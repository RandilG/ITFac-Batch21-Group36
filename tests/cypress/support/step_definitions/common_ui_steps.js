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
    cy.contains(linkText, { timeout: 10000 }).click();
});

Then("I should see {string} button", (btnText) => {
    const re = new RegExp(btnText, 'i');
    cy.contains('button, a, [role="button"], .btn', re, { timeout: 10000 }).should('be.visible');
});

Then("I should see the heading {string}", (headingText) => {
    cy.get('h2, h3').contains(headingText).should('be.visible');
});

Then("I should not see {string} button", (btnText) => {
    const re = new RegExp(btnText, 'i');
    cy.contains('button, a, [role="button"], .btn', re).should('not.exist');
});

Then("I should see the {string} table with data", (tableName) => {
    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length.at.least', 1);
});

Then("I should see the {string} table displaying {string} and {string} columns", (tableName, col1, col2) => {
    cy.get('table').should('be.visible');
    // Check that both col1 and col2 are present in the headers
    cy.get('thead th').then($ths => {
        const texts = $ths.map((i, el) => Cypress.$(el).text().trim()).get();
        expect(texts).to.include(col1);
        expect(texts).to.include(col2);
    });
});

When("I submit the form", () => {
        // Get the value from likely name input fields before submitting
        cy.get('input[name="name"], input#name, input[id*="name"], input[name="categoryName"], [data-test="name"]')
            .first()
            .invoke('val')
            .then((nameValue) => {
                cy.wrap(nameValue).as('submittedName');

                // Click the submit button
                cy.get('button[type="submit"], [type="submit"], .btn-primary, .btn-submit', { timeout: 10000 })
                    .first()
                    .click();

                // Wait for the form submission and UI update to complete
                cy.wait(1500);

                // Verify the category was created in the backend when a name was provided
                if (nameValue && nameValue.trim() !== '') {
                    cy.request({
                        url: '/api/categories',
                        failOnStatusCode: false
                    }).its('body').should((body) => {
                        const names = Array.isArray(body) ? body.map(c => c.name) : [];
                        expect(names).to.include(nameValue);
                    });
                }
        });
});

When("I go back in browser history", () => {
    cy.go('back');
});

Then("I should still be logged in as {string}", (username) => {
    // Basic check: should not be on login page
    cy.url().should('not.include', '/login');
});
