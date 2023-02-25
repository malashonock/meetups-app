export {};

describe('Internationalization', () => {
  it('should support EN locale', () => {
    cy.loginAsChief();
    cy.visit('/');

    cy.get('[data-testid="language-select"]')
      .click()
      .within(() => {
        cy.get('[class*="LanguageSelect_option"]').contains('EN').click();
      });

    // Describe /meetups/topics page
    cy.get('*').contains('Meetups').should('exist');
    cy.get('*').contains('News').should('exist');
    cy.get('*').contains('Topics').should('exist');
    cy.get('*').contains('On moderation').as('onModerationTab').should('exist');
    cy.get('*').contains('Upcoming').as('upcomingTab').should('exist');
    cy.get('*').contains('Finished').as('finishedTab').should('exist');
    cy.get('*').contains('Create meetup').should('exist');
    cy.get('*').contains(' suggested').should('exist');

    // Describe /meetups/moderation page
    cy.get('@onModerationTab').click();
    cy.get('*').contains(' on moderation').should('exist');

    // Describe /meetups/upcoming page
    cy.get('@upcomingTab').click();
    cy.get('*').contains(' scheduled').should('exist');

    // Describe /meetups/finished page
    cy.get('@finishedTab').click();
    cy.get('*').contains(' passed').should('exist');

    // Describe /news page
    cy.visit('/news');
    cy.get('*', { timeout: 10_000 }).contains('Create news').should('exist');
  });

  it('should support RU locale', () => {
    cy.loginAsChief();
    cy.visit('/');

    cy.get('[data-testid="language-select"]', { timeout: 10_000 })
      .click()
      .within(() => {
        cy.get('[class*="LanguageSelect_option"]').contains('RU').click();
      });

    // Describe /meetups/topics page
    cy.get('*').contains('Митапы').should('exist');
    cy.get('*').contains('Новости').should('exist');
    cy.get('*').contains('Темы').should('exist');
    cy.get('*').contains('На модерации').as('onModerationTab').should('exist');
    cy.get('*').contains('Будущие').as('upcomingTab').should('exist');
    cy.get('*').contains('Прошедшие').as('finishedTab').should('exist');
    cy.get('*').contains('Создать митап').should('exist');
    cy.get('*').contains(' предложен').should('exist');

    // Describe /meetups/moderation page
    cy.get('@onModerationTab').click();
    cy.get('*').contains(' на модерации').should('exist');

    // Describe /meetups/upcoming page
    cy.get('@upcomingTab').click();
    cy.get('*').contains(' опубликован').should('exist');

    // Describe /meetups/finished page
    cy.get('@finishedTab').click();
    cy.get('*').contains(' прош').should('exist');

    // Describe /news page
    cy.visit('/news');
    cy.get('*', { timeout: 10_000 })
      .contains('Создать новость')
      .should('exist');
  });
});
