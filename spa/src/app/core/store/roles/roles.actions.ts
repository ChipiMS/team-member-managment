import { Role } from '../../models/role.model';

/**
 * This action is used to load the roles from the API.
 */
export class LoadRoles {
  /**
   * The type of the action.
   */
  static readonly type = '[Roles] Load Roles';
}

/**
 * This action is used to set the roles in the store.
 */
export class SetRoles {
  /**
   * The type of the action.
   */
  static readonly type = '[Roles] Set Roles';

  /**
   * The constructor of the action.
   * @param payload - The roles to set.
   */
  constructor(public payload: Role[]) {}
}

/**
 * This action is used to set the loading state of the roles in the store.
 */
export class SetRolesLoading {
  /**
   * The type of the action.
   */
  static readonly type = '[Roles] Set Loading';

  /**
   * The constructor of the action.
   * @param payload - The loading state to set.
   */
  constructor(public payload: boolean) {}
}

/**
 * This action is used to set the error state of the roles in the store.
 */
export class SetRolesError {
  /**
   * The type of the action.
   */
  static readonly type = '[Roles] Set Error';

  /**
   * The constructor of the action.
   * @param payload - The error to set.
   */
  constructor(public payload: Error | null) {}
}
