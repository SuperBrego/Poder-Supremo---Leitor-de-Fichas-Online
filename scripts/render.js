const mainContent = document.getElementById('content');

function renderCards(portfolioData) {
    let cardBlock = document.createElement('div');
    cardBlock.className = 'content-fluid d-flex justify-content-center';

    let returnBtn = document.createElement('button');
    returnBtn.className = 'btn btn-primary';
    returnBtn.innerHTML = 'Retornar';
    returnBtn.onclick = () => { mainContent.innerHTML = HomeMainContent(); }
    // cardBlock.appendChild(returnBtn);

    let cardElement;
    for(let characterData of portfolioData) {
        cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.style.width = '20rem';
        cardElement.innerHTML = CharacterChard(characterData);
        cardBlock.appendChild(cardElement);
    }

    mainContent.innerHTML = '';
    mainContent.appendChild(returnBtn);
    mainContent.appendChild(cardBlock);
}


const HomeMainContent = () => {
    return  `
    <div id="main-header" class="container-fluid main_container">
        <h1 class="quantico-regular">Leitor e Exibição de Fichas Poder Supremo M&M</h1>
        <p>Carregue o portfólio de ficha clicando no botão abaixo.</p>
        <!-- Input para upload de arquivo JSON -->
        <label for="fileInput" class="btn btn-primary btn-lg"><b>Carregar arquivo</b> (.json)</label>
        <input type="file" id="fileInput" style="display: none;" accept=".json" onchange="handleFileUpload(event)">
    </div>  `
}

const CharacterChard = (character) => {
    let image = character.gallery[0];
    let name = character.personalInfo.heroicName;
    let realName = character.personalInfo.realName;
    let powerLevel = character.powerLevel;
    
    return `
    <img src="${image}" class="card-img-top" alt="${name}">
    <div class="card-body">
        <h5 class="card-title">${name} • NP ${powerLevel}</h5>
        <p class="card-text">${name}${realName.length > 0 && ` (${realName})`}</p>
        <a href="#" class="btn btn-primary">Ir à ficha</a>
    </div>
    `
}