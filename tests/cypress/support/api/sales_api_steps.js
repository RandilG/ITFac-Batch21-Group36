const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

// Access sharedState from global if available
const getSharedState = () => {
    return (typeof global !== 'undefined' && global.sharedState) ? global.sharedState : {};
};

// ============================================================
// SALES-SPECIFIC API STEPS
// ============================================================

When("I POST a sale to {string} with quantity {int}", (url, qty) => {
    const sharedState = getSharedState();
    const finalUrl = url.replace("{plantId}", sharedState.plantId || 1);
    
    cy.get('@authToken', { log: false }).then((authToken) => {
        cy.request({
            method: 'POST',
            url: finalUrl,
            headers: { 'Authorization': authToken },
            failOnStatusCode: false
        }).as('response');
    });
});