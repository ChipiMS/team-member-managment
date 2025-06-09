import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { RolesState, RolesStateModel } from './roles.state';
import { RolesService } from '../../services/roles/roles.service';
import {
  LoadRoles,
  AddRole,
  UpdateRole,
  DeleteRole,
  SetRoles,
  SetRolesLoading,
  SetRolesError
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
    { id: 4, name: 'manage_roles' }
  ];

  const mockRoles: Role[] = [
    {
      id: 1,
      name: 'Developer',
      is_admin: false,
      permissions: [mockPermissions[0], mockPermissions[1]]
    },
    {
      id: 2,
      name: 'Admin',
      is_admin: true,
      permissions: mockPermissions
    }
  ];

  beforeEach(() => {
    rolesService = jasmine.createSpyObj('RolesService', [
      'getRoles',
      'getRole',
      'createRole',
      'updateRole',
      'deleteRole'
    ]);

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([RolesState])],
      providers: [
        { provide: RolesService, useValue: rolesService }
      ]
    });

    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should load roles', () => {
    rolesService.getRoles.and.returnValue(of(mockRoles));

    store.dispatch(new LoadRoles());

    store.selectOnce(RolesState.getRoles).subscribe(roles => {
      expect(roles).toEqual(mockRoles);
    });

    store.selectOnce(RolesState.getLoading).subscribe(loading => {
      expect(loading).toBeFalse();
    });

    store.selectOnce(RolesState.getError).subscribe(error => {
      expect(error).toBeNull();
    });
  });

  it('should handle error when loading roles', () => {
    const error = new Error('Failed to load roles');
    rolesService.getRoles.and.returnValue(throwError(() => error));

    store.dispatch(new LoadRoles());

    store.selectOnce(RolesState.getError).subscribe(stateError => {
      expect(stateError).toEqual(error.message);
    });

    store.selectOnce(RolesState.getLoading).subscribe(loading => {
      expect(loading).toBeFalse();
    });
  });

  it('should add role', () => {
    const newRole: Role = {
      id: 3,
      name: 'Manager',
      is_admin: false,
      permissions: [mockPermissions[0], mockPermissions[1], mockPermissions[2]]
    };

    rolesService.createRole.and.returnValue(of(newRole));
    rolesService.getRoles.and.returnValue(of(mockRoles));

    // First load existing roles
    store.dispatch(new LoadRoles());

    // Then add new role
    store.dispatch(new AddRole(newRole));

    store.selectOnce(RolesState.getRoles).subscribe(roles => {
      expect(roles).toContain(newRole);
    });

    store.selectOnce(RolesState.getLoading).subscribe(loading => {
      expect(loading).toBeFalse();
    });
  });

  it('should update role', () => {
    const updatedRole: Role = {
      ...mockRoles[0],
      name: 'Senior Developer'
    };

    rolesService.updateRole.and.returnValue(of(updatedRole));
    rolesService.getRoles.and.returnValue(of(mockRoles));

    // First load existing roles
    store.dispatch(new LoadRoles());

    // Then update role
    if (updatedRole.id) {
      store.dispatch(new UpdateRole(updatedRole.id, updatedRole));
    }

    store.selectOnce(RolesState.getRoles).subscribe(roles => {
      const role = roles.find(r => r.id === updatedRole.id);
      expect(role).toEqual(updatedRole);
    });

    store.selectOnce(RolesState.getLoading).subscribe(loading => {
      expect(loading).toBeFalse();
    });
  });

  it('should delete role', () => {
    const roleToDelete = mockRoles[0];
    rolesService.deleteRole.and.returnValue(of(void 0));
    rolesService.getRoles.and.returnValue(of(mockRoles));

    // First load existing roles
    store.dispatch(new LoadRoles());

    // Then delete role
    if (roleToDelete.id) {
      store.dispatch(new DeleteRole(roleToDelete.id));
    }

    store.selectOnce(RolesState.getRoles).subscribe(roles => {
      expect(roles).not.toContain(roleToDelete);
    });

    store.selectOnce(RolesState.getLoading).subscribe(loading => {
      expect(loading).toBeFalse();
    });
  });

  it('should handle error when adding role', () => {
    const error = new Error('Failed to add role');
    rolesService.createRole.and.returnValue(throwError(() => error));

    store.dispatch(new AddRole(mockRoles[0]));

    store.selectOnce(RolesState.getError).subscribe(stateError => {
      expect(stateError).toEqual(error.message);
    });

    store.selectOnce(RolesState.getLoading).subscribe(loading => {
      expect(loading).toBeFalse();
    });
  });

  it('should handle error when updating role', () => {
    const error = new Error('Failed to update role');
    rolesService.updateRole.and.returnValue(throwError(() => error));

    if (mockRoles[0].id) {
      store.dispatch(new UpdateRole(mockRoles[0].id, mockRoles[0]));
    }

    store.selectOnce(RolesState.getError).subscribe(stateError => {
      expect(stateError).toEqual(error.message);
    });

    store.selectOnce(RolesState.getLoading).subscribe(loading => {
      expect(loading).toBeFalse();
    });
  });

  it('should handle error when deleting role', () => {
    const error = new Error('Failed to delete role');
    rolesService.deleteRole.and.returnValue(throwError(() => error));

    if (mockRoles[0].id) {
      store.dispatch(new DeleteRole(mockRoles[0].id));
    }

    store.selectOnce(RolesState.getError).subscribe(stateError => {
      expect(stateError).toEqual(error.message);
    });

    store.selectOnce(RolesState.getLoading).subscribe(loading => {
      expect(loading).toBeFalse();
    });
  });

  it('should set roles directly', () => {
    store.dispatch(new SetRoles(mockRoles));

    store.selectOnce(RolesState.getRoles).subscribe(roles => {
      expect(roles).toEqual(mockRoles);
    });
  });

  it('should set loading state', () => {
    store.dispatch(new SetRolesLoading(true));

    store.selectOnce(RolesState.getLoading).subscribe(loading => {
      expect(loading).toBeTrue();
    });
  });

  it('should set error state', () => {
    const errorMessage = 'Test error';
    store.dispatch(new SetRolesError(errorMessage));

    store.selectOnce(RolesState.getError).subscribe(error => {
      expect(error).toEqual(errorMessage);
    });
  });
}); 