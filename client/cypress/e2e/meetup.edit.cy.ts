import { faker } from '@faker-js/faker';

describe('Edit meetup', () => {
  describe('given a user is logged in', () => {
    it('should update an existing meetup', function () {
      cy.createMeetupDraft().then((createdMeetupId: string) => {
        cy.visit('/meetups/drafts');
        cy.get(`[href="/meetups/${createdMeetupId}"]`, {
          timeout: 10_000,
        }).within(() => {
          cy.get('[data-testid="edit-button"]').click();
        });

        cy.url().should('contain', `/meetups/${createdMeetupId}/edit`);

        const updatedSubject: string = faker.company.catchPhrase();
        const updatedExcerpt: string = faker.lorem.paragraph();
        const updatedAuthor: string = 'employee Gerlach';
        const startDate: string = '15 Mar 2023 12:00';
        const finishDate: string = '15 Mar 2023 14:00';
        const place: string = faker.address.streetAddress();

        cy.get('[name="subject"]').clear().type(updatedSubject);
        cy.get('[name="excerpt"]').clear().type(updatedExcerpt);
        cy.get('[name="start"]').clear().type(startDate);
        cy.get('[name="finish"]').clear().type(finishDate);
        cy.get('[name="place"]').clear().type(place);

        cy.get('[data-testid="select-field"]').as('authorSelect').click();
        cy.get('@authorSelect').within(() => {
          cy.get('[class*="SelectField_option"]')
            .contains(updatedAuthor)
            .click();
        });

        cy.get('[data-testid="clear-button"]').click();
        cy.get('[data-testid="image-dropbox"]').selectFile(
          'cypress/fixtures/test-image-2.jpeg',
          { action: 'drag-drop' },
        );

        cy.get('#btn-save').should('be.enabled').click();

        // Should not redirect anywhere
        cy.url().should('contain', `/meetups/${createdMeetupId}/edit`);

        cy.visit(`/meetups/${createdMeetupId}`);
        cy.get('[class*="meetupHeading"]', { timeout: 20_000 }).should(
          'contain',
          updatedSubject,
        );
        cy.get('[class*="excerpt"]').should('contain', updatedExcerpt);
        // Currently, author is editable, but is not shown on View Meetup Page
        // cy.get('[class*="UserPreview"]').should('contain', updatedAuthor);
        cy.get('#date > span')
          .invoke('text')
          .should('match', /(March 15, 2023|15 марта, 2023)/);
        cy.get('#time > span')
          .invoke('text')
          .should('match', /(12:00 PM — 2:00 PM|12:00 — 14:00)/);
        cy.get('#location > span').invoke('text').should('contain', place);
        // uploaded image should be checked somehow, too
      });
    });
  });

  describe('given no user is logged in', () => {
    it('there should be no Edit button on the meetup card', () => {
      cy.visit('/meetups/drafts');
      cy.get('[class*="MeetupCard"]', { timeout: 10_000 })
        .first()
        .within(() => {
          cy.get('[data-testid="edit-button"]').should('not.exist');
        });
    });

    it('should not allow to navigate to edit route via browser address bar', () => {
      cy.visit('/meetups/aaa/edit');

      // Should redirect to /login page
      cy.url().should('contain', 'login');
    });
  });
});
