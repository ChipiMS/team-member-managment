import { Component } from '@angular/core';
import { TeamMembersListComponent } from './team-members-list/team-members-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ TeamMembersListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spa';
}
