// cypress/support/commands.js

Cypress.Commands.add('visitAndWait', () => {
    const baseUrl = Cypress.config('baseUrl');
    console.log(`Visitando a URL base: ${baseUrl}`);
    cy.visit(baseUrl);
    Cypress.config('defaultCommandTimeout', 30000);
    cy.focused().should('not.be.null').then(() => {
        console.log('A página recebeu o foco');
    });
});

Cypress.Commands.add('fecharConsentimento', () => {
    cy.get('body').then(($body) => {
        if ($body.find('#sc_terms-consent').length > 0) {
            cy.get('#sc_terms-consent', { timeout: 30000 })
                .click()
                .then(() => {
                    console.log('Consentimento de termos fechado');
                });
        } else {
            console.log('Consentimento de termos não encontrado');
        }
    });
});


Cypress.Commands.add('fecharPopup', () => {
    cy.get('body').then(($body) => {
        if ($body.find("button.close-button:first-of-type").length > 0) {
            cy.get("button.close-button:first-of-type", { timeout: 30000 })
                .should('be.visible')
                .click({ force: true });
            console.log('Popup fechado');
        }
    });
});


