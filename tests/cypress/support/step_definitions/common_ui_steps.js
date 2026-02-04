const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

Given("I am on the login page", () => {
    cy.visit('/ui/login');
});

When("I login as {string} with password {string}", (username, password) => {
    cy.get('input').filter('[name="username"],#username').type(username);
    cy.get('input').filter('[name="password"],#password').type(password);
    cy.get('button').filter('[type="submit"],.btn-primary').click();
});

Then("I should see the dashboard", () => {
    cy.url().should('include', '/dashboard');
    cy.contains('h3', 'Dashboard').should('be.visible');
});

Then("I should see summary statistics for {string}, {string}, and {string}", (stat1, stat2, stat3) => {
    cy.get('.dashboard-card').should('have.length.at.least', 3);
    cy.get('.dashboard-card').contains(stat1).should('be.visible');
    cy.get('.dashboard-card').contains(stat2).should('be.visible');
    cy.get('.dashboard-card').contains(stat3).should('be.visible');
});

Then("I should see summary statistics", () => {
    cy.get('.dashboard-card').should('exist');
});

Then("I should see the navigation menu", () => {
    cy.get('.sidebar').should('be.visible');
    cy.get('.sidebar .nav-link').should('have.length.at.least', 4);
});

Then("I click {string} in navigation", (linkText) => {
    cy.contains(linkText).click();
});

Then("I should see {string} button", (btnText) => {
    cy.contains(btnText).should('be.visible');
});

Then("I should not see {string} button", (btnText) => {
    cy.contains(btnText).should('not.exist');
});
