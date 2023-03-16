import { AlertSeverity } from 'types';

describe('Delete meetup', () => {
  describe('given a user with admin rights is logged in', () => {
    it('should delete meetup via Delete button on meetup card', function () {
      cy.createTopic().then((createdMeetupId: string) => {
        cy.visit('/meetups/topics');
        cy.get(`[href="/meetups/${createdMeetupId}"]`, {
          timeout: 10_000,
        }).within(() => {
          cy.getByTestId('delete-button').click();
        });
        cy.getByTestId('confirm-button').click();

        cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

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
        cy.getByTestId('btn-delete', {
          timeout: 10_000,
        }).click();
        cy.getByTestId('confirm-button').click();

        cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

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
        cy.getByTestId('btn-delete', {
          timeout: 10_000,
        }).should('not.exist');
      });
    });
  });

  describe('given a user with non-admin rights is logged in', () => {
    it('there should be no Delete button on the meetup card', () => {
      cy.loginAsEmployee();

      cy.visit('/meetups');
      cy.getByTestId('meetup-card', { timeout: 10_000 })
        .first()
        .within(() => {
          cy.getByTestId('delete-button').should('not.exist');
        });
    });

    it('there should be no Delete button on the view topic page', () => {
      cy.loginAsEmployee();

      cy.visit('/meetups/topics');
      cy.getByTestId('meetup-card', { timeout: 10_000 }).first().click();
      cy.getByTestId('btn-delete', {
        timeout: 10_000,
      }).should('not.exist');
    });
  });

  describe('given no user is logged in', () => {
    it('there should be no Delete button on the meetup card', () => {
      cy.visit('/meetups');
      cy.getByTestId('meetup-card', { timeout: 10_000 })
        .first()
        .within(() => {
          cy.getByTestId('delete-button').should('not.exist');
        });
    });

    it('there should be no Delete button on the view topic page', () => {
      cy.visit('/meetups/topics');
      cy.getByTestId('meetup-card', { timeout: 10_000 }).first().click();
      cy.getByTestId('btn-delete', {
        timeout: 10_000,
      }).should('not.exist');
    });
  });
});
