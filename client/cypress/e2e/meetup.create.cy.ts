import { faker } from '@faker-js/faker';

import { AlertSeverity } from 'types';

describe('Create meetup', () => {
  describe('given a user with admin rights is logged in', () => {
    it('should create a new topic', () => {
      cy.loginAsChief();

      cy.visit('/meetups');
      cy.url().should('contain', '/meetups/topics');

      cy.getByTestId('btn-create-meetup').click();
      cy.url().should('contain', '/meetups/create');

      const subject: string = faker.company.catchPhrase();
      const excerpt: string = faker.lorem.paragraph();

      cy.getByTestId('text-input-subject').type(subject);
      cy.getByTestId('text-area-excerpt').type(excerpt);
      cy.getByTestId('select-speakers').as('speakersSelect').click();
      cy.get('@speakersSelect').within(() => {
        cy.get('[aria-label="Remove chief Blick"]').click();
        cy.get('[class*="SelectField_option"]')
          .contains('employee Gerlach')
          .click();
      });

      cy.getByTestId('btn-next').click();

      cy.get('[name="start"]').type('15 Mar 2023 12:00');
      cy.get('[name="finish"]').type('15 Mar 2023 14:00');
      cy.getByTestId('text-input-place').type('room 123');
      cy.getByTestId('image-dropbox').selectFile(
        'cypress/fixtures/test-image-1.jpeg',
        { action: 'drag-drop' },
      );

      cy.getByTestId('btn-create').click();

      cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

      // Should redirect to view created topic page
      cy.url().should('match', /\/meetups\/(.)+$/);

      // The just created meetup is in topic stage,
      // so the only visible fields should be subject, excerpt and author
      cy.getByTestId('heading').should('contain', subject);
      cy.getByTestId('description').should('contain', excerpt);
      cy.getByTestId('author').should('contain', 'chief Blick');
    });
  });

  describe('given a user with non-admin rights is logged in', () => {
    it('should create a new topic', () => {
      cy.loginAsEmployee();

      cy.visit('/meetups');
      cy.url().should('contain', '/meetups/topics');

      cy.getByTestId('btn-create-meetup').click();
      cy.url().should('contain', '/meetups/create');

      const subject: string = faker.company.catchPhrase();
      const excerpt: string = faker.lorem.paragraph();

      cy.getByTestId('text-input-subject').type(subject);
      cy.getByTestId('text-area-excerpt').type(excerpt);
      cy.getByTestId('select-speakers').as('speakersSelect').click();
      cy.get('@speakersSelect').within(() => {
        cy.get('[aria-label="Remove employee Gerlach"]').click();
        cy.get('[class*="SelectField_option"]')
          .contains('employee Gerlach')
          .click();
      });

      cy.getByTestId('btn-next').click();

      cy.get('[name="start"]').type('15 Mar 2023 12:00');
      cy.get('[name="finish"]').type('15 Mar 2023 14:00');
      cy.getByTestId('text-input-place').type('room 123');
      cy.getByTestId('image-dropbox').selectFile(
        'cypress/fixtures/test-image-1.jpeg',
        { action: 'drag-drop' },
      );

      cy.getByTestId('btn-create').click();

      cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

      // Should redirect to view created topic page
      cy.url().should('match', /\/meetups\/(.)+$/);

      // The just created meetup is in topic stage,
      // so the only visible fields should be subject, excerpt and author
      cy.getByTestId('heading').should('contain', subject);
      cy.getByTestId('description').should('contain', excerpt);
      cy.getByTestId('author').should('contain', 'employee Gerlach');
    });
  });

  describe('given no user is logged in', () => {
    it('should not render Create Meetup button', () => {
      cy.visit('/meetups');
      cy.url().should('contain', '/meetups/topics');

      cy.getByTestId('btn-create-meetup').should('not.exist');
    });

    it('should not allow to navigate to /create route via browser address bar', () => {
      cy.visit('/meetups/create');

      cy.expectToastToPopupAndDismiss(AlertSeverity.Error);

      // Should redirect to /login page
      cy.url().should('contain', 'login');
    });
  });
});
