// cypress/e2e/214241H/steps/214241H_api_steps.js
import { When, Then, Given } from "@badeball/cypress-cucumber-preprocessor";

let authToken;
let savedPlantId;

// Login to get token before tests
before(() => {
  cy.request("POST", "/api/auth/login", {
    username: "admin",
    password: "admin123",
  }).then((res) => {
    authToken = res.body.token;
  });
});

When("I send a POST request to {string} with body:", (url, docString) => {
  cy.request({
    method: "POST",
    url: url,
    headers: { Authorization: `Bearer ${authToken}` },
    body: JSON.parse(docString),
  }).as("response");
});

// Note: "the response status should be {int}" is defined in common_api_steps.js - removed duplicate here

Then(
  /the response body "([^"]+)" should be ([0-9]*\.[0-9]+)/,
  (path, value) => {
    const num = parseFloat(value);
    cy.get("@response").its(`body.${path}`).should("eq", num);
  },
);

Then("the response body {string} should be {string}", (path, value) => {
  cy.get("@response").its(`body.${path}`).should("eq", value);
});

When("I POST a sale to {string} with quantity {int}", (url, qty) => {
  // Replace {plantId} in URL with a real ID
  const finalUrl = url.replace("{plantId}", savedPlantId);
  cy.request({
    method: "POST",
    url: finalUrl,
    headers: { Authorization: `Bearer ${authToken}` },
  }).as("response");
});
