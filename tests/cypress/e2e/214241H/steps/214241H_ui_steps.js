const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");

// Navigation steps
When("I navigate to categories page", () => {
  cy.contains("a, button, [role='button']", /categories/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/categories");
});

When("I navigate to plants page", () => {
  cy.contains("a, button, [role='button']", /plants/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/plants");
});

When("I navigate to sales page", () => {
  cy.contains("a, button, [role='button']", /sales/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/sales");
});

// Button and form interaction steps
When("I click {string}", (buttonText) => {
  cy.contains("button, a, [role='button'], .btn", new RegExp(buttonText, "i"), {
    timeout: 10000,
  }).click();
  
  // If clicking Save, wait for form submission and navigation
  if (/save/i.test(buttonText)) {
    cy.wait(1500);
  }
});

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
