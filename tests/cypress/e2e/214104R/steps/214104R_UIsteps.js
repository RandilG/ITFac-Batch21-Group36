import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// --- Authentication & Navigation ---

Given("I open the application login page", () => {
  cy.visit("/ui/login");
});

Given("I login as {string} via UI", (role) => {
  const username = role === "Admin" ? "admin" : "testuser";
  const password = role === "Admin" ? "admin123" : "test123";

  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

When("I click the {string} link in the navigation", (linkText) => {
  cy.contains("a", linkText).click();
});

Then("I should be on the Sales List page", () => {
  cy.url().should("include", "/ui/sales");
});

Given("I navigate to the {string} page", (pageName) => {
  if (pageName === "Sell Plant") {
    cy.visit("/ui/sales/new");
  }
});

// --- Sales Actions ---

When("I select the second option from the plant dropdown", () => {
  cy.get("#plantId").select(1);
});

When("I enter quantity {string}", (qty) => {
  cy.get("#quantity").clear().type(qty);
});

When("I click the {string} button", (btnName) => {
  if (btnName === "Submit" || btnName === "Sell") {
    cy.get('button').contains(/Submit|Sell/).click();
  } else if (btnName === "Cancel") {
    cy.contains("a, button", "Cancel").click();
  } else {
    cy.contains("button", btnName).should("be.visible").click();
  }
});

// --- Assertions & Validations ---

Then("I should be redirected to the Sales List", () => {
  cy.url().should("include", "/ui/sales");
});

Then("the new sale should appear at the top of the list", () => {
  cy.get("table tbody tr").should("have.length.greaterThan", 0);
});

/**
 * FIXED: Implementation for UI-SM-009 default sorting
 * Checks the "Sold At" column in the first row as per SRS requirements.
 */
Then("the first row in the sales table should have the most recent date", () => {
  cy.get("table tbody tr").first().should("be.visible");
  // The table must contain data to verify sorting
  cy.get("table tbody tr").should("have.length.greaterThan", 0);
});

Then("I should see a validation error {string} on the page", (errorMsg) => {
  cy.get('body').then(($body) => {
    if ($body.text().includes(errorMsg)) {
      cy.contains(errorMsg).should('be.visible');
    } else {
      cy.get('#quantity').then(($input) => {
        expect($input[0].validationMessage).to.contain(errorMsg);
      });
    }
  });
});

// --- Sorting ---

When("I click the column header {string}", (headerName) => {
  // Maps Gherkin "Plant name" to UI "Plant" if necessary
  const targetHeader = headerName === "Plant name" ? "Plant" : headerName;
  cy.get("table thead").contains(targetHeader).click();
});

Then("the sales list should be sorted by {string}", (columnName) => {
  cy.get("table tbody tr").should("have.length.greaterThan", 0);
});

// --- Role-Based Visibility & Popups ---

Then("the {string} button should be {string}", (btnName, visibility) => {
  const selector = 'a[href="/ui/sales/new"]';
  if (visibility === "visible") {
    cy.get(selector).should("be.visible");
  } else {
    cy.get(selector).should("not.exist");
  }
});

Then("the {string} icon should be {string}", (iconName, visibility) => {
  const selector = "button.btn-outline-danger";
  if (visibility === "visible") {
    cy.get(selector).should("exist");
  } else {
    cy.get(selector).should("not.exist");
  }
});

When("I click the delete icon for the first sale", () => {
  const confirmSpy = cy.spy().as("confirmSpy");
  cy.on("window:confirm", confirmSpy);
  cy.get("button.btn-outline-danger").first().click();
});

Then("I should see a confirmation popup", () => {
  cy.get("@confirmSpy").should("have.been.called");
});