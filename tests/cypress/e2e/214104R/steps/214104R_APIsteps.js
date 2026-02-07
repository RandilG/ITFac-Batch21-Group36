import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

let response;
let lastCreatedSaleId;
let authToken;

Given("the application is running", () => {
  // Base URL is typically set in cypress.config.js
});

Given("I am logged in as {string} via API", (role) => {
  const username = role === 'Admin' ? 'admin' : 'testuser';
  const password = role === 'Admin' ? 'admin123' : 'test123';

  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { username, password }
  }).then((res) => {
    expect(res.status).to.eq(200);
    authToken = res.body.token;
  });
});

When("I send a GET request to {string}", (endpoint) => {
  cy.request({
    method: 'GET',
    url: endpoint,
    headers: { Authorization: `Bearer ${authToken}` },
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

When("I request to sell plant ID {string} with quantity {string}", (plantId, qty) => {
  cy.request({
    method: 'POST',
    url: `/api/sales/plant/${plantId}?quantity=${qty}`,
    headers: { Authorization: `Bearer ${authToken}` },
    failOnStatusCode: false
  }).then((res) => {
    response = res;
    if (res.status === 201 || res.status === 200) {
      lastCreatedSaleId = res.body.id;
    }
  });
});

When("I note the sale ID", () => {
  expect(lastCreatedSaleId).to.exist;
});

When("I send a GET request for that specific sale ID", () => {
  cy.request({
    method: 'GET',
    url: `/api/sales/${lastCreatedSaleId}`,
    headers: { Authorization: `Bearer ${authToken}` },
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

When("I send a DELETE request to that sale ID", () => {
  cy.request({
    method: 'DELETE',
    url: `/api/sales/${lastCreatedSaleId}`,
    headers: { Authorization: `Bearer ${authToken}` },
    failOnStatusCode: false
  }).then((res) => {
    response = res;
  });
});

Then("the response status code should be {int}", (statusCode) => {
  expect(response.status).to.eq(statusCode);
});

Then("the response should contain a list of sales", () => {
  expect(response.body).to.be.an('array');
});

Then("the response should contain the correct sale details", () => {
  expect(response.body).to.have.property('id', lastCreatedSaleId);
  expect(response.body).to.have.property('quantity');
  expect(response.body).to.have.property('totalPrice');
});

Then("the sales API error message should be {string}", (msg) => {
  const errorMsg = typeof response.body === 'string' ? response.body : response.body.message || JSON.stringify(response.body);
  expect(errorMsg).to.include(msg);
});