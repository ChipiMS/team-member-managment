import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { provideStore } from '@ngxs/store';
import { TeamMembersState } from './core/store/team-members/team-members.state';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RolesState } from './core/store/roles/roles.state';
import { MessageService } from 'primeng/api';
import { PrimeNgPreset } from './prime-ng.preset';

/**
 * The application configuration.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
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
