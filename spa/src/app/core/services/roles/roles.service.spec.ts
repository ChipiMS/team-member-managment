import { TestBed } from '@angular/core/testing';
import { RolesService } from './roles.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RolesService', () => {
  let service: RolesService;
  let httpMock: HttpTestingController;

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
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RolesService],
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

  it('should handle error when getting roles', () => {
    const errorMessage = 'Error fetching roles';
    service.getRoles().subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/roles`);
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });
});
