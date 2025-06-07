import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { TeamMember } from '../../models/team-member.model';
import { TeamMembersService } from '../../services/team-members.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadTeamMembers, AddTeamMember, UpdateTeamMember, DeleteTeamMember } from './team-members.actions';

export interface TeamMembersStateModel {
  teamMembers: TeamMember[];
  loading: boolean;
  error: any;
}

@State<TeamMembersStateModel>({
  name: 'teamMembers',
  defaults: {
    teamMembers: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class TeamMembersState {
  constructor(private teamMembersService: TeamMembersService) {}

  @Selector()
  static getTeamMembers(state: TeamMembersStateModel) {
    return state.teamMembers;
  }

  @Selector()
  static getLoading(state: TeamMembersStateModel) {
    return state.loading;
  }

  @Selector()
  static getError(state: TeamMembersStateModel) {
    return state.error;
  }

  @Action(LoadTeamMembers)
  loadTeamMembers(ctx: StateContext<TeamMembersStateModel>) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.teamMembersService.getTeamMembers().pipe(
      tap((teamMembers) => {
        ctx.patchState({ teamMembers, loading: false });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return of(error);
      })
    );
  }

  @Action(AddTeamMember)
  addTeamMember(ctx: StateContext<TeamMembersStateModel>, action: AddTeamMember) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.teamMembersService.createTeamMember(action.teamMember).pipe(
      tap((teamMember) => {
        ctx.patchState({
          teamMembers: [...state.teamMembers, teamMember],
          loading: false
        });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return of(error);
      })
    );
  }

  @Action(UpdateTeamMember)
  updateTeamMember(ctx: StateContext<TeamMembersStateModel>, action: UpdateTeamMember) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.teamMembersService.updateTeamMember(action.id, action.teamMember).pipe(
      tap((teamMember) => {
        ctx.patchState({
          teamMembers: state.teamMembers.map((tm) =>
            tm.id === teamMember.id ? teamMember : tm
          ),
          loading: false
        });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return of(error);
      })
    );
  }

  @Action(DeleteTeamMember)
  deleteTeamMember(ctx: StateContext<TeamMembersStateModel>, action: DeleteTeamMember) {
    const state = ctx.getState();
    ctx.patchState({ loading: true, error: null });

    return this.teamMembersService.deleteTeamMember(action.id).pipe(
      tap(() => {
        ctx.patchState({
          teamMembers: state.teamMembers.filter((tm) => tm.id !== action.id),
          loading: false
        });
      }),
      catchError((error) => {
        ctx.patchState({ error, loading: false });
        return of(error);
      })
    );
  }
} 