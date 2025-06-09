describe('Team Members List Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the team members list', () => {
    // Check if the page title is visible
    cy.get('h1').should('contain', 'Team Members');

    // Check if the add button is visible
    cy.get('a[aria-label="Add team member"]').should('be.visible');

    // Check if we have at least one team member
    cy.get('app-team-member-information').should('have.length.at.least', 1);
  });

  it('should navigate to add team member page', () => {
    cy.get('a[aria-label="Add team member"]').click();
    cy.url().should('include', '/add');
  });

  it('should navigate to edit team member page', () => {
    // Click the edit button of the first team member
    cy.get('app-team-member-information').first().click();
    cy.url().should('include', '/edit');
  });

  it('should show team member details', () => {
    // Check if the first team member's information is displayed
    cy.get('app-team-member-information').first().should('contain', 'John'); // First name
    cy.get('app-team-member-information').first().should('contain', 'Doe'); // Last name
    cy.get('app-team-member-information')
      .first()
      .should('contain', 'john@example.com'); // Email
    cy.get('app-team-member-information')
      .first()
      .should('contain', '(123) 456-7890'); // Phone
  });

  it('should show confirmation dialog when deleting team member', () => {
    // Click the delete button of the first team member
    cy.get('p-button[aria-label="Delete"]').first().click();

    // Check if confirmation dialog is shown
    cy.get('.p-confirmdialog').should('be.visible');
    cy.get('.p-confirmdialog').should(
      'contain',
      'Are you sure you want to delete this team member?',
    );
  });

  it('should delete team member after confirmation', () => {
    // Get initial count
    cy.get('app-team-member-information').then(($rows) => {
      const initialCount = $rows.length;

      // Click delete and confirm
      cy.get('p-button[aria-label="Delete"]').first().click();
      cy.get('.p-confirmdialog-accept-button').click();

      // Check if count decreased
      cy.get('app-team-member-information').should('have.length', initialCount - 1);
    });

    cy.get('p-toast').should('contain', 'Team member deleted.');
  });

});
