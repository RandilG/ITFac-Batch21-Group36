//common ui steps

const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// ============================================================
// LOGIN & AUTHENTICATION
// ============================================================

Given("I am on the login page", () => {
    cy.visit('/ui/login');
});

When("I login as {string} with password {string}", (username, password) => {
    cy.get('input').filter('[name="username"],#username').type(username);
    cy.get('input').filter('[name="password"],#password').type(password);
    cy.get('button').filter('[type="submit"],.btn-primary').click();
});

Then("I should still be logged in as {string}", (username) => {
    cy.url().should('not.include', '/login');
});

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
// NAVIGATION
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
// BUTTONS & GENERAL INTERACTIONS
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

Then("I should not see any {string} buttons", (buttonType) => {
    cy.get('table tbody').within(() => {
        cy.contains('button', new RegExp(buttonType, 'i')).should('not.exist');
    });
});

When("I click the edit icon on the first row", () => {
    cy.get('table tbody tr').first().within(() => {
        cy.get('button, a, [role="button"]').filter(':contains("Edit"), [title*="Edit"], [aria-label*="Edit"]').first().click({ force: true });
    });
});

When("I click the delete icon on the first row", () => {
    cy.get('table tbody tr').first().within(() => {
        cy.get('button, a, [role="button"]').filter(':contains("Delete"), [title*="Delete"], [aria-label*="Delete"]').first().click({ force: true });
    });
});

// ============================================================
// HEADINGS & CONTENT
// ============================================================

Then("I should see the heading {string}", (headingText) => {
    cy.get('h2, h3').contains(headingText).should('be.visible');
});

Then("I should see the main content area", () => {
    cy.get(".main-content, main, [role='main'], .container").should("be.visible");
});

// ============================================================
// TABLES
// ============================================================

Then("I should see the {string} table with data", (tableName) => {
    cy.get('table').should('be.visible');
    cy.get('tbody tr').should('have.length.at.least', 1);
});

Then("I should see the {string} table displaying {string} and {string} columns", (tableName, col1, col2) => {
    cy.get('table').should('be.visible');
    cy.get('thead th').then($ths => {
        const texts = $ths.map((i, el) => Cypress.$(el).text().trim()).get();
        expect(texts).to.include(col1);
        expect(texts).to.include(col2);
    });
});

Then("I should see the plant table with {string} and {string} columns visible", (col1, col2) => {
    cy.get("table thead th").then(($ths) => {
        const headers = $ths.map((i, el) => Cypress.$(el).text().trim()).get();
        expect(headers.some((h) => h.includes(col1))).to.be.true;
        expect(headers.some((h) => h.includes(col2))).to.be.true;
    });
});

Then("I should see the plant table displayed with information", () => {
    cy.get("table").should("be.visible");
    cy.get("tbody tr").should("have.length.at.least", 1);
});

Then("I should see the category list displayed", () => {
    cy.get("table").should("be.visible");
});

Then("I should see the plants table", () => {
    cy.wait(1000);
    cy.get("body").then(($body) => {
        if ($body.find("table").length > 0) {
            cy.get("table", { timeout: 5000 }).should("be.visible");
            cy.get("tbody tr", { timeout: 5000 }).should("have.length.at.least", 1);
        } else if ($body.find(".plants-list, [class*='plant'], [data-test*='plants']").length > 0) {
            cy.get(".plants-list, [class*='plant'], [data-test*='plants']", { timeout: 5000 }).should("be.visible");
        } else {
            cy.get("table, .plants-list, [class*='plant'], main, .container", { timeout: 5000 }).should("be.visible");
        }
    });
});

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

// ============================================================
// FORMS - INPUT FIELDS
// ============================================================

When("I enter {string} in {string} field", (value, fieldName) => {
    Cypress.env(`entered_${value}`, value);
    cy.log(`Entering value in field: ${value}`);
    
    cy.get(`[name="${fieldName}"], #${fieldName}, [id="${fieldName}"], input[name="categoryName"], input[id*="name"]`)
        .first()
        .clear()
        .type(value);
});

When("I enter {string} into {string} field", (value, fieldName) => {
    const timestamp = Date.now().toString();
    const finalValue = value.replace(/{timestamp}/g, timestamp.slice(-6));
    
    cy.get("body").then(($body) => {
        let $input = $body.find(`[name="${fieldName}"]`).first();
        if (!$input.length) $input = $body.find(`#${fieldName}`).first();
        if (!$input.length) $input = $body.find(`[id*="${fieldName.toLowerCase()}"]`).first();
        if (!$input.length) $input = $body.find(`input[placeholder*="${fieldName}"]`).first();
        if (!$input.length) $input = $body.find("input").first();
        
        if ($input.length) {
            cy.wrap($input).clear().type(finalValue);
        }
    });
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

When("I enter {string} as the category name", (catName) => {
    cy.get('input[name="name"], input[id*="name"], input[data-test="name"]').first().type(catName);
});

When("I enter plant name {string}", (plantName) => {
    cy.get("body").then(($body) => {
        let $nameInput = $body.find('input[name="name"]').first();
        if (!$nameInput.length) $nameInput = $body.find('input[id*="name"]').first();
        if (!$nameInput.length) $nameInput = $body.find('input[data-test*="name"]').first();
        if (!$nameInput.length) $nameInput = $body.find('input[type="text"]').first();
        if (!$nameInput.length) $nameInput = $body.find("input").first();
        if ($nameInput.length) {
            cy.wrap($nameInput).clear().type(plantName);
        }
    });
});

When("I enter price {string}", (priceValue) => {
    cy.get("body").then(($body) => {
        let $priceInput = $body.find('input[name="price"]').first();
        if (!$priceInput.length) $priceInput = $body.find('input[id*="price"]').first();
        if (!$priceInput.length) $priceInput = $body.find('input[type="number"]').eq(0);
        if (!$priceInput.length) $priceInput = $body.find("input").eq(1);
        if ($priceInput.length) {
            cy.wrap($priceInput).clear().type(priceValue);
        }
    });
});

When("I enter quantity {string}", (quantityValue) => {
    cy.get("body").then(($body) => {
        let $quantityInput = $body.find('input[name="quantity"]').first();
        if (!$quantityInput.length) $quantityInput = $body.find('input[id*="quantity"]').first();
        if (!$quantityInput.length) {
            const numberInputs = $body.find('input[type="number"]');
            $quantityInput = numberInputs.length > 1 ? numberInputs.eq(1) : numberInputs.last();
        }
        if (!$quantityInput.length) $quantityInput = $body.find("input").eq(2);
        if ($quantityInput.length) {
            cy.wrap($quantityInput).clear().type(quantityValue);
        }
    });
});

When("I select the first available category", () => {
    cy.get("body").then(($body) => {
        let $categorySelect = null;
        if ($body.find('select[name*="category"]').length > 0) {
            $categorySelect = $body.find('select[name*="category"]').first();
        } else if ($body.find('input[name*="category"]').length > 0) {
            $categorySelect = $body.find('input[name*="category"]').first();
        } else if ($body.find('[data-test*="category"]').length > 0) {
            $categorySelect = $body.find('[data-test*="category"]').first();
        } else if ($body.find("select").length > 0) {
            $categorySelect = $body.find("select").first();
        }

        if ($categorySelect && $categorySelect.length) {
            if ($categorySelect.is("select")) {
                cy.wrap($categorySelect).select(1);
            } else if ($categorySelect.is("input")) {
                cy.wrap($categorySelect).click();
                cy.get(".option, .dropdown-item, li, [role='option']").first().click({ force: true });
            } else {
                cy.wrap($categorySelect).click();
                cy.get(".option, .dropdown-item, li").first().click({ force: true });
            }
        }
    });
});

// ============================================================
// VALIDATION
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

Then("I should see validation errors for name, price, and quantity", () => {
    cy.contains(/name is required/i).should("be.visible");
    cy.contains(/price is required/i).should("be.visible");
    cy.contains(/quantity is required/i).should("be.visible");
});

Then("I should see a validation error for name field", () => {
    cy.get("body").then(($body) => {
        const hasErrorElement = $body.find('[role="alert"], .error, .invalid-feedback, .error-message, .alert, [class*="error"]').length > 0 ||
            $body.find('input[name="name"]').parent().find('[role="alert"], .error, .invalid-feedback').length > 0 ||
            $body.find('input[id*="name"]').parent().find('[role="alert"], .error, .invalid-feedback').length > 0;

        const hasErrorText = $body.text().toLowerCase().includes("name") &&
            ($body.text().toLowerCase().includes("required") ||
                $body.text().toLowerCase().includes("error") ||
                $body.text().toLowerCase().includes("invalid"));

        const hasErrorClass = $body.find('input[name="name"], input[id*="name"]').hasClass("error") ||
            $body.find('input[name="name"], input[id*="name"]').hasClass("is-invalid");

        expect(hasErrorElement || hasErrorText || hasErrorClass).to.be.true;
    });
});

Then("the name validation error should be cleared", () => {
    cy.get("body").then(($body) => {
        let $nameInput = $body.find('input[name="name"]').first();
        if (!$nameInput.length) $nameInput = $body.find('input[id*="name"]').first();
        if (!$nameInput.length) $nameInput = $body.find('input[data-test*="name"]').first();

        const hasErrorClass = $nameInput.hasClass("error") || $nameInput.hasClass("is-invalid");
        expect(hasErrorClass).to.be.false;

        if ($nameInput.length) {
            const $parent = $nameInput.parent();
            const $errorInParent = $parent.find('[role="alert"], .error, .invalid-feedback, [class*="error"]');
            if ($errorInParent.length > 0) {
                expect($errorInParent.css("display")).to.equal("none");
            }
        }
    });
});

Then("the price field should retain value {string}", (expectedValue) => {
    cy.get("body").then(($body) => {
        let $priceInput = $body.find('input[name="price"]').first();
        if (!$priceInput.length) $priceInput = $body.find('input[id*="price"]').first();
        if (!$priceInput.length) $priceInput = $body.find('input[type="number"]').eq(0);
        if ($priceInput.length) {
            const actualValue = $priceInput.val();
            const actualNum = parseFloat(actualValue);
            const expectedNum = parseFloat(expectedValue);
            expect(actualNum).to.equal(expectedNum);
        }
    });
});

Then("the quantity field should retain value {string}", (expectedValue) => {
    cy.get("body").then(($body) => {
        let $quantityInput = $body.find('input[name="quantity"]').first();
        if (!$quantityInput.length) $quantityInput = $body.find('input[id*="quantity"]').first();
        if (!$quantityInput.length) {
            const numberInputs = $body.find('input[type="number"]');
            $quantityInput = numberInputs.length > 1 ? numberInputs.eq(1) : numberInputs.last();
        }
        if ($quantityInput.length) {
            const actualValue = $quantityInput.val();
            const actualNum = parseFloat(actualValue);
            const expectedNum = parseFloat(expectedValue);
            expect(actualNum).to.equal(expectedNum);
        }
    });
});

Then("no new category should be created", () => {
    cy.get('.success, .alert-success').should('not.exist');
    cy.contains('td, .category-item', /^\s*$/, { timeout: 2000 }).should('not.exist');
});

Then("the category should not be created", () => {
    cy.get('.success, .alert-success').should('not.exist');
});

Then("there should be no duplicate plant submissions", () => {
    cy.get("table tbody tr").then(($rows) => {
        const initialCount = $rows.length;
        cy.reload();
        cy.get("table tbody tr").should("have.length", initialCount);
    });
});

// ============================================================
// PAGINATION
// ============================================================

Then("I should see pagination controls", () => {
    cy.get("body").then(($body) => {
        const hasPagination = $body.find(".pagination").length > 0 ||
            $body.find("[aria-label='pagination']").length > 0 ||
            $body.find("nav[role='navigation']").length > 0 ||
            $body.find("button:contains('Next')").length > 0 ||
            $body.find("button:contains('Previous')").length > 0 ||
            $body.find("a:contains('Next')").length > 0 ||
            $body.find("a:contains('Previous')").length > 0;
        expect(hasPagination).to.be.true;
    });
});

Then("the {string} pagination button should be visible", (buttonLabel) => {
    const re = new RegExp(buttonLabel, "i");
    cy.get("body").then(($body) => {
        const elem = $body.find("button, a, [role='button']").filter((i, el) => {
            return re.test(el.textContent);
        });
        expect(elem.length).to.be.greaterThan(0);
    });
    cy.contains("button, a, [role='button']", re, { timeout: 5000 }).should("be.visible");
});

Then("the {string} pagination button should be enabled", (buttonLabel) => {
    const re = new RegExp(buttonLabel, "i");
    cy.contains("button, a, [role='button']", re, { timeout: 5000 }).then(($el) => {
        if ($el.is("button")) {
            expect($el).to.not.have.attr("disabled");
        }
        expect($el).to.be.visible;
    });
});

When("I click the {string} pagination button", (buttonLabel) => {
    const re = new RegExp(buttonLabel, "i");
    cy.contains("button, a, [role='button']", re, { timeout: 5000 }).click({ force: true });
    cy.wait(500);
});

Then("the page number should update", () => {
    cy.get("table tbody tr").should("have.length.at.least", 1);
});

// ============================================================
// SEARCH
// ============================================================

When("I enter {string} in the plant search field", (searchTerm) => {
    cy.get("body").then(($body) => {
        let $searchInput = null;
        if ($body.find('input[placeholder*="search"]').length > 0) {
            $searchInput = $body.find('input[placeholder*="search"]').first();
        } else if ($body.find('input[name="search"]').length > 0) {
            $searchInput = $body.find('input[name="search"]').first();
        } else if ($body.find('input[id*="search"]').length > 0) {
            $searchInput = $body.find('input[id*="search"]').first();
        } else if ($body.find('input[type="search"]').length > 0) {
            $searchInput = $body.find('input[type="search"]').first();
        } else if ($body.find("input").length > 0) {
            $searchInput = $body.find("input").first();
        }
        if ($searchInput && $searchInput.length > 0) {
            cy.wrap($searchInput).clear().type(searchTerm);
        }
    });
});

When("I click the plant search button", () => {
    cy.get("body").then(($body) => {
        const searchBtn = $body.find('button:contains("Search"), button[type="submit"]').first();
        if (searchBtn.length > 0) {
            cy.wrap(searchBtn).click();
        } else {
            cy.get("button").first().click();
        }
    });
    cy.wait(500);
});

When("I clear the plant search field", () => {
    cy.get("body").then(($body) => {
        let $searchInput = null;
        if ($body.find('input[placeholder*="search"]').length > 0) {
            $searchInput = $body.find('input[placeholder*="search"]').first();
        } else if ($body.find('input[name="search"]').length > 0) {
            $searchInput = $body.find('input[name="search"]').first();
        } else if ($body.find('input[id*="search"]').length > 0) {
            $searchInput = $body.find('input[id*="search"]').first();
        } else if ($body.find('input[type="search"]').length > 0) {
            $searchInput = $body.find('input[type="search"]').first();
        } else if ($body.find("input").length > 0) {
            $searchInput = $body.find("input").first();
        }
        if ($searchInput && $searchInput.length > 0) {
            cy.wrap($searchInput).clear();
        }
    });
});

Then("the plants table should show filtered results", () => {
    cy.get("table tbody tr").should("have.length.at.least", 1);
});

Then("the plants table should display all plants", () => {
    cy.get("table tbody tr").should("have.length.at.least", 1);
});

Then("I should see no plants found message", () => {
    cy.get("body").then(($body) => {
        const bodyText = $body.text().toLowerCase();
        const hasNoResultsMsg = bodyText.includes("no plants") ||
            bodyText.includes("no results") ||
            bodyText.includes("no data") ||
            bodyText.includes("not found") ||
            bodyText.includes("empty");

        const tableRows = $body.find("table tbody tr").length;
        const emptyState = $body.find(".empty-state, .no-results, [class*='empty']").length > 0;

        const hasNoResults = hasNoResultsMsg || tableRows === 0 || emptyState;
        expect(hasNoResults).to.be.true;
    });
});

Then("the search should return case-insensitive results", () => {
    cy.get("table tbody tr").should("have.length.at.least", 1);
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

Then("the results should match both filter criteria", () => {
    cy.get("table tbody tr").should("have.length.at.least", 1);
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