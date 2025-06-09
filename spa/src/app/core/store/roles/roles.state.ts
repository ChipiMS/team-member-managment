import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { RolesService } from '../../services/roles/roles.service';
import {
  LoadRoles,
  SetRoles,
  SetRolesLoading,
  SetRolesError,
} from './roles.actions';
import { Role } from '../../models/role.model';

/**
 * This interface represents the state of the roles.
 */
export interface RolesStateModel {
  /**
   * The roles.
   */
  roles: Role[];
  /**
   * If roles are loading.
   */
  loading: boolean;
  /**
   * If exists, an error happened while loading.
   */
  error: Error | string | null;
}

/**
 * This state is used to store the roles.
 */
@State<RolesStateModel>({
  name: 'roles',
  defaults: {
    roles: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class RolesState {
  /**
   * Constructor for RolesState.
   * @param rolesService 
   */
  constructor(private rolesService: RolesService) {}

  /**
   * The selector for the roles.
   * @param state - The state of the roles.
   * @returns The roles.
   */
  @Selector()
  static getRoles(state: RolesStateModel) {
    return state.roles;
  }

  /**
   * The selector for the loading state.
   * @param state - The state of the roles.
   * @returns The loading state.
   */
  @Selector()
  static getLoading(state: RolesStateModel) {
    return state.loading;
  }

  /**
   * The selector for the error state.
   * @param state - The state of the roles.
   * @returns The error state.
   */
  @Selector()
  static getError(state: RolesStateModel) {
    return state.error;
  }

  /**
   * The action to load the roles.
   * @param ctx - The state context.
   */
  @Action(LoadRoles)
  loadRoles(ctx: StateContext<RolesStateModel>) {
    ctx.patchState({ loading: true, error: null });

    return this.rolesService.getRoles().pipe(
      tap((roles) => {
        ctx.patchState({
          roles,
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({
          loading: false,
          error: error.message,
        });
        return of(error);
      }),
    );
  }

  /**
   * The action to set the roles.
   * @param ctx - The state context.
   * @param action - The action to set the roles.
   */
  @Action(SetRoles)
  setRoles(ctx: StateContext<RolesStateModel>, action: SetRoles) {
    ctx.patchState({ roles: action.payload });
  }

  /**
   * The action to set the loading state.
   * @param ctx - The state context.
   * @param action - The action to set the loading state.
   */
  @Action(SetRolesLoading)
  setLoading(ctx: StateContext<RolesStateModel>, action: SetRolesLoading) {
    ctx.patchState({ loading: action.payload });
  }

  /**
   * The action to set the error state.
   * @param ctx - The state context.
   * @param action - The action to set the error state.
   */
  @Action(SetRolesError)
  setError(ctx: StateContext<RolesStateModel>, action: SetRolesError) {
    ctx.patchState({ error: action.payload });
  }
}
