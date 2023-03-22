import { faker } from '@faker-js/faker';

import { AlertSeverity } from 'types';

describe('Edit news article', () => {
  describe('given a user with admin rights is logged in', () => {
    it('should update an existing news article', function () {
      cy.createNewsArticle().then((createdNewsId: string) => {
        cy.visit(`/news/${createdNewsId}`);

        cy.getByTestId('btn-edit', { timeout: 10_000 }).click();
        cy.url().should('contain', `/news/${createdNewsId}/edit`);

        const updatedTitle: string = faker.company.catchPhrase();
        const updatedText: string = faker.lorem.paragraph();

        cy.getByTestId('text-input-title').clear().type(updatedTitle);
        cy.getByTestId('text-area-text').clear().type(updatedText);

        cy.getByTestId('clear-button').click();
        cy.getByTestId('image-dropbox').selectFile(
          'cypress/fixtures/test-image-2.jpeg',
          { action: 'drag-drop' },
        );

        cy.getByTestId('btn-save').click();

        cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

        // Should redirect to /news
        cy.url().should('match', /\/news$/);

        cy.visit(`/news/${createdNewsId}`);
        cy.getByTestId('title', { timeout: 10_000 }).should(
          'contain',
          updatedTitle,
        );
        cy.getByTestId('text').should('contain', updatedText);
        // uploaded image should be checked somehow, too
      });
    });
  });

  describe('given a user with non-admin is logged in', () => {
    it('there should be no Edit button on the View News page', () => {
      cy.visit('/news');
      cy.getByTestId('news-card', { timeout: 10_000 }).first().click();

      // Should open /news/:id page
      cy.url().should('match', /\/news\/(.)+$/);

      cy.getByTestId('btn-edit').should('not.exist');
    });

    it('should not allow to navigate to edit route via browser address bar', () => {
      cy.visit('/news/aaa/edit');

      cy.expectToastToPopupAndDismiss(AlertSeverity.Error);

      // Should redirect to /login page
      cy.url().should('contain', 'login');
    });
  });

  describe('given no user is logged in', () => {
    it('there should be no Edit button on the View News page', () => {
      cy.visit('/news');
      cy.getByTestId('news-card', { timeout: 10_000 }).first().click();

      // Should open /news/:id page
      cy.url().should('match', /\/news\/(.)+$/);

      cy.getByTestId('btn-edit').should('not.exist');
    });

    it('should not allow to navigate to edit route via browser address bar', () => {
      cy.visit('/news/aaa/edit');

      cy.expectToastToPopupAndDismiss(AlertSeverity.Error);

      // Should redirect to /login page
      cy.url().should('contain', 'login');
    });
  });
});
