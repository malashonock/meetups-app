/// <reference types="cypress" />

import '@testing-library/cypress/add-commands';
import { faker } from '@faker-js/faker';
import { MeetupStatus, IUser } from 'model';

declare global {
  namespace Cypress {
    interface Chainable {
      login(name: string, surname: string, password: string): Chainable<void>;
      loginAsChief(): Chainable<void>;
      loginAsEmployee(): Chainable<void>;
      createNewsArticle(): Chainable<string>;
      createTopic(): Chainable<string>;
      createMeetupDraft(): Chainable<string>;
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

  cy.fixture<string>('test-image-1.jpeg', 'binary').then((image: string) => {
    formData.append(
      'image',
      Cypress.Blob.binaryStringToBlob(image, 'image/jpeg'),
      'test-image-1.jpeg',
    );
  });

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

Cypress.Commands.add('createTopic', function () {
  cy.loginAsChief();

  const subject: string = faker.company.catchPhrase();
  const excerpt: string = faker.lorem.paragraph();
  const author: IUser = {
    id: 'uuu-bbb',
    name: 'chief',
    surname: 'Blick',
  };

  const formData = new FormData();
  formData.append('subject', subject);
  formData.append('excerpt', excerpt);
  formData.append('author', JSON.stringify(author));

  cy.fixture<string>('test-image-1.jpeg', 'binary').then((image: string) => {
    formData.append(
      'image',
      Cypress.Blob.binaryStringToBlob(image, 'image/jpeg'),
      'test-image-1.jpeg',
    );
  });

  cy.request({
    url: 'http://localhost:8080/api/meetups',
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

Cypress.Commands.add('createMeetupDraft', function () {
  cy.createTopic().then((createdTopicId) => {
    const formData = new FormData();
    formData.append('status', MeetupStatus.DRAFT);

    cy.request({
      url: `http://localhost:8080/api/meetups/${createdTopicId}`,
      method: 'PATCH',
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
});
