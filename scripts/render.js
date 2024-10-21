const mainContent = document.getElementById('content');
const imageForeground = document.getElementById('image-foreground');

var isWideSheet = false;

/**
* Renderiza a página inicial do site. 
* A página inicial contém apenas o botão e cabeçalho de introduzir a leitura 
* do portfólio.
*/
function renderHome() {
    imageForeground.style.backgroundColor = `rgba(0, 0, 0, .80)`;
    
    mainContent.innerHTML = `
    <div id="main-header" class="container-fluid home-container">
        <h1 class="quantico-regular">Nexus Supremo</h1>
        <h3 class="quantico-regular">Leitor e Exibição de Fichas Poder Supremo M&M</h3>
        <p>Carregue o portfólio de ficha clicando no botão abaixo.</p>
        <!-- Input para upload de arquivo JSON -->
        <label for="fileInput" class="btn btn-primary btn-lg"><b>Carregar arquivo</b> (.json)</label>
        <input type="file" id="fileInput" style="display: none;" accept=".json" onchange="handleFileUpload(event)">
    </div>
    `;
    
}

/**
* Renderiza, em cards, todas as fichas dentro do portfólio.
*/
function renderSheetList() {
    let cardBlock = document.createElement('div');
    cardBlock.className = 'content-fluid d-flex justify-content-center mt-2 p-2 row-gap-2 column-gap-3 flex-wrap card-block';
    
    let returnBtn = document.createElement('button');
    returnBtn.className = 'btn btn-primary p-2 btn-lg ms-3 mt-3';
    returnBtn.innerHTML = '← Retornar';
    returnBtn.addEventListener('click', () => { renderHome() });
    
    for(let index = 0; index < currentPortfolio.length; index++) {
        cardBlock.insertAdjacentHTML('beforeend', CharacterChard(currentPortfolio[index], index));
    }
    mainContent.innerHTML = '';
    mainContent.appendChild(returnBtn);
    mainContent.appendChild(cardBlock);
    
    // Associa o evento de clique a todos os botões renderizados
    document.querySelectorAll('.btn.btn-primary[data-index]').forEach(button => {
        button.addEventListener('click', () => {
            // Pega o índice do data-index do botão
            const index = button.getAttribute('data-index');
            // Recupera o personagem do mapa usando o índice
            const character = currentPortfolio[Number(index)];
            // Chama a função renderCharacterSheet com o personagem correspondente
            renderCharacterSheet(character);
        });
    });
    
}

/**
* Componente de Card de personagem.
* @param {Character} character Personagem do Portfólio.
* @param {number} index Index da ficha de personagem. Usado para calcular o tempo da animação de fadeIn
* @returns {HTMLElement}
*/
const CharacterChard = (character, index) => {
    let image = character.gallery[0];
    let name = character.data.personalInfo.heroicName;
    let powerLevel = character.data.powerLevel;
    let points = character.data.points.abilities + character.data.points.advantages + character.data.points.powers + character.data.points.skills + character.data.points.defenses; 
    
    let characterType = character.data.characterType;
    let typeText = '';
    
    // 0- Personagem, 1- Capanga, 2- Parceiro, 3- Metamorfose
    
    switch(characterType) {
        default:
        case 0: typeText = 'Personagem'; break;
        case 1: typeText = 'Capanga'; break;
        case 2: typeText = 'Parceiro'; break;
        case 3: typeText = 'Invocação'; break;
        case 4: typeText = 'Metamorfose'; break;
    }
    
    let realName = character.data.personalInfo.realName;
    let showRealName = realName && (realName.length > 0);
    let playerName = character.data.personalInfo.playerName;
    let showPlayerName = playerName && (playerName.length > 0);
    
    return `
    <div class="card character-card" style="animation: fadeInAnimation ${1 * (index + .25)}s linear forwards;">
        <div class="card-header"> ${typeText} ${(showPlayerName) ? ` • Jogador: ${playerName}` : ''}</div> 
        <img src="${image}" class="card-img-top" alt="${name}">
        <div class="card-body">
            <p class="card-title"> <b>${name} • NP ${powerLevel}</b> </p>
            ${showRealName ? `<p class="card-subtitle mb-2 text-body-secondary">${realName}</p>` : ''}
            <p class="card-text">${name}, Nível de Poder ${powerLevel}, Pontos ${points}</p>
        </div>
        <div class='card-footer'>
            <button type="button" class="btn btn-primary" data-index="${index}">Ir à ficha</button>
        </div>
    </div>
    `;
}

/**
* Renderiza o personagem escolhido, gerando a página de ficha de personagem.
* @param {Character} character Personagem a ser renderizado.
*/
function renderCharacterSheet(character) {
    // Deixar opaco o fundo porque tá me dando enjoo
    imageForeground.style.backgroundColor = `rgba(1, 1, 1, .99)`;
    
    // Grupo de Botões.
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group p-2 btn-lg ms-3 mt-3';
    btnGroup.setAttribute('role', 'group');
    
    //      Voltar para Home.
    const returnSheetList = document.createElement('button');
    returnSheetList.className = 'btn btn-primary';
    returnSheetList.innerHTML = '← Retornar';
    // ***************************************** ↓ mudar aqui, temos que voltar aos cards.
    returnSheetList.addEventListener('click', () => { renderSheetList() });    
    
    //      Salvar a Ficha
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.innerHTML = 'Salvar PDF';
    saveBtn.addEventListener('click', () => { saveToPDF() });    
    
    //      Espandir a ficha
    const widenBtn = document.createElement('button');
    widenBtn.className = 'btn btn-primary';
    widenBtn.id = 'wide-reduce-sheet-btn'
    widenBtn.innerHTML = `<img src="../images/icons/arrows-angle-expand.svg" title="Aumentar" alt='Expand' />`;
    widenBtn.addEventListener('click', () => wideContractSheet());
    
    // Add botões
    btnGroup.appendChild(returnSheetList);
    btnGroup.appendChild(saveBtn);
    btnGroup.appendChild(widenBtn);
    
    // Container da Ficha
    const sheetContainer = document.createElement('div')
    sheetContainer.id = 'sheet-container';
    
    // Ficha Marvel
    const sheet = document.createElement('div')
    sheet.className = 'marvel-character-sheet ';
    sheet.innerHTML = renderMarvelCharacterSheet(character);
    
    // Spinner
    // Criar o elemento Spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border';
    spinner.style.position = 'absolute';
    spinner.style.top = '50%';
    spinner.style.left = '50%';
    
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    
    // Adicionar o Spinner ao contêiner
    
    mainContent.innerHTML = '';
    
    mainContent.appendChild(btnGroup);
    mainContent.appendChild(spinner);
    
    sheetContainer.appendChild(sheet);
    mainContent.appendChild(sheetContainer);
    sheetContainer.style.visibility = 'hidden';
    
    let templateClass = '';
    
    setTimeout(() => { templateClass = renderSheetTemplate(0, character, sheet)}, 1000);    
    setTimeout(() => { 
        sheetContainer.style.visibility = 'visible';        
        spinner.remove() 
    }, 3000);
    
    /**
    * Esse código abaixo é ainda necessário porque o handleResize não pega direitinho 
    * antes do componente estar 100% renderizado.
    */
    // Padrão .6
    let scaleOffset = .6;
    setTimeout(() => {
        const pages = document.querySelectorAll(`.${templateClass} .a4-page`);
        pages.forEach((page, index) => {
            const offset = 297 * (index * scaleOffset); // 297mm multiplicado pela posição
            page.style.top = `${offset}mm`; // Definindo a posição top diretamente
        });
    }, 2000);  
    
    // Já estrutura o tamanho da escala das fichas.
    handleResize();
    // Adicionamos o listener de resize
    window.addEventListener('resize', handleResize);
}

/**
* Aumenta o container da ficha para redimensioná-la ao seu tamanho real.
*/
function wideContractSheet() {
    let wideBtn = document.getElementById('wide-reduce-sheet-btn');
    if(isWideSheet) wideBtn.innerHTML = `<img src="../images/icons/arrows-angle-expand.svg" title="Aumentar" alt='Expand' />`;
    else wideBtn.innerHTML = `<img src="../images/icons/arrows-angle-contract.svg" title="Reduzir"  alt='contract' />`;
    
    isWideSheet = !isWideSheet;
    let sheetContainer = document.getElementById('sheet-container');
    sheetContainer.style.minWidth = (isWideSheet) ? '210mm' : '450px';
    sheetContainer.style.maxWidth = (isWideSheet) ? '' : '40%';
    
    handleResize();
}

/**
* Realiza resize das páginas da ficha quando a janela é redimensionada.
*/
function handleResize() {
    let parent = document.getElementById('sheet-container');
    let children = parent.querySelectorAll('.a4-page');
    let currentTop = 0; // Controla a posição acumulada de cada ficha
    
    if (parent && children) {
        let parentWidth = parent.offsetWidth;
        let scaleValue = parentWidth / 850; // 100 é a largura original do filho; 850 dá direitinho
        Array.from(children).forEach((child) => {
            
            // Transforma
            child.style.transform = `scale(${scaleValue})`;
            child.style.transformOrigin = `top left`;
            
            // Obter as novas dimensões após a transformação
            const scaledRect = child.getBoundingClientRect();
            const scaledHeight = scaledRect.height; // Altura do elemento após o scale
            
            // Ajustar a posição do elemento
            child.style.top = `${currentTop}px`; // Posiciona de acordo com o deslocamento acumulado
            
            // Atualiza o currentTop com a altura atual + algum espaçamento (se necessário)
            currentTop += scaledHeight * 1.0; // Dando basicamente uma página + 1.0 de distância entre elas.
        });
    }
    
}

/**
* Encaminha o modelo de ficha conforme o tipo.
* @param {number} index Índice do tipo de ficha.
* @param {{data: MnMCharacterData, gallery: string[]}} character Dados do Personagem e sua galeria.
* @param {HTMLElement} container Elemento onde será renderizado páginas adicionais da ficha. Normalmente, é o mesmo modelo espaço.
*/
function renderSheetTemplate(index, character, container) {
    switch(index) {
        default:
        case 0: renderMarvelPowers(character.data.powers, container);
        return 'marvel-character-sheet';
    }
}

function renderExportOptions() {}

function renderCombatTracker() {}


// **********************************************************************
// Componentes Padrões
// **********************************************************************
/**
* Renderiza, em string, a Vantagem do personagem.
* @param {FeatData} feat Vantagem a ser renderizada.
* @returns {string}
*/
function renderDefaultFeat(feat) {
    let featTxt = feat.name;
    if(feat.rank > 1) featTxt += ` ${feat.rank}`;
    if(feat.trait && feat.trait.length > 1) featTxt += ` (${feat.trait})`;
    return featTxt;
}

/**
* Renderiza as informações sobre o poder do personagem.
* @param {PowerData} power Poder a ser explorado as características.
* @returns {string}
*/
function renderDefaultPower(power) {
    
    // Abrir Parênteses    
    let isDynamic = power.isDynamicEffect;
    let hasAffectedTrait = (power.affectedTrait !== "" && power.affectedTrait !== "Nenhum");
    let hasResistedBy = (power.resistedBy !== "" && power.resistedBy !== "Nenhum");
    
    let hasEnhancements = !!(power.enhancedTraits && power.enhancedTraits.length > 0);
    let hasEnhancedAdvantages = power.enhancedAdvantages.length > 0;
    
    let hasDescriptors = (power.descriptors.length > 0);
    let hasFlats = (power.flats.length > 0);
    let hasExtras = (power.extras.length > 0);
    let hasFlaws = (power.flaws.length > 0);
    
    let isRemovable = (power.removable > 0);
    
    // Aflição
    let hasFirstDegree = !!(power.firstDegree && power.firstDegree.length > 0);
    let hasSecondDegree = !!(power.secondDegree && power.secondDegree.length > 0);
    let hasThirdDegree = !!(power.thirdDegree && power.thirdDegree.length > 0);
    
    let isArray = power.effectID === 5042;
    
    const details = [];
    
    // É Removível
    if(isRemovable) details.push((power.removable === 1) ? `Difícil de Remover` : `Fácil de Remover`);
    // É dinâmico
    if(isDynamic && !power.isAlternateEffect) details.push(`<span>Dinâmico</span>`);
    // Poder base do Arranjo
    if(isArray) details.push(`<b>Poder base:</b> ${power.biggest}`)
        // Afeta alguma característica
    if(hasAffectedTrait) details.push(`<span>${power.affectedTrait}</span>`)
        // Tem Resistência
    if(hasResistedBy) details.push(`<span><b>Resistido por</b>: ${power.resistedBy}</span>`);
    
    // Tem opções de Poder
    if(power.powerOptions) {
        details.push(`
            ${power.powerOptions.map((pwrOpt) => `
                ${pwrOpt.name}${pwrOpt.rank !== 1 ? ` ${pwrOpt.rank}` : ''}
                ${pwrOpt.traitText.length > 0 ? ` [${pwrOpt.traitText}]` : ''}
            `).join(', ')}`
        );
    }
    
    // É Aflição
    if(power.overcomedBy) {
        details.push(`<span><b>Superador por</b>: ${power.overcomedBy}</span>`);
        if(power.variableDegree === 4) details.push(`Todas Condições Variáveis`);
        else {
            if(hasFirstDegree || power.variableDegree === 1) {
                details.push(`<b>1º Grau:</b> ${(power.variableDegree === 1) ? 'Variável' : `${power.firstDegree}`}`);
            }
            
            if((hasSecondDegree || power.variableDegree === 2) && power.limitedDegree < 2) {
                details.push(`<b>2º Grau:</b> ${(power.variableDegree === 2) ? 'Variável' : `${power.secondDegree}`}`);
            }
            
            if((hasThirdDegree || power.variableDegree === 3) && power.limitedDegree < 1) {
                details.push(`<b>3º Grau:</b> ${(power.variableDegree === 2) ? 'Variável' : `${power.thirdDegree}`}`);
            }
        }
        
    }
    
    // Modificadores Fixos
    if(hasFlats) details.push(`<b>Fixos:</b> ${power.flats.map((elem) => renderDefaultModifier(elem, true)).join(', ')}`);
    
    // Modificadores Extras
    if(hasExtras) details.push(`<b>Extras:</b> ${power.extras.map((elem) => renderDefaultModifier(elem, false)).join(', ')}`);
    
    // Modificadores Falhas
    if(hasFlaws) details.push(`<b>Falhas:</b> ${power.flaws.map((elem) => renderDefaultModifier(elem, false)).join(', ')}`);
    
    // <PSSModifierRender modifier={elem} isExtra={elem.extra} isFlat={true} />
    
    // Modificações
    if(hasEnhancements) {
        details.push(`<b>Modificações</b>: ${power.enhancedTraits.map((elem) => `${elem.trait} ${elem.rank}`)}`);
    }
    
    if(hasEnhancedAdvantages) {
        details.push(`<b>Vantagens</b>: ${power.enhancedAdvantages.map((elem) => renderDefaultFeat(elem)).join(', ')}`);
    }
    
    // Descritores
    if(hasDescriptors) details.push(`<b>Descritores</b>: ${power.descriptors.map((elem) => `${elem}`).join(', ')}`);
    
    return `
        ${power.effect} ${power.strengthBased ? ' baseado em Força' : ''} ${power.showRank ? `${power.rank}` : ''}
        ${details.length > 0 ? `(${details.map(elem => `${elem}`).join('. ')})` : ''}
    `;
}

/**
* Renderiza Modificador de Poder.
* @param {ModifierData} modifier Modificador a ser renderizado.
* @param {boolean} isFlat Se o Modificador é Fixo ou Extra/Falha por Graduação.
* @returns {string}
*/
function renderDefaultModifier(modifier, isFlat) {
    return `
        ${modifier.name} ${(modifier.extra) ? `+${modifier.rank}` : `-${modifier.rank}`}${!(isFlat) ? `/grad` : '/fixo'}
        ${modifier.hasTrait ? `[${modifier.traitText}]` : ''}
    `;
}