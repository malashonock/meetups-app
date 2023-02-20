import { faker } from '@faker-js/faker';

describe('Edit news article', () => {
  describe('given a user is logged in', () => {
    it('should update an existing news article', function () {
      cy.createNewsArticle().then((createdNewsId: string) => {
        cy.visit(`/news/${createdNewsId}`);

        cy.get('#btn-edit', { timeout: 10_000 }).click();
        cy.url().should('contain', `/news/${createdNewsId}/edit`);

        const updatedTitle: string = faker.company.catchPhrase();
        const updatedText: string = faker.lorem.paragraph();

        cy.get('[name="title"]').clear().type(updatedTitle);
        cy.get('[name="text"]').clear().type(updatedText);

        cy.get('[data-testid="clear-button"]').click();
        cy.get('[data-testid="image-dropbox"]').selectFile(
          'cypress/fixtures/test-image-2.jpeg',
          { action: 'drag-drop' },
        );

        cy.get('#btn-save').click();

        // Should redirect to /news
        cy.url().should('match', /\/news$/);

        cy.visit(`/news/${createdNewsId}`);
        cy.get('[class*="ViewNewsPage_title"]', { timeout: 10_000 }).should(
          'contain',
          updatedTitle,
        );
        cy.get('[class*="ViewNewsPage_text"]').should('contain', updatedText);
        // uploaded image should be checked somehow, too
      });
    });
  });

  describe('given no user is logged in', () => {
    it('there should be no Edit button on the View News page', () => {
      cy.visit('/news');
      cy.get('[class*="NewsCard"]', { timeout: 10_000 }).first().click();

      // Should open /news/:id page
      cy.url().should('match', /\/news\/(.)+$/);

      cy.get('#btn-edit').should('not.exist');
    });

    it('should not allow to navigate to edit route via browser address bar', () => {
      cy.visit('/news/aaa/edit');

      // Should redirect to /login page
      cy.url().should('contain', 'login');
    });
  });
});
