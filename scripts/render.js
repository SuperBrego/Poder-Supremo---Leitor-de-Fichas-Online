const mainContent = document.getElementById('content');

function renderCards(portfolioData) {
    let cardBlock = document.createElement('div');
    cardBlock.className = 'content-fluid d-flex justify-content-center column-gap-3 card-block';

    let returnBtn = document.createElement('button');
    returnBtn.className = 'btn btn-primary p-2 btn-lg ms-3 mt-3';
    returnBtn.innerHTML = '← Retornar';
    returnBtn.onclick = () => { mainContent.innerHTML = HomeMainContent(); }
    // cardBlock.appendChild(returnBtn);

    let cardElement;
    for(let index = 0; index < portfolioData.length; index++) {
        cardElement = document.createElement('div');
        cardElement.className = 'card character-card';
        cardElement.style.animation = `fadeInAnimation ${2 * (index + .5)}s linear forwards`;
        cardElement.innerHTML = CharacterChard(portfolioData[index]);
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
    let name = character.data.personalInfo.heroicName;
    let realName = character.data.personalInfo.realName;
    let powerLevel = character.data.powerLevel;
    let points = character.data.points.abilities + 
    character.data.points.advantages + character.data.points.powers + 
    character.data.points.skills + character.data.points.defenses; 
    
    return `
    <img src="${image}" class="card-img-top" alt="${name}">
    <div class="card-body">
        <p class="card-title"> <b>${name} • NP ${powerLevel}</b> </p>
        ${realName.length > 0 && `<p class="card-subtitle mb-2 text-body-secondary">${realName}</p>`}
        <p class="card-text">${name}, Nível de Poder ${powerLevel}, Pontos ${points}</p>
    </div>
    <div class='card-footer'><a href="#" class="btn btn-primary">Ir à ficha</a></div>
    `;
}