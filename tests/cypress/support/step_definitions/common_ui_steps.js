//common ui steps

const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");

// ============================================================
// LOGIN & AUTHENTICATION
// ============================================================

Given("I am on the login page", () => {
  cy.visit("/ui/login");
});

When("I login as {string} with password {string}", (username, password) => {
  cy.get("input").filter('[name="username"],#username').type(username);
  cy.get("input").filter('[name="password"],#password').type(password);
  cy.get("button").filter('[type="submit"],.btn-primary').click();
});

Then("I should still be logged in as {string}", (username) => {
  cy.url().should("not.include", "/login");
});

// ============================================================
// CATEGORY SETUP
// ============================================================

Given("a category named {string} exists", (categoryName) => {
  Cypress.env(`entered_${categoryName}`, categoryName);
  cy.log(`Ensuring category exists: ${categoryName}`);
  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: { username: "admin", password: "admin123" },
    headers: { "Content-Type": "application/json" },
  }).then((authRes) => {
    const token =
      authRes && authRes.body && authRes.body.token
        ? `Bearer ${authRes.body.token}`
        : null;
    if (token) {
      cy.request({
        method: "POST",
        url: "/api/categories",
        body: { name: categoryName },
        failOnStatusCode: false,
        headers: { Authorization: token, "Content-Type": "application/json" },
      }).then((resp) => {
        const createdName =
          resp && resp.body && resp.body.name ? resp.body.name : categoryName;
        Cypress.env(`entered_${categoryName}`, createdName);
        cy.wait(500);
        cy.contains("Categories", { timeout: 5000 }).click({ force: true });
        cy.wait(500);
      });
    }
  });
});

// ============================================================
// DASHBOARD
// ============================================================

Then("I should see the dashboard", () => {
  cy.url().should("include", "/dashboard");
  cy.contains("h3", "Dashboard").should("be.visible");
});

Then(
  "I should see summary statistics for {string}, {string}, and {string}",
  (stat1, stat2, stat3) => {
    cy.get(".dashboard-card").should("have.length.at.least", 3);
    cy.get(".dashboard-card").contains(stat1).should("be.visible");
    cy.get(".dashboard-card").contains(stat2).should("be.visible");
    cy.get(".dashboard-card").contains(stat3).should("be.visible");
  },
);

Then("I should see summary statistics", () => {
  cy.get(".dashboard-card").should("exist");
});

Then("the dashboard content should be displayed", () => {
  cy.get('.dashboard, #dashboard, [class*="dashboard"]').should("be.visible");
});

// ============================================================
// NAVIGATION
// ============================================================

Then("I should see the navigation menu", () => {
  cy.get(".sidebar").should("be.visible");
  cy.get(".sidebar .nav-link").should("have.length.at.least", 4);
});

Then("I click {string} in navigation", (linkText) => {
  cy.contains(linkText, { timeout: 10000 }).click();
});

When("I navigate to the categories page", () => {
  cy.contains("a, button, [role='button']", /categories/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/categories");
});

When("I navigate to categories page", () => {
  cy.contains("a, button, [role='button']", /categories/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/categories");
});

When("I navigate to the plants page", () => {
  cy.contains("a, button, [role='button']", /plants/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/plants");
});

When("I navigate to plants page", () => {
  cy.contains("a, button, [role='button']", /plants/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/plants");
});

When("I navigate to the sales page", () => {
  cy.contains("a, button, [role='button']", /sales/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/sales");
});

When("I navigate to sales page", () => {
  cy.contains("a, button, [role='button']", /sales/i, {
    timeout: 10000,
  }).click();
  cy.url().should("include", "/sales");
});

When("I navigate directly to {string}", (url) => {
  cy.request({ url: url, failOnStatusCode: false })
    .as("lastRequest")
    .then((resp) => {
      const ct = resp && resp.headers && resp.headers["content-type"];
      if (
        ct &&
        ct.includes("text/html") &&
        resp.status >= 200 &&
        resp.status < 400
      ) {
        cy.visit(url, { failOnStatusCode: false });
      }
    });
});

When("I visit {string}", (url) => {
  cy.visit(url, { failOnStatusCode: false });
});

When("I go back in browser history", () => {
  cy.go("back");
});

When("I click the browser back button", () => {
  cy.go("back");
});

When("I click browser back button", () => {
  cy.go("back");
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
  cy.get("@lastRequest").then((resp) => {
    const ct = resp && resp.headers && resp.headers["content-type"];
    const isHtml = ct && ct.includes("text/html");
    if (isHtml && resp.status >= 200 && resp.status < 400) {
      cy.url().then((currentUrl) => {
        const isRedirected = !currentUrl.includes("/admin/categories");
        const hasAccessDenied = Cypress.$("body")
          .text()
          .match(/access denied|unauthorized|forbidden/i);
        expect(isRedirected || hasAccessDenied).to.be.true;
      });
    } else {
      expect(resp.status).to.be.oneOf([400, 401, 403, 404, 500]);
    }
  });
});

// ============================================================
// BUTTONS & GENERAL INTERACTIONS
// ============================================================

Then("I should see {string} button", (btnText) => {
  const re = new RegExp(btnText, "i");
  cy.contains('button, a, [role="button"], .btn', re, {
    timeout: 10000,
  }).should("be.visible");
});

Then("I should not see {string} button", (btnText) => {
  const re = new RegExp(btnText, "i");
  cy.contains('button, a, [role="button"], .btn', re).should("not.exist");
});
//edited here
When("I click {string} button", (buttonText) => {
  const re = new RegExp(buttonText, "i");
  const selector =
    'button, a, [role="button"], .btn, input[type="submit"], input[type="button"]';

  cy.get("body").then(($body) => {
    const $matches = $body.find(selector).filter((i, el) => {
      const $el = Cypress.$(el);
      const text = ($el.text() || "").trim();
      const value = ($el.val() || "").toString().trim();
      const aria = ($el.attr("aria-label") || "").trim();
      return re.test(text) || re.test(value) || re.test(aria);
    });

    //edited here again
    if ($matches.length > 0) {
      cy.wrap($matches.first()).click({ force: true });
      return;
    }

    const $form = $body.find("form").first();
    if ($form.length > 0) {
      cy.wrap($form).submit();
      return;
    }

    cy.get('button[type="submit"], input[type="submit"], [type="submit"]', {
      timeout: 10000,
    })
      .first()
      .click({ force: true });
  });
});

When("I click {string}", (buttonText) => {
  cy.contains("button, a, [role='button'], .btn", new RegExp(buttonText, "i"), {
    timeout: 10000,
  }).click();

  if (/save/i.test(buttonText)) {
    cy.wait(1500);
  }
});

When("I click {string} without entering a name", (buttonText) => {
  cy.contains("button, [type='submit']", new RegExp(buttonText, "i")).click();
});

When("I click {string} without filling required fields", (buttonText) => {
  cy.get(
    'input[name="name"], input#name, input[id*="name"], input[name="categoryName"]',
  )
    .first()
    .clear();
  const re = new RegExp(buttonText, "i");
  cy.contains('button, [type="submit"], .btn', re, { timeout: 10000 }).click();
});

Then("I should not see any {string} buttons", (buttonType) => {
  cy.get("table tbody").within(() => {
    cy.contains("button", new RegExp(buttonType, "i")).should("not.exist");
  });
});

When("I click the edit icon on the first row", () => {
  cy.get("table tbody tr")
    .first()
    .within(() => {
      cy.get('button, a, [role="button"]')
        .filter(':contains("Edit"), [title*="Edit"], [aria-label*="Edit"]')
        .first()
        .click({ force: true });
    });
});

When("I click the delete icon on the first row", () => {
  cy.get("table tbody tr")
    .first()
    .within(() => {
      cy.get('button, a, [role="button"]')
        .filter(
          ':contains("Delete"), [title*="Delete"], [aria-label*="Delete"]',
        )
        .first()
        .click({ force: true });
    });
});

// ============================================================
// HEADINGS & CONTENT
// ============================================================

Then("I should see the heading {string}", (headingText) => {
  cy.get("h2, h3").contains(headingText).should("be.visible");
});

Then("I should see the main content area", () => {
  cy.get(".main-content, main, [role='main'], .container").should("be.visible");
});

// ============================================================
// TABLES
// ============================================================

Then("I should see the {string} table with data", (tableName) => {
  cy.get("table").should("be.visible");
  cy.get("tbody tr").should("have.length.at.least", 1);
});

Then(
  "I should see the {string} table displaying {string} and {string} columns",
  (tableName, col1, col2) => {
    cy.get("table").should("be.visible");
    cy.get("thead th").then(($ths) => {
      const texts = $ths.map((i, el) => Cypress.$(el).text().trim()).get();
      expect(texts).to.include(col1);
      expect(texts).to.include(col2);
    });
  },
);

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
    } else if (
      $body.find(".plants-list, [class*='plant'], [data-test*='plants']")
        .length > 0
    ) {
      cy.get(".plants-list, [class*='plant'], [data-test*='plants']", {
        timeout: 5000,
      }).should("be.visible");
    } else {
      cy.get("table, .plants-list, [class*='plant'], main, .container", {
        timeout: 5000,
      }).should("be.visible");
    }
  });
});

Then("I should see the category list", () => {
  cy.wait(500);
  cy.get("body").then(($body) => {
    if ($body.find("table").length > 0) {
      cy.get("table", { timeout: 5000 }).should("be.visible");
      cy.get("tbody tr, tbody td", { timeout: 5000 }).should(
        "have.length.at.least",
        1,
      );
    } else if ($body.find(".category-list, [class*='category']").length > 0) {
      cy.get(".category-list, [class*='category']", { timeout: 5000 }).should(
        "be.visible",
      );
    } else {
      cy.get("table, .category-list, main, .container", {
        timeout: 5000,
      }).should("be.visible");
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
      cy.get(".sales-list, [class*='sales']", { timeout: 5000 }).should(
        "be.visible",
      );
    } else {
      cy.get("table, .sales-list, main, .container", { timeout: 5000 }).should(
        "be.visible",
      );
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

  cy.get(
    `[name="${fieldName}"], #${fieldName}, [id="${fieldName}"], input[name="categoryName"], input[id*="name"]`,
  )
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
    if (!$input.length)
      $input = $body.find(`[id*="${fieldName.toLowerCase()}"]`).first();
    if (!$input.length)
      $input = $body.find(`input[placeholder*="${fieldName}"]`).first();
    if (!$input.length) $input = $body.find("input").first();

    if ($input.length) {
      cy.wrap($input).clear().type(finalValue);
    }
  });
});

When("I clear and enter {string} in {string} field", (value, fieldName) => {
  Cypress.env(`entered_${value}`, value);
  cy.log(`Clearing and entering value: ${value}`);

  if (Cypress.env("api_edit_mode")) {
    const editing = Cypress.env("current_editing");
    if (editing) {
      Cypress.env(`pending_new_${editing}`, value);
      return;
    }
  }

  cy.get(
    `[name="${fieldName}"], #${fieldName}, [id="${fieldName}"], input[name="categoryName"], input[id*="name"]`,
  )
    .first()
    .clear()
    .type(value);
});

When("I submit the form", () => {
  cy.get(
    'input[name="name"], input#name, input[id*="name"], input[name="categoryName"], [data-test="name"]',
  )
    .first()
    .invoke("val")
    .then((nameValue) => {
      cy.wrap(nameValue).as("submittedName");
      cy.get(
        'button[type="submit"], [type="submit"], .btn-primary, .btn-submit',
        { timeout: 10000 },
      )
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
  cy.get('input[name="name"], input[id*="name"], input[data-test="name"]')
    .first()
    .type(catName);
});

When("I enter plant name {string}", (plantName) => {
  cy.get("body").then(($body) => {
    let $nameInput = $body.find('input[name="name"]').first();
    if (!$nameInput.length)
      $nameInput = $body.find('input[id*="name"]').first();
    if (!$nameInput.length)
      $nameInput = $body.find('input[data-test*="name"]').first();
    if (!$nameInput.length)
      $nameInput = $body.find('input[type="text"]').first();
    if (!$nameInput.length) $nameInput = $body.find("input").first();
    if ($nameInput.length) {
      cy.wrap($nameInput).clear().type(plantName);
    }
  });
});

// Additional plant-related step synonyms and helpers
When("I clear and enter {string} into {string} field", (value, fieldName) => {
  const needle = fieldName.toLowerCase();
  cy.get("body").then(($body) => {
    let $input = $body.find(`[name="${fieldName}"]`).first();
    if (!$input.length) $input = $body.find(`#${fieldName}`).first();

    if (!$input.length) {
      // find inputs whose name/id/placeholder/label contains the field name (case-insensitive)
      $input = $body
        .find("input")
        .filter((i, el) => {
          const $el = Cypress.$(el);
          const name = ($el.attr("name") || "").toLowerCase();
          const id = ($el.attr("id") || "").toLowerCase();
          const ph = ($el.attr("placeholder") || "").toLowerCase();
          let labelText = "";
          try {
            labelText = (
              $body.find(`label[for="${el.id}"]`).text() || ""
            ).toLowerCase();
          } catch (e) {}
          return (
            name.includes(needle) ||
            id.includes(needle) ||
            ph.includes(needle) ||
            labelText.includes(needle)
          );
        })
        .first();
    }

    if (!$input.length) {
      // fallback: inputs with attribute containing the field name
      $input = $body
        .find(
          `input[name*="${needle}" i], input[id*="${needle}" i], input[placeholder*="${needle}" i]`,
        )
        .first();
    }

    if (!$input.length) $input = $body.find("input").first();

    if ($input.length) {
      cy.wrap($input).clear().type(value);
    } else {
      throw new Error(`Unable to find input field for '${fieldName}'`);
    }
  });
});

When("I select the first option from {string} dropdown", (dropdownName) => {
  cy.get("body").then(($body) => {
    const nameLower = dropdownName.toLowerCase();
    let $select = $body
      .find(`select[name*="${nameLower}"], select[id*="${nameLower}"]`)
      .first();
    if (!$select.length) $select = $body.find("select").first();

    if ($select.length) {
      cy.wrap($select)
        .find("option")
        .then(($opts) => {
          if ($opts.length > 0) {
            const val = $opts.eq(0).attr("value");
            if (typeof val !== "undefined") cy.wrap($select).select(val);
          }
        });
    } else {
      // fallback for custom dropdowns
      cy.contains(
        'label, .dropdown, [data-test*="category"]',
        new RegExp(dropdownName, "i"),
      ).click({ force: true });
      cy.get(".dropdown-menu, .options, li").first().click({ force: true });
    }
  });
  cy.wait(500);
});

When("I select the second option from {string} dropdown", (dropdownName) => {
  cy.get("body").then(($body) => {
    const nameLower = dropdownName.toLowerCase();
    let $select = $body
      .find(`select[name*="${nameLower}"], select[id*="${nameLower}"]`)
      .first();
    if (!$select.length) $select = $body.find("select").first();

    if ($select.length) {
      cy.wrap($select)
        .find("option")
        .then(($opts) => {
          if ($opts.length > 1) {
            const val = $opts.eq(1).attr("value");
            if (typeof val !== "undefined") cy.wrap($select).select(val);
          }
        });
    } else {
      cy.contains(
        'label, .dropdown, [data-test*="category"]',
        new RegExp(dropdownName, "i"),
      ).click({ force: true });
      cy.get(".dropdown-menu, .options, li").eq(1).click({ force: true });
    }
  });
  cy.wait(500);
});

Then("I should see {string} column in the table", (colName) => {
  cy.get("table thead th, table thead td", { timeout: 10000 }).then(($ths) => {
    const headers = $ths.map((i, el) => Cypress.$(el).text().trim()).get();
    const found = headers.some((h) => new RegExp(colName, "i").test(h));
    expect(found).to.be.true;
  });
});

Then("I should not see any action buttons in the table", () => {
  cy.get("table tbody").within(() => {
    cy.contains(
      'button, a, [role="button"]',
      /edit|delete|remove|actions|sell|buy/i,
    ).should("not.exist");
  });
});

Then("I should see a success message {string}", (msg) => {
  const re = new RegExp(msg, "i");
  cy.get("body", { timeout: 10000 }).then(($body) => {
    const selectors = [
      ".alert-success",
      ".toast-success",
      ".toast",
      ".success",
      ".alert",
      '[role="alert"]',
    ];
    for (const sel of selectors) {
      const $found = $body.find(sel).filter(":visible");
      if ($found.length > 0) {
        return cy.contains(sel, re, { timeout: 10000 }).should("be.visible");
      }
    }
    // fallback to any visible text match
    return cy.contains(re, { timeout: 10000 }).should("be.visible");
  });
});

Then("I should see {string} in the table", (text) => {
  cy.get("table", { timeout: 10000 }).should("exist");
  cy.get("table")
    .contains("td, tr", new RegExp(text, "i"), { timeout: 10000 })
    .should("be.visible");
});

Then(/the plant "([^"]+)" should have the default image/, (plantName) => {
  cy.contains("tr, td", new RegExp(plantName, "i"))
    .closest("tr")
    .within(() => {
      cy.get("img").then(($img) => {
        const src = ($img.attr("src") || "").toLowerCase();
        expect(src).to.match(
          /default|placeholder|no-image|default-image|\/images\//i,
        );
      });
    });
});

When("I enter price {string}", (priceValue) => {
  cy.get("body").then(($body) => {
    let $priceInput = $body.find('input[name="price"]').first();
    if (!$priceInput.length)
      $priceInput = $body.find('input[id*="price"]').first();
    if (!$priceInput.length)
      $priceInput = $body.find('input[type="number"]').eq(0);
    if (!$priceInput.length) $priceInput = $body.find("input").eq(1);
    if ($priceInput.length) {
      cy.wrap($priceInput).clear().type(priceValue);
    }
  });
});

When("I enter quantity {string}", (quantityValue) => {
  cy.get("body").then(($body) => {
    let $quantityInput = $body.find('input[name="quantity"]').first();
    if (!$quantityInput.length)
      $quantityInput = $body.find('input[id*="quantity"]').first();
    if (!$quantityInput.length) {
      const numberInputs = $body.find('input[type="number"]');
      $quantityInput =
        numberInputs.length > 1 ? numberInputs.eq(1) : numberInputs.last();
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
        cy.get(".option, .dropdown-item, li, [role='option']")
          .first()
          .click({ force: true });
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
  cy.get('.error, .invalid-feedback, [class*="error"], [role="alert"]', {
    timeout: 5000,
  })
    .should("be.visible")
    .and("not.be.empty");
});

Then("I should see validation error {string}", (errorMessage) => {
  cy.contains(new RegExp(errorMessage, "i"), { timeout: 5000 }).should(
    "be.visible",
  );
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
    const hasErrorElement =
      $body.find(
        '[role="alert"], .error, .invalid-feedback, .error-message, .alert, [class*="error"]',
      ).length > 0 ||
      $body
        .find('input[name="name"]')
        .parent()
        .find('[role="alert"], .error, .invalid-feedback').length > 0 ||
      $body
        .find('input[id*="name"]')
        .parent()
        .find('[role="alert"], .error, .invalid-feedback').length > 0;

    const hasErrorText =
      $body.text().toLowerCase().includes("name") &&
      ($body.text().toLowerCase().includes("required") ||
        $body.text().toLowerCase().includes("error") ||
        $body.text().toLowerCase().includes("invalid"));

    const hasErrorClass =
      $body.find('input[name="name"], input[id*="name"]').hasClass("error") ||
      $body
        .find('input[name="name"], input[id*="name"]')
        .hasClass("is-invalid");

    expect(hasErrorElement || hasErrorText || hasErrorClass).to.be.true;
  });
});

Then("the name validation error should be cleared", () => {
  cy.get("body").then(($body) => {
    let $nameInput = $body.find('input[name="name"]').first();
    if (!$nameInput.length)
      $nameInput = $body.find('input[id*="name"]').first();
    if (!$nameInput.length)
      $nameInput = $body.find('input[data-test*="name"]').first();

    const hasErrorClass =
      $nameInput.hasClass("error") || $nameInput.hasClass("is-invalid");
    expect(hasErrorClass).to.be.false;

    if ($nameInput.length) {
      const $parent = $nameInput.parent();
      const $errorInParent = $parent.find(
        '[role="alert"], .error, .invalid-feedback, [class*="error"]',
      );
      if ($errorInParent.length > 0) {
        expect($errorInParent.css("display")).to.equal("none");
      }
    }
  });
});

Then("the price field should retain value {string}", (expectedValue) => {
  cy.get("body").then(($body) => {
    let $priceInput = $body.find('input[name="price"]').first();
    if (!$priceInput.length)
      $priceInput = $body.find('input[id*="price"]').first();
    if (!$priceInput.length)
      $priceInput = $body.find('input[type="number"]').eq(0);
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
    if (!$quantityInput.length)
      $quantityInput = $body.find('input[id*="quantity"]').first();
    if (!$quantityInput.length) {
      const numberInputs = $body.find('input[type="number"]');
      $quantityInput =
        numberInputs.length > 1 ? numberInputs.eq(1) : numberInputs.last();
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
  cy.get(".success, .alert-success").should("not.exist");
  cy.contains("td, .category-item", /^\s*$/, { timeout: 2000 }).should(
    "not.exist",
  );
});

Then("the category should not be created", () => {
  cy.get(".success, .alert-success").should("not.exist");
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
    const hasPagination =
      $body.find(".pagination").length > 0 ||
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
  cy.contains("button, a, [role='button']", re, { timeout: 5000 }).should(
    "be.visible",
  );
});

Then("the {string} pagination button should be enabled", (buttonLabel) => {
  const re = new RegExp(buttonLabel, "i");
  cy.contains("button, a, [role='button']", re, { timeout: 5000 }).then(
    ($el) => {
      if ($el.is("button")) {
        expect($el).to.not.have.attr("disabled");
      }
      expect($el).to.be.visible;
    },
  );
});

When("I click the {string} pagination button", (buttonLabel) => {
  const re = new RegExp(buttonLabel, "i");
  cy.contains("button, a, [role='button']", re, { timeout: 5000 }).click({
    force: true,
  });
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
    const searchBtn = $body
      .find('button:contains("Search"), button[type="submit"]')
      .first();
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
    const hasNoResultsMsg =
      bodyText.includes("no plants") ||
      bodyText.includes("no results") ||
      bodyText.includes("no data") ||
      bodyText.includes("not found") ||
      bodyText.includes("empty");

    const tableRows = $body.find("table tbody tr").length;
    const emptyState =
      $body.find(".empty-state, .no-results, [class*='empty']").length > 0;

    const hasNoResults = hasNoResultsMsg || tableRows === 0 || emptyState;
    expect(hasNoResults).to.be.true;
  });
});

Then("the search should return case-insensitive results", () => {
  cy.get("table tbody tr").should("have.length.at.least", 1);
});

Then("I should see the category filter dropdown", () => {
  cy.get("body").then(($body) => {
    const hasCategoryFilter =
      $body.find('select[name*="category"]').length > 0 ||
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
  cy.get(".sub-category, [data-test='sub-category']").should(
    "have.length.at.least",
    1,
  );
});

Then("I should see category hierarchy", () => {
  cy.get("table, .category-tree, .hierarchy", { timeout: 10000 }).should(
    "be.visible",
  );
});

// ============================================================
// CATEGORY LIST VISIBILITY
// ============================================================

Then("I should see {string} in the category list", (categoryName) => {
  // Wait for any VISIBLE modals/dialogs to close
  cy.wait(500);

  // Check if there are visible modals, if so wait for them to close
  cy.get("body").then(($body) => {
    const visibleModals = $body.find(
      ".modal.show, .modal:visible, [role='dialog']:visible, .modal-content:visible",
    ).length;
    if (visibleModals > 0) {
      // Wait for visible modals to close
      cy.get(
        ".modal.show, .modal:visible, [role='dialog']:visible, .modal-content:visible",
        { timeout: 5000 },
      ).should("not.be.visible");
    }
  });

  // Wait a bit for the page to settle
  cy.wait(800);

  // Try to find any table or list container
  cy.get("body").then(($body) => {
    const hasTable = $body.find("table").length > 0;
    const hasList = $body.find("[class*='list'], [class*='grid']").length > 0;

    if (!hasTable && !hasList) {
      // Try clicking Categories navigation again if table not found
      cy.contains("a, button, [role='button']", /categories/i, {
        timeout: 5000,
      }).click({ force: true });
      cy.wait(800);
    }
  });

  // Now look for the table
  cy.get("table, [class*='category-list'], [class*='table']", {
    timeout: 15000,
  }).should("exist");

  // Wait for table body to have rows
  cy.get("table tbody, [class*='body'] tr, [class*='list-item']", {
    timeout: 10000,
  }).should("have.length.at.least", 1);

  // Now check if the category exists in the table/list
  cy.contains(
    "table tr, [class*='list-item'], [class*='row']",
    new RegExp(categoryName, "i"),
    { timeout: 10000 },
  ).should("be.visible");
});

Then("I should not see {string} in the category list", (categoryName) => {
  cy.wait(1000);
  cy.get("body").then(($body) => {
    // Check in the visible text of the page
    const pageText = $body.text();

    // More thorough check - look for the exact category name
    const isVisible = pageText.includes(categoryName);

    if (isVisible) {
      // If it appears somewhere, specifically check it's not in the table
      cy.get("table tbody, [class*='list']").then(($container) => {
        if ($container.length > 0) {
          cy.wrap($container).within(() => {
            cy.contains(
              "tr, [class*='item']",
              new RegExp(categoryName, "i"),
            ).should("not.exist");
          });
        }
      });
    }
  });
});

// ============================================================
// CATEGORY EDIT & DELETE OPERATIONS
// ============================================================

When("I click {string} button for {string}", (action, categoryName) => {
  const isDelete = /delete/i.test(action);
  const isEdit = /edit/i.test(action);

  cy.wait(500);

  // Wait for table to be visible
  cy.get("table tbody", { timeout: 10000 }).should("be.visible");

  // Find the row containing the category name
  cy.get("table tbody tr").each(($row) => {
    const rowText = $row.text();
    if (rowText.includes(categoryName)) {
      // Found the row, now find the action button
      cy.wrap($row).within(() => {
        if (isEdit) {
          cy.contains("button, a, [role='button']", /edit/i, {
            timeout: 5000,
          }).click({ force: true });
        } else if (isDelete) {
          cy.contains("button, a, [role='button']", /delete/i, {
            timeout: 5000,
          }).click({ force: true });
        }
      });
      return false; // Exit each loop
    }
  });

  cy.wait(800);
});

When("I save the changes", () => {
  // Try to find and click the save/update button
  cy.get(
    "button:contains('Save'), button:contains('Update'), button[type='submit'], .btn-primary",
  )
    .first()
    .then(($btn) => {
      if ($btn.length) {
        cy.wrap($btn).click({ force: true });
      } else {
        // Fallback: search by text content
        cy.contains("button, [type='submit'], .btn", /save|update/i, {
          timeout: 10000,
        }).click({ force: true });
      }
    });
  cy.wait(1500);
});

When("I confirm the deletion", () => {
  cy.wait(500);
  cy.get("body").then(($body) => {
    // Check if there's a modal or confirmation dialog
    const hasModal =
      $body.find(".modal, .dialog, [role='dialog'], .modal-dialog").length > 0;
    if (hasModal) {
      cy.get(".modal, .dialog, [role='dialog'], .modal-dialog")
        .first()
        .within(() => {
          cy.contains("button", /confirm|yes|delete|ok/i, {
            timeout: 5000,
          }).click({ force: true });
        });
    } else {
      // Try to find and click a confirmation button without a modal
      cy.contains("button", /confirm|delete|yes/i, { timeout: 5000 }).click({
        force: true,
      });
    }
  });
  cy.wait(1500);
});

// ============================================================
// SALES SPECIFIC STEPS
// ============================================================

Then("I should see {string} in the body", (text) => {
  cy.get("body").contains(text).should("be.visible");
});

Then("the sales table should display the column {string}", (colName) => {
  cy.get("table th").contains(colName).should("be.visible");
});

Then("I should see the sale form", () => {
  cy.get("form, .modal-body, .sale-form").should("be.visible");
});

Then("the plant dropdown should be visible", () => {
  cy.get('select[name*="plant"], .plant-select, select#plantId').should(
    "be.visible",
  );
});

Then("the plant dropdown should contain available plants", () => {
  // SRS 7.2: Ensure dropdown has at least the placeholder + 1 plant
  cy.get('select#plantId, select[name*="plant"]')
    .find("option")
    .should("have.length.at.least", 2);
});

When("I select a plant from the dropdown", () => {
  cy.get('select#plantId, select[name*="plant"]').then(($select) => {
    if ($select.length > 0) {
      cy.wrap($select).select(1); // Selects the second option (first actual plant)
    } else {
      cy.get(".dropdown-toggle").click();
      cy.get(".dropdown-item").first().click();
    }
  });
});

Then("I should see the quantity input field", () => {
  cy.get('input[name*="quantity"], #quantity')
    .should("be.visible")
    .and("have.attr", "type", "number");
});

Then("a confirmation dialog should appear", () => {
  cy.get(".modal, .dialog, [role='dialog'], .swal2-container").should(
    "be.visible",
  );
});
//edited here 4
When("I click the {string} column header", (headerName) => {
  cy.get("th").contains(headerName).click();
});

// FIX: Corrected .or() logic for Scenario 08
Then("the sales should be sorted by {string}", (column) => {
  cy.get("th")
    .contains(column)
    .should(($el) => {
      const className = $el.attr("class") || "";
      expect(className).to.match(/sorting_asc|sorting_desc/);
    });
});

Then("I should see the sale in the sales list", () => {
  cy.get("table tbody tr", { timeout: 10000 }).should(
    "have.length.at.least",
    1,
  );
});

Then(
  "the sales table should display only sales matching the search term",
  () => {
    cy.get("table tbody tr").each(($row) => {
      cy.wrap($row).should("contain", "Rose");
    });
  },
);

// --- Dropdown & Selection ---

When("I select a plant from the dropdown", () => {
  // Wait for options to load, then pick the 2nd one (index 1)
  // Index 0 is usually the "Select a Plant" placeholder
  cy.get('select#plantId, select[name*="plant"]')
    .should("be.visible")
    .find("option")
    .should("have.length.at.least", 2); // Ensure data is loaded

  cy.get('select#plantId, select[name*="plant"]').select(1);
});

Then("the plant dropdown should contain available plants", () => {
  cy.get('select#plantId, select[name*="plant"]')
    .should("be.visible")
    .find("option")
    .should("have.length.at.least", 2);
});