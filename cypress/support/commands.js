Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Renata')
    cy.get('#lastName').type('Santos')
    cy.get('#email').type('teste@teste.com.br')
    cy.get('textarea').type('Teste')
    cy.contains('button', 'Enviar').click()
})