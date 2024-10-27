/**
* Componente de Card de personagem.
* @param {Character} character Personagem do Portfólio.
* @param {number} index Index da ficha de personagem. Usado para calcular o tempo da animação de fadeIn
* @returns {HTMLElement}
*/
const CharacterChard = (character, index) => {
    let image = (character.gallery[0].length > 0) ? character.gallery[0] : '../images/placeholder-char-img.jpg';
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
    <div class="card character-card" style="animation: fadeInAnimation ${(index + .25)}s linear forwards;">
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
 * Componente de Card do modelo.
 * @param {any} templateInfo Informações do template
 * @returns {string} Elemento HTML Card como String
*/
function TemplateCard(templateInfo) {
    let templateCard = document.createElement('div');

    templateCard.innerHTML = `
    <div class="card mb-3 template-sheet-card" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${templateInfo.img}" class="img-fluid rounded-start" alt="${templateInfo.name}">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${templateInfo.name}</h5>
                    <p class="card-text">${templateInfo.description}</p>
                    <p class="card-text"><small class="text-body-secondary"><b>Créditos:</b> ${templateInfo.credits}</small></p>
                </div>
            </div>
        </div>
    </div>
    `;

    templateCard.onclick = () => renderCharacterSheet(currentCharacter, templateInfo.index);
    return templateCard;
}

// ******************************
// Componentes para as fichas 
// ******************************
/**
* Renderiza a Vantagem do personagem, em string HTML.
* @param {FeatData} feat Vantagem a ser renderizada.
* @returns {string}
*/
function renderFeatDefault(feat) {
    let featTxt = feat.name;
    if(feat.rank > 1) featTxt += ` ${feat.rank}`;
    if(feat.trait && feat.trait.length > 1) featTxt += ` (${feat.trait})`;
    return featTxt;
}

/**
* Renderiza as informações sobre o poder do personagem, em string HTML.
* @param {PowerData} power Poder a ser explorado as características.
* @returns {string}
*/
function renderPowerDefault(power) {
    
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
    if(hasFlats) details.push(`<b>Fixos:</b> ${power.flats.map((elem) => renderModifierDefault(elem, true)).join(', ')}`);
    
    // Modificadores Extras
    if(hasExtras) details.push(`<b>Extras:</b> ${power.extras.map((elem) => renderModifierDefault(elem, false)).join(', ')}`);
    
    // Modificadores Falhas
    if(hasFlaws) details.push(`<b>Falhas:</b> ${power.flaws.map((elem) => renderModifierDefault(elem, false)).join(', ')}`);
    
    // <PSSModifierRender modifier={elem} isExtra={elem.extra} isFlat={true} />
    
    // Modificações
    if(hasEnhancements) {
        details.push(`<b>Modificações</b>: ${power.enhancedTraits.map((elem) => `${elem.trait} ${elem.rank}`)}`);
    }
    
    if(hasEnhancedAdvantages) {
        details.push(`<b>Vantagens</b>: ${power.enhancedAdvantages.map((elem) => renderFeatDefault(elem)).join(', ')}`);
    }
    
    // Descritores
    if(hasDescriptors) details.push(`<b>Descritores</b>: ${power.descriptors.map((elem) => `${elem}`).join(', ')}`);
    
    return `
        ${power.effect} ${power.strengthBased ? ' baseado em Força' : ''} ${power.showRank ? `${power.rank}` : ''} 
        ${details.length > 0 ? `(${details.map(elem => `${elem}`).join('. ')})` : ''} 
        • <b>${power.totalSpent} pontos</b>
    `;
}

/**
* Renderiza Modificador de Poder, em string HTML.
* @param {ModifierData} modifier Modificador a ser renderizado.
* @param {boolean} isFlat Se o Modificador é Fixo ou Extra/Falha por Graduação.
* @returns {string}
*/
function renderModifierDefault(modifier, isFlat) {
    return `
        ${modifier.name} ${(modifier.extra) ? `+${modifier.rank}` : `-${modifier.rank}`}${!(isFlat) ? `/grad` : '/fixo'}
        ${modifier.hasTrait ? `[${modifier.traitText}]` : ''}
    `;
}

/**
 * Renderiza Equipamento, em string HTML.
 * @param {EquipmentData} equipment Equipamento a ser renderizado.
 * @returns {string}
*/
function renderEquipmentDefault(equipment) {
    // Se cai nessa condição, foi durante o Spread, pegamos um poder no meio da lista.
    // Removi o spread de poderes.
    // if(equipment.equipType === undefined) return renderPowerDefault(equipment);

    let isVehicle = equipment.equipType.startsWith('V');
    let isHeadquarters = equipment.equipType.startsWith('Q');
    let isMultipleEquip = equipment.equipType.startsWith('M');
    let isEquipArray = equipment.equipType.startsWith('A');
    let isPowerEquip = equipment.equipType.startsWith('P');

    let isStructure = isVehicle || isHeadquarters || isMultipleEquip || isEquipArray;

    let output = '';

    if(isPowerEquip) return `<b>${equipment.name}</b>: ${renderPowerDefault(equipment.powerEquipData)}`;

    output += `<b>${equipment.name}</b> ${isStructure ? `(${equipment.equipType})` : ''} • <b>${equipment.totalPoints} pontos</b>`;
    if(isVehicle || isHeadquarters) {
        output += `
        ${isVehicle 
            ? `<div class="container">
                    <div class="row">
                        <div class="col"><b>Tamanho:</b> ${equipment.size}</div> 
                        <div class="col"><b>Resistência:</b> ${equipment.toughness} </div>
                    </div>
                    <div class="row">
                        <div class="col"><b>Força:</b> ${equipment.strength}</div>
                        <div class="col"><b>Defesa:</b> ${equipment.defense}</div>
                    </div>
                </div>` 
            : `<p><b>Tamanho:</b> ${equipment.size} • <b>Resistência:</b> ${equipment.toughness}</p>`}
        ${(equipment.features && equipment.features.length > 0) 
            ? `<p><b>Características:</b> ${equipment.features.map(elem => `${renderFeatDefault(elem)}`).join(', ')}` : ''}
        ${(equipment.rooms && equipment.rooms.length > 0) 
            ? `<p><b>Cômodos:</b> ${equipment.rooms.map(elem => `${renderFeatDefault(elem)}`).join(', ')}` : ''}
        ${(equipment.powers && equipment.powers.length > 0) 
            ? ` <p><b>Poderes:</b> ${equipment.powers.map(elem => `
                    ${renderPowerDefault(elem).replace(/\d+\spontos/g, "").replace(" • ", "")}
                `).join(', ')}` 
            : ''}
        `;
    }
    else if((isMultipleEquip || isEquipArray) && (equipment.equipList && equipment.equipList.length > 0)) {

    }

    return output;
}

/**
 * Renderiza, em string HTML, o ataque do personagem.
 * @param {AttackData} attack Ataque a ser renderizado
 * @returns {string}
*/
function renderAttackDefault(attack) {
    let hitDisplay = (attack.hitBonus >= 0) ? `+${attack.hitBonus}` : `${attack.hitBonus}`;
    let critDisplay = (attack.crit === 20) ? 'Crit 20' : `Crit ${attack.crit}-20`;

    let hasFirstDegree = !!(attack.firstDegree && attack.firstDegree.length > 0);
    let hasSecondDegree = !!(attack.secondDegree && attack.secondDegree.length > 0);
    let hasThirdDegree = !!(attack.thirdDegree && attack.thirdDegree.length > 0);
    let hasConditions = hasFirstDegree || hasSecondDegree || hasThirdDegree;
    
    let conditions = [];
    if(hasFirstDegree)  conditions.push(`<b>1º Grau</b>: ${attack.firstDegree}`);
    if(hasSecondDegree) conditions.push(`<b>2º Grau</b>: ${attack.secondDegree}`);
    if(hasThirdDegree)  conditions.push(`<b>3º Grau</b>: ${attack.thirdDegree}`);
    
    let output = '';

    output += `<b>${attack.parentName.length > 0 ? `${attack.parentName} | ` : ''}${attack.name}:</b> ${attack.effect}`;

    // Não é área completa e não é Percepção.
    if(!attack.isFullArea && attack.range < 3) output += `, Bônus Acerto ${hitDisplay}, ${critDisplay}`

    // Se tem algo a ser Resistido
    if(attack.resistedBy.length > 0 && attack.resistedBy !== 'Nenhum') output += ` • CD ${attack.cd} vs. ${attack.resistedBy}`;

    // Se contém Superado por...
    if((attack.overcomedBy && attack.overcomedBy.length > 0)) output += `, Superador por ${attack.overcomedBy}`;

    // Se é Área
    if(attack.isArea) output += `, CD ${Number(10 + attack.areaRanks)} vs Esquiva para metade do efeito (Área ${attack.areaDescription})`;

    // Se tem Condições
    if(hasConditions) output += `. (${conditions.map(elem => `${elem}`).join(', ')})`;

    return output;
}