/// <reference types="Cypress" />

beforeEach(() => {
    cy.visit('./src/index.html')
});

describe('Central Atendimento  ao Cliente TAT',  function() {
    const threeSeconds = 3000
    it('Verifica o titulo da aplicação', function() {
        cy.title().should('be.equal','Central de Atendimento ao Cliente TAT') 
    });

    it('Preenche os campos obrigatórios e envia o formulário', () => {
        const longTex = Cypress._.repeat('Teste ', 50)
        cy.clock()

        cy.get('#firstName').type('Renata')
        cy.get('#lastName').type('Santos')
        cy.get('#email').type('teste@teste.com.br')
        cy.get('textarea').type(longTex, {delay: 0})
        
        cy.contains('button', 'Enviar').click()
        cy.get('[class="success"]').should('be.visible')   
        cy.tick(threeSeconds)     
        cy.get('[class="success"]').should('not.be.visible')   
    });

    it('Preenche o formulário com dados inválidos e verifica se a mensagem de erro é exibida', () => {
        cy.clock()
        cy.get('#firstName').type('Renata')
        cy.get('#lastName').type('Santos')
        cy.get('#email').type('teste@teste,com.br')
        cy.contains('button', 'Enviar').click()
        cy.get('[class="error"]').should('be.visible')        
        cy.tick(threeSeconds)  
        cy.get('[class="error"]').should('not.be.visible')        
    });

    it('Verico se o campo de telefone ao informar um valor inválido o mesmo ficará vazio', () => {

        cy.get('input[id="phone"]').type('abcdefg')
        .should('have.value', '')        
    });

    it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        cy.clock()
        cy.get('#firstName').type('Renata')
        cy.get('#lastName').type('Santos')
        cy.get('#email').type('teste@teste.com.br')
        cy.get('#phone-checkbox').check()
        cy.get('textarea').type('Teste')
        cy.contains('button', 'Enviar').click()
        cy.get('[class="error"]').should('be.visible')  
        cy.tick(threeSeconds)  
        cy.get('[class="error"]').should('not.be.visible')                
    });

    it('Informa dados e limpa os campos em seguida', () => {
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('[class="error"]').should('be.visible')        
        cy.tick(threeSeconds)   
        cy.get('[class="error"]').should('not.be.visible')        
    });        

    Cypress._.times(1, () => {
        it('Envia o formuário com sucesso usando um comando customizado', () => {
            cy.clock()
            cy.fillMandatoryFieldsAndSubmit();
            cy.get('[class="success"]').should('be.visible')   
            cy.tick(threeSeconds)  
            cy.get('[class="success"]').should('not.be.visible')   
       });
    })

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

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })

    it('preenche a area de texto usando o comando invoke', () => {
        const longText = Cypress._.repeat('Cypress ', 20)

        cy.get('textarea').invoke('val', longText).should('have.value', longText)        
    });

    it('faz uma requisição HTTP', () => {
        cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
        .should(function(response){
            const {status, statusText, body} = response
            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')

        })        
    });

    it('Desafio (encontre o gato)', () => {
        cy.get('#cat')        
          .invoke('show')
          .should('be.visible')         
    });

  
});


