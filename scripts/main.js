
window.onload = () => {
    // Habilitando Popovers;
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    
    mainContent.innerHTML = HomeMainContent();
}

// Função para ler o arquivo JSON enviado
function handleFileUpload(event) {
    const file = event.target.files[0];
    
    if (file && file.type === "application/json") {
        const reader = new FileReader();
        
        // Função que será chamada quando o arquivo for lido
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                characterTest(jsonData);
                // appendAlert('Sucesso! A ficha carregará em instantes!', 'success');
            } catch (error) {
                console.error('Erro ao ler o arquivo JSON:', error);
                alert('Arquivo inválido. Certifique-se de que é um JSON válido.');
            }
        };
        // Ler o conteúdo do arquivo
        reader.readAsText(file);
    } else {
        alert('Por favor, envie um arquivo JSON válido.');
    }
}

// Função para verificar as propriedades no JSON
function characterTest(portfolio) {
    let portfolioData = getPortData(portfolio);
    
    for(let portData of portfolioData) {
        if(!portData.data) {
            $('#load-error-modal').modal('show');
            return;
        }
    }
    
    currentPortfolio = portfolio;
    
    renderSheetList(portfolioData);
}

/**
* 
* @param {Power[]} powers 
* @returns {Power[]}
*/
function spreadPowers(powers) {
    const spreadArray = [];
    
    powers.forEach((power) => {
        // Adiciona o poder principal
        spreadArray.push(power);
        
        // Se existirem Poderes dentro, adiciona-os
        if (power.powers) {
            power.powers.forEach((alternative, index) => {
                // Renomeia o alternativo para refletir a sequência
                const alternativePower = {
                    ...alternative,
                    name: `> ${power.name} ${index + 1}`,
                };
                spreadArray.push(alternativePower);
            });
        }
        // Se existirem alternativos, adiciona-os
        if (power.alternativeEffects) {
            power.alternativeEffects.forEach((alternative, index) => {
                // Renomeia o alternativo para refletir a sequência
                const alternativePower = {
                    ...alternative,
                    name: `${alternative.isDynamicEffect ? 'EAD' : 'EA'}: ${alternative.name}`,
                };
                spreadArray.push(alternativePower);
            });
        }
    });
    
    return spreadArray;
}

function countPowerBlocksWithStrictOverflow(container, blocks) {
    let count = 0;
    let totalHeight = 0;
    const containerHeight = container.getBoundingClientRect().height;

    for (let i = 0; i < blocks.length; i++) {
        // Adicionar temporariamente o bloco ao container para medir a altura
        container.appendChild(blocks[i]);
        
        // Calcular a altura do próximo bloco
        const blockHeight = blocks[i].getBoundingClientRect().height;

        // Somar a altura acumulada
        totalHeight += blockHeight;

        // Verificar se a altura total ultrapassa a altura do contêiner
        if (totalHeight > containerHeight) {
            // console.log(`O overflow ocorreu ao tentar adicionar o bloco número ${i + 1}`);
            // Remover o bloco se causou overflow
            container.removeChild(blocks[i]);
            break;
        }

        // Incrementar o contador se o bloco foi adicionado com sucesso
        count++;
    }

    return count;
}


function isOutOfParent(container, element) {
    const elementRect = element.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    
    return (elementRect.bottom > parentRect.bottom  
        // elementRect.top < parentRect.top ||
        // || elementRect.left < parentRect.left || 
        //|| elementRect.right > parentRect.right
    );
}