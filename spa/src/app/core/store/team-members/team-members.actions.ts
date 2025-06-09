import { TeamMember } from '../../models/team-member.model';

/**
 * This action is used to load the team members from the API.
 */
export class LoadTeamMembers {
  /**
   * The type of the action.
   */
  static readonly type = '[Team Members] Load Team Members';
}

/**
 * This action is used to add a team member to the API.
 */
export class AddTeamMember {
  /**
   * The type of the action.
   */
  static readonly type = '[Team Members] Add Team Member';

  /**
   * The constructor of the action.
   * @param teamMember - The team member to add.
   */
  constructor(public teamMember: TeamMember) {}
}

/**
 * This action is used to update a team member in the API.
 */
export class UpdateTeamMember {
  /**
   * The type of the action.
   */
  static readonly type = '[Team Members] Update Team Member';

  /**
   * The constructor of the action.
   * @param id - The id of the team member to update.
   * @param teamMember - The team member to update.
   */
  constructor(
    public id: number,
    public teamMember: TeamMember,
  ) {}
}

/**
 * This action is used to delete a team member from the API.
 */
export class DeleteTeamMember {
  /**
   * The type of the action.
   */
  static readonly type = '[Team Members] Delete Team Member';

  /**
   * The constructor of the action.
   * @param id - The id of the team member to delete.
   */
  constructor(public id: number) {}
}
