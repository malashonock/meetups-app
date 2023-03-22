import { faker } from '@faker-js/faker';

import { AlertSeverity } from 'types';

describe('Create meetup', () => {
  describe('given a user with admin rights is logged in', () => {
    it('should guide the user to approve & publish the meetup', () => {
      cy.createTopic().then((createdTopicId: string) => {
        cy.visit(`/meetups/${createdTopicId}`);

        cy.getByTestId('btn-approve', { timeout: 10_000 })
          .as('approveBtn')
          .should('be.enabled');
        cy.get('@approveBtn').click();

        cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

        // Should redirect to edit topic page
        cy.url().should('contain', `/meetups/${createdTopicId}/edit`);

        cy.get('[name="start"]').type('15 Mar 2024 12:00');
        cy.get('[name="finish"]').type('15 Mar 2024 14:00');
        cy.getByTestId('text-input-place').type(faker.address.streetAddress());

        cy.getByTestId('btn-preview').as('previewBtn').should('be.disabled');
        cy.getByTestId('btn-save').click();

        cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

        cy.get('@previewBtn').should('be.enabled');
        cy.get('@previewBtn').click();

        // Should redirect to view created meetup page
        cy.url().should('match', new RegExp(`\/meetups\/${createdTopicId}$`));

        cy.getByTestId('btn-publish').should('be.enabled').click();

        cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

        // Should redirect to upcoming meetups page
        cy.url().should('contain', '/meetups/upcoming');
        cy.get(`[href="/meetups/${createdTopicId}"]`, {
          timeout: 10_000,
        }).should('exist');
      });
    });
  });
});
