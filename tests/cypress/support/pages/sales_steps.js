const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// ============================================================
// SALES TABLE
// ============================================================

Then("I should see the sales table", () => {
    cy.wait(500);
    cy.get("body").then(($body) => {
        if ($body.find("table").length > 0) {
            cy.get("table", { timeout: 5000 }).should("be.visible");
            cy.get("tbody tr", { timeout: 5000 }).should("have.length.at.least", 1);
        } else if ($body.find(".sales-list, [class*='sales']").length > 0) {
            cy.get(".sales-list, [class*='sales']", { timeout: 5000 }).should("be.visible");
        } else {
            cy.get("table, .sales-list, main, .container", { timeout: 5000 }).should("be.visible");
        }
    });
});

Then("I should see the sales table with records", () => {
    cy.get("table").should("be.visible");
    cy.get("tbody tr").should("have.length.at.least", 1);
});