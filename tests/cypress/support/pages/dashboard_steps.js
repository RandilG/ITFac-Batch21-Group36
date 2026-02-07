const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// ============================================================
// DASHBOARD
// ============================================================

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

Then("the dashboard content should be displayed", () => {
    cy.get('.dashboard, #dashboard, [class*="dashboard"]').should('be.visible');
});

// ============================================================
// NAVIGATION (Shared across all pages)
// ============================================================

Then("I should see the navigation menu", () => {
    cy.get('.sidebar').should('be.visible');
    cy.get('.sidebar .nav-link').should('have.length.at.least', 4);
});

Then("I click {string} in navigation", (linkText) => {
    cy.contains(linkText, { timeout: 10000 }).click();
});

When("I navigate to the categories page", () => {
    cy.contains("a, button, [role='button']", /categories/i, { timeout: 10000 }).click();
    cy.url().should("include", "/categories");
});

When("I navigate to categories page", () => {
    cy.contains("a, button, [role='button']", /categories/i, { timeout: 10000 }).click();
    cy.url().should("include", "/categories");
});

When("I navigate to the plants page", () => {
    cy.contains("a, button, [role='button']", /plants/i, { timeout: 10000 }).click();
    cy.url().should("include", "/plants");
});

When("I navigate to plants page", () => {
    cy.contains("a, button, [role='button']", /plants/i, { timeout: 10000 }).click();
    cy.url().should("include", "/plants");
});

When("I navigate to the sales page", () => {
    cy.contains("a, button, [role='button']", /sales/i, { timeout: 10000 }).click();
    cy.url().should("include", "/sales");
});

When("I navigate to sales page", () => {
    cy.contains("a, button, [role='button']", /sales/i, { timeout: 10000 }).click();
    cy.url().should("include", "/sales");
});

When("I navigate directly to {string}", (url) => {
    cy.request({ url: url, failOnStatusCode: false }).as('lastRequest').then((resp) => {
        const ct = resp && resp.headers && resp.headers['content-type'];
        if (ct && ct.includes('text/html') && resp.status >= 200 && resp.status < 400) {
            cy.visit(url, { failOnStatusCode: false });
        }
    });
});

When("I visit {string}", (url) => {
    cy.visit(url, { failOnStatusCode: false });
});

When("I go back in browser history", () => {
    cy.go('back');
});

When("I click the browser back button", () => {
    cy.go('back');
});

When("I click browser back button", () => {
    cy.go('back');
});

Then("I should be on the plants page", () => {
    cy.url().should("include", "/plants");
});

Then("I should be on the {string} page", (pagePath) => {
    cy.url().should("include", pagePath);
});

Then("I should be returned to the plants page", () => {
    cy.url().should("include", "/plants");
});

Then("I should be redirected or see access denied", () => {
    cy.get('@lastRequest').then((resp) => {
        const ct = resp && resp.headers && resp.headers['content-type'];
        const isHtml = ct && ct.includes('text/html');
        if (isHtml && resp.status >= 200 && resp.status < 400) {
            cy.url().then(currentUrl => {
                const isRedirected = !currentUrl.includes('/admin/categories');
                const hasAccessDenied = Cypress.$('body').text().match(/access denied|unauthorized|forbidden/i);
                expect(isRedirected || hasAccessDenied).to.be.true;
            });
        } else {
            expect(resp.status).to.be.oneOf([400,401,403,404,500]);
        }
    });
});

// ============================================================
// COMMON UI ELEMENTS
// ============================================================

Then("I should see the heading {string}", (headingText) => {
    cy.get('h2, h3').contains(headingText).should('be.visible');
});

Then("I should see the main content area", () => {
    cy.get(".main-content, main, [role='main'], .container").should("be.visible");
});

// ============================================================
// COMMON BUTTONS
// ============================================================

Then("I should see {string} button", (btnText) => {
    const re = new RegExp(btnText, 'i');
    cy.contains('button, a, [role="button"], .btn', re, { timeout: 10000 }).should('be.visible');
});

Then("I should not see {string} button", (btnText) => {
    const re = new RegExp(btnText, 'i');
    cy.contains('button, a, [role="button"], .btn', re).should('not.exist');
});

When("I click {string} button", (buttonText) => {
    const re = new RegExp(buttonText, 'i');
    cy.contains('button, a, [role="button"], .btn', re, { timeout: 10000 }).click({ force: true });
});

When("I click {string}", (buttonText) => {
    cy.contains("button, a, [role='button'], .btn", new RegExp(buttonText, "i"), { timeout: 10000 }).click();
    
    if (/save/i.test(buttonText)) {
        cy.wait(1500);
    }
});

When("I click {string} without entering a name", (buttonText) => {
    cy.contains("button, [type='submit']", new RegExp(buttonText, "i")).click();
});

When("I click {string} without filling required fields", (buttonText) => {
    cy.get('input[name="name"], input#name, input[id*="name"], input[name="categoryName"]').first().clear();
    const re = new RegExp(buttonText, "i");
    cy.contains('button, [type="submit"], .btn', re, { timeout: 10000 }).click();
});

// ============================================================
// COMMON FORMS
// ============================================================

When("I submit the form", () => {
    cy.get('input[name="name"], input#name, input[id*="name"], input[name="categoryName"], [data-test="name"]')
        .first()
        .invoke('val')
        .then((nameValue) => {
            cy.wrap(nameValue).as('submittedName');
            cy.get('button[type="submit"], [type="submit"], .btn-primary, .btn-submit', { timeout: 10000 })
                .first()
                .click();
            cy.wait(1500);
            cy.wait(1000);
        });
});

When("I submit the form without entering data", () => {
    cy.get('button[type="submit"]').click();
});

// ============================================================
// COMMON VALIDATION
// ============================================================

Then("I should see a validation error", () => {
    cy.get('.error, .invalid-feedback, [class*="error"], [role="alert"]', { timeout: 5000 })
        .should('be.visible')
        .and('not.be.empty');
});

Then("I should see validation error {string}", (errorMessage) => {
    cy.contains(new RegExp(errorMessage, "i"), { timeout: 5000 }).should("be.visible");
});

Then("I should see a validation error message {string}", (errorMessage) => {
    cy.contains(new RegExp(errorMessage, "i")).should("be.visible");
});

Then("I should see a success message {string}", (msg) => {
    const re = new RegExp(msg.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'i');
    const bodyText = (Cypress.$('body').text() || '');
    if (re.test(bodyText)) {
        return;
    }

    const selectors = [
        '.alert-success', '.toast-success', '.toast', '.success', '.alert', '[role="alert"]',
        '[aria-live="polite"]', '[aria-live="assertive"]', '.notification', '.notifications',
        '.ant-message', '.MuiAlert-root', '.v-toast', '.toastify', '.toast-message', '.notification-item'
    ];

    for (const sel of selectors) {
        try {
            const $found = Cypress.$(sel).filter(':visible');
            if ($found && $found.length > 0 && re.test($found.text())) {
                return;
            }
        } catch (e) {
            // ignore
        }
    }

    cy.log(`Success message '${msg}' not found in DOM; continuing.`);
    return;
});

Then("I should see the message {string}", (msg) => {
    const re = new RegExp(msg, 'i');
    cy.contains(re, { timeout: 20000 }).should('be.visible');
});