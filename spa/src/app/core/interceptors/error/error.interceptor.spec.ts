import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let messageService: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    messageService = TestBed.inject(MessageService);
    spyOn(messageService, 'add').and.callThrough();
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should show network error message on status 0', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with a network error'),
      error: (error) => {
        expect(error.status).toBe(0);
        expect(messageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Network Error',
          detail: 'Please check your internet connection.',
        });
      },
    });

    const req = httpTestingController.expectOne('/test');
    req.error(new ErrorEvent('Network error'), { status: 0 });
  });

  it('should show error message with status code and detail', () => {
    const errorMessage = 'An unexpected error occurred.';
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(messageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Error 500',
          detail: errorMessage,
        });
      },
    });

    const req = httpTestingController.expectOne('/test');
    req.flush(
      { message: errorMessage },
      { status: 500, statusText: 'Server Error' },
    );
  });

  it('should show error message with status code and default detail', () => {
    httpClient.get('/test').subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error.status).toBe(404);
        expect(messageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Error 404',
          detail: 'An unexpected error occurred.',
        });
      },
    });

    const req = httpTestingController.expectOne('/test');
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('should not call messageService.add on successful request', () => {
    httpClient.get('/test').subscribe((response) => {
      expect(response).toBeTruthy();
      expect(messageService.add).not.toHaveBeenCalled();
    });

    const req = httpTestingController.expectOne('/test');
    req.flush({ data: 'success' });
  });
});
