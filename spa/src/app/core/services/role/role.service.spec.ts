import { TestBed } from '@angular/core/testing';
import { RoleService } from './role.service';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';

describe('RoleService', () => {
  let service: RoleService;
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
      imports: [],
      providers: [provideHttpClient(),
        provideHttpClientTesting(),RoleService]
    });

    service = TestBed.inject(RoleService);
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
}); 