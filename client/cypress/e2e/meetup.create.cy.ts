import { faker } from '@faker-js/faker';

describe('Create meetup', () => {
  describe('given a user is logged in', () => {
    it('should create a new meetup', () => {
      cy.loginAsChief();

      cy.visit('/meetups');
      cy.url().should('contain', '/meetups/topics');

      cy.get('#btn-create-meetup').click();
      cy.url().should('contain', '/meetups/create');

      const subject: string = faker.company.catchPhrase();
      const excerpt: string = faker.lorem.paragraph();

      cy.get('[name="subject"]').type(subject);
      cy.get('[name="excerpt"]').type(excerpt);
      cy.get('[data-testid="select-field"]').as('authorSelect').click();
      cy.get('@authorSelect').within(() => {
        cy.get('[class*="SelectField_option"]').contains('chief Blick').click();
      });

      cy.get('#btn-next').click();

      cy.get('[name="start"]').type('15 Mar 2023 12:00');
      cy.get('[name="finish"]').type('15 Mar 2023 14:00');
      cy.get('[name="place"]').type('room 123');
      cy.get('[data-testid="image-dropbox"]').selectFile(
        'cypress/fixtures/test-image-1.jpeg',
        { action: 'drag-drop' },
      );

      cy.get('#btn-create').click();

      // Should redirect to view created meetup page
      cy.url().should('match', /\/meetups\/(.)+$/);

      // The just created meetup is in topic stage,
      // so the only visible fields should be subject, excerpt and author
      cy.get('[class*="meetupHeading"]').should('contain', subject);
      cy.get('[class*="excerpt"]').should('contain', excerpt);
      cy.get('[data-testid="user-preview"]').should('contain', 'chief Blick');
    });
  });

  describe('given no user is logged in', () => {
    it('should redirect to Login page', () => {
      cy.visit('/meetups');
      cy.url().should('contain', '/meetups/topics');

      cy.get('[class*="createMeetupBtn"]').click();
      cy.url().should('contain', '/login');
    });

    it('should not allow to navigate to /create route via browser address bar', () => {
      cy.visit('/meetups/create');

      // Should redirect to /login page
      cy.url().should('contain', 'login');
    });
  });
});
