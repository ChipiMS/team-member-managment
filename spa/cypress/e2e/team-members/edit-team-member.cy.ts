describe('Edit Team Member Page', () => {
  beforeEach(() => {
    // Visit edit page for first team member
    cy.visit('/edit/1');
  });

  it('should display the form with all fields', () => {
    // Check if the form is visible
    cy.get('form').should('be.visible');

    // Check if all required fields are present
    cy.get('input[formControlName="first_name"]').should('be.visible');
    cy.get('input[formControlName="last_name"]').should('be.visible');
    cy.get('input[formControlName="email"]').should('be.visible');
    cy.get('[formControlName="phone_number"] input').should('be.visible');
    cy.get('p-radiobutton[formControlName="role_id"]').should('be.visible');

    // Check if buttons are present
    cy.get('button[type=submit]').should('be.visible');
  });

  it('should load and display team member data', () => {
    // Check if form is populated with existing data
    cy.get('input[formControlName="first_name"]').should('have.value', 'John');
    cy.get('input[formControlName="last_name"]').should('have.value', 'Doe');
    cy.get('input[formControlName="email"]').should(
      'have.value',
      'john@example.com',
    );
    cy.get('[formControlName="phone_number"] input').should(
      'have.value',
      '(123) 456-7890',
    );
  });

  it('should show validation errors for required fields', () => {
    // Clear required fields
    cy.get('input[formControlName="first_name"]').clear();
    cy.get('input[formControlName="last_name"]').clear();
    cy.get('input[formControlName="email"]').clear();

    // Try to submit
    cy.get('button[type=submit]').click();

    // Check for validation messages
    cy.get('p-message').should('contain', 'First name is required');
    cy.get('p-message').should('contain', 'Last name is required');
    cy.get('p-message').should('contain', 'Email is required');
  });

  it('should show validation error for invalid email', () => {
    cy.get('input[formControlName="email"]').clear().type('invalid-email');
    cy.get('button[type=submit]').click();
    cy.get('p-message').should('contain', 'Please enter a valid email');
  });

  it('should show validation error for invalid phone number', () => {
    cy.get('[formControlName="phone_number"] input').clear();
    cy.get('input[formControlName="email"]').clear().type('chipi@instawork.com');
    cy.get('[formControlName="phone_number"] input').clear().type('123');
    cy.get('p-message').should('contain', 'Please enter a valid phone number');
  });

  it('should successfully update team member', () => {
    // Update form fields
    cy.get('input[formControlName="first_name"]').clear().type('Updated');
    cy.get('input[formControlName="last_name"]').clear().type('Name');
    cy.get('input[formControlName="email"]')
      .clear()
      .type('updated@example.com');
    cy.get('[formControlName="phone_number"] input')
      .clear()
      .type('(555) 987-6543');

    // Select a different role
    cy.get('p-radiobutton[formControlName="role_id"]').first().click();

    // Submit the form
    cy.get('button[type=submit]').click();

    // Should redirect to team members list
    cy.url().should('include', '/');

    cy.get('p-toast').should('contain', 'Team member updated.');
  });

  it('should navigate back to list on cancel', () => {
    cy.get('a[aria-label=Back').click();
    cy.url().should('include', '/');
  });

  it('should show error message when team member is not found', () => {
    cy.visit('/edit/999');
    cy.get('p-toast').should('contain', 'Team member not found.');
    cy.url().should('include', '/');
  });
});
