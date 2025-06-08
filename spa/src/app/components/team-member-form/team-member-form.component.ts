import { Component, inject, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TeamMember } from '../../core/models/team-member.model';
import { Role } from '../../core/models/role.model';
import { Store } from '@ngxs/store';
import { TeamMembersState } from '../../core/store/team-members/team-members.state';
import {
  AddTeamMember,
  LoadTeamMembers,
  UpdateTeamMember,
} from '../../core/store/team-members/team-members.actions';
import { RolesState } from '../../core/store/roles/roles.state';
import { LoadRoles } from '../../core/store/roles/roles.actions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SkeletonModule } from 'primeng/skeleton';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-team-member-form',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    DropdownModule,
    FloatLabelModule,
    InputMaskModule,
    InputTextModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    ReactiveFormsModule,
    RouterLink,
    MessageModule,
    SkeletonModule,
  ],
  templateUrl: './team-member-form.component.html',
  styleUrls: ['./team-member-form.component.css'],
})
export class TeamMemberFormComponent implements OnInit {
  public id = input<string>();

  teamMemberForm: FormGroup;
  public roles$: Observable<Role[]>;
  public loading$: Observable<boolean>;
  public error$: Observable<string | null>;
  public teamMember$: Observable<TeamMember | undefined>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.teamMemberForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: [
        '',
        [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)],
      ],
      role_id: [null, [Validators.required]],
    });

    this.roles$ = this.store.select(RolesState.getRoles);
    this.loading$ = this.store.select(RolesState.getLoading);
    this.error$ = this.store.select(RolesState.getError);
    this.teamMember$ = this.store.select(TeamMembersState.getTeamMembers).pipe(
      map((members) => {
        const memberId = this.id();
        return memberId
          ? members.find((m) => m.id?.toString() === memberId)
          : undefined;
      }),
    );

    // Subscribe to team member changes
    this.teamMember$.subscribe((member) => {
      if (member) {
        this.teamMemberForm.patchValue({
          first_name: member.first_name,
          last_name: member.last_name,
          email: member.email,
          phone_number: member.phone_number,
          role_id: member.role?.id,
        });
      }
    });
  }

  public get selectedRole(): number | undefined {
    return this.teamMemberForm.get('role_id')?.value;
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadRoles());
    this.store.dispatch(new LoadTeamMembers());
  }

  getRoleId(role: Role): string {
    return `role_${role.id}`;
  }

  onSubmit(): void {
    if (this.teamMemberForm.valid) {
      const formData = this.teamMemberForm.value;
      const teamMemberData: TeamMember = {
        ...formData,
        id: this.id(),
      };
      if (this.id()) {
        this.store.dispatch(
          new UpdateTeamMember(Number.parseInt(this.id()!), teamMemberData),
        );
      } else {
        this.store.dispatch(new AddTeamMember(teamMemberData));
      }
    } else {
      this.teamMemberForm.markAllAsTouched();
    }
  }
}
