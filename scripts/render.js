const mainContent = document.getElementById('content');
const imageForeground = document.getElementById('image-foreground');

function renderHome() {
    mainContent.innerHTML = HomeMainContent()
    imageForeground.style.backgroundColor = `rgba(0, 0, 0, .80)`;
}

const HomeMainContent = () => {
    return  `
    <div id="main-header" class="container-fluid home-container">
        <h1 class="quantico-regular">Leitor e Exibição de Fichas Poder Supremo M&M</h1>
        <p>Carregue o portfólio de ficha clicando no botão abaixo.</p>
        <!-- Input para upload de arquivo JSON -->
        <label for="fileInput" class="btn btn-primary btn-lg"><b>Carregar arquivo</b> (.json)</label>
        <input type="file" id="fileInput" style="display: none;" accept=".json" onchange="handleFileUpload(event)">
    </div>  `
}

function renderSheetList(portfolioData) {
    let cardBlock = document.createElement('div');
    cardBlock.className = 'content-fluid d-flex justify-content-center mt-2 p-2 row-gap-2 column-gap-3 flex-wrap card-block';

    let returnBtn = document.createElement('button');
    returnBtn.className = 'btn btn-primary p-2 btn-lg ms-3 mt-3';
    returnBtn.innerHTML = '← Retornar';
    returnBtn.addEventListener('click', () => { renderHome() });
    
    for(let index = 0; index < portfolioData.length; index++) {
        cardBlock.insertAdjacentHTML('beforeend', CharacterChard(portfolioData[index], index));
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
            const character = portfolioData[Number(index)];
            // Chama a função renderCharacterSheet com o personagem correspondente
            renderCharacterSheet(character);
        });
    });

}

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

function renderCharacterSheet(character) {
    // Deixar opaco o fundo porque tá me dando enjoo
    imageForeground.style.backgroundColor = `rgba(1, 1, 1, .99)`;

    let returnBtn = document.createElement('button');
    returnBtn.className = 'btn btn-primary p-2 btn-lg ms-3 mt-3';
    returnBtn.innerHTML = '← Retornar';
    returnBtn.addEventListener('click', () => { renderHome() });    
    
    let sheetContainer = document.createElement('div')
    sheetContainer.id = 'sheet-container';

    // Ficha Marvel
    let sheet = document.createElement('div')
    sheet.className = 'marvel-character-sheet ms-3 mt-3';
    sheet.innerHTML = renderMarvelCharacterSheet(character);

    // Spinner
    // Criar o elemento Spinner
    const spinner = document.createElement('div');
    spinner.className = 'spinner-border';
    spinner.style.position = 'absolute';
    spinner.style.top = '50%';
    spinner.style.left = '50%';
    // spinner.style.transform = 'translate(-50%, -50%)';

    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';

    // Adicionar o Spinner ao contêiner
    
    mainContent.innerHTML = '';
    mainContent.appendChild(returnBtn);   
    mainContent.appendChild(spinner);
    sheetContainer.appendChild(sheet);
    mainContent.appendChild(sheetContainer);
    sheetContainer.style.visibility = 'hidden';
    
    setTimeout(() => renderMarvelPowers(character.data.powers, sheet), 1000);
    setTimeout(() => {
        const pages = document.querySelectorAll('.marvel-character-sheet .a4-page');
        pages.forEach((page, index) => {
            const offset = 278 * (index * .7); // 278mm multiplicado pela posição
            page.style.top = `${offset}mm`; // Definindo a posição top diretamente
        });
    }, 2000);  
    setTimeout(() => { 
        sheetContainer.style.visibility = 'visible';
        spinner.remove() 
    }, 3000);
}

function renderExportOptions() {}

function renderCombatTracker() {}