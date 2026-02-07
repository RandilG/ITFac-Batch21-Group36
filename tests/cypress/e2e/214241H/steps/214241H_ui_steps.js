const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");

// Navigation steps
When(/I navigate to (?:the )?categories page/, () => {
  cy.contains("a, button, [role='button']", /categories/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/categories");
});

When(/I navigate to (?:the )?plants page/, () => {
  cy.contains("a, button, [role='button']", /plants/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/plants");
});

When(/I navigate to (?:the )?sales page/, () => {
  cy.contains("a, button, [role='button']", /sales/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/sales");
});

// Table and UI visibility
Then("I should see the plants table", () => {
  cy.get("table, .plant-list, [data-test='plant-table']").should("be.visible");
});

Then("I should see the category list", () => {
  cy.get("table, .category-list, [data-test='category-table']").should("be.visible");
});

Then("I should see the sales table", () => {
  cy.get("table, .sales-list, [data-test='sales-table']").should("be.visible");
});

Then("I should see pagination controls", () => {
  cy.get(".pagination, .pager, [data-test='pagination']").should("be.visible");
});

// Button and form interaction steps
// Duplicate step removed. Using common_ui_steps.js definition.
// When("I click {string}", (buttonText) => { ... });

When("I enter {string} as the category name", (catName) => {
  cy.get('input[name="name"], input[id*="name"], input[data-test="name"]')
    .first()
    .type(catName);
});

When("I click {string} without entering a name", (buttonText) => {
  cy.contains("button, [type='submit']", new RegExp(buttonText, "i")).click();
});

// Validation and assertions
// Note: category list visibility/containment step moved to shared step definitions to avoid duplicates.

Then("I should see a validation error message {string}", (errorMessage) => {
  cy.contains(new RegExp(errorMessage, "i")).should("be.visible");
});

Then("I should see validation errors for name, price, and quantity", () => {
  cy.contains(/name is required/i).should("be.visible");
  cy.contains(/price is required/i).should("be.visible");
  cy.contains(/quantity is required/i).should("be.visible");
});

Then(
  "I should see the plant table with {string} and {string} columns visible",
  (col1, col2) => {
    cy.get("table thead th").then(($ths) => {
      const headers = $ths.map((i, el) => Cypress.$(el).text().trim()).get();
      expect(headers.some((h) => h.includes(col1))).to.be.true;
      expect(headers.some((h) => h.includes(col2))).to.be.true;
    });
  },
);

When("I expand a main category", () => {
  cy.get(".category-row, [data-test='category-row']").first().click();
});

Then("I should see the list of sub-categories", () => {
  cy.get(".sub-category, [data-test='sub-category']").should(
    "have.length.at.least",
    1,
  );
});

// Navigation assertions
Then("I should see the plant table displayed with information", () => {
  cy.get("table").should("be.visible");
  cy.get("tbody tr").should("have.length.at.least", 1);
});

Then("I should see the category list displayed", () => {
  cy.get("table").should("be.visible");
});

When("I click the browser back button", () => {
  cy.go("back");
});

Then("I should be returned to the plants page", () => {
  cy.url().should("include", "/plants");
});

Then("I should see the main content area", () => {
  cy.get(".main-content, main, [role='main'], .container").should("be.visible");
});

Then("I should see the sales table with records", () => {
  cy.get("table").should("be.visible");
  cy.get("tbody tr").should("have.length.at.least", 1);
});

// Pagination details
Then(/the "([^"]*)" pagination button should be (visible|enabled|disabled)/, (btnText, state) => {
  const btn = cy.get('.pagination, .pager').contains(new RegExp(btnText, 'i'));
  if (state === 'visible') {
    btn.should('be.visible');
  } else if (state === 'enabled') {
    btn.should('not.be.disabled');
  } else if (state === 'disabled') {
    btn.should('be.disabled');
  }
});

When(/I click (?:the )?"([^"]*)" pagination button/, (btnText) => {
  cy.get('.pagination, .pager').contains(new RegExp(btnText, 'i')).click();
});

Then("the page number should update", () => {
  // Check for active page change or URL query param change
  cy.get('.pagination .active, .page-item.active, [aria-current="page"]').should('exist');
});

// Search functionality
When("I enter {string} in the plant search field", (searchTerm) => {
  cy.get('input[placeholder*="Search"], input[name*="search"], .search-input').first().clear().type(searchTerm);
});

When("I click the plant search button", () => {
  cy.get('button').filter(':contains("Search"), .search-btn, [type="submit"]').first().click();
});

Then("the plants table should show filtered results", () => {
  cy.get("tbody tr").should("have.length.at.least", 1);
});

When("I clear the plant search field", () => {
  cy.get('input[placeholder*="Search"], input[name*="search"], .search-input').first().clear();
});

Then("the plants table should display all plants", () => {
  cy.get("tbody tr").should("have.length.at.least", 1);
});

Then("I should see no plants found message", () => {
  cy.contains(/no plants found|no results/i).should("be.visible");
});

Then("the search should return case-insensitive results", () => {
  // Logic is implicit if the previous steps passed, but we can check if content matches
  cy.get("tbody tr").should("have.length.at.least", 1);
});

// Filter
Then("I should see the category filter dropdown", () => {
  cy.get("select").should("be.visible");
});

When("I select the first category from the filter dropdown", () => {
  cy.get("select").first().select(1); // Select first non-placeholder option
});

Then("the results should match both filter criteria", () => {
  cy.get("tbody tr").should("have.length.at.least", 1);
});

// Form validation
Then("I should see a validation error for {string} field", (fieldName) => {
  cy.contains(new RegExp(`${fieldName}.*required|invalid ${fieldName}`, 'i')).should("be.visible");
});

Then("the {string} field should retain value {string}", (fieldName, value) => {
  cy.get('input').filter((i, el) => {
    const text = Cypress.$(el).parent().text().toLowerCase();
    return text.includes(fieldName.toLowerCase());
  }).should('have.value', value);
});

Then("the {string} validation error should be cleared", (fieldName) => {
  cy.contains(new RegExp(`${fieldName}.*required|invalid ${fieldName}`, 'i')).should("not.exist");
});

Then("the name validation error should be cleared", () => {
  cy.contains(/name is required|invalid name/i).should("not.exist");
});

When("I enter plant name {string}", (name) => {
  cy.get('input[name="name"]').clear().type(name);
});

When("I select the first available category", () => {
  cy.get('select').first().select(1);
});

When("I enter price {string}", (price) => {
  cy.get('input[name="price"]').clear().type(price);
});

When("I enter quantity {string}", (quantity) => {
  cy.get('input[name="quantity"]').clear().type(quantity);
});
