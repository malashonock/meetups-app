export {};

describe('Delete meetup', () => {
  describe('given a user is logged in', () => {
    it('should delete an existing meetup', function () {
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
  });
});
