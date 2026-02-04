const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

Given("I am on the login page", () => {
    cy.visit('/');
});

When("I login as {string} with password {string}", (username, password) => {
    cy.get('input').first().type(username);
    cy.get('input[type="password"]').type(password);
    cy.get('button').click();
});

Then("I should see the dashboard", () => {
    cy.url().should('include', 'dashboard');
    cy.contains('Dashboard');
});

Then("I should see summary statistics", () => {
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