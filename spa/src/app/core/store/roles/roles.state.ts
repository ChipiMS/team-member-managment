import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { RolesService } from './roles.service';
import {
  LoadRoles,
  AddRole,
  UpdateRole,
  DeleteRole,
  SetRoles,
  SetRolesLoading,
  SetRolesError
} from './roles.actions';

export interface RolesStateModel {
  roles: any[];
  loading: boolean;
  error: string | null;
}

@State<RolesStateModel>({
  name: 'roles',
  defaults: {
    roles: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class RolesState {
  constructor(private rolesService: RolesService) {}

  @Selector()
  static getRoles(state: RolesStateModel) {
    return state.roles;
  }

  @Selector()
  static getLoading(state: RolesStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: RolesStateModel) {
    return state.error;
  }

  @Action(LoadRoles)
  loadRoles(ctx: StateContext<RolesStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.rolesService.getRoles().pipe(
      tap(roles => {
        ctx.patchState({
          roles,
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: error.message
        });
        return of(error);
      })
    );
  }

  @Action(AddRole)
  addRole(ctx: StateContext<RolesStateModel>, action: AddRole) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.rolesService.createRole(action.payload).pipe(
      tap(newRole => {
        ctx.patchState({
          roles: [...state.roles, newRole],
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: error.message
        });
        return of(error);
      })
    );
  }

  @Action(UpdateRole)
  updateRole(ctx: StateContext<RolesStateModel>, action: UpdateRole) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.rolesService.updateRole(action.id, action.payload).pipe(
      tap(updatedRole => {
        ctx.patchState({
          roles: state.roles.map(role => 
            role.id === action.id ? updatedRole : role
          ),
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: error.message
        });
        return of(error);
      })
    );
  }

  @Action(DeleteRole)
  deleteRole(ctx: StateContext<RolesStateModel>, action: DeleteRole) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.rolesService.deleteRole(action.id).pipe(
      tap(() => {
        ctx.patchState({
          roles: state.roles.filter(role => role.id !== action.id),
          loading: false
        });
      }),
      catchError(error => {
        ctx.patchState({
          loading: false,
          error: error.message
        });
        return of(error);
      })
    );
  }

  @Action(SetRoles)
  setRoles(ctx: StateContext<RolesStateModel>, action: SetRoles) {
    ctx.patchState({ roles: action.payload });
  }

  @Action(SetRolesLoading)
  setLoading(ctx: StateContext<RolesStateModel>, action: SetRolesLoading) {
    ctx.patchState({ loading: action.payload });
  }

  @Action(SetRolesError)
  setError(ctx: StateContext<RolesStateModel>, action: SetRolesError) {
    ctx.patchState({ error: action.payload });
  }
} 