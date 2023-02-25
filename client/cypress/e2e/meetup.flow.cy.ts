import { faker } from '@faker-js/faker';

describe('Create meetup', () => {
  describe('given a user is logged in', () => {
    it('should guide the user to approve & publish the meetup', () => {
      cy.createTopic().then((createdTopicId: string) => {
        cy.visit(`/meetups/${createdTopicId}`);

        cy.get('#btn-approve', { timeout: 10_000 })
          .should('be.enabled')
          .click();

        // Should redirect to edit topic page
        cy.url().should('contain', `/meetups/${createdTopicId}/edit`);

        cy.get('[name="start"]').type('15 Mar 2024 12:00');
        cy.get('[name="finish"]').type('15 Mar 2024 14:00');
        cy.get('[name="place"]').type(faker.address.streetAddress());

        cy.get('#btn-preview').should('be.disabled');
        cy.get('#btn-save').click();
        cy.get('#btn-preview').should('be.enabled').click();

        // Should redirect to view created meetup page
        cy.url().should('match', new RegExp(`\/meetups\/${createdTopicId}$`));

        cy.get('#btn-publish').should('be.enabled').click();

        // Should redirect to upcoming meetups page
        cy.url().should('contain', '/meetups/upcoming');
        cy.get(`[href="/meetups/${createdTopicId}"]`, {
          timeout: 10_000,
        }).should('exist');
      });
    });
  });
});
