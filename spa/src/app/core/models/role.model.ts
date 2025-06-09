import { Permission } from './permission.model';

/**
 * This interface represents a role.
 * It is used to represent a role that a user can have.
 */
export interface Role {
  /**
   * The id of the role.
   */
  id: number;
  /**
   * The name of the role.
   */
  name: string;
  /**
   * The permissions of the role.
   */
  permissions: Permission[];
  /**
   * Whether the role is an admin role.
   */
  is_admin: boolean;
  /**
   * The date and time the role was created.
   */
  created_at?: string;
  /**
   * The date and time the role was updated.
   */
  updated_at?: string;
}
