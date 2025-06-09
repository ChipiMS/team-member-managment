import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Role } from '../../models/role.model';

/**
 * This service is used to get the roles from the API.
 */
@Injectable({
  providedIn: 'root',
})
export class RolesService {
  /**
   * The API URL for the roles.
   */
  private apiUrl = `${environment.apiUrl}/roles`;

  /**
   * The constructor for the service.
   * @param http - The HTTP client.
   */
  constructor(private http: HttpClient) {}

  /**
   * Gets the roles from the API.
   * @returns An observable of the roles.
   */
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }
}
