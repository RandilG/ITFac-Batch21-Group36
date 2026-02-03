const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

let response;
let authToken;

Given("I assume the application is running", () => {
    // Implicit check could be done here if needed
});

When("I authenticate as {string}", (role) => {
    const credentials = role === 'admin' ? 'admin:admin123' : 'user:test123'; // Guessing password for user
    const encoded = btoa(credentials);
    authToken = `Basic ${encoded}`;
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
