import { AlertSeverity } from 'types';

describe('Logout', () => {
  it('should log the current user out', () => {
    cy.loginAsChief();
    cy.visit('/');

    cy.getByTestId('auth-toggle').click();

    cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

    cy.url().should('include', '/meetups');
    cy.getByTestId('logged-user-info').should('not.contain', 'chief Blick');
  });
});
