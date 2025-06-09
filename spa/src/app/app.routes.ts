import { Routes } from '@angular/router';

/**
 * The application routes.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/team-members-list/team-members-list.component').then(
        (m) => m.TeamMembersListComponent,
      ),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/team-member-form/team-member-form.component').then(
        (m) => m.TeamMemberFormComponent,
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/team-member-form/team-member-form.component').then(
        (m) => m.TeamMemberFormComponent,
      ),
  },
];
