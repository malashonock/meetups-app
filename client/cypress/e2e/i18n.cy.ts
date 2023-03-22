export {};

describe('Internationalization', () => {
  it('should support EN locale', () => {
    cy.loginAsChief();
    cy.visit('/');
    cy.wait(1_000);

    cy.get('[data-testid="language-select"]')
      .click()
      .within(() => {
        cy.get('[class*="LanguageSelect_option"]').contains('EN').click();
      });

    // Describe /meetups/topics page
    cy.get('[class*=navLink]').contains('Meetups').should('exist');
    cy.get('[class*=navLink]').contains('News').should('exist');
    cy.get('[class*=MeetupStagesTabs]').contains('Topics').should('exist');
    cy.get('[class*=MeetupStagesTabs]')
      .contains('On moderation')
      .as('draftTab')
      .should('exist');
    cy.get('[class*=MeetupStagesTabs]')
      .contains('Upcoming')
      .as('upcomingTab')
      .should('exist');
    cy.get('[class*=MeetupStagesTabs]')
      .contains('Finished')
      .as('finishedTab')
      .should('exist');
    cy.get('button').contains('Create meetup').should('exist');
    cy.get('[class*=counter]').contains(' suggested').should('exist');

    // Describe /meetups/moderation page
    cy.get('@draftTab').click();
    cy.get('[class*=counter]').contains(' on moderation').should('exist');

    // Describe /meetups/upcoming page
    cy.get('@upcomingTab').click();
    cy.get('[class*=counter]').contains(' scheduled').should('exist');

    // Describe /meetups/finished page
    cy.get('@finishedTab').click();
    cy.get('[class*=counter]').contains(' passed').should('exist');

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

    cy.get('[data-testid="language-select"]', { timeout: 10_000 })
      .click()
      .within(() => {
        cy.get('[class*="LanguageSelect_option"]').contains('RU').click();
      });

    // Describe /meetups/topics page
    cy.get('[class*=navLink]').contains('Митапы').should('exist');
    cy.get('[class*=navLink]').contains('Новости').should('exist');
    cy.get('[class*=MeetupStagesTabs]').contains('Темы').should('exist');
    cy.get('[class*=MeetupStagesTabs]')
      .contains('На модерации')
      .as('draftTab')
      .should('exist');
    cy.get('[class*=MeetupStagesTabs]')
      .contains('Будущие')
      .as('upcomingTab')
      .should('exist');
    cy.get('[class*=MeetupStagesTabs]')
      .contains('Прошедшие')
      .as('finishedTab')
      .should('exist');
    cy.get('button').contains('Создать митап').should('exist');
    cy.get('[class*=counter]').contains(' предложен').should('exist');

    // Describe /meetups/moderation page
    cy.get('@draftTab').click();
    cy.get('[class*=counter]').contains(' на модерации').should('exist');

    // Describe /meetups/upcoming page
    cy.get('@upcomingTab').click();
    cy.get('[class*=counter]').contains(' опубликован').should('exist');

    // Describe /meetups/finished page
    cy.get('@finishedTab').click();
    cy.get('[class*=counter]').contains(' прош').should('exist');

    // Describe /news page
    cy.visit('/news');
    cy.get('button', { timeout: 10_000 })
      .contains('Создать новость')
      .should('exist');
  });
});
