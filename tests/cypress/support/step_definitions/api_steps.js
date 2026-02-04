const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

let response;
let authToken;

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

Then("the response body should be valid JSON", () => {
    expect(response.body).to.exist;
    // If string, try parse
    if (typeof response.body === 'string') {
        JSON.parse(response.body);
    }
});

Then("the response body should contain {string}", (content) => {
    expect(JSON.stringify(response.body)).to.contain(content);
});
