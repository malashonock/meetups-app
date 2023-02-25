export {};

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  describe('given valid credentials', () => {
    it('sends the credentials to server, receives the auth cookie and redirects to the Meetups page', () => {
      cy.get('input[name="username"]').type('chief');
      cy.get('input[name="password"]').type('private');
      cy.get('button[type="submit"').click();
      cy.url().should('include', '/meetups');
      cy.getCookie('connect.sid').should('exist');
      cy.get('header').should('contain', 'chief Blick');
    });
  });

  describe('given invalid credentials', () => {
    it('keeps Login page open', () => {
      cy.get('input[name="username"]').type('invalid-username');
      cy.get('input[name="password"]').type('invalid-password');
      cy.get('button[type="submit"').click();
      cy.url().should('include', '/login');
      cy.getCookie('connect.sid').should('not.exist');
      cy.get('header').should('not.contain', 'chief Blick');
    });
  });
});
