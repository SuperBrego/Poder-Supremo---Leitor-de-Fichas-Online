const mainContent = document.getElementById('content');

function renderSheetList(portfolioData) {
    let cardBlock = document.createElement('div');
    cardBlock.className = 'content-fluid d-flex justify-content-center mt-2 p-2 row-gap-2 column-gap-3 flex-wrap card-block';

    let returnBtn = document.createElement('button');
    returnBtn.className = 'btn btn-primary p-2 btn-lg ms-3 mt-3';
    returnBtn.innerHTML = '← Retornar';
    returnBtn.onclick = () => { mainContent.innerHTML = HomeMainContent(); }

    for(let index = 0; index < portfolioData.length; index++) {
        cardBlock.insertAdjacentHTML('beforeend', CharacterChard(portfolioData[index], index));
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

const CharacterChard = (character, index) => {
    let image = character.gallery[0];
    let name = character.data.personalInfo.heroicName;
    let realName = character.data.personalInfo.realName;
    let powerLevel = character.data.powerLevel;
    let points = character.data.points.abilities + 
    character.data.points.advantages + character.data.points.powers + 
    character.data.points.skills + character.data.points.defenses; 

    let characterType = character.data.characterType;
    console.log(characterType)
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
    
    return `
    <div class="card character-card" style="animation: fadeInAnimation ${1 * (index + .25)}s linear forwards;">
        <div class="card-header"> ${typeText} </div> 
        <img src="${image}" class="card-img-top" alt="${name}">
        <div class="card-body">
            <p class="card-title"> <b>${name} • NP ${powerLevel}</b> </p>
            ${realName && (realName.length > 0) && `<p class="card-subtitle mb-2 text-body-secondary">${realName}</p>`}
            <p class="card-text">${name}, Nível de Poder ${powerLevel}, Pontos ${points}</p>
        </div>
        <div class='card-footer'><a href="#" class="btn btn-primary">Ir à ficha</a></div>
    </div>
    `;
}

function renderExportOptions() {}

function renderCombatTracker() {}