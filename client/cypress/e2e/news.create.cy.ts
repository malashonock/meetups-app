import { faker } from '@faker-js/faker';

describe('Create news article', () => {
  it('should create new news article', () => {
    cy.loginAsChief();

    cy.visit('/news');
    cy.get('[class*="createNewsBtn"]').click();
    cy.url().should('contain', '/news/create');

    const title: string = faker.company.catchPhrase();
    const text: string = faker.lorem.paragraph();

    cy.get('[name="title"]').type(title);
    cy.get('[name="text"]').type(text);
    cy.get('[data-testid="image-dropbox"]').selectFile(
      'cypress/fixtures/test-image-1.jpeg',
      { action: 'drag-drop' },
    );
    cy.get('[type="submit"]').click();

    // Should redirect to /news
    cy.url().should('match', /\/news$/);
    // Assume the newly created article is the last
    cy.get('[data-testid="news-card"]').last().as('createdArticle');
    cy.get('@createdArticle').should('contain', title);
    cy.get('@createdArticle').should('contain', text);
    cy.get('@createdArticle').within(() => {
      // Image should have alt attribute the same as the news title
      cy.get(`[alt="${title}"]`).should('exist');
    });
  });
});
