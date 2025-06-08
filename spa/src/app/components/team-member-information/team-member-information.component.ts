import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../core/models/team-member.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-team-member-information',
  imports: [CommonModule, RouterLink],
  templateUrl: './team-member-information.component.html',
  styleUrls: ['./team-member-information.component.css']
})
export class TeamMemberInformationComponent {
  teamMember = input.required<TeamMember>();
} 