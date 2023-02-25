export {};

describe('Logout', () => {
  it('should log the current user out', () => {
    cy.loginAsChief();
    cy.visit('/');

    cy.get('[data-testid="auth-toggle"]').click();

    cy.url().should('include', '/meetups');
    cy.get('header').should('not.contain', 'chief Blick');
  });
});
