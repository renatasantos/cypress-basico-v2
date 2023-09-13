/// <reference types="Cypress" />

beforeEach(() => {
    cy.visit('./src/index.html')
});

describe('Central Atendimento  ao Cliente TAT',  function() {
    it('Verifica o titulo da aplicação', function() {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT') 
    });

    it('Preenche os campos obrigatórios e envia o formulário', () => {
        const longTex = 'Teste, teste, teste, teste, teste, teste, teste, , teste, teste, , teste, teste, , teste, teste, , teste, teste, , teste, teste, , teste, teste, , teste, teste, , teste, teste.'
        
        cy.get('#firstName').type('Renata')
        cy.get('#lastName').type('Santos')
        cy.get('#email').type('teste@teste.com.br')
        cy.get('textarea').type(longTex)
        cy.contains('button', 'Enviar').click()
        cy.get('[class="success"]').should('be.visible')        
    });

    it('Preenche o formulário com dados inválidos e verifica se a mensagem de erro é exibida', () => {
        cy.get('#firstName').type('Renata')
        cy.get('#lastName').type('Santos')
        cy.get('#email').type('teste@teste,com.br')
        cy.contains('button', 'Enviar').click()
        cy.get('[class="error"]').should('be.visible')        
    });

    it('Verico se o campo de telefone ao informar um valor inválido o mesmo ficará vazio', () => {

        cy.get('input[id="phone"]').type('abcdefg')
        .should('have.value', '')        
    });

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.get('#firstName').type('Renata')
        cy.get('#lastName').type('Santos')
        cy.get('#email').type('teste@teste.com.br')
        cy.get('#phone-checkbox').check()
        cy.get('textarea').type('Teste')
        cy.contains('button', 'Enviar').click()
        cy.get('[class="error"]').should('be.visible')         
    });

    it('Informa dados e limpa os campos em seguida', () => {
        cy.contains('button', 'Enviar').click()
        cy.get('[class="error"]').should('be.visible')         
    });        

    it('Envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit();
        cy.get('[class="success"]').should('be.visible')   
    });

    it('Seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube').should('have.value', 'youtube');
    });

    it('Seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria');  
    });

    it('Seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1).should('have.value', 'blog');  
    });

    it('Marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
    });

    it('Marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })        
    });

    it('Marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
        .check()
        .should('be.checked')
        .last() //pega o ultimo item da lista de checkbox
        .uncheck()
        .should('not.be.checked')        
    });

    it('Seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .should(function(input){
            expect(input[0].files[0].name).to.equal('example.json')
        })
    });

    it('Seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
        .should(function(input){
            expect(input[0].files[0].name).to.equal('example.json')
        })    
    });

    it('Seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('simpleFile')
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('@simpleFile')
        .should(function(input){
            expect(input[0].files[0].name).to.equal('example.json')
        })  
    });

    it('Verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')        
    });

    it('Acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        cy.contains('CAC TAT - Política de privacidade').should('be.visible')     
    });

  
});


