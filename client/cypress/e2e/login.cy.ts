import { AlertSeverity } from 'types';

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  describe('given valid credentials', () => {
    it('sends the credentials to server, receives the auth cookie and redirects to the Meetups page', () => {
      cy.getByTestId('text-input-username').type('chief');
      cy.getByTestId('text-input-password').type('private');
      cy.getByTestId('btn-login').click();

      cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

      cy.url().should('include', '/meetups');
      cy.getCookie('connect.sid').should('exist');
      cy.getByTestId('logged-user-info').should('contain', 'chief Blick');
    });
  });

  describe('given invalid credentials', () => {
    it('keeps Login page open', () => {
      cy.getByTestId('text-input-username').type('invalid-username');
      cy.getByTestId('text-input-password').type('invalid-password');
      cy.getByTestId('btn-login').click();

      cy.expectToastToPopupAndDismiss(AlertSeverity.Error);

      cy.url().should('include', '/login');
      cy.getCookie('connect.sid').should('not.exist');
      cy.getByTestId('logged-user-info').should('not.contain', 'chief Blick');
    });
  });
});
