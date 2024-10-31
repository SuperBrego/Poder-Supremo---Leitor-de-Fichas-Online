const mainContent = document.getElementById('content');
const imageForeground = document.getElementById('image-foreground');
var currentCharacter = {};
var currentIndex = 0;
var keepGallery = false;
var keepJournals = false;

var isWideSheet = false;

/**
* Renderiza a página inicial do site. 
* A página inicial contém apenas o botão e cabeçalho de introduzir a leitura 
* do portfólio.
*/
function renderHome() {
    currentCharacter = {};
    
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
            renderCharacterSheet(character, 0);
        });
    });
    
}

/**
* Renderiza o personagem escolhido, gerando a página de ficha de personagem.
* @param {Character} character Personagem a ser renderizado.
*/
function renderCharacterSheet(character, index) {
    // Atualizar variável global
    currentCharacter = character;
    currentIndex = index;

    // Deixar opaco o fundo porque tá me dando enjoo
    imageForeground.style.backgroundColor = `rgba(1, 1, 1, .99)`;

    //  Top com Várias opções
    // const flexTopPage = document.createElement('div');
    // flexTopPage.className = 'd-flex flex-row';
    
    //      Grupo de Botões.
    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group p-2 btn-lg ms-3 mt-3';
    btnGroup.setAttribute('role', 'group');
    
    //      Voltar para Home.
    const returnSheetList = document.createElement('button');
    returnSheetList.className = 'btn btn-primary';
    returnSheetList.innerHTML = '← Retornar';
    returnSheetList.addEventListener('click', () => { renderSheetList() });
    
    //      Salvar a Ficha
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary';
    saveBtn.innerHTML = 'Salvar PDF';
    saveBtn.disabled = true;
    saveBtn.addEventListener('click', () => { saveToPDF() });
    
    //      Espandir a ficha
    const widenBtn = document.createElement('button');
    widenBtn.className = 'btn btn-primary';
    widenBtn.id = 'wide-reduce-sheet-btn'
    widenBtn.innerHTML = `<img src="images/icons/arrows-angle-expand.svg" title="Aumentar" alt='Expand' />`;
    widenBtn.disabled = true;
    widenBtn.addEventListener('click', () => wideContractSheet());
    
    // Add botões
    btnGroup.appendChild(returnSheetList);
    btnGroup.appendChild(saveBtn);
    btnGroup.appendChild(widenBtn);
    
    // Container da Ficha
    const sheetContainer = document.createElement('div')
    sheetContainer.id = 'sheet-container';
    
    // Criar o elemento Spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border';
    spinner.style.position = 'absolute';
    spinner.style.top = '50%';
    spinner.style.left = '50%';
    
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    
    // Limpa Conteúdo da Página
    mainContent.innerHTML = '';
    
    // Adicionar os Botões e o Spinner ao Conteúdo
    mainContent.appendChild(btnGroup);
    mainContent.appendChild(spinner);

    // Container que tem a ficha | modelos de fichas
    const sheetTemplatesBlock = document.createElement('div');
    sheetTemplatesBlock.id = 'sheet-models-block';
    sheetTemplatesBlock.className = 'd-flex flex-row';
    
    //      Encaixa o container da Ficha
    sheetTemplatesBlock.appendChild(sheetContainer);
    
    //      Campo de Modelos
    const templatesBlock = document.createElement('div');
    templatesBlock.className = 'd-flex flex-column';
    templatesBlock.appendChild(renderSheetTemplatesOptions());
    sheetTemplatesBlock.appendChild(templatesBlock);

    // 
    mainContent.appendChild(sheetTemplatesBlock);
    
    // Deixa a ficha invisível enquanto renderiza.
    sheetTemplatesBlock.style.visibility = 'hidden';
    
    // ******************
    // Renderiza a ficha
    // ******************
    renderSheetTemplate(index, character, sheetContainer);
    
    /**
     * Aguarda-se 3 segundos antes de exibir a ficha, para que os elementos 
     * tenham tempo de surgir para os cálculos de dimensões.
     * Alguns modelos de ficha não precisam disso.
    */
    setTimeout(() => { 
        // Exibe a Ficha novamente;
        sheetTemplatesBlock.style.visibility = 'visible';
        // Remove o Spinner
        spinner.remove();
        
        // Permite os botões funcionarem
        saveBtn.disabled = false;
        widenBtn.disabled = false;

        // Já estrutura o tamanho da escala das fichas.
        handleResize();
    }, 1200);
    
    // Adicionamos o listener de resize
    window.addEventListener('resize', handleResize);
}

/**
* Aumenta o container da ficha para redimensioná-la ao seu tamanho real.
*/
function wideContractSheet() {
    let wideBtn = document.getElementById('wide-reduce-sheet-btn');
    if(isWideSheet) wideBtn.innerHTML = `<img src="images/icons/arrows-angle-expand.svg" title="Aumentar" alt='Expand' />`;
    else wideBtn.innerHTML = `<img src="images/icons/arrows-angle-contract.svg" title="Reduzir"  alt='contract' />`;
    
    isWideSheet = !isWideSheet;
    let sheetContainer = document.getElementById('sheet-container');
    sheetContainer.style.minWidth = (isWideSheet) ? '50%' : '450px';
    sheetContainer.style.maxWidth = (isWideSheet) ? '50%' : '40%';
    
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
* @param {HTMLElement} sheetContainer Elemento onde será renderizado páginas adicionais da ficha. Normalmente, é o mesmo modelo
* do espaço da ficha.
*/
function renderSheetTemplate(index, character, sheetContainer) {
    const sheet = document.createElement('div');

    switch(index) {
        default:
        case 0: 
            sheet.className = 'marvel-character-sheet';
            sheet.innerHTML = renderMarvelCharacterSheet(character);
            sheetContainer.appendChild(sheet);

            // Esperar um momento antes de encaixar os outros elementos.
            setTimeout(() => { renderMarvelCharacterBlocks(character.data, sheet); }, 1000);
            setTimeout(() => { renderMarvelCharacterPersonalTraits(character.data.personalInfo, sheet); }, 1100);
            break;
        case 1: 
            sheet.className = 'jb-character-sheet a4-page';
            sheet.innerHTML = renderJBCharacterSheet(character);
            sheetContainer.appendChild(sheet);
            break;
    }
}

/**
 * Lista de Templates
*/
const sheetTemplates = [
    {
        index: 0, 
        name: 'Modelo Marvel', 
        description: 'Baseado no site da Marvel Comics, com imagem de cabeçalho e campos do personagem sendo distribuídos lado-a-lado com os poderes e equipamentos.', 
        img: 'images/sheet examples/marvel-sheet-template.png',
        credits: 'Gio Mota'
    },
    {
        index: 1, 
        name: 'Modelo JB', 
        description: 'Um modelo simples com cabeçalhos e quebra de página dinâmica.', 
        img: 'images/sheet examples/jb-sheet-template.png',
        credits: 'João Brasil'
    },
];

/**
 * Renderiza a lista de templates de fichas.
 * @returns {string} Elemento HTML como string.
*/
function renderSheetTemplatesOptions() {
    let asideBlock = document.createElement('aside');
    asideBlock.id = 'sheet-templates';

    let listBlock = document.createElement('ul');
    listBlock.className = 'list-group';

    let listItem;
    for(let sheetTemplate of sheetTemplates.sort()) {
        listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        if(sheetTemplate.index === currentIndex) listItem.className += ' active';
        else listItem.style.cursor = 'pointer';

        listItem.appendChild(TemplateCard(sheetTemplate));

        listBlock.appendChild(listItem);
    }
    
    asideBlock.appendChild(listBlock);

    return asideBlock;
}

function renderCombatTracker() {}