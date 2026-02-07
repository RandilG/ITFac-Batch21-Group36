const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// ============================================================
// LOGIN & AUTHENTICATION
// ============================================================

Given("I am on the login page", () => {
    cy.visit('/ui/login');
});

When("I login as {string} with password {string}", (username, password) => {
    cy.get('input').filter('[name="username"],#username').type(username);
    cy.get('input').filter('[name="password"],#password').type(password);
    cy.get('button').filter('[type="submit"],.btn-primary').click();
});

Then("I should still be logged in as {string}", (username) => {
    cy.url().should('not.include', '/login');
});