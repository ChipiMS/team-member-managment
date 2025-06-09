import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamMembersListComponent } from './team-members-list.component';
import { Store } from '@ngxs/store';
import { of, Observable } from 'rxjs';
import { LoadTeamMembers } from '../../core/store/team-members/team-members.actions';
import { TeamMember } from '../../core/models/team-member.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeamMembersState } from '../../core/store/team-members/team-members.state';
import { TypedSelector } from '@ngxs/store';

describe('TeamMembersListComponent', () => {
  let component: TeamMembersListComponent;
  let fixture: ComponentFixture<TeamMembersListComponent>;
  let storeMock: jasmine.SpyObj<Store>;
  let router: Router;

  const mockTeamMembers: TeamMember[] = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone_number: '(123) 456-7890',
      role: { id: 1, name: 'Developer', is_admin: false, permissions: [] },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      phone_number: '(098) 765-4321',
      role: { id: 2, name: 'Admin', is_admin: true, permissions: [] },
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('Store', ['dispatch', 'select']);

    // Mock store selectors
    storeMock.select.and.callFake(<T>(selector: TypedSelector<T>) => {
      if (selector === TeamMembersState.getTeamMembers) {
        return of(mockTeamMembers) as unknown as Observable<T>;
      }
      if (selector === TeamMembersState.getLoading) {
        return of(false) as unknown as Observable<T>;
      }
      if (selector === TeamMembersState.getError) {
        return of(null) as unknown as Observable<T>;
      }
      return of(null) as unknown as Observable<T>;
    });

    await TestBed.configureTestingModule({
      imports: [
        TeamMembersListComponent,
        CommonModule,
        ButtonModule,
        CardModule,
        RouterModule.forRoot([])
      ],
      providers: [
        { provide: Store, useValue: storeMock }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();

    fixture = TestBed.createComponent(TeamMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load team members on init', () => {
    component.ngOnInit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new LoadTeamMembers());
  });

  it('should display team members list', () => {
    const compiled = fixture.nativeElement;
    mockTeamMembers.forEach(member => {
      expect(compiled.textContent).toContain(member.first_name);
      expect(compiled.textContent).toContain(member.last_name);
      expect(compiled.textContent).toContain(member.email);
      expect(compiled.textContent).toContain(member.phone_number);
    });
  });




  it('should show loading state', () => {
    storeMock.select.and.callFake(<T>(selector: TypedSelector<T>) => {
      if (selector === TeamMembersState.getLoading) {
        return of(true) as unknown as Observable<T>;
      }
      return of(null) as unknown as Observable<T>;
    });

    fixture = TestBed.createComponent(TeamMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p-skeleton')).toBeTruthy();
  });



  it('should show empty state when no team members', () => {
    storeMock.select.and.callFake(<T>(selector: TypedSelector<T>) => {
      if (selector === TeamMembersState.getTeamMembers) {
        return of([]) as unknown as Observable<T>;
      }
      return of(null) as unknown as Observable<T>;
    });

    fixture = TestBed.createComponent(TeamMembersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('No team members found');
  });
}); 