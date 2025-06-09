import { TestBed } from '@angular/core/testing';
import { TeamMembersService } from './team-members.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { TeamMember } from '../../models/team-member.model';
import { Role } from '../../models/role.model';
import { HttpErrorResponse } from '@angular/common/http';

describe('TeamMembersService', () => {
  let service: TeamMembersService;
  let httpMock: HttpTestingController;

  const mockTeamMembers: TeamMember[] = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone_number: '(123) 456-7890',
      role: { id: 1, name: 'Developer', is_admin: false, permissions: [] },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone_number: '(098) 765-4321',
      role: { id: 2, name: 'Admin', is_admin: true, permissions: [] },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  const mockRoles: Role[] = [
    { id: 1, name: 'Developer', is_admin: false, permissions: [] },
    { id: 2, name: 'Admin', is_admin: true, permissions: [] },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeamMembersService],
    });

    service = TestBed.inject(TeamMembersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get team members', () => {
    service.getTeamMembers().subscribe((members: TeamMember[]) => {
      expect(members).toEqual(mockTeamMembers);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/team-members/`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeamMembers);
  });

  it('should create team member', () => {
    const newMember: Partial<TeamMember> = {
      first_name: 'New',
      last_name: 'Member',
      email: 'new@example.com',
      phone_number: '(555) 555-5555',
      role: mockRoles[0],
    };

    service
      .createTeamMember(newMember as TeamMember)
      .subscribe((member: TeamMember) => {
        expect(member).toEqual({ ...newMember, id: 3 } as TeamMember);
      });

    const req = httpMock.expectOne(`${environment.apiUrl}/team-members/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newMember);
    req.flush({ ...newMember, id: 3 });
  });

  it('should update team member', () => {
    const memberId = 1;
    const updatedMember: TeamMember = {
      first_name: 'Updated',
      last_name: 'Name',
      email: 'new@example.com',
      phone_number: '(555) 555-5555',
      role: mockRoles[0],
    };

    service
      .updateTeamMember(memberId, updatedMember)
      .subscribe((member: TeamMember) => {
        expect(member).toEqual({ ...mockTeamMembers[0], ...updatedMember });
      });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/team-members/${memberId}/`,
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedMember);
    req.flush({ ...mockTeamMembers[0], ...updatedMember });
  });

  it('should delete team member', () => {
    const memberId = 1;
    service.deleteTeamMember(memberId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/team-members/${memberId}/`,
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error when getting team members', () => {
    const errorMessage = 'Error fetching team members';
    service.getTeamMembers().subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/team-members/`);
    req.flush(errorMessage, { status: 500, statusText: errorMessage });
  });

  it('should handle error when creating team member', () => {
    const errorMessage = 'Error creating team member';
    const newMember: Partial<TeamMember> = {
      first_name: 'New',
      last_name: 'Member',
      email: 'new@example.com',
      phone_number: '(555) 555-5555',
      role: mockRoles[0],
    };

    service.createTeamMember(newMember as TeamMember).subscribe({
      error: (error: HttpErrorResponse) => {
        expect(error.status).toBe(400);
        expect(error.statusText).toBe(errorMessage);
      },
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/team-members/`);
    req.flush(errorMessage, { status: 400, statusText: errorMessage });
  });
});
