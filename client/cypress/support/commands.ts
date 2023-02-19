/// <reference types="cypress" />

import '@testing-library/cypress/add-commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login(name: string, surname: string, password: string): Chainable<void>;
      loginAsChief(): Chainable<void>;
      loginAsEmployee(): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  'login',
  (name: string, surname: string, password: string) => {
    cy.session(
      [name, surname, password],
      () => {
        cy.visit('/login');
        cy.get('input[name="username"]').type(name);
        cy.get('input[name="password"]').type(password);
        cy.get('button[type="submit"').click();
        cy.url().should('include', '/meetups');
        cy.get('header').should('contain', name + ' ' + surname);
      },
      {
        validate: () => {
          cy.getCookie('connect.sid').should('exist');
        },
      },
    );
  },
);

Cypress.Commands.add('loginAsChief', () => {
  cy.login('chief', 'Blick', 'private');
});

Cypress.Commands.add('loginAsEmployee', () => {
  cy.login('employee', 'Gerlach', 'private');
});
