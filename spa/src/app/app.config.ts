import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideStore } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error/error.interceptor';
import { RolesState } from './core/store/roles/roles.state';
import { TeamMembersState } from './core/store/team-members/team-members.state';
import { PrimeNgPreset } from './prime-ng.preset';

/**
 * The application configuration.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    providePrimeNG({
      theme: {
        preset: PrimeNgPreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    provideStore([RolesState, TeamMembersState]),
    MessageService,
  ],
};
