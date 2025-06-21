import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, tap } from 'rxjs';

/**
 * Interceptor function to handle HTTP responses and show alerts based on the response status.
 * It intercepts HTTP requests and checks for errors in the response.
 */
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    tap({
      error: (httpError: HttpErrorResponse) => {
        if (httpError.status === 0) {
          messageService.add({
            severity: 'error',
            summary: 'Network Error',
            detail: 'Please check your internet connection.',
          });
        } else {
          messageService.add({
            severity: 'error',
            summary: `Error ${httpError.status}`,
            detail: httpError.error?.message || 'An unexpected error occurred.',
          });
        }
      },
    }),
  );
};
