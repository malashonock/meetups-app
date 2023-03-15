import { AlertSeverity } from 'types';

describe('Logout', () => {
  it('should log the current user out', () => {
    cy.loginAsChief();
    cy.visit('/');

    cy.get('[data-testid="auth-toggle"]').first().click();

    cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

    cy.url().should('include', '/meetups');
    cy.get('[class*="Header_userInfo"]').should('not.contain', 'chief Blick');
  });
});
