// ***************************************
// Ficha Modelo Marvel
// ***************************************
/**
* Componente que renderiza a ficha de Personagem, modelo Marvel.
* @param {{data: MnMCharacterData, gallery: string[]}} character Personagem a ser renderizado.
* @return {string} HTMLElement como string.
*/
function renderMarvelCharacterSheet(character) {
    let charData = character.data;
    
    let headerImage = new Image();
    headerImage.src = character.gallery[0];
    
    let bgHeaderStyle = '';
    bgHeaderStyle += `background-image: url(${headerImage.src});`;
    bgHeaderStyle += `background-size: cover;`;
    
    let forebgHeaderStyle = '';
    forebgHeaderStyle += `background-image: url(${headerImage.src});`;
    
    let page1 = `
    <link rel="stylesheet" href="styles/Sheets Styles/marvel-style.css">
    <div class="a4-page">
        
        <header id="marvel-header">
            <div id="marvel-header-background" style="${bgHeaderStyle}"></div>
            <div id="marvel-header-foreground" style="${forebgHeaderStyle}"></div>
            <div class="character-titles d-flex">
                <div><span class="character-title">${charData.name}</span></div>
                <div><span class="character-title">NP ${charData.powerLevel}</span></div>
            </div>
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
            <div id="power-list-page1" class="power-listing">
                <h3>Poderes</h3>
            </div>
        </div>
    </div>`;
    
    let page2 = `
    <!-- Página 2 -->
    <div id="page2" class="a4-page">
        <!-- Poderes | Perícias/Vantagens -->
        
        <div id="skillsAdvs-powers">
            <!-- Lista de Poderes -->
            <div id="power-list-page2" class="power-listing col-7">
                <h3>Cont. Poderes</h3>
            </div>
            
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
                    <p>${charData.advantages.map(elem => renderDefaultFeat(elem)).join(", ")}</p>
                </div>
            </aside>
        </div>
    </div>
    `;
    
    return `${page1}${page2}`;
}

/**
* Renderiza Habilidade de personagem em círculos.
* @param {ability} ability Habilidade a ser renderizada.
* @param {number} index Index da Habilidade, para seleção de cores.
* @returns {string} HTMLElement em string.
*/
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

/**
* Renderiza os Poderes do personagem, dinamicamente criando novas páginas caso haja poderes demais.
* @param {Power[]} powers Lista de Poderes do Personagem.
* @param {HTMLElement} container Elemento HTML onde a ficha está localizada.
*/
function renderMarvelPowers(powers, container) {
    let powerList = spreadPowers(powers);
    
    var blocks = [];
    let powerBlock, powerHeader, powerDescription;
    
    for(let power of powerList) {
        powerBlock = document.createElement('div');
        powerBlock.className = 'power-block';
        // Se for poder dentro de Múltiplos Poderes...
        if(power.name.includes('>', 0)) {
            powerBlock.className += ` child-power`;
            let paddingCount = power.name.split('>').length - 1;
            powerBlock.style.paddingLeft = `${paddingCount * 1.75}rem`
        }
        
        // Se for poder alternativo...
        if(power.isAlternateEffect) powerBlock.className += ` alternate-power`;
        
        let alternativeNameHeader = (power.isAlternateEffect) ? ((power.IsDynamicEffect) ? 'EAD: ' : 'EA: ') : '';
        let headerTxt = `${alternativeNameHeader}${power.name}`;
        if(power.showRank) headerTxt += ` ${power.rank}`;

        powerHeader = document.createElement('header');
        powerHeader.innerHTML = headerTxt;
        powerBlock.appendChild(powerHeader);
        
        if(power.description.length > 0) {
            powerDescription = document.createElement('p');
            powerDescription.innerHTML = `<span class="gold-bold">Drama:</span> ${power.description}`
            powerBlock.appendChild(powerDescription);
        }
        
        powerDescription = document.createElement('p');
        powerDescription.innerHTML = `<span class="gold-bold">Mecânica:</span> ${renderDefaultPower(power)}`;
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
        powerPageHeader.innerHTML = 'Cont. Poderes';
        powerPage.appendChild(powerPageHeader);
        
        powerListElement = document.createElement('div');
        powerListElement.className = 'power-listing';
        powerPage.appendChild(powerListElement);
        
        
        container.appendChild(powerPage);
        blocks = blocks.splice(maxBlocks)
        maxBlocks = countPowerBlocksWithStrictOverflow(powerListElement, blocks);
        leftovers = blocks.length - maxBlocks;
    }
}

function renderMarvelAttacks(attacks, container) {

}