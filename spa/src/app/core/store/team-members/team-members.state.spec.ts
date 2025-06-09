import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TeamMembersState } from './team-members.state';
import { TeamMembersService } from '../../services/team-members/team-members.service';
import {
  LoadTeamMembers,
  AddTeamMember,
  UpdateTeamMember,
  DeleteTeamMember,
} from './team-members.actions';
import { TeamMember } from '../../models/team-member.model';
import { of, throwError } from 'rxjs';

describe('TeamMembersState', () => {
  let store: Store;
  let teamMembersService: jasmine.SpyObj<TeamMembersService>;

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

  beforeEach(() => {
    teamMembersService = jasmine.createSpyObj('TeamMembersService', [
      'getTeamMembers',
      'createTeamMember',
      'updateTeamMember',
      'deleteTeamMember',
    ]);

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([TeamMembersState])],
      providers: [
        { provide: TeamMembersService, useValue: teamMembersService },
      ],
    });

    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should load team members', () => {
    teamMembersService.getTeamMembers.and.returnValue(of(mockTeamMembers));

    store.dispatch(new LoadTeamMembers());

    store
      .selectOnce(TeamMembersState.getTeamMembers)
      .subscribe((teamMembers) => {
        expect(teamMembers).toEqual(mockTeamMembers);
      });

    store.selectOnce(TeamMembersState.getLoading).subscribe((loading) => {
      expect(loading).toBeFalse();
    });

    store.selectOnce(TeamMembersState.getError).subscribe((error) => {
      expect(error).toBeNull();
    });
  });

  it('should handle error when loading team members', () => {
    const error = new Error('Failed to load team members');
    teamMembersService.getTeamMembers.and.returnValue(throwError(() => error));

    store.dispatch(new LoadTeamMembers());

    store.selectOnce(TeamMembersState.getError).subscribe((stateError) => {
      expect(stateError).toEqual(error);
    });

    store.selectOnce(TeamMembersState.getLoading).subscribe((loading) => {
      expect(loading).toBeFalse();
    });
  });

  it('should add team member', () => {
    const newMember: TeamMember = {
      id: 3,
      first_name: 'New',
      last_name: 'Member',
      email: 'new@example.com',
      phone_number: '(555) 555-5555',
      role: { id: 1, name: 'Developer', is_admin: false, permissions: [] },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    teamMembersService.createTeamMember.and.returnValue(of(newMember));
    teamMembersService.getTeamMembers.and.returnValue(of(mockTeamMembers));

    // First load existing team members
    store.dispatch(new LoadTeamMembers());

    // Then add new member
    store.dispatch(new AddTeamMember(newMember));

    store
      .selectOnce(TeamMembersState.getTeamMembers)
      .subscribe((teamMembers) => {
        expect(teamMembers).toContain(newMember);
      });

    store.selectOnce(TeamMembersState.getLoading).subscribe((loading) => {
      expect(loading).toBeFalse();
    });
  });

  it('should update team member', () => {
    const updatedMember: TeamMember = {
      ...mockTeamMembers[0],
      first_name: 'Updated',
      last_name: 'Name',
    };

    teamMembersService.updateTeamMember.and.returnValue(of(updatedMember));
    teamMembersService.getTeamMembers.and.returnValue(of(mockTeamMembers));

    // First load existing team members
    store.dispatch(new LoadTeamMembers());

    // Then update member
    if (updatedMember.id) {
      store.dispatch(new UpdateTeamMember(updatedMember.id, updatedMember));
    }

    store
      .selectOnce(TeamMembersState.getTeamMembers)
      .subscribe((teamMembers) => {
        const member = teamMembers.find((tm) => tm.id === updatedMember.id);
        expect(member).toEqual(updatedMember);
      });

    store.selectOnce(TeamMembersState.getLoading).subscribe((loading) => {
      expect(loading).toBeFalse();
    });
  });

  it('should delete team member', () => {
    const memberToDelete = mockTeamMembers[0];
    teamMembersService.deleteTeamMember.and.returnValue(of(void 0));
    teamMembersService.getTeamMembers.and.returnValue(of(mockTeamMembers));

    // First load existing team members
    store.dispatch(new LoadTeamMembers());

    // Then delete member
    if (memberToDelete.id) {
      store.dispatch(new DeleteTeamMember(memberToDelete.id));
    }

    store
      .selectOnce(TeamMembersState.getTeamMembers)
      .subscribe((teamMembers) => {
        expect(teamMembers).not.toContain(memberToDelete);
      });

    store.selectOnce(TeamMembersState.getLoading).subscribe((loading) => {
      expect(loading).toBeFalse();
    });
  });

  it('should handle error when adding team member', () => {
    const error = new Error('Failed to add team member');
    teamMembersService.createTeamMember.and.returnValue(
      throwError(() => error),
    );

    store.dispatch(new AddTeamMember(mockTeamMembers[0]));

    store.selectOnce(TeamMembersState.getError).subscribe((stateError) => {
      expect(stateError).toEqual(error);
    });

    store.selectOnce(TeamMembersState.getLoading).subscribe((loading) => {
      expect(loading).toBeFalse();
    });
  });

  it('should handle error when updating team member', () => {
    const error = new Error('Failed to update team member');
    teamMembersService.updateTeamMember.and.returnValue(
      throwError(() => error),
    );

    if (mockTeamMembers[0].id) {
      store.dispatch(
        new UpdateTeamMember(mockTeamMembers[0].id, mockTeamMembers[0]),
      );
    }

    store.selectOnce(TeamMembersState.getError).subscribe((stateError) => {
      expect(stateError).toEqual(error);
    });

    store.selectOnce(TeamMembersState.getLoading).subscribe((loading) => {
      expect(loading).toBeFalse();
    });
  });

  it('should handle error when deleting team member', () => {
    const error = new Error('Failed to delete team member');
    teamMembersService.deleteTeamMember.and.returnValue(
      throwError(() => error),
    );

    if (mockTeamMembers[0].id) {
      store.dispatch(new DeleteTeamMember(mockTeamMembers[0].id));
    }

    store.selectOnce(TeamMembersState.getError).subscribe((stateError) => {
      expect(stateError).toEqual(error);
    });

    store.selectOnce(TeamMembersState.getLoading).subscribe((loading) => {
      expect(loading).toBeFalse();
    });
  });
});
