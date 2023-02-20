export {};

describe('Delete meetup', () => {
  describe('given a user is logged in', () => {
    it('should delete meetup via Delete button on meetup card', function () {
      cy.createTopic().then((createdMeetupId: string) => {
        cy.visit('/meetups/topics');
        cy.get(`[href="/meetups/${createdMeetupId}"]`, {
          timeout: 10_000,
        }).within(() => {
          cy.get('[data-testid="delete-button"]').click();
        });

        // Should not redirect anywhere
        cy.url().should('contain', '/meetups/topics');

        cy.visit(`/meetups/${createdMeetupId}`);
        cy.get(`[href="/meetups/${createdMeetupId}"]`, {
          timeout: 10_000,
        }).should('not.exist');
      });
    });

    it('should delete meetup via Delete button on view topic page', function () {
      cy.createTopic().then((createdMeetupId: string) => {
        cy.visit(`/meetups/${createdMeetupId}`);
        cy.get('#btn-delete', {
          timeout: 10_000,
        }).click();

        // Should redirect to topics
        cy.url().should('contain', '/meetups/topics');

        cy.visit(`/meetups/${createdMeetupId}`);
        cy.get(`[href="/meetups/${createdMeetupId}"]`, {
          timeout: 10_000,
        }).should('not.exist');
      });
    });

    it('should not show Delete button on view meetup page after topic approval', function () {
      cy.createMeetupDraft().then((createdMeetupId: string) => {
        cy.visit(`/meetups/${createdMeetupId}`);
        cy.get('#btn-delete', {
          timeout: 10_000,
        }).should('not.exist');
      });
    });
  });

  describe('given no user is logged in', () => {
    it('there should be no Delete button on the meetup card', () => {
      cy.visit('/meetups');
      cy.get('[class*="MeetupCard"]', { timeout: 10_000 })
        .first()
        .within(() => {
          cy.get('[data-testid="delete-button"]').should('not.exist');
        });
    });

    it('there should be no Delete button on the view topic page', () => {
      cy.visit('/meetups/topics');
      cy.get('[class*="MeetupCard"]', { timeout: 10_000 }).first().click();
      cy.get('#btn-delete', {
        timeout: 10_000,
      }).should('not.exist');
    });
  });
});
