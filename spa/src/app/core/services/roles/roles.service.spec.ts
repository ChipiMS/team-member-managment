import { TestBed } from '@angular/core/testing';
import { RolesService } from './roles.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('RolesService', () => {
  let service: RolesService;
  let httpMock: HttpTestingController;

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
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RolesService]
    });

    service = TestBed.inject(RolesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all roles', () => {
    service.getRoles().subscribe((roles: Role[]) => {
      expect(roles).toEqual(mockRoles);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoles);
  });

  it('should get role by id', () => {
    const roleId = 1;
    service.getRole(roleId).subscribe((role: Role) => {
      expect(role).toEqual(mockRoles[0]);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles/${roleId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoles[0]);
  });

  it('should create role', () => {
    const newRole: Role = {
      id: 3,
      name: 'Manager',
      is_admin: false,
      permissions: [mockPermissions[0], mockPermissions[1], mockPermissions[2]]
    };

    service.createRole(newRole).subscribe((role: Role) => {
      expect(role).toEqual(newRole);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newRole);
    req.flush(newRole);
  });

  it('should update role', () => {
    const roleId = 1;
    const updatedRole: Role = {
      ...mockRoles[0],
      name: 'Senior Developer'
    };

    service.updateRole(roleId, updatedRole).subscribe((role: Role) => {
      expect(role).toEqual(updatedRole);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles/${roleId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedRole);
    req.flush(updatedRole);
  });

  it('should delete role', () => {
    const roleId = 1;
    service.deleteRole(roleId).subscribe((response: void) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles/${roleId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error when getting roles', () => {
    const errorMessage = 'Error fetching roles';
    service.getRoles().subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles`);
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });

  it('should handle error when getting role by id', () => {
    const roleId = 999;
    const errorMessage = 'Role not found';
    service.getRole(roleId).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(404);
        expect(error.statusText).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles/${roleId}`);
    req.flush(errorMessage, { status: 404, statusText: errorMessage });
  });

  it('should handle error when creating role', () => {
    const errorMessage = 'Error creating role';
    const newRole: Role = {
      id: 3,
      name: 'Manager',
      is_admin: false,
      permissions: [mockPermissions[0], mockPermissions[1], mockPermissions[2]]
    };

    service.createRole(newRole).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles`);
    req.flush(errorMessage, { status: 400, statusText: errorMessage });
  });

  it('should handle error when updating role', () => {
    const roleId = 1;
    const errorMessage = 'Error updating role';
    const updatedRole: Role = {
      ...mockRoles[0],
      name: 'Senior Developer'
    };

    service.updateRole(roleId, updatedRole).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles/${roleId}`);
    req.flush(errorMessage, { status: 400, statusText: errorMessage });
  });

  it('should handle error when deleting role', () => {
    const roleId = 1;
    const errorMessage = 'Error deleting role';

    service.deleteRole(roleId).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe(errorMessage);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles/${roleId}`);
    req.flush(errorMessage, { status: 400, statusText: errorMessage });
  });
}); 