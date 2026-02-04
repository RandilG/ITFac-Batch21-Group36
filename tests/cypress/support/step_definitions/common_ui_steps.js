const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

Given("I am on the login page", () => {
    cy.visit('/'); // Assuming root is login or redirects to login
});

When("I login as {string} with password {string}", (username, password) => {
    // Adjust selectors based on actual app HTML if known. 
    // Standard guess: input[name=username], etc.
    cy.get('input').first().type(username); // Try to find first input usually username
    // Or better generic:
    // cy.get('input[type="text"]').type(username);
    cy.get('input[type="password"]').type(password);
    cy.get('button').click();
});

Then("I should see the dashboard", () => {
    cy.url().should('include', 'dashboard');
    cy.contains('Dashboard');
});

Then("I should see summary statistics", () => {
    // Look for any stats container
    cy.get('div').filter((index, elt) => elt.innerText.includes('Total')).should('exist');
});

Then("I should see the navigation menu", () => {
    cy.get('nav').should('exist');
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
