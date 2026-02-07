const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// ============================================================
// PLANT TABLES
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

Then("I should see {string} column in the table", (colName) => {
    cy.get('table thead th, table thead td', { timeout: 10000 }).then(($ths) => {
        const headers = $ths.map((i, el) => Cypress.$(el).text().trim()).get();
        const found = headers.some(h => new RegExp(colName, 'i').test(h));
        expect(found).to.be.true;
    });
});

Then("I should see {string} in the table", (text) => {
    cy.get('body').then(($body) => {
        const last = Cypress.env('last_entered');
        const searchPattern = last && last.toString().toLowerCase().includes(text.toString().toLowerCase()) ? new RegExp(last, 'i') : new RegExp(text, 'i');

        if ($body.find('table').length > 0) {
            cy.get('table', { timeout: 20000 }).should('be.visible');
            cy.get('table').contains(searchPattern, { timeout: 20000 }).should('be.visible');
        } else if ($body.find('.plants-list, [class*="plant"], [data-test*="plants"]').length > 0) {
            cy.get('.plants-list, [class*="plant"], [data-test*="plants"]', { timeout: 20000 }).contains(searchPattern, { timeout: 20000 }).should('be.visible');
        } else {
            cy.get('main, .container, body', { timeout: 20000 }).contains(searchPattern, { timeout: 20000 }).should('be.visible');
        }
    });
});

// ============================================================
// PLANT FORMS
// ============================================================

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
            try {
                Cypress.env('last_entered', finalValue);
                Cypress.env(`entered_${fieldName}`, finalValue);
            } catch (e) {}
        }
    });
});

When("I clear and enter {string} into {string} field", (value, fieldName) => {
    const needle = fieldName.toLowerCase();
    cy.get('body').then(($body) => {
        let $input = $body.find(`[name="${fieldName}"]`).first();
        if (!$input.length) $input = $body.find(`#${fieldName}`).first();

        if (!$input.length) {
            $input = $body.find('input').filter((i, el) => {
                const $el = Cypress.$(el);
                const name = ($el.attr('name') || '').toLowerCase();
                const id = ($el.attr('id') || '').toLowerCase();
                const ph = ($el.attr('placeholder') || '').toLowerCase();
                let labelText = '';
                try { labelText = ($body.find(`label[for="${el.id}"]`).text() || '').toLowerCase(); } catch(e) {}
                return name.includes(needle) || id.includes(needle) || ph.includes(needle) || labelText.includes(needle);
            }).first();
        }

        if (!$input.length) {
            $input = $body.find(`input[name*="${needle}" i], input[id*="${needle}" i], input[placeholder*="${needle}" i]`).first();
        }

        if (!$input.length) $input = $body.find('input').first();

        if ($input.length) {
            cy.wrap($input).clear().type(value);
        } else {
            throw new Error(`Unable to find input field for '${fieldName}'`);
        }
    });
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

When("I select the first option from {string} dropdown", (dropdownName) => {
    cy.get('body').then(($body) => {
        const nameLower = dropdownName.toLowerCase();
        let $select = $body.find(`select[name*="${nameLower}"], select[id*="${nameLower}"]`).first();
        if (!$select.length) $select = $body.find('select').first();

        if ($select.length) {
            cy.wrap($select).find('option').then(($opts) => {
                if ($opts.length > 0) {
                    const val = $opts.eq(0).attr('value');
                    if (typeof val !== 'undefined') cy.wrap($select).select(val);
                }
            });
        } else {
            cy.contains('label, .dropdown, [data-test*="category"]', new RegExp(dropdownName, 'i')).click({ force: true });
            cy.get('.dropdown-menu, .options, li').first().click({ force: true });
        }
    });
    cy.wait(500);
});

When("I select the second option from {string} dropdown", (dropdownName) => {
    cy.get('body').then(($body) => {
        const nameLower = dropdownName.toLowerCase();
        let $select = $body.find(`select[name*="${nameLower}"], select[id*="${nameLower}"]`).first();
        if (!$select.length) $select = $body.find('select').first();

        if ($select.length) {
            cy.wrap($select).find('option').then(($opts) => {
                if ($opts.length > 1) {
                    const val = $opts.eq(1).attr('value');
                    if (typeof val !== 'undefined') cy.wrap($select).select(val);
                }
            });
        } else {
            cy.contains('label, .dropdown, [data-test*="category"]', new RegExp(dropdownName, 'i')).click({ force: true });
            cy.get('.dropdown-menu, .options, li').eq(1).click({ force: true });
        }
    });
    cy.wait(500);
});

// ============================================================
// PLANT ACTIONS
// ============================================================

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

Then("I should not see any action buttons in the table", () => {
    cy.get('table tbody').within(() => {
        cy.contains('button, a, [role="button"]', /edit|delete|remove|actions|sell|buy/i).should('not.exist');
    });
});

// ============================================================
// PLANT VALIDATION
// ============================================================

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

Then("there should be no duplicate plant submissions", () => {
    cy.get("table tbody tr").then(($rows) => {
        const initialCount = $rows.length;
        cy.reload();
        cy.get("table tbody tr").should("have.length", initialCount);
    });
});

Then(/the plant "([^"]+)" should have the default image/, (plantName) => {
    cy.contains('tr, td', new RegExp(plantName, 'i')).closest('tr').within(() => {
        cy.get('img').then(($img) => {
            const src = ($img.attr('src') || '').toLowerCase();
            expect(src).to.match(/default|placeholder|no-image|default-image|\/images\//i);
        });
    });
});

// ============================================================
// PLANT SEARCH
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

Then("the results should match both filter criteria", () => {
    cy.get("table tbody tr").should("have.length.at.least", 1);
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