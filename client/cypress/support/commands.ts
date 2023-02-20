/// <reference types="cypress" />

import '@testing-library/cypress/add-commands';
import { faker } from '@faker-js/faker';

declare global {
  namespace Cypress {
    interface Chainable {
      login(name: string, surname: string, password: string): Chainable<void>;
      loginAsChief(): Chainable<void>;
      loginAsEmployee(): Chainable<void>;
      createNewsArticle(): Chainable<string>;
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

Cypress.Commands.add('createNewsArticle', function () {
  cy.loginAsChief();

  const title: string = faker.company.catchPhrase();
  const text: string = faker.lorem.paragraph();

  const formData = new FormData();
  formData.append('title', title);
  formData.append('text', text);

  cy.fixture<string>('../fixtures/test-image-1.jpeg', 'base64').then(
    (image: string) => {
      formData.append(
        'image',
        Cypress.Blob.base64StringToBlob(image, 'image/jpeg'),
      );
    },
  );

  cy.request({
    url: 'http://localhost:8080/api/news',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  })
    .its('body')
    .then((body: ArrayBuffer) => {
      const bodyAsString = Cypress.Blob.arrayBufferToBinaryString(body);
      return JSON.parse(bodyAsString);
    })
    .its('id');
});
