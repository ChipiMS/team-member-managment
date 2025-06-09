import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamMember } from '../../models/team-member.model';
import { environment } from '../../../../environments/environment';

/**
 * This service is used to get the team members from the API.
 */
@Injectable({
  providedIn: 'root',
})
export class TeamMembersService {
  /**
   * The API URL for the team members.
   */
  private apiUrl = `${environment.apiUrl}/team-members/`;

  /**
   * The constructor for the service.
   * @param http - The HTTP client.
   */
  constructor(private http: HttpClient) {}

  /**
   * Gets the team members from the API.
   * @returns An observable of the team members.
   */
  public getTeamMembers(): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(this.apiUrl);
  }

  /**
   * Gets a team member from the API.
   * @param id - The id of the team member.
   * @returns An observable of the team member.
   */
  public getTeamMember(id: string): Observable<TeamMember> {
    return this.http.get<TeamMember>(`${this.apiUrl}${id}`);
  }

  /**
   * Creates a team member in the API.
   * @param teamMember - The team member to create.
   * @returns An observable of the created team member.
   */
  public createTeamMember(teamMember: TeamMember): Observable<TeamMember> {
    return this.http.post<TeamMember>(this.apiUrl, teamMember);
  }

  /**
   * Updates a team member in the API.
   * @param id - The id of the team member.
   * @param teamMember - The team member to update.
   * @returns An observable of the updated team member.
   */
  public updateTeamMember(
    id: number,
    teamMember: TeamMember,
  ): Observable<TeamMember> {
    return this.http.put<TeamMember>(`${this.apiUrl}${id}/`, teamMember);
  }

  /**
   * Deletes a team member from the API.
   * @param id - The id of the team member.
   * @returns An observable of the deleted team member.
   */
  public deleteTeamMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
