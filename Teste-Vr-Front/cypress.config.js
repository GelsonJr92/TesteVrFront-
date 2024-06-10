const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://www.vr.com.br',
        setupNodeEvents(on, config) {
            on('task', {
                log(message) {
                    console.log(message);
                    return null;
                },
            });
        },
        specPattern: 'cypress/e2e/**/*.cy.js',
        defaultCommandTimeout: 30000,
    },
});
