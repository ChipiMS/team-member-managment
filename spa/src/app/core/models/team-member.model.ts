import { Role } from './role.model';

/**
 * This interface represents a team member.
 * It is used to represent a team member that a user can have.
 */
export interface TeamMember {
  /**
   * The id of the team member.
   */
  id?: number;
  /**
   * The first name of the team member.
   */
  first_name: string;
  /**
   * The last name of the team member.
   */
  last_name: string;
  /**
   * The email of the team member.
   */
  email: string;
  /**
   * The phone number of the team member.
   */
  phone_number?: string;
  /**
   * The role of the team member.
   */
  role?: Role;
  /**
   * The date and time the team member was created.
   */
  created_at?: string;
  /**
   * The date and time the team member was updated.
   */
  updated_at?: string;
}
