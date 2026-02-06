const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// ============================================================
// GIVEN STEP - CREATE CATEGORY VIA API OR UI
// ============================================================

Given("a category named {string} exists", (categoryName) => {
  // Store the exact name for later lookups
  Cypress.env(`entered_${categoryName}`, categoryName);
  cy.log(`Ensuring category exists: ${categoryName}`);
  
  // Since we're already logged in from the test, just use the UI to create the category
  // This is more reliable than API calls
  
  // Click Add Category button
  cy.contains('button, a, [role="button"], .btn', /add a category/i, { timeout: 10000 }).click({ force: true });
  
  // Enter the category name
  cy.get('input[name="name"], input#name, input[id*="name"], input[name="categoryName"], [data-test="name"]')
    .first()
    .clear()
    .type(categoryName);
  
  // Submit the form
  cy.get('button[type="submit"]').click();
  
  // Wait for the form to close and category to appear
  cy.wait(1000);
  
  // Verify the category appears in the list
  cy.contains('.category-list, table, .table', categoryName, { timeout: 10000 })
    .should('be.visible');
});

// ============================================================
// CATEGORY MANAGEMENT SPECIFIC STEPS (215030T)
// ============================================================

// Form interaction steps
When("I enter {string} in {string} field", (value, fieldName) => {
  // Store the exact value without modification
  Cypress.env(`entered_${value}`, value);
  cy.log(`Entering value in field: ${value}`);
  
  cy.get(`[name="${fieldName}"], #${fieldName}, [id="${fieldName}"], input[name="categoryName"], input[id*="name"]`)
    .first()
    .clear()
    .type(value);
});

When("I clear and enter {string} in {string} field", (value, fieldName) => {
  // Store the exact value for later lookups
  Cypress.env(`entered_${value}`, value);
  cy.log(`Clearing and entering value: ${value}`);
  
  cy.get(`[name="${fieldName}"], #${fieldName}, [id="${fieldName}"], input[name="categoryName"], input[id*="name"]`)
    .first()
    .clear()
    .type(value);
});

When("I submit the form without entering data", () => {
  cy.get('button[type="submit"]').click();
});

When("I save the changes", () => {
  // Click save button
  cy.contains('button', /save/i).click();
  
  // Wait for the save operation to complete
  cy.wait(1500);
});

// Button interaction steps
When("I click {string} button", (buttonText) => {
  const re = new RegExp(buttonText, 'i');
  cy.contains('button, a, [role="button"], .btn', re, { timeout: 10000 }).click({ force: true });
});

When("I click {string} button for {string}", (action, categoryName) => {
  const mapped = Cypress.env(`entered_${categoryName}`) || categoryName;
  cy.log(`Clicking ${action} button for category: ${mapped}`);
  
  // Wait a bit for the table to stabilize after any previous operations
  cy.wait(500);
  
  // Find the row containing the category name and click the action button
  cy.contains('tr', mapped, { timeout: 10000 }).should('be.visible').within(() => {
    const re = new RegExp(action, 'i');
    // Try several strategies to find the action control
    cy.get('button, a, [role="button"], .btn').then($els => {
      const match = $els.filter((i, el) => (el.textContent || '').trim().match(re));
      if (match.length) {
        cy.wrap(match.first()).click({ force: true });
        return;
      }
      // Try title / aria-label selectors
      cy.get(`[title*="${action}"], [aria-label*="${action}"]`).then($alt => {
        if ($alt.length) {
          cy.wrap($alt.first()).click({ force: true });
          return;
        }
        // Fallback to any element containing the text
        cy.contains(re, { timeout: 5000 }).click({ force: true });
      });
    });
  });
});

When("I confirm the deletion", () => {
  // Wait for modal to appear
  cy.wait(500);
  
  // Try to find and click the confirm button in the modal
  cy.get('body').then($body => {
    // Check if there's a visible modal
    if ($body.find('.modal:visible, #deleteModal:visible').length > 0) {
      cy.get('.modal:visible, #deleteModal:visible').within(() => {
        cy.contains('button', /confirm|yes|delete/i).click();
      });
    } else {
      // Fallback: just click any confirm button
      cy.contains('button', /confirm|yes|delete/i, { timeout: 10000 }).click({ force: true });
    }
  });
  
  // Wait for deletion to complete
  cy.wait(1500);
});

// Visibility and validation steps
Then("I should see {string} in the category list", (categoryName) => {
  const mapped = Cypress.env(`entered_${categoryName}`) || categoryName;
  cy.log(`Looking for category in list: ${mapped}`);
  
  // Just check if it's visible in the UI
  cy.contains('.category-list, table, .table', mapped, { timeout: 15000 })
    .should('be.visible');
});

Then("I should see {string} in category list", (categoryName) => {
  const mapped = Cypress.env(`entered_${categoryName}`) || categoryName;
  cy.log(`Looking for category in list: ${mapped}`);
  
  cy.contains('.category-list, table, .table', mapped, { timeout: 15000 })
    .should('be.visible');
});

Then("I should not see {string} in the category list", (categoryName) => {
  const mapped = Cypress.env(`entered_${categoryName}`) || categoryName;
  cy.log(`Verifying category not in list: ${mapped}`);
  
  // Wait a moment for any UI updates
  cy.wait(500);
  
  // Check that the category is not in the visible table/list
  cy.get('body').then($body => {
    const $table = $body.find('.category-list, table, .table');
    if ($table.length > 0) {
      cy.wrap($table).should('not.contain', mapped);
    }
  });
});

Then("I should see a validation error", () => {
  cy.get('.error, .invalid-feedback, [class*="error"], [role="alert"]', { timeout: 5000 })
    .should('be.visible')
    .and('not.be.empty');
});

Then("no new category should be created", () => {
  // Check that there is no success message
  cy.get('.success, .alert-success').should('not.exist');
  // Check that no empty category was added
  cy.contains('td, .category-item', /^\s*$/, { timeout: 2000 }).should('not.exist');
});

Then("the category should not be created", () => {
  // Alternative validation - check for success message absence
  cy.get('.success, .alert-success').should('not.exist');
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
  cy.request({ url: url, failOnStatusCode: false }).as('lastRequest').then((resp) => {
    const ct = resp && resp.headers && resp.headers['content-type'];
    if (ct && ct.includes('text/html') && resp.status >= 200 && resp.status < 400) {
      cy.visit(url, { failOnStatusCode: false });
    }
  });
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
      // Assert we received an error or non-HTML response indicating no access
      expect(resp.status).to.be.oneOf([400,401,403,404,500]);
    }
  });
});

// Category hierarchy specific steps
Then("I should see category hierarchy", () => {
  cy.get('table, .category-tree, .hierarchy', { timeout: 10000 })
    .should('be.visible');
});

// API Response validation steps
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

// Additional helper steps for Category Management
When("I wait for category list to load", () => {
  cy.get('table tbody tr, .category-list > *', { timeout: 10000 })
    .should('be.visible');
});

Then("I should see {string} category in the list", (categoryName) => {
  cy.contains('td, .category-item', categoryName, { timeout: 5000 })
    .should('be.visible');
});
