import { faker } from '@faker-js/faker';

import { AlertSeverity } from 'types';

describe('Edit meetup', () => {
  describe('given a user with admin rights is logged in', () => {
    it('should update an existing meetup', function () {
      cy.createMeetupDraft().then((createdMeetupId: string) => {
        cy.visit('/meetups/drafts');
        cy.get(`[href="/meetups/${createdMeetupId}"]`, {
          timeout: 10_000,
        }).within(() => {
          cy.getByTestId('edit-button').click();
        });

        cy.url().should('contain', `/meetups/${createdMeetupId}/edit`);

        const updatedSubject: string = faker.company.catchPhrase();
        const updatedExcerpt: string = faker.lorem.paragraph();
        const updatedSpeaker: string = 'employee Gerlach';
        const startDate: string = '15 Mar 2023 12:00';
        const finishDate: string = '15 Mar 2023 14:00';
        const place: string = faker.address.streetAddress();

        cy.getByTestId('text-input-subject').clear().type(updatedSubject);
        cy.getByTestId('text-area-excerpt').clear().type(updatedExcerpt);
        cy.get('[name="start"]').clear().type(startDate);
        cy.get('[name="finish"]').clear().type(finishDate);
        cy.getByTestId('text-input-place').clear().type(place);

        cy.getByTestId('select-speakers').as('speakersSelect').click();
        cy.get('@speakersSelect').within(() => {
          cy.get('[aria-label="Remove chief Blick"]').click();
          cy.get('[class*="SelectField_option"]')
            .contains(updatedSpeaker)
            .click();
        });

        cy.getByTestId('clear-button').click();
        cy.getByTestId('image-dropbox').selectFile(
          'cypress/fixtures/test-image-2.jpeg',
          { action: 'drag-drop' },
        );

        cy.getByTestId('btn-save').should('be.enabled').click();

        cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

        // Should not redirect anywhere
        cy.url().should('contain', `/meetups/${createdMeetupId}/edit`);

        cy.visit(`/meetups/${createdMeetupId}`);
        cy.getByTestId('heading', { timeout: 20_000 }).should(
          'contain',
          updatedSubject,
        );
        cy.getByTestId('description').should('contain', updatedExcerpt);
        // Currently, author is editable, but is not shown on View Meetup Page
        // cy.get('[class*="UserPreview"]').should('contain', updatedSpeaker);
        cy.get('#date > span')
          .invoke('text')
          .should('match', /(March 15, 2023|15 марта, 2023)/);
        cy.get('#time > span')
          .invoke('text')
          .should('match', /(12:00 PM — 2:00 PM|12:00 — 14:00)/);
        cy.getByTestId('location').should('contain', place);
        // uploaded image should be checked somehow, too
      });
    });
  });

  describe('given a user with non-admin rights is logged in', () => {
    it('there should be no Edit button on the meetup card', () => {
      cy.loginAsEmployee();

      cy.visit('/meetups/drafts');
      cy.getByTestId('meetup-card', { timeout: 10_000 })
        .first()
        .within(() => {
          cy.getByTestId('edit-button').should('not.exist');
        });
    });

    it('should not allow to navigate to edit route via browser address bar', () => {
      cy.loginAsEmployee();

      cy.visit('/meetups/aaa/edit');

      cy.expectToastToPopupAndDismiss(AlertSeverity.Error);

      // Should redirect to /meetups page
      cy.url().should('contain', '/meetups');
    });
  });

  describe('given no user is logged in', () => {
    it('there should be no Edit button on the meetup card', () => {
      cy.visit('/meetups/drafts');
      cy.getByTestId('meetup-card', { timeout: 10_000 })
        .first()
        .within(() => {
          cy.getByTestId('edit-button').should('not.exist');
        });
    });

    it('should not allow to navigate to edit route via browser address bar', () => {
      cy.visit('/meetups/aaa/edit');

      cy.expectToastToPopupAndDismiss(AlertSeverity.Error);

      // Should redirect to /login page
      cy.url().should('contain', 'login');
    });
  });
});
