const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// Variables are handled via Cypress aliases @response and @authToken
const sharedState = {};

Given("I assume the application is running", () => {
    // Implicit check could be done here if needed
});

When("I authenticate as {string}", (role) => {
    const username = role === 'admin' ? 'admin' : 'testuser';
    const password = role === 'admin' ? 'admin123' : 'test123';

    cy.request({
        method: 'POST',
        url: '/api/auth/login',
        body: { username, password },
        headers: { 'Content-Type': 'application/json' }
    }).then((res) => {
        expect(res.status).to.eq(200);
        cy.wrap(`Bearer ${res.body.token}`).as('authToken');
    });
});

When("I request {string} {string}", (method, url) => {
    cy.get('@authToken', { log: false }).then((authToken) => {
        cy.request({
            method: method,
            url: url,
            failOnStatusCode: false,
            headers: { 'Authorization': authToken }
        }).as('response');
    });
});

When("I request {string} {string} with body:", (method, url, body) => {
    cy.get('@authToken', { log: false }).then((authToken) => {
        cy.request({
            method: method,
            url: url,
            body: JSON.parse(body),
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        }).as('response');
    });
});

Then("the response status should be {int}", (statusCode) => {
    cy.get('@response').its('status').should('eq', statusCode);
});

Then("the response body should be valid JSON", () => {
    cy.get('@response').its('body').then((body) => {
        expect(typeof body).to.be.oneOf(['object', 'array']);
        expect(body).to.not.be.null;
    });
});

Then("the response body should not be empty", () => {
    cy.get('@response').its('body').then((body) => {
        if (Array.isArray(body)) {
            expect(body.length).to.be.greaterThan(0);
        } else if (typeof body === 'object' && body !== null) {
            expect(Object.keys(body).length).to.be.greaterThan(0);
        } else {
            expect(body).to.exist;
            expect(body).to.not.be.empty;
        }
    });
});

Then("the response body should contain {string}", (content) => {
    cy.get('@response').its('body').then((body) => {
        expect(JSON.stringify(body)).to.contain(content);
    });
});

Then("the response body should not be empty", () => {
    if (Array.isArray(response.body)) {
        expect(response.body.length).to.be.greaterThan(0);
    } else if (typeof response.body === 'object') {
        expect(Object.keys(response.body).length).to.be.greaterThan(0);
    } else {
        expect(response.body).to.exist;
        expect(response.body).to.not.be.empty;
    }
});

When("I capture the id as {string}", (alias) => {
    cy.get('@response').its('body.id').then((id) => {
        sharedState[alias] = id;
        cy.wrap(id).as(alias);
    });
});

When("I request {string} {string} with {string} as {string}", (method, url, alias, placeholder) => {
    const val = sharedState[alias] || 1;
    const finalUrl = url.replace(`{${placeholder}}`, val);
    cy.get('@authToken', { log: false }).then((authToken) => {
        cy.request({
            method: method,
            url: finalUrl,
            failOnStatusCode: false,
            headers: { 'Authorization': authToken }
        }).as('response');
    });
});

When("I request {string} {string} with {string} as {string} and body:", (method, url, alias, placeholder, body) => {
    const val = sharedState[alias] || 1;
    const finalUrl = url.replace(`{${placeholder}}`, val);
    cy.get('@authToken', { log: false }).then((authToken) => {
        cy.request({
            method: method,
            url: finalUrl,
            body: JSON.parse(body),
            failOnStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            }
        }).as('response');
    });
});
