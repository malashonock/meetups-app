export {};

describe('Internationalization', () => {
  it('should support EN locale', () => {
    cy.loginAsChief();
    cy.visit('/');
    cy.wait(1_000);

    cy.getByTestId('language-select')
      .first()
      .click()
      .within(() => {
        cy.get('[class*="LanguageSelect_option"]').contains('EN').click();
      });

    // Describe /meetups/topics page
    cy.getByTestId('page-link').contains('Meetups').should('exist');
    cy.getByTestId('page-link').contains('News').should('exist');
    cy.getByTestId('nav-tabs').contains('Topics').should('exist');
    cy.getByTestId('nav-tabs')
      .contains('On moderation')
      .as('draftTab')
      .should('exist');
    cy.getByTestId('nav-tabs')
      .contains('Upcoming')
      .as('upcomingTab')
      .should('exist');
    cy.getByTestId('nav-tabs')
      .contains('Finished')
      .as('finishedTab')
      .should('exist');
    cy.get('button').contains('Create meetup').should('exist');
    cy.getByTestId('meetup-counter').contains(' suggested').should('exist');

    // Describe /meetups/moderation page
    cy.get('@draftTab').click();
    cy.getByTestId('meetup-counter').contains(' on moderation').should('exist');

    // Describe /meetups/upcoming page
    cy.get('@upcomingTab').click();
    cy.getByTestId('meetup-counter').contains(' scheduled').should('exist');

    // Describe /meetups/finished page
    cy.get('@finishedTab').click();
    cy.getByTestId('meetup-counter').contains(' passed').should('exist');

    // Describe /news page
    cy.visit('/news');
    cy.get('button', { timeout: 10_000 })
      .contains('Create news')
      .should('exist');
  });

  it('should support RU locale', () => {
    cy.loginAsChief();
    cy.visit('/');
    cy.wait(1_000);

    cy.getByTestId('language-select', { timeout: 10_000 })
      .first()
      .click()
      .within(() => {
        cy.get('[class*="LanguageSelect_option"]').contains('RU').click();
      });

    // Describe /meetups/topics page
    cy.getByTestId('page-link').contains('Митапы').should('exist');
    cy.getByTestId('page-link').contains('Новости').should('exist');
    cy.getByTestId('nav-tabs').contains('Темы').should('exist');
    cy.getByTestId('nav-tabs')
      .contains('На модерации')
      .as('draftTab')
      .should('exist');
    cy.getByTestId('nav-tabs')
      .contains('Будущие')
      .as('upcomingTab')
      .should('exist');
    cy.getByTestId('nav-tabs')
      .contains('Прошедшие')
      .as('finishedTab')
      .should('exist');
    cy.get('button').contains('Создать митап').should('exist');
    cy.getByTestId('meetup-counter').contains(' предложен').should('exist');

    // Describe /meetups/moderation page
    cy.get('@draftTab').click();
    cy.getByTestId('meetup-counter').contains(' на модерации').should('exist');

    // Describe /meetups/upcoming page
    cy.get('@upcomingTab').click();
    cy.getByTestId('meetup-counter').contains(' опубликован').should('exist');

    // Describe /meetups/finished page
    cy.get('@finishedTab').click();
    cy.getByTestId('meetup-counter').contains(' прош').should('exist');

    // Describe /news page
    cy.visit('/news');
    cy.get('button', { timeout: 10_000 })
      .contains('Создать новость')
      .should('exist');
  });
});
