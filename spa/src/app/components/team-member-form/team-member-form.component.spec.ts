import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store, TypedSelector } from '@ngxs/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SkeletonModule } from 'primeng/skeleton';
import { Observable, of } from 'rxjs';
import { Role } from '../../core/models/role.model';
import { TeamMember } from '../../core/models/team-member.model';
import { LoadRoles } from '../../core/store/roles/roles.actions';
import { RolesState } from '../../core/store/roles/roles.state';
import { LoadTeamMembers } from '../../core/store/team-members/team-members.actions';
import { TeamMembersState } from '../../core/store/team-members/team-members.state';
import { TeamMemberFormComponent } from './team-member-form.component';

describe('TeamMemberFormComponent', () => {
  let component: TeamMemberFormComponent;
  let fixture: ComponentFixture<TeamMemberFormComponent>;
  let storeMock: jasmine.SpyObj<Store>;
  let router: Router;
  let confirmationServiceMock: jasmine.SpyObj<ConfirmationService>;

  const mockTeamMember: TeamMember = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    phone_number: '(123) 456-7890',
    role: { id: 1, name: 'Developer', is_admin: false, permissions: [] },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockRoles: Role[] = [
    { id: 1, name: 'Developer', is_admin: false, permissions: [] },
    { id: 2, name: 'Admin', is_admin: true, permissions: [] },
  ];

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    confirmationServiceMock = jasmine.createSpyObj('ConfirmationService', [
      'confirm',
    ]);

    // Mock store selectors
    storeMock.select.and.callFake(<T>(selector: TypedSelector<T>) => {
      if (selector === RolesState.getRoles) {
        return of(mockRoles) as unknown as Observable<T>;
      }
      if (selector === RolesState.getLoading) {
        return of(false) as unknown as Observable<T>;
      }
      if (selector === RolesState.getError) {
        return of(null) as unknown as Observable<T>;
      }
      if (selector === TeamMembersState.getTeamMembers) {
        return of([mockTeamMember]) as unknown as Observable<T>;
      }
      return of(null) as unknown as Observable<T>;
    });

    await TestBed.configureTestingModule({
      imports: [
        TeamMemberFormComponent,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        CardModule,
        ProgressSpinnerModule,
        MessageModule,
        FloatLabelModule,
        SkeletonModule,
        RadioButtonModule,
        ConfirmDialogModule,
        InputMaskModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        MessageService,
        { provide: Store, useValue: storeMock },
        { provide: ConfirmationService, useValue: confirmationServiceMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();

    fixture = TestBed.createComponent(TeamMemberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.teamMemberForm.get('first_name')?.value).toBe('');
    expect(component.teamMemberForm.get('last_name')?.value).toBe('');
    expect(component.teamMemberForm.get('email')?.value).toBe('');
    expect(component.teamMemberForm.get('phone_number')?.value).toBe('');
    expect(component.teamMemberForm.get('role_id')?.value).toBe(null);
  });

  it('should load roles and team members on init', () => {
    component.ngOnInit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new LoadRoles());
    expect(storeMock.dispatch).toHaveBeenCalledWith(new LoadTeamMembers());
  });

  it('should validate required fields', () => {
    component.onSubmit();

    expect(
      component.teamMemberForm.get('first_name')?.errors?.['required'],
    ).toBeTruthy();
    expect(
      component.teamMemberForm.get('last_name')?.errors?.['required'],
    ).toBeTruthy();
    expect(
      component.teamMemberForm.get('email')?.errors?.['required'],
    ).toBeTruthy();
    expect(
      component.teamMemberForm.get('role_id')?.errors?.['required'],
    ).toBeTruthy();
  });

  it('should validate email format', () => {
    component.teamMemberForm.get('email')?.setValue('invalid-email');
    component.teamMemberForm.get('email')?.markAsTouched();

    expect(
      component.teamMemberForm.get('email')?.errors?.['email'],
    ).toBeTruthy();
  });

  it('should validate phone number format', () => {
    component.teamMemberForm.get('phone_number')?.setValue('1234567890');
    component.teamMemberForm.get('phone_number')?.markAsTouched();

    expect(
      component.teamMemberForm.get('phone_number')?.errors?.['pattern'],
    ).toBeTruthy();
  });

  it('should get role ID correctly', () => {
    const role = mockRoles[0];
    expect(component.getRoleId(role)).toBe(`role_${role.id}`);
  });

  it('should get selected role ID', () => {
    component.teamMemberForm.get('role_id')?.setValue(1);
    expect(component.selectedRole).toBe(1);
  });
});
