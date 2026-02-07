const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");

// Variables are handled via Cypress aliases @response and @authToken
const sharedState = {};

When("I authenticate as {string}", (role) => {
  const username = role === "admin" ? "admin" : "testuser";
  const password = role === "admin" ? "admin123" : "test123";

  cy.request({
    method: "POST",
    url: "/api/auth/login",
    body: { username, password },
    headers: { "Content-Type": "application/json" },
  }).then((res) => {
    expect(res.status).to.eq(200);
    cy.wrap(`Bearer ${res.body.token}`).as("authToken");
  });
});

When("I request {string} {string}", (method, url) => {
  cy.get("@authToken", { log: false }).then((authToken) => {
    cy.request({
      method: method,
      url: url,
      failOnStatusCode: false,
      headers: { Authorization: authToken },
    }).as("response");
  });
});

When("I request {string} {string} with body:", (method, url, body) => {
    const timestamp = new Date().getTime().toString().slice(-5);
    const finalUrl = url.replace(/{timestamp}/g, timestamp);
    const bodyWithTimestamp = body.replace(/{timestamp}/g, timestamp);

    cy.get('@authToken', { log: false }).then((authToken) => {
        cy.request({
            method: method,
            url: finalUrl,
            body: JSON.parse(bodyWithTimestamp),
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        }).as('response');
    });
});

Then("the response status should be {int}", (statusCode) => {
    cy.get('@response', { timeout: 10000 }).then((res) => {
        const errorMessage = res.status !== statusCode
            ? `Expected ${statusCode} but got ${res.status}. Response Body: ${JSON.stringify(res.body)}`
            : `Success`;
        expect(res.status, errorMessage).to.eq(statusCode);
    });
});

Then("the response status should be {int} or {int}", (status1, status2) => {
  cy.get("@response")
    .its("status")
    .then((actualStatus) => {
      expect([status1, status2]).to.include(actualStatus);
    });
});

Then("the response body should be valid JSON", () => {
  cy.get("@response")
    .its("body")
    .then((body) => {
      expect(typeof body).to.be.oneOf(["object", "array"]);
      expect(body).to.not.be.null;
    });
});

Then("the response body should not be empty", () => {
  cy.get("@response")
    .its("body")
    .then((body) => {
      if (Array.isArray(body)) {
        expect(body.length).to.be.greaterThan(0);
      } else if (typeof body === "object" && body !== null) {
        expect(Object.keys(body).length).to.be.greaterThan(0);
      } else {
        expect(body).to.exist;
        expect(body).to.not.be.empty;
      }
    });
});

Then("the response body should contain {string}", (content) => {
  cy.get("@response")
    .its("body")
    .then((body) => {
      expect(JSON.stringify(body)).to.contain(content);
    });
});

When("I capture the id as {string}", (alias) => {
  cy.get("@response")
    .its("body.id")
    .then((id) => {
      sharedState[alias] = id;
      cy.wrap(id).as(alias);
    });
});

When(
  "I request {string} {string} with {string} as {string}",
  (method, url, alias, placeholder) => {
    const val = sharedState[alias] || 1;
    const finalUrl = url.replace(`{${placeholder}}`, val);
    cy.get("@authToken", { log: false }).then((authToken) => {
      cy.request({
        method: method,
        url: finalUrl,
        failOnStatusCode: false,
        headers: { Authorization: authToken },
      }).as("response");
    });
  },
);

When(
  "I request {string} {string} with {string} as {string} and body:",
  (method, url, alias, placeholder, body) => {
    const val = sharedState[alias] || 1;
    const timestamp = new Date().getTime().toString().slice(-5);
    const finalUrl = url.replace(`{${placeholder}}`, val);
    const bodyWithTimestamp = body.replace(/{timestamp}/g, timestamp);

    cy.get('@authToken', { log: false }).then((authToken) => {
        cy.request({
            method: method,
            url: finalUrl,
            body: JSON.parse(bodyWithTimestamp),
            failOnStatusCode: false,
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
          })
          .then((res) => {
            if (
              res &&
              res.status === 400 &&
              res.body &&
              (res.body.error === "DUPLICATE_RESOURCE" ||
                /duplicate/i.test(res.body.message || ""))
            ) {
              try {
                payload.name = `${payload.name}-${Math.floor(Math.random() * 10000)}`;
              } catch (e) {}
              return cy
                .request({
                  method,
                  url: finalUrl,
                  body: payload,
                  failOnStatusCode: false,
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                  },
                })
                .then((res2) => cy.wrap(res2).as("response"));
            }
        }).as('response');
    });
  },
);

When(
  "I request {string} {string} with body using {string} as {string}:",
  (method, url, alias, placeholder, body) => {
    const val = sharedState[alias];
    const timestamp = new Date().getTime().toString().slice(-5);
    let bodyWithReplacement = body.replace(new RegExp(`{${placeholder}}`, 'g'), val);
    bodyWithReplacement = bodyWithReplacement.replace(/{timestamp}/g, timestamp);

    const finalUrl = url.replace(/{timestamp}/g, timestamp);

    cy.get('@authToken', { log: false }).then((authToken) => {
        cy.request({
            method: method,
            url: finalUrl,
            body: JSON.parse(bodyWithReplacement),
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        }).as('response');
    });
  },
);

Then(
  "the response body {string} should match captured {string}",
  (property, alias) => {
    const expectedVal = sharedState[alias];
    cy.get("@response")
      .its("body")
      .then((body) => {
        // Handle nested properties like 'category.id'
        const actualVal = property
          .split(".")
          .reduce((obj, key) => obj && obj[key], body);
        expect(actualVal).to.eq(expectedVal);
      });
  },
);

Then("the response body {string} should be {int}", (property, expectedVal) => {
  cy.get("@response")
    .its("body")
    .then((body) => {
      const actualVal = property
        .split(".")
        .reduce((obj, key) => obj && obj[key], body);
      expect(actualVal).to.eq(expectedVal);
    });
});
