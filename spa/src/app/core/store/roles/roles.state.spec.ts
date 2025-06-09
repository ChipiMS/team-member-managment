import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { RolesState } from './roles.state';
import { RolesService } from '../../services/roles/roles.service';
import {
  LoadRoles,
  SetRoles,
  SetRolesLoading,
  SetRolesError,
} from './roles.actions';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { of, throwError } from 'rxjs';

describe('RolesState', () => {
  let store: Store;
  let rolesService: jasmine.SpyObj<RolesService>;

  const mockPermissions: Permission[] = [
    { id: 1, name: 'view_team_members' },
    { id: 2, name: 'edit_team_members' },
    { id: 3, name: 'delete_team_members' },
    { id: 4, name: 'manage_roles' },
  ];

  const mockRoles: Role[] = [
    {
      id: 1,
      name: 'Developer',
      is_admin: false,
      permissions: [mockPermissions[0], mockPermissions[1]],
    },
    {
      id: 2,
      name: 'Admin',
      is_admin: true,
      permissions: mockPermissions,
    },
  ];

  beforeEach(() => {
    rolesService = jasmine.createSpyObj('RolesService', [
      'getRoles',
      'getRole',
      'createRole',
      'updateRole',
      'deleteRole',
    ]);

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([RolesState])],
      providers: [{ provide: RolesService, useValue: rolesService }],
    });

    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should load roles', () => {
    rolesService.getRoles.and.returnValue(of(mockRoles));

    store.dispatch(new LoadRoles());

    store.selectOnce(RolesState.getRoles).subscribe((roles) => {
      expect(roles).toEqual(mockRoles);
    });

    store.selectOnce(RolesState.getLoading).subscribe((loading) => {
      expect(loading).toBeFalse();
    });

    store.selectOnce(RolesState.getError).subscribe((error) => {
      expect(error).toBeNull();
    });
  });

  it('should handle error when loading roles', () => {
    const error = new Error('Failed to load roles');
    rolesService.getRoles.and.returnValue(throwError(() => error));

    store.dispatch(new LoadRoles());

    store.selectOnce(RolesState.getError).subscribe((stateError) => {
      expect(stateError).toEqual(error.message);
    });

    store.selectOnce(RolesState.getLoading).subscribe((loading) => {
      expect(loading).toBeFalse();
    });
  });

  it('should set roles directly', () => {
    store.dispatch(new SetRoles(mockRoles));

    store.selectOnce(RolesState.getRoles).subscribe((roles) => {
      expect(roles).toEqual(mockRoles);
    });
  });

  it('should set loading state', () => {
    store.dispatch(new SetRolesLoading(true));

    store.selectOnce(RolesState.getLoading).subscribe((loading) => {
      expect(loading).toBeTrue();
    });
  });

  it('should set error state', () => {
    const errorMessage = 'Test error';
    store.dispatch(new SetRolesError(new Error(errorMessage)));

    store.selectOnce(RolesState.getError).subscribe((error) => {
      expect(error).toEqual(new Error(errorMessage));
    });
  });
});
