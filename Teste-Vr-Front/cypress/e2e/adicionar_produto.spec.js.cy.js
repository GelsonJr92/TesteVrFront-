describe('Adicionar produto ao carrinho', () => {
    it('Deve adicionar um produto ao carrinho com sucesso', () => {
        // Acessar a home do portal web
        cy.visitAndWait();

        // Extrair a URL do conteúdo do script
        cy.document().then((doc) => {
            const scriptElement = doc.evaluate('/html/body/header/nav[2]/script', doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (scriptElement) {
                const scriptContent = scriptElement.textContent;


                const urlRegex = /window\.open\('([^']+)'/;
                const match = scriptContent.match(urlRegex);
                if (match && match[1]) {
                    const url = match[1];
                    cy.visit(url);
                    cy.url().should('include', 'loja.vr.com.br');
                } else {
                    throw new Error('URL não encontrada no script');
                }
            } else {
                throw new Error('Elemento <script> não encontrado');
            }
        });

        // Selecionar a opção "Cartões VR"
        cy.contains('Cartões VR', { timeout: 30000 }).should('be.visible').click({ force: true }).then(() => {
            console.log('Botão "Cartões VR" clicado');
        });

        cy.fecharConsentimento();
        cy.fecharPopup();

        // Adicionar uma quantidade aleatória de cartões do produto "Auto"
        const quantidadeAleatoria = Math.floor(Math.random() * 300) + 1;
        cy.get('#produto-auto-quantidade', { timeout: 30000 })
            .should('be.visible')
            .clear()
            .type(quantidadeAleatoria.toString())
            .then(() => {
                console.log('Quantidade do produto "Auto" preenchida com valor: ' + quantidadeAleatoria);
            });


        const valorAleatorio = (Math.random() * 999 + 1).toFixed(2).replace('.', ',');
        cy.get('#produto-auto-valor', { timeout: 30000 })
            .should('be.visible')
            .clear()
            .type(valorAleatorio)
            .then(() => {
                console.log('Valor do produto "Auto" preenchido com valor: ' + valorAleatorio);
            });


        // Clicar no botão "Adicionar ao carrinho"
        cy.get('#btn-adicionar-carrinho-auto', { timeout: 30000 }).should('be.visible').click({ force: true }).then(() => {
            console.log('Botão "Adicionar ao carrinho" clicado');
        });

        // Valida se a mensagem "Produto adicionado!" está presente no elemento especificado
        cy.get('#modalidade-avulso-page div div div form:nth-of-type(4) div:nth-of-type(3)', { timeout: 30000 })
            .should('be.visible')
            .and('contain.text', 'Produto adicionado!')
            .then(() => {
                console.log('Mensagem "Produto adicionado!" encontrada');
            });

        cy.get('#btn-meu-carrinho', { timeout: 30000 }).should('be.visible').click({ force: true }).then(() => {
            console.log('Botão Meu Carrinho clicado');
        });

        cy.get('.cart-individual-item-container__product-information', { timeout: 30000 })
            .should('be.visible')
            .invoke('text')
            .then((text) => {
                console.log('Texto extraído:', text);

                // Remover o prefixo "R$ " e qualquer espaço em branco ao redor
                const textoSemRS = text.replace('R$ ', '').trim();
                console.log('Texto sem prefixo R$: ', textoSemRS);

                // Verificar se o texto contém o valor numérico esperado
                expect(textoSemRS).to.contain(valorAleatorio);

                // Verificar se o texto contém a quantidade de cartões esperada
                const quantidadeEsperada = `Quantidade cartões${quantidadeAleatoria}`;
                console.log('Quantidade esperada:', quantidadeEsperada);
                expect(textoSemRS).to.contain(quantidadeEsperada);
            })
            .then(() => {
                console.log('Valor e quantidade no carrinho validados');
            });
    });
});



