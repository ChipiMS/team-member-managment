import { Component, EventEmitter, inject, input, Input, OnInit, Output, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TeamMember } from '../../core/models/team-member.model';
import { Role } from '../../core/models/role.model';
import { RoleState } from '../../core/state/role.state';
import { Store } from '@ngxs/store';
import { TeamMembersState } from '../../core/store/team-members/team-members.state';
import { LoadTeamMembers } from '../../core/store/team-members/team-members.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-team-member-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    ProgressSpinnerModule
  ],
  templateUrl: './team-member-form.component.html',
  styleUrls: ['./team-member-form.component.css']
})
export class TeamMemberFormComponent implements OnInit {
  public id = input<string>();
  public formSubmit = new EventEmitter<TeamMember>();

  teamMemberForm: FormGroup;
  public roles: Signal<Role[]>;
  public loading: Signal<boolean>;
  public error: Signal<string | null>;
  public teamMember$: Observable<TeamMember | undefined>;

  constructor(
    private fb: FormBuilder,
    private roleState: RoleState,
    private store: Store
  ) {
    this.teamMemberForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [''],
      role_id: [null]
    });

    this.roles = this.roleState.roles;
    this.loading = this.roleState.loading;
    this.error = this.roleState.error;
    this.teamMember$ = this.store.select(TeamMembersState.getTeamMembers).pipe(
      map(members => {
        const memberId = this.id();
        return memberId ? members.find(m => m.id?.toString() === memberId) : undefined;
      })
    );

    // Subscribe to team member changes
    this.teamMember$.subscribe(member => {
      if (member) {
        this.teamMemberForm.patchValue({
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          phone_number: member.phone_number,
          role_id: member.role?.id
        });
      }
    });
  }

  ngOnInit(): void {
    this.roleState.loadRoles();
    this.store.dispatch(new LoadTeamMembers());
  }

  onSubmit(): void {
    if (this.teamMemberForm.valid) {
      const formData = this.teamMemberForm.value;
      const teamMemberData: TeamMember = {
        ...formData,
        id: this.id()
      };
      this.formSubmit.emit(teamMemberData);
    }
  }
} 