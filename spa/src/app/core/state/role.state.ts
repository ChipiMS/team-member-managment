import { Injectable, signal } from '@angular/core';
import { Role } from '../models/role.model';
import { RoleService } from '../services/role.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class RoleState {
  private rolesSignal = signal<Role[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  // Public signals
  roles = this.rolesSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  constructor(private roleService: RoleService) {}

  loadRoles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.rolesSignal.set(roles);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.message || 'Failed to load roles');
        this.loadingSignal.set(false);
      }
    });
  }

  getRoleById(id: number): Role | undefined {
    return this.rolesSignal().find(role => role.id === id);
  }
} 