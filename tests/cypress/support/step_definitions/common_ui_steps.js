const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

Given("I am on the login page", () => {
<<<<<<< HEAD
    cy.visit('/');
});

When("I login as {string} with password {string}", (username, password) => {
    cy.get('input').first().type(username);
    cy.get('input[type="password"]').type(password);
    cy.get('button').click();
=======
    cy.visit('/ui/login');
});

When("I login as {string} with password {string}", (username, password) => {
    cy.get('input').filter('[name="username"],#username').type(username);
    cy.get('input').filter('[name="password"],#password').type(password);
    cy.get('button').filter('[type="submit"],.btn-primary').click();
>>>>>>> 5e80f97623c23038588444913edb6dbdd60f389e
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
<<<<<<< HEAD
    cy.get('div').filter((index, elt) => elt.innerText.includes('Total')).should('exist');
=======
    cy.get('.dashboard-card').should('exist');
>>>>>>> 5e80f97623c23038588444913edb6dbdd60f389e
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

Then("I should see the heading {string}", (headingText) => {
    cy.get('h2, h3').contains(headingText).should('be.visible');
});

Then("I should not see {string} button", (btnText) => {
    cy.contains(btnText).should('not.exist');
});

<<<<<<< HEAD
// NEW STEP DEFINITIONS ADDED BELOW

Then("I click {string} button", (buttonText) => {
    cy.contains('button', buttonText).click();
});

Then("I enter {string} in {string} field", (value, fieldName) => {
    cy.get(`input[name="${fieldName}"], input[placeholder*="${fieldName}"], input#${fieldName}`).type(value);
});

Then("I submit the form", () => {
    cy.get('form').submit();
});

Then("I should see {string} in category list", (categoryName) => {
    cy.get('.category-list, .categories, table, .list').should('contain', categoryName);
});

Then("I should see validation error", () => {
    cy.get('.error, .alert, .validation-error, [role="alert"], .invalid-feedback').should('be.visible');
});

Then("the category should not be created", () => {
    cy.get('.error, .alert, .validation-error').should('exist');
});

Then("I should see category hierarchy", () => {
    cy.get('.category-list, .categories, table, .list').should('exist');
});

Then("I click {string} button for {string}", (buttonText, itemName) => {
    cy.contains(itemName).parents('tr, .row, .item').find(`button:contains("${buttonText}")`).click();
});

Then("I save the changes", () => {
    cy.get('button[type="submit"], button:contains("Save"), button:contains("Update")').click();
});

Then("I confirm the deletion", () => {
    cy.get('button:contains("Confirm"), button:contains("Yes"), button:contains("Delete"), .modal button.confirm').click();
});

Then("I should not see {string} in category list", (categoryName) => {
    cy.get('.category-list, .categories, table, .list').should('not.contain', categoryName);
});

Then("I navigate directly to {string}", (url) => {
    cy.visit(url, { failOnStatusCode: false });
});

Then("I should see access denied or redirect to dashboard", () => {
    cy.url().should('satisfy', (url) => {
        return !url.includes('/admin/categories') || url.includes('dashboard') || url.includes('access-denied');
    });
});

Then("I should see limited navigation menu", () => {
    cy.get('nav, .navigation, .menu').should('exist');
});

Then("I should not see admin options", () => {
    cy.get('nav, .navigation').should('not.contain', 'Admin');
});

Then("I should see the content area", () => {
    cy.get('.content, main, [role="main"], .main-content').should('exist');
});

Then("I should see category list", () => {
    cy.get('.category-list, .categories, table, .list').should('exist');
});
=======
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

When("I go back in browser history", () => {
    cy.go('back');
});

Then("I should still be logged in as {string}", (username) => {
    // Basic check: should not be on login page, or should see some indication of user session
    cy.url().should('not.include', '/login');
});
>>>>>>> 5e80f97623c23038588444913edb6dbdd60f389e
