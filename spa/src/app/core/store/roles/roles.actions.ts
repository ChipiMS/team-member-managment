export class LoadRoles {
  static readonly type = '[Roles] Load Roles';
}

export class AddRole {
  static readonly type = '[Roles] Add Role';
  constructor(public payload: any) {}
}

export class UpdateRole {
  static readonly type = '[Roles] Update Role';
  constructor(public id: number, public payload: any) {}
}

export class DeleteRole {
  static readonly type = '[Roles] Delete Role';
  constructor(public id: number) {}
}

export class SetRoles {
  static readonly type = '[Roles] Set Roles';
  constructor(public payload: any[]) {}
}

export class SetRolesLoading {
  static readonly type = '[Roles] Set Loading';
  constructor(public payload: boolean) {}
}

export class SetRolesError {
  static readonly type = '[Roles] Set Error';
  constructor(public payload: string | null) {}
} 