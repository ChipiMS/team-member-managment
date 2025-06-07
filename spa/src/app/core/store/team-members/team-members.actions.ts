import { TeamMember } from '../../models/team-member.model';

export class LoadTeamMembers {
  static readonly type = '[Team Members] Load Team Members';
}

export class AddTeamMember {
  static readonly type = '[Team Members] Add Team Member';
  constructor(public teamMember: TeamMember) {}
}

export class UpdateTeamMember {
  static readonly type = '[Team Members] Update Team Member';
  constructor(public id: number, public teamMember: TeamMember) {}
}

export class DeleteTeamMember {
  static readonly type = '[Team Members] Delete Team Member';
  constructor(public id: number) {}
} 