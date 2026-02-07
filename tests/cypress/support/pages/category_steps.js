const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// ============================================================
// CATEGORY SETUP
// ============================================================

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

// ============================================================
// CATEGORY FORMS
// ============================================================

When("I enter {string} in {string} field", (value, fieldName) => {
    Cypress.env(`entered_${value}`, value);
    cy.log(`Entering value in field: ${value}`);
    
    cy.get(`[name="${fieldName}"], #${fieldName}, [id="${fieldName}"], input[name="categoryName"], input[id*="name"]`)
        .first()
        .clear()
        .type(value);
});

When("I clear and enter {string} in {string} field", (value, fieldName) => {
    Cypress.env(`entered_${value}`, value);
    cy.log(`Clearing and entering value: ${value}`);
    
    if (Cypress.env('api_edit_mode')) {
        const editing = Cypress.env('current_editing');
        if (editing) {
            Cypress.env(`pending_new_${editing}`, value);
            return;
        }
    }

    cy.get(`[name="${fieldName}"], #${fieldName}, [id="${fieldName}"], input[name="categoryName"], input[id*="name"]`)
        .first()
        .clear()
        .type(value);
});

When("I enter {string} as the category name", (catName) => {
    cy.get('input[name="name"], input[id*="name"], input[data-test="name"]').first().type(catName);
});

// ============================================================
// CATEGORY TABLE & LIST
// ============================================================

Then("I should see the category list", () => {
    cy.wait(500);
    cy.get("body").then(($body) => {
        if ($body.find("table").length > 0) {
            cy.get("table", { timeout: 5000 }).should("be.visible");
            cy.get("tbody tr, tbody td", { timeout: 5000 }).should("have.length.at.least", 1);
        } else if ($body.find(".category-list, [class*='category']").length > 0) {
            cy.get(".category-list, [class*='category']", { timeout: 5000 }).should("be.visible");
        } else {
            cy.get("table, .category-list, main, .container", { timeout: 5000 }).should("be.visible");
        }
    });
});

Then("I should see the category list displayed", () => {
    cy.get("table").should("be.visible");
});

Then("I should see {string} in the category list", (categoryName) => {
    cy.wait(500);
    
    cy.get("body").then(($body) => {
        const visibleModals = $body.find(".modal.show, .modal:visible, [role='dialog']:visible, .modal-content:visible").length;
        if (visibleModals > 0) {
            cy.get(".modal.show, .modal:visible, [role='dialog']:visible, .modal-content:visible", { timeout: 5000 }).should("not.be.visible");
        }
    });
    
    cy.wait(800);
    
    cy.get("body").then(($body) => {
        const hasTable = $body.find("table").length > 0;
        const hasList = $body.find("[class*='list'], [class*='grid']").length > 0;
        
        if (!hasTable && !hasList) {
            cy.contains("a, button, [role='button']", /categories/i, { timeout: 5000 }).click({ force: true });
            cy.wait(800);
        }
    });
    
    cy.get("table, [class*='category-list'], [class*='table']", { timeout: 15000 }).should("exist");
    cy.get("table tbody, [class*='body'] tr, [class*='list-item']", { timeout: 10000 }).should("have.length.at.least", 1);
    cy.contains("table tr, [class*='list-item'], [class*='row']", new RegExp(categoryName, 'i'), { timeout: 10000 }).should("be.visible");
});

Then("I should not see {string} in the category list", (categoryName) => {
    cy.wait(1000);
    cy.get("body").then(($body) => {
        const pageText = $body.text();
        const isVisible = pageText.includes(categoryName);
        
        if (isVisible) {
            cy.get("table tbody, [class*='list']").then(($container) => {
                if ($container.length > 0) {
                    cy.wrap($container).within(() => {
                        cy.contains("tr, [class*='item']", new RegExp(categoryName, 'i')).should("not.exist");
                    });
                }
            });
        }
    });
});

// ============================================================
// CATEGORY OPERATIONS
// ============================================================

When("I click {string} button for {string}", (action, categoryName) => {
    const isDelete = /delete/i.test(action);
    const isEdit = /edit/i.test(action);
    
    cy.wait(500);
    cy.get("table tbody", { timeout: 10000 }).should("be.visible");
    
    cy.get("table tbody tr").each(($row) => {
        const rowText = $row.text();
        if (rowText.includes(categoryName)) {
            cy.wrap($row).within(() => {
                if (isEdit) {
                    cy.contains("button, a, [role='button']", /edit/i, { timeout: 5000 })
                        .click({ force: true });
                } else if (isDelete) {
                    cy.contains("button, a, [role='button']", /delete/i, { timeout: 5000 })
                        .click({ force: true });
                }
            });
            return false;
        }
    });
    
    cy.wait(800);
});

When("I save the changes", () => {
    cy.get("button:contains('Save'), button:contains('Update'), button[type='submit'], .btn-primary").first().then(($btn) => {
        if ($btn.length) {
            cy.wrap($btn).click({ force: true });
        } else {
            cy.contains("button, [type='submit'], .btn", /save|update/i, { timeout: 10000 })
                .click({ force: true });
        }
    });
    cy.wait(1500);
});

When("I confirm the deletion", () => {
    cy.wait(500);
    cy.get("body").then(($body) => {
        const hasModal = $body.find(".modal, .dialog, [role='dialog'], .modal-dialog").length > 0;
        if (hasModal) {
            cy.get(".modal, .dialog, [role='dialog'], .modal-dialog").first().within(() => {
                cy.contains("button", /confirm|yes|delete|ok/i, { timeout: 5000 })
                    .click({ force: true });
            });
        } else {
            cy.contains("button", /confirm|delete|yes/i, { timeout: 5000 })
                .click({ force: true });
        }
    });
    cy.wait(1500);
});

// ============================================================
// CATEGORY VALIDATION
// ============================================================

Then("no new category should be created", () => {
    cy.get('.success, .alert-success').should('not.exist');
    cy.contains('td, .category-item', /^\s*$/, { timeout: 2000 }).should('not.exist');
});

Then("the category should not be created", () => {
    cy.get('.success, .alert-success').should('not.exist');
});

// ============================================================
// CATEGORY HIERARCHY
// ============================================================

When("I expand a main category", () => {
    cy.get(".category-row, [data-test='category-row']").first().click();
});

Then("I should see the list of sub-categories", () => {
    cy.get(".sub-category, [data-test='sub-category']").should("have.length.at.least", 1);
});

Then("I should see category hierarchy", () => {
    cy.get('table, .category-tree, .hierarchy', { timeout: 10000 }).should('be.visible');
});

// ============================================================
// CATEGORY PERMISSIONS
// ============================================================

Then("I should not see any {string} buttons", (buttonType) => {
    cy.get('table tbody').within(() => {
        cy.contains('button', new RegExp(buttonType, 'i')).should('not.exist');
    });
});

Then("I should see the category filter dropdown", () => {
    cy.get("body").then(($body) => {
        const hasCategoryFilter = $body.find('select[name*="category"]').length > 0 ||
            $body.find('[data-test*="category-filter"]').length > 0 ||
            $body.find(".category-filter").length > 0 ||
            $body.find('select[name*="filter"]').length > 0 ||
            $body.find("select").length > 0;
        expect(hasCategoryFilter).to.be.true;
    });
});

When("I select the first category from the filter dropdown", () => {
    cy.get("body").then(($body) => {
        let $filter = null;
        if ($body.find('select[name*="category"]').length > 0) {
            $filter = $body.find('select[name*="category"]').first();
        } else if ($body.find('[data-test*="category-filter"]').length > 0) {
            $filter = $body.find('[data-test*="category-filter"]').first();
        } else if ($body.find(".category-filter").length > 0) {
            $filter = $body.find(".category-filter").first();
        } else if ($body.find('select[name*="filter"]').length > 0) {
            $filter = $body.find('select[name*="filter"]').first();
        } else if ($body.find("select").length > 0) {
            $filter = $body.find("select").first();
        }

        if ($filter && $filter.length > 0) {
            if ($filter.is("select")) {
                cy.wrap($filter).select(1);
            } else {
                cy.wrap($filter).click();
                cy.get(".option, .dropdown-item, li").first().click();
            }
        }
    });
    cy.wait(500);
});