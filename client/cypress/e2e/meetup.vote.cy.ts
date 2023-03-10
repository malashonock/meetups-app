import { AlertSeverity } from 'types';

describe('Vote/withdraw vote for meetup', () => {
  describe('given a user with admin rights is logged in', () => {
    it('should not show vote/unvote button', () => {
      cy.createTopic().then((createdTopicId: string) => {
        cy.loginAsChief();

        cy.visit(`/meetups/${createdTopicId}`);

        cy.get('#btn-vote-toggle', { timeout: 10_000 }).should('not.exist');
      });
    });
  });

  describe('given a user with non-admin rights is logged in', () => {
    describe('given the user is the author of the topic', () => {
      it('should not show vote/unvote button', () => {
        cy.createTopic().then((createdTopicId: string) => {
          cy.loginAsChief();

          cy.visit(`/meetups/${createdTopicId}`);

          cy.get('#btn-vote-toggle', { timeout: 10_000 }).should('not.exist');
        });
      });
    });

    describe('given the user is not the author of the topic', () => {
      it('should allow the user to vote/withdraw their vote for the meetup', () => {
        cy.createTopic().then((createdTopicId: string) => {
          cy.loginAsEmployee();

          cy.visit(`/meetups/${createdTopicId}`);

          // No one has voted yet
          cy.get('[data-testid="voted-users"]').should('not.exist');

          // Now let's vote
          cy.get('#btn-vote-toggle', { timeout: 10_000 })
            .as('voteToggleBtn')
            .should('be.enabled');
          cy.get('@voteToggleBtn').click();

          cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

          cy.get('[data-testid="voted-users"]')
            .as('votedUsers')
            .within(() => {
              cy.get('[class*="UserPreview"]:first-of-type').should(
                'contain.text',
                'EG',
              );
            });

          // Now let's withdraw our vote
          cy.get('@voteToggleBtn').should('be.enabled');
          cy.get('@voteToggleBtn').click();

          cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

          cy.get('@votedUsers').should('not.exist');
        });
      });
    });
  });
});
