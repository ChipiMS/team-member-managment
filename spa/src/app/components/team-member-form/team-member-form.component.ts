import { Component, input, OnInit } from '@angular/core';
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
  DeleteTeamMember,
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
import { Router, RouterLink } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SkeletonModule } from 'primeng/skeleton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

/**
 * This component is used to add or edit a team member.
 * It displays a form with the team member's information and a dropdown to select the role.
 * It also displays a button to delete the team member.
 * It also displays a button to submit the form.
 * It also displays a button to cancel the form.
 * It also displays a button to reset the form.
 * It also displays a button to navigate to the team members list.
 */
@Component({
  selector: 'app-team-member-form',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    ConfirmDialogModule,
    DropdownModule,
    FloatLabelModule,
    InputMaskModule,
    InputTextModule,
    MessageModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    ReactiveFormsModule,
    RouterLink,
    SkeletonModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './team-member-form.component.html',
  styleUrls: ['./team-member-form.component.css'],
})
export class TeamMemberFormComponent implements OnInit {
  /**
   * The id of the team member to edit.
   */
  public id = input<string>();

  /**
   * The error message to display.
   */
  public error$: Observable<Error | string | null>;

  /**
   * The loading state of the component.
   */
  public loading$: Observable<boolean>;

  /**
   * The roles to display in the dropdown.
   */
  public roles$: Observable<Role[]>;

  /**
   * The team member to display in the form.
   */
  public teamMember$: Observable<TeamMember | undefined>;

  /**
   * The form group for the team member.
   */
  public teamMemberForm: FormGroup;

  /**
   * The constructor for the component.
   * @param fb - The form builder.
   * @param router - The router.
   * @param store - The store.
   * @param confirmationService - The confirmation service.
   * @param messageService - The message service.
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
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

  /**
   * The role id selected in the form.
   */
  public get selectedRole(): number | undefined {
    return this.teamMemberForm.get('role_id')?.value;
  }

  /**
   * The ngOnInit method.
   */
  public ngOnInit(): void {
    this.store.dispatch(new LoadRoles());
    this.store.dispatch(new LoadTeamMembers());
  }

  /**
   * The getRoleId method.
   * @param role - The role to get the id for.
   * @returns The id of the role.
   */
  public getRoleId(role: Role): string {
    return `role_${role.id}`;
  }

  /**
   * Confirmation dialog to delete the team member. If the user confirms, the team member is deleted.
   */
  public onDelete(): void {
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
          .dispatch(new DeleteTeamMember(Number.parseInt(this.id()!)))
          .subscribe(() => {
            this.messageService.add({ severity: 'success', summary: 'Team member deleted.', life: 3000 });
            this.router.navigate(['/']);
          });
      },
    });
  }

  /**
   * The onSubmit method.
   * If the form is valid, the team member is added or updated.
   */
  public onSubmit(): void {
    if (this.teamMemberForm.valid) {
      const formData = this.teamMemberForm.value;
      const teamMemberData: TeamMember = {
        ...formData,
        id: this.id(),
      };
      (this.id()
        ? this.store.dispatch(
            new UpdateTeamMember(Number.parseInt(this.id()!), teamMemberData),
          )
        : this.store.dispatch(new AddTeamMember(teamMemberData))
      ).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: this.id() ? 'Team member updated.' : 'Team member added.', life: 3000 });
        this.router.navigate(['/']);
      });
    } else {
      this.teamMemberForm.markAllAsTouched();
    }
  }
}
