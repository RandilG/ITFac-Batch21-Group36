const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

let response;
let authToken;
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
        authToken = `Bearer ${res.body.token}`;
    });
});

When("I request {string} {string}", (method, url) => {
    cy.request({
        method: method,
        url: url,
        failOnStatusCode: false,
        headers: { 'Authorization': authToken }
    }).then((res) => {
        response = res;
    });
});

When("I request {string} {string} with body:", (method, url, body) => {
    cy.request({
        method: method,
        url: url,
        body: JSON.parse(body),
        failOnStatusCode: false,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
        }
    }).then((res) => {
        response = res;
    });
});

Then("the response status should be {int}", (statusCode) => {
    expect(response.status).to.eq(statusCode);
});

Then("the response body should not be empty", () => {
    if (Array.isArray(response.body)) {
        expect(response.body.length).to.be.greaterThan(0);
    } else if (typeof response.body === 'object' && response.body !== null) {
        expect(Object.keys(response.body).length).to.be.greaterThan(0);
    } else {
        expect(response.body).to.exist;
        expect(response.body).to.not.be.empty;
    }
});

Then("the response body should contain {string}", (content) => {
    expect(JSON.stringify(response.body)).to.contain(content);
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
    sharedState[alias] = response.body.id;
    cy.wrap(response.body.id).as(alias);
});

When("I request {string} {string} with {string} as {string}", (method, url, alias, placeholder) => {
    const val = sharedState[alias] || 1;
    const finalUrl = url.replace(`{${placeholder}}`, val);
    cy.request({
        method: method,
        url: finalUrl,
        failOnStatusCode: false,
        headers: { 'Authorization': authToken }
    }).then((res) => {
        response = res;
    });
});

When("I request {string} {string} with {string} as {string} and body:", (method, url, alias, placeholder, body) => {
    const val = sharedState[alias] || 1;
    const finalUrl = url.replace(`{${placeholder}}`, val);
    cy.request({
        method: method,
        url: finalUrl,
        body: JSON.parse(body),
        failOnStatusCode: false,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken
        }
    }).then((res) => {
        response = res;
    });
});
