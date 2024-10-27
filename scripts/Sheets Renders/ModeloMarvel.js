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
                <header><h2>Defesa</h2></header>
    
                ${charData.defenses.map(defense => `
                    <div class="defItem">
                        <header>${defense.name}</header>
                        <div class="defRanks"> <span>${defense.totalText}</span> </div>
                    </div>
                `).join("")}
            </div>
            <div id="content-listing-page1" class="content-listing"></div>
        </div>
    </div>`;
    
    let page2 = `
    <!-- Página 2 -->
    <div id="page2" class="a4-page">
        <!-- Poderes | Perícias/Vantagens -->
        
        <div id="skillsAdvs-powers">
            <!-- Lista de Poderes -->
            <div id="content-listing-page2" class="content-listing col-7">
            </div>
            
            <!-- Perícias/Vantagens -->
            <aside id="skills-advs">
                <h2>Perícias</h2>
                
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
                    ${charData.advantages.length > 0 
                        ? `<h2>Vantagens</h2> 
                        <p>${charData.advantages.map(elem => renderFeatDefault(elem)).join(", ")}</p>` 
                        : ''}
                </div>
            </aside>
        </div>
    </div>
    `;
    
    let page3 = `
    <!-- Página 3 -->
    <div id="page3" class="a4-page">
        <!-- Informações do Personagem -->
        
        
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
function renderMarvelCharacterBlocks(characterData, container) {    
    let blocks = [].concat(
        setMarvelOffensiveBlocks(characterData.offensive),
        setMarvelPowersBlocks(spreadPowers(characterData.powers)), 
        setMarvelEquipmentBlocks(spreadEquipments(characterData.equipments))
    );

    // **************************************
    // Socar todo mundo dentro dos Divs.
    // **************************************    
    const powerContainer1 = document.getElementById('content-listing-page1');
    const powerContainer2 = document.getElementById('content-listing-page2');
    
    var maxBlocks = countPowerBlocksWithStrictOverflow(powerContainer1, blocks);
    let leftovers = blocks.length - maxBlocks;
    // console.log(`Você pode adicionar ${maxBlocks} blocos antes de causar overflow, sobrando ${blocks.length - maxBlocks}.`);
    
    if(leftovers > 0) {
        blocks = blocks.splice(maxBlocks)
        maxBlocks = countPowerBlocksWithStrictOverflow(powerContainer2, blocks);
        // console.log(`Você pode adicionar ${maxBlocks} blocos antes de causar overflow, sobrando ${blocks.length - maxBlocks}.`);
        leftovers = blocks.length - maxBlocks;
    }
    
    if(leftovers === 0) return;
    
    let powerPage, powerPageHeader, powerListElement;

    while(leftovers > 0) {
        powerPage = document.createElement('div');
        powerPage.className = 'a4-page p-5';
        
        powerPageHeader = document.createElement('h2');
        powerPageHeader.innerHTML = 'Cont. Poderes & Equips.';
        powerPage.appendChild(powerPageHeader);
        
        powerListElement = document.createElement('div');
        powerListElement.className = 'content-listing';
        powerPage.appendChild(powerListElement);
        
        
        container.appendChild(powerPage);
        blocks = blocks.splice(maxBlocks)
        maxBlocks = countPowerBlocksWithStrictOverflow(powerListElement, blocks);
        leftovers = blocks.length - maxBlocks;
    }
}

/**
 * Define os Blocos de Poderes de Personagem para adicionar ao elemento lista.
 * @returns {HTMLElement[]}
*/
function setMarvelPowersBlocks(powers) {
    let blocks = [];

    let sectionHeader, powerBlock, nameHeader, descriptionBlock;
    
    if(powers.length > 0) {
        sectionHeader = document.createElement('h2');
        sectionHeader.innerHTML = 'Poderes';
        blocks.push(sectionHeader);
    }

    for(let power of powers) {
        powerBlock = document.createElement('div');
        powerBlock.className = 'power-block';
        // Se for poder dentro de Múltiplos Poderes ou Poderes Alternativos...
        if(power.name.includes('>', 0)) {
            powerBlock.className += ` child-power`;
            let paddingCount = power.name.split('>').length - 1;
            powerBlock.style.paddingLeft = `${paddingCount * 1.75}rem`
        }
        
        let alternativeNameHeader = (power.isAlternateEffect) ? ((power.IsDynamicEffect) ? 'EAD: ' : 'EA: ') : '';
        let headerTxt = `${alternativeNameHeader}${power.name.replaceAll('>', '')}`;
        if(power.showRank) headerTxt += ` ${power.rank}`;

        nameHeader = document.createElement('header');
        nameHeader.innerHTML = headerTxt;
        powerBlock.appendChild(nameHeader);
        
        if(power.description.length > 0) {
            descriptionBlock = document.createElement('p');
            descriptionBlock.innerHTML = `<span class="gold-bold">Drama:</span> ${power.description}`
            powerBlock.appendChild(descriptionBlock);
        }
        
        descriptionBlock = document.createElement('p');
        descriptionBlock.innerHTML = `<span class="gold-bold">Mecânica:</span> ${renderPowerDefault(power)}`;
        powerBlock.appendChild(descriptionBlock);
        
        blocks.push(powerBlock);
    }

    return blocks;
}

/**
 * Define os Blocos de Equipamentos de Personagem para adicionar ao elemento lista.
 * @returns {HTMLElement[]}
*/
function setMarvelEquipmentBlocks(equipments) {
    let blocks = [];
    let sectionHeader, equipBlock, descriptionBlock;

    if(equipments.length > 0) {
        sectionHeader = document.createElement('h2');
        sectionHeader.innerHTML = 'Equipamentos';
        blocks.push(sectionHeader);
    }

    for(let equipment of equipments) {
        equipBlock = document.createElement('div');
        equipBlock.className = 'power-block';
        // Se for poder dentro de Múltiplos Poderes ou Poderes Alternativos...
        if(equipment.name.includes('>', 0)) {
            equipBlock.className += ` child-power`;
            let paddingCount = equipment.name.split('>').length - 1;
            equipBlock.style.paddingLeft = `${paddingCount * 1.75}rem`
        }

        descriptionBlock = document.createElement('p');
        descriptionBlock.innerHTML = `<span class="darkgreen-bold">${renderEquipmentDefault(equipment)}</span>`;
        equipBlock.appendChild(descriptionBlock);
        
        blocks.push(equipBlock);
    }

    return blocks;
}

function setMarvelOffensiveBlocks(offensiveData) {
    let blocks = [];
    let attacks = offensiveData.attacks;

    let sectionHeader, attackBlock, descriptionBlock;
    
    sectionHeader = document.createElement('h2');
    sectionHeader.innerHTML = 'Ofensiva';
    blocks.push(sectionHeader);
    
    // Iniciativa
    let initiativeTxt = (offensiveData.initiative >= 0) ? `+${offensiveData.initiative}` : `${offensiveData.initiative}`;
    attackBlock = document.createElement('p');
    attackBlock.innerHTML = `<b>Bônus de Iniciativa:</b> ${initiativeTxt}`;
    blocks.push(attackBlock);
    
    // Perto
    sectionHeader = document.createElement('h3');
    sectionHeader.innerHTML = 'Perto';
    blocks.push(sectionHeader);

    attacks.filter(elem => elem.range === 1).map(attack => {
        attackBlock = document.createElement('div');
        attackBlock.className = 'power-block';

        descriptionBlock = document.createElement('p');
        descriptionBlock.innerHTML = `<span class="darkred-bold">${renderAttackDefault(attack)}</span>`;
        attackBlock.appendChild(descriptionBlock);
        
        blocks.push(attackBlock);
    });
    
    // À Distância
    sectionHeader = document.createElement('h3');
    sectionHeader.innerHTML = 'À Distância';
    blocks.push(sectionHeader);

    attacks.filter(elem => elem.range === 2).map(attack => {
        attackBlock = document.createElement('div');
        attackBlock.className = 'power-block';

        descriptionBlock = document.createElement('p');
        descriptionBlock.innerHTML = `<span class="darkred-bold">${renderAttackDefault(attack)}</span>`;
        attackBlock.appendChild(descriptionBlock);
        
        blocks.push(attackBlock);
    });

    // Percepção
    if(attacks.filter(elem => elem.range === 3).length > 0) {
        sectionHeader = document.createElement('h3');
        sectionHeader.innerHTML = 'Percepção';
        blocks.push(sectionHeader);
    
        attacks.filter(elem => elem.range === 3).map(attack => {
            attackBlock = document.createElement('div');
            attackBlock.className = 'power-block';
    
            descriptionBlock = document.createElement('p');
            descriptionBlock.innerHTML = `<span class="darkred-bold">${renderAttackDefault(attack)}</span>`;
            attackBlock.appendChild(descriptionBlock);
            
            blocks.push(attackBlock);
        });
    }

    return blocks;
}