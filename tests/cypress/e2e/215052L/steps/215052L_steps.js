const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// ============================================================
// MEMBER-SPECIFIC STEPS (215030T, etc.)
// Only put steps here that are UNIQUE to your features
// and NOT shared across multiple members
// ============================================================

// Example: Category-specific step for member 215030T
Given("a category named {string} exists", (categoryName) => {
    Cypress.env(`entered_${categoryName}`, categoryName);
    cy.log(`Ensuring category exists: ${categoryName}`);
    cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: { username: 'admin', password: 'admin123' },
        headers: { 'Content-Type': 'application/json' }
    }).then((authRes) => {
        const token = authRes && authRes.body && authRes.body.token ? `Bearer ${authRes.body.token}` : null;
        if (token) {
            cy.request({
                method: 'POST',
                url: '/api/categories',
                body: { name: categoryName },
                failOnStatusCode: false,
                headers: { Authorization: token, 'Content-Type': 'application/json' }
            }).then((resp) => {
                const createdName = resp && resp.body && resp.body.name ? resp.body.name : categoryName;
                Cypress.env(`entered_${categoryName}`, createdName);
                cy.wait(500);
                cy.contains('Categories', { timeout: 5000 }).click({ force: true });
                cy.wait(500);
            });
        }
    });
});

// Add other member-specific steps below...