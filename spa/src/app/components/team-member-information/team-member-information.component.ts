import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../core/models/team-member.model';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngxs/store';
import { ConfirmationService } from 'primeng/api';
import { DeleteTeamMember } from '../../core/store/team-members/team-members.actions';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-team-member-information',
  imports: [CommonModule, RouterLink, ButtonModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './team-member-information.component.html',
  styleUrls: ['./team-member-information.component.css']
})
export class TeamMemberInformationComponent {
  teamMember = input.required<TeamMember>();

  public teamMemberDeleted = output<void>();

  constructor(
    private store: Store,
    private confirmationService: ConfirmationService,
  ) {}

  onDelete(event: MouseEvent): void {
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
          });
      },
    });
  }
} 