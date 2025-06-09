describe('Add Team Member Page', () => {
  beforeEach(() => {
    // Visit the add team member page
    cy.visit('/add');
  });

  it('should display the form with all fields', () => {
    // Check if the form is visible
    cy.get('form').should('be.visible');

    // Check if all required fields are present
    cy.get('input[formControlName="first_name"]').should('be.visible');
    cy.get('input[formControlName="last_name"]').should('be.visible');
    cy.get('input[formControlName="email"]').should('be.visible');
    cy.get('[formControlName="phone_number"] input').should('be.visible');
    cy.get('p-radiobutton[formControlName="role_id"]')
      .first()
      .should('be.visible');

    // Check if buttons are present
    cy.get('button[type=submit]').should('be.visible');
  });

  it('should show validation errors for required fields', () => {
    // Try to submit without filling required fields
    cy.get('button[type=submit]').click();

    // Check for validation messages
    cy.get('p-message').should('contain', 'First name is required');
    cy.get('p-message').should('contain', 'Last name is required');
    cy.get('p-message').should('contain', 'Email is required');
  });

  it('should show validation error for invalid email', () => {
    cy.get('input[formControlName="email"]').type('invalid-email');
    cy.get('button[type=submit]').click();
    cy.get('p-message').should('contain', 'Please enter a valid email');
  });

  it('should show validation error for invalid phone number', () => {
    cy.get('button[type=submit]').click();
    cy.get('[formControlName="phone_number"] input').type('123');
    cy.get('p-message').should('contain', 'Please enter a valid phone number');
  });

  it('should successfully create a new team member', () => {
    // Fill in the form
    cy.get('input[formControlName="first_name"]').type('New');
    cy.get('input[formControlName="last_name"]').type('Member');
    cy.get('input[formControlName="email"]').type('new@example.com');
    cy.get('[formControlName="phone_number"] input').type('(555) 123-4567');

    // Select a role
    cy.get('p-radiobutton[formControlName="role_id"]').first().click();

    // Submit the form
    cy.get('button[type=submit]').click();

    // Should redirect to team members list
    cy.url().should('include', '/');

    cy.get('p-toast').should('contain', 'Team member added.');
  });

  it('should navigate back to list on cancel', () => {
    cy.get('a[aria-label=Back').click();
    cy.url().should('include', '/');
  });
});
