/**
 * This interface represents a permission.
 * It is used to represent a permission that a user can have.
 */
export interface Permission {
  /**
   * The id of the permission.
   */
  id: number;
  /**
   * The name of the permission.
   */
  name: string;
  /**
   * The date and time the permission was created.
   */
  created_at?: string;
  /**
   * The date and time the permission was updated.
   */
  updated_at?: string;
}
