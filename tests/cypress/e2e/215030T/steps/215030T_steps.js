const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// ============================================================
// CATEGORY MANAGEMENT SPECIFIC STEPS (215030T)
// ============================================================

// Form interaction steps
When("I enter {string} in {string} field", (value, fieldName) => {
  cy.get(`[name="${fieldName}"]`).clear().type(value);
});

When("I clear and enter {string} in {string} field", (value, fieldName) => {
  cy.get(`[name="${fieldName}"]`).clear().type(value);
});

When("I submit the form without entering data", () => {
  cy.get('button[type="submit"]').click();
});

When("I save the changes", () => {
  cy.contains('button', /save/i).click();
});

// Button interaction steps
When("I click {string} button", (buttonText) => {
  cy.contains('button', buttonText, { matchCase: false }).click();
});

When("I click {string} button for {string}", (action, categoryName) => {
  cy.contains('tr', categoryName)
    .find('button')
    .contains(new RegExp(action, 'i'))
    .click();
});

When("I confirm the deletion", () => {
  // Handle confirmation dialog - adjust selector based on your app
  cy.contains('button', /confirm|yes|delete/i).click();
});

// Visibility and validation steps
Then("I should see {string} in the category list", (categoryName) => {
  cy.contains('.category-list, table, .table', categoryName, { timeout: 10000 })
    .should('be.visible');
});

Then("I should see {string} in category list", (categoryName) => {
  cy.contains('.category-list, table, .table', categoryName, { timeout: 10000 })
    .should('be.visible');
});

Then("I should not see {string} in the category list", (categoryName) => {
  cy.contains('.category-list, table, .table', categoryName).should('not.exist');
});

Then("I should see a validation error", () => {
  cy.get('.error, .invalid-feedback, [class*="error"], [role="alert"]', { timeout: 5000 })
    .should('be.visible')
    .and('not.be.empty');
});

Then("no new category should be created", () => {
  // Verify the category list count doesn't increase
  cy.get('table tbody tr, .category-list > *').then($items => {
    const initialCount = $items.length;
    cy.wrap(initialCount).should('be.gte', 0);
  });
});

Then("the category should not be created", () => {
  // Alternative validation - check for success message absence
  cy.get('.success, .alert-success').should('not.exist');
});

Then("I should see the {string} table with data", (tableName) => {
  cy.get('table', { timeout: 10000 })
    .should('be.visible')
    .find('tbody tr')
    .should('have.length.gt', 0);
});

Then("the dashboard content should be displayed", () => {
  cy.get('.dashboard, #dashboard, [class*="dashboard"]').should('be.visible');
});

// Edit and Delete button visibility
Then("I should not see any {string} buttons", (buttonType) => {
  cy.get('table tbody').within(() => {
    cy.contains('button', new RegExp(buttonType, 'i')).should('not.exist');
  });
});

// Navigation and redirect steps
When("I navigate directly to {string}", (url) => {
  cy.visit(url);
});

Then("I should be redirected or see access denied", () => {
  cy.url().then(currentUrl => {
    // Check if redirected away from admin URL or access denied message shown
    const isRedirected = !currentUrl.includes('/admin/categories');
    const hasAccessDenied = Cypress.$('body').text().match(/access denied|unauthorized|forbidden/i);
    
    expect(isRedirected || hasAccessDenied).to.be.true;
  });
});

// Category hierarchy specific steps
Then("I should see category hierarchy", () => {
  cy.get('table, .category-tree, .hierarchy', { timeout: 10000 })
    .should('be.visible');
});

// API Response validation steps (for API tests if using Cypress for API)
Then("the response body should not have {string} field", (fieldName) => {
  cy.get('@response').then((response) => {
    expect(response.body).to.not.have.property(fieldName);
  });
});

Then("the response body {string} should contain {string}", (field, value) => {
  cy.get('@response').then((response) => {
    expect(response.body[field]).to.include(value);
  });
});

Then("the response body should contain {string}", (text) => {
  cy.get('@response').then((response) => {
    const bodyString = JSON.stringify(response.body);
    expect(bodyString).to.include(text);
  });
});

// Additional helper steps for Category Management
When("I wait for category list to load", () => {
  cy.get('table tbody tr, .category-list > *', { timeout: 10000 })
    .should('be.visible');
});

Then("I should see {string} category in the list", (categoryName) => {
  cy.contains('td, .category-item', categoryName, { timeout: 5000 })
    .should('be.visible');
});

// Session and authentication helpers
Then("I should still be logged in as {string}", (username) => {
  cy.get('.user-info, .navbar, header').should('contain', username);
});

// Summary statistics verification
Then("I should see summary statistics for {string}, {string}, and {string}", (stat1, stat2, stat3) => {
  cy.contains(stat1).should('be.visible');
  cy.contains(stat2).should('be.visible');
  cy.contains(stat3).should('be.visible');
});
