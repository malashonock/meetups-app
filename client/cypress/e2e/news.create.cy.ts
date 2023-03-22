import { faker } from '@faker-js/faker';

import { AlertSeverity } from 'types';

describe('Create news article', () => {
  describe('given a user with admin rights is logged in', () => {
    it('should create a new news article', () => {
      cy.loginAsChief();

      cy.visit('/news');
      cy.wait(1_000);

      cy.getByTestId('btn-create-news').click();
      cy.url().should('contain', '/news/create');

      const title: string = faker.company.catchPhrase();
      const text: string = faker.lorem.paragraph();

      cy.getByTestId('text-input-title').type(title);
      cy.getByTestId('text-area-text').type(text);
      cy.getByTestId('image-dropbox').selectFile(
        'cypress/fixtures/test-image-1.jpeg',
        { action: 'drag-drop' },
      );
      cy.getByTestId('btn-create').click();

      cy.expectToastToPopupAndDismiss(AlertSeverity.Success);

      // Should redirect to /news
      cy.url().should('match', /\/news$/);
      // Assume the newly created article is the last
      cy.getByTestId('news-card').last().as('createdArticle');
      cy.get('@createdArticle').should('contain', title);
      cy.get('@createdArticle').should('contain', text);
      cy.get('@createdArticle').within(() => {
        // Image should have alt attribute the same as the news title
        cy.get(`[alt="${title}"]`).should('exist');
      });
    });
  });

  describe('given a user with non-admin rights is logged in', () => {
    it('there should be no Create News button on the News page', () => {
      cy.visit('/news');
      cy.get('[class*="createNewsBtn"]').should('not.exist');
    });

    it('should not allow to navigate to /create route via browser address bar', () => {
      cy.visit('/news/create');

      cy.expectToastToPopupAndDismiss(AlertSeverity.Error);

      // Should redirect to /login page
      cy.url().should('contain', 'login');
    });
  });

  describe('given no user is logged in', () => {
    it('there should be no Create News button on the News page', () => {
      cy.visit('/news');
      cy.get('[class*="createNewsBtn"]').should('not.exist');
    });

    it('should not allow to navigate to /create route via browser address bar', () => {
      cy.visit('/news/create');

      cy.expectToastToPopupAndDismiss(AlertSeverity.Error);

      // Should redirect to /login page
      cy.url().should('contain', 'login');
    });
  });
});
