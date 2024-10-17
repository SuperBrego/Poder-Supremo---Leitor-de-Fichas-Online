// ***************************************
// Ficha Modelo Marvel
// ***************************************
/**
 * 
 * @param {{data: MnMCharacterData, gallery: string[]}} character 
 * @return {string}
 */
function renderMarvelCharacterSheet(character) {
    let charData = character.data;

    let headerImage = new Image();
    headerImage.src = character.gallery[0];

    let headerStyling = '';

    const imageWidth = headerImage.width;
    const imageHeight = headerImage.height;
    headerStyling += `background-image: url(${headerImage.src});`;
    
    // Determina se a imagem é paisagem ou retrato
    if (imageWidth > imageHeight) {
        // console.log("A imagem é em formato paisagem.");
        headerStyling += `background-size: cover;` // Configura como cover
        headerStyling += `width: 100%;`
    } else if (imageHeight > imageWidth) {
        // console.log("A imagem é em formato retrato.");
        headerStyling += `background-size: contain;` // Configura como contain
        headerStyling += `width: 25%;`
    } else {
        // console.log("A imagem é quadrada.");
        headerStyling += `background-size: cover;` // Ou qualquer outra configuração desejada
        headerStyling += `width: 25%;`
    }

    let page1 = `
    <link rel="stylesheet" href="styles/Sheets Styles/marvel-style.css">
    <div class="a4-page">
        
        <header id="image-header" style="${headerStyling}">
            <h1><span class="character-title">${charData.name}</span></h1>
        </header>
        
        <!-- Habilidades -->
        <div id="abilities" class="container-fluid text-center">
            ${charData.abilities.map((ability, index) => renderMarvelAbility(ability, index)).join("")}
        </div>
            
        <!-- Defesa | Poderes -->
        <div id="defenses-powers">
            <div id="defenses" class="col-3 text-center">
                <header><h3>Defesa</h3></header>

                ${charData.defenses.map(defense => `
                    <div class="defItem">
                        <header>${defense.name}</header>
                        <div class="defRanks"> <span>${defense.total}</span> </div>
                    </div>
                `).join("")}
            </div>
            <div id="power-list-page1" class="power-listing"></div>
        </div>
    </div>`;
    
    let page2 = `
    <!-- Página 2 -->
    <div id="page2" class="a4-page">
        <!-- Poderes | Perícias/Vantagens -->
        
        <div id="skillsAdvs-powers">
            <!-- Lista de Poderes -->
            <div id="power-list-page2" class="power-listing col-7"></div>
            
            <!-- Perícias/Vantagens -->
            <aside id="skills-advs">
                <h3>Perícias</h3>
                
                <!-- Perícias -->
                <div id="skills" class="col-5">
                    <header><span>Nome</span></header>
                    <header><span>Grad.</span></header>
                    <header><span>Total</span></header>
                    ${charData.skills.map(skill => `
                        <header>${skill.name}</header>
                        <div class="skill-rank">${skill.rank}</div>
                        <div class="skill-total">${skill.total}</div>
                    `).join('')}
                </div>
                
                <!-- Vantagens -->
                <div id="advantages">
                    <h3>Vantagens</h3>
                    <p>${charData.advantages.map(elem => renderMarvelAdv(elem)).join(", ")}</p>
                </div>
            </aside>
        </div>
    </div>
    `;

    return `${page1}${page2}`;
}

function renderMarvelAbility(ability, index) {
    const colors = ['red', 'orange', 'blue', 'green', 'purple', 'grey', 'darkred', 'darkgold'];
    let abilitiyCircle, abiRank, abiName;

    abilitiyCircle = document.createElement('div');
    abilitiyCircle.className = 'abi-circle';
    abilitiyCircle.style.borderColor = `${colors[index]}`;
    
    // Graduação
    abiRank = document.createElement('div');
    abiRank.className = 'abi-rank';
    abiRank.innerHTML = `${ability.total}`;
    abilitiyCircle.appendChild(abiRank);
    
    // Nome
    abiName = document.createElement('div');
    abiName.className = 'abi-name';
    abiName.innerHTML = `${ability.abrev}`;
    abilitiyCircle.appendChild(abiName);

    return abilitiyCircle.outerHTML;
}

function renderMarvelAdv(advantage) {
    let advTxt = advantage.name;
    if(advantage.rank > 1) advTxt += ` ${advantage.rank}`;
    if(advantage.trait && advantage.trait.length > 1) advTxt += ` (${advantage.trait})`;
    return advTxt;
}

function renderMarvelPowers(powers, container) {
    let powerList = spreadPowers(powers);

    var blocks = [];
    let powerBlock, powerHeader, powerDescription;

    for(let power of powerList) {
        powerBlock = document.createElement('div');
        powerBlock.className = 'power-block';
        if(power.isAlternateEffect) powerBlock.className += ` alternate-power`;
        
        powerHeader = document.createElement('header');

        let headerTxt = `${power.name}`;
        if(power.showRank) headerTxt += ` ${power.rank}`;
        powerHeader.innerHTML = headerTxt;
        powerBlock.appendChild(powerHeader);
        
        powerDescription = document.createElement('p');
        if(power.description.length > 0) powerDescription.innerHTML = `<b>Drama:</b> ${power.description}`
        else powerDescription.innerHTML = '<b>Drama:</b> <i>Resuminho do poder como ele é no jogo e como deve ser interpretado.</i>';
        powerBlock.appendChild(powerDescription);
        
        powerDescription = document.createElement('p');
        powerDescription.innerHTML = '<b>Trama:</b> Como são os efeitos que compoem o poder e seus custos';
        powerBlock.appendChild(powerDescription);
        
        blocks.push(powerBlock);
    }
    
    const page1Container = document.getElementById('power-list-page1');
    const page2Container = document.getElementById('power-list-page2');
    
    var maxBlocks = countPowerBlocksWithStrictOverflow(page1Container, blocks);
    let leftovers = blocks.length - maxBlocks;
    // console.log(`Você pode adicionar ${maxBlocks} blocos antes de causar overflow, sobrando ${blocks.length - maxBlocks}.`);
    
    if(leftovers > 0) {
        blocks = blocks.splice(maxBlocks)
        maxBlocks = countPowerBlocksWithStrictOverflow(page2Container, blocks);
        // console.log(`Você pode adicionar ${maxBlocks} blocos antes de causar overflow, sobrando ${blocks.length - maxBlocks}.`);
        leftovers = blocks.length - maxBlocks;
    }
    
    if((leftovers === 0) ) return;
    
    let powerPage, powerPageHeader, powerListElement;
    while(leftovers > 0) {
        powerPage = document.createElement('div');
        powerPage.className = 'a4-page p-5';
        
        powerPageHeader = document.createElement('h3');
        powerPageHeader.innerHTML = 'Poderes';
        powerPage.appendChild(powerPageHeader);
        
        powerListElement = document.createElement('div');
        powerListElement.className = 'power-listing';
        powerPage.appendChild(powerListElement);
        
        
        container.appendChild(powerPage);
        blocks = blocks.splice(maxBlocks)
        maxBlocks = countPowerBlocksWithStrictOverflow(powerListElement, blocks);
        leftovers = blocks.length - maxBlocks;
        // console.log(`Você pode adicionar ${maxBlocks} blocos antes de causar overflow, sobrando ${blocks.length - maxBlocks}.`);
    }
}