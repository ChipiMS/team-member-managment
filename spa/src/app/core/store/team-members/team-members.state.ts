import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { TeamMember } from '../../models/team-member.model';
import { TeamMembersService } from '../../services/team-members/team-members.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  LoadTeamMembers,
  AddTeamMember,
  UpdateTeamMember,
  DeleteTeamMember,
} from './team-members.actions';

/**
 * This interface represents the state of the team members.
 */
export interface TeamMembersStateModel {
  /**
   * The team members.
   */
  teamMembers: TeamMember[];
  /**
   * If team members are loading.
   */
  loading: boolean;
  /**
   * If exists an error happened while loading.
   */
  error: Error | null;
}

/**
 * This state is used to store the team members.
 */
@State<TeamMembersStateModel>({
  name: 'teamMembers',
  defaults: {
    teamMembers: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class TeamMembersState {
  /**
   * The constructor for TeamMembersState.
   * @param teamMembersService 
   */
  constructor(private teamMembersService: TeamMembersService) {}

  /**
   * The selector for the team members.
   * @param state - The state of the team members.
   * @returns The team members.
   */
  @Selector()
  static getTeamMembers(state: TeamMembersStateModel) {
    return state.teamMembers;
  }

  /**
   * The selector for the loading state.
   * @param state - The state of the team members.
   * @returns The loading state.
   */
  @Selector()
  static getLoading(state: TeamMembersStateModel) {
    return state.loading;
  }

  /**
   * The selector for the error state.
   * @param state - The state of the team members.
   * @returns The error state.
   */
  @Selector()
  static getError(state: TeamMembersStateModel) {
    return state.error;
  }

  /**
   * The action to load the team members.
   * @param ctx - The state context.
   */
  @Action(LoadTeamMembers)
  loadTeamMembers(ctx: StateContext<TeamMembersStateModel>) {
    ctx.patchState({ loading: true, error: null });

    return this.teamMembersService.getTeamMembers().pipe(
      tap((teamMembers) => {
        ctx.patchState({ teamMembers, loading: false });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return of(error);
      }),
    );
  }

  /**
   * The action to add a team member.
   * @param ctx - The state context.
   * @param action - The action to add a team member.
   */
  @Action(AddTeamMember)
  addTeamMember(
    ctx: StateContext<TeamMembersStateModel>,
    action: AddTeamMember,
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.teamMembersService.createTeamMember(action.teamMember).pipe(
      tap((teamMember) => {
        ctx.patchState({
          teamMembers: [...state.teamMembers, teamMember],
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return of(error);
      }),
    );
  }

  /**
   * The action to update a team member.
   * @param ctx - The state context.
   * @param action - The action to update a team member.
   */
  @Action(UpdateTeamMember)
  updateTeamMember(
    ctx: StateContext<TeamMembersStateModel>,
    action: UpdateTeamMember,
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.teamMembersService
      .updateTeamMember(action.id, action.teamMember)
      .pipe(
        tap((teamMember) => {
          ctx.patchState({
            teamMembers: state.teamMembers.map((tm) =>
              tm.id === teamMember.id ? teamMember : tm,
            ),
            loading: false,
          });
        }),
        catchError((error) => {
          ctx.patchState({ error, loading: false });
          return of(error);
        }),
      );
  }

  /**
   * The action to delete a team member.
   * @param ctx - The state context.
   * @param action - The action to delete a team member.
   */
  @Action(DeleteTeamMember)
  deleteTeamMember(
    ctx: StateContext<TeamMembersStateModel>,
    action: DeleteTeamMember,
  ) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.teamMembersService.deleteTeamMember(action.id).pipe(
      tap(() => {
        ctx.patchState({
          teamMembers: state.teamMembers.filter((tm) => tm.id !== action.id),
          loading: false,
        });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return of(error);
      }),
    );
  }
}
