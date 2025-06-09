import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Store } from '@ngxs/store';
import { TeamMembersState } from '../../core/store/team-members/team-members.state';
import { LoadTeamMembers } from '../../core/store/team-members/team-members.actions';
import { TeamMember } from '../../core/models/team-member.model';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TeamMemberInformationComponent } from '../team-member-information/team-member-information.component';
import { SkeletonModule } from 'primeng/skeleton';

/**
 * This component is used to display a list of team members.
 * It displays the team members' names, emails, phone numbers and roles.
 * It also displays a button to delete the team member.
 */
@Component({
  selector: 'app-team-members-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    RouterLink,
    TeamMemberInformationComponent,
    SkeletonModule,
  ],
  templateUrl: './team-members-list.component.html',
  styleUrls: ['./team-members-list.component.css'],
})
export class TeamMembersListComponent implements OnInit {
  /**
   * The team members to display.
   */
  public teamMembers$: Observable<TeamMember[]>;

  /**
   * The loading state of the component.
   */
  public loading$: Observable<boolean>;

  /**
   * The constructor for the component.
   * @param store - The store.
   */
  constructor(private store: Store) {
    this.teamMembers$ = this.store.select(TeamMembersState.getTeamMembers);
    this.loading$ = this.store.select(TeamMembersState.getLoading);
  }

  /**
   * The ngOnInit method.
   * Loads the team members from the store.
   */
  public ngOnInit(): void {
    this.store.dispatch(new LoadTeamMembers());
  }
}
