export {};

describe('Logout', () => {
  it('should log the current user out', () => {
    cy.loginAsChief();
    cy.visit('/');
    cy.wait(1_000);

    cy.get('[data-testid="auth-toggle"]').click();

    cy.url().should('include', '/meetups');
    cy.get('header').should('not.contain', 'chief Blick');
  });
});
