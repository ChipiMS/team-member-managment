import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../core/models/team-member.model';
import { RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DeleteTeamMember } from '../../core/store/team-members/team-members.actions';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

/**
 * This component is used to display a team member's information.
 * It displays the team member's name, email, phone number and role.
 * It also displays a button to delete the team member.
 */
@Component({
  selector: 'app-team-member-information',
  imports: [CommonModule, RouterLink, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './team-member-information.component.html',
  styleUrls: ['./team-member-information.component.css'],
})
export class TeamMemberInformationComponent {
  /**
   * The team member to display.
   */
  public teamMember = input.required<TeamMember>();

  /**
   * The event emitter for when the team member is deleted.
   */
  public teamMemberDeleted = output<void>();

  /**
   * The constructor for the component.
   * @param store - The store.
   * @param confirmationService - The confirmation service.
   * @param messageService - The message service.
   */
  constructor(
    private store: Store,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  /**
   * Confirmation dialog to delete the team member. If the user confirms, the team member is deleted.
   * @param event - The mouse event.
   */
  public onDelete(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this team member?',
      header: 'Delete Confirmation',
      icon: 'ph ph-warning',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.store
          .dispatch(new DeleteTeamMember(this.teamMember().id!))
          .subscribe(() => {
            this.teamMemberDeleted.emit();
            this.messageService.add({ severity: 'success', summary: 'Team member deleted.', life: 3000 });
          });
      },
    });
  }
}
