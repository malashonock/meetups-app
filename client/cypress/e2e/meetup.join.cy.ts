import { AlertSeverity } from 'types';

describe('Join/cancel join meetup', () => {
  describe('given a user with admin rights is logged in', () => {
    it('should not show join/unjoin button', () => {
      cy.createMeetup().then((createdMeetupId: string) => {
        cy.loginAsChief();

        cy.visit(`/meetups/${createdMeetupId}`);

        cy.getByTestId('btn-join-toggle', { timeout: 10_000 }).should(
          'not.exist',
        );
      });
    });
  });

  describe('given a user with non-admin rights is logged in', () => {
    describe('given the user is the author of the topic', () => {
      it('should not show join/unjoin button', () => {
        cy.createMeetup().then((createdMeetupId: string) => {
          cy.loginAsChief();

          cy.visit(`/meetups/${createdMeetupId}`);

          cy.getByTestId('btn-join-toggle', { timeout: 10_000 }).should(
            'not.exist',
          );
        });
      });
    });

    describe('given the user is not the author of the topic', () => {
      it('should allow the user to join/cancel their participation in the meetup', () => {
        cy.createMeetup().then((createdMeetupId: string) => {
          cy.loginAsEmployee();

          cy.visit(`/meetups/${createdMeetupId}`);

          // No one has joined yet
          cy.getByTestId('participants').should('not.exist');

          // Now let's join
          cy.getByTestId('btn-join-toggle', { timeout: 10_000 })
            .as('joinToggleBtn')
            .should('be.enabled');
          cy.get('@joinToggleBtn').click();

          cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

          cy.getByTestId('participants')
            .as('participants')
            .within(() => {
              cy.getByTestId('user-preview')
                .first()
                .should('contain.text', 'EG');
            });

          // Now let's withdraw our join
          cy.get('@joinToggleBtn').should('be.enabled');
          cy.get('@joinToggleBtn').click();

          cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

          cy.get('@participants').should('not.exist');
        });
      });
    });
  });
});
