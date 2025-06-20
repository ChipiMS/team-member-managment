import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngxs/store';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { of } from 'rxjs';
import { TeamMember } from '../../core/models/team-member.model';
import { DeleteTeamMember } from '../../core/store/team-members/team-members.actions';
import { TeamMemberInformationComponent } from './team-member-information.component';

describe('TeamMemberInformationComponent', () => {
  let component: TeamMemberInformationComponent;
  let fixture: ComponentFixture<TeamMemberInformationComponent>;
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

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch']);
    confirmationServiceMock = jasmine.createSpyObj('ConfirmationService', [
      'confirm',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        TeamMemberInformationComponent,
        CommonModule,
        ButtonModule,
        CardModule,
        ConfirmDialogModule,
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

    fixture = TestBed.createComponent(TeamMemberInformationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('teamMember', mockTeamMember);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display team member information', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain(mockTeamMember.first_name);
    expect(compiled.textContent).toContain(mockTeamMember.last_name);
    expect(compiled.textContent).toContain(mockTeamMember.email);
    expect(compiled.textContent).toContain(mockTeamMember.phone_number);
  });

  it('should dispatch DeleteTeamMember action and emit event when deletion is confirmed', () => {
    storeMock.dispatch.and.returnValue(of(void 0));
    spyOn(component.teamMemberDeleted, 'emit');

    let acceptCallback: (() => void) | undefined;
    confirmationServiceMock.confirm.and.callFake(
      (confirmation: Confirmation) => {
        acceptCallback = confirmation.accept as () => void;
        return confirmationServiceMock;
      },
    );

    const event = new MouseEvent('click');
    component.onDelete(event);

    if (acceptCallback && mockTeamMember.id) {
      acceptCallback();
      expect(storeMock.dispatch).toHaveBeenCalledWith(
        new DeleteTeamMember(mockTeamMember.id),
      );
      expect(component.teamMemberDeleted.emit).toHaveBeenCalled();
    }
  });
});
