var currentPortfolio = {};
const _MultiplePowersList = [5043, 5045, 5046, 5048];

function getPortData(portfolio) {
    let portData = [];

    for(let character of portfolio.characters) {
        portData = portData.concat(getCharactersData(character));
    }

    return portData;
}

/**
 * Pega informações dos personagens.
 * @param {Character} character Personagem que contém 
 * @returns {data: MnMCharacterData, gallery: string[]}
 */
function getCharactersData(character) {
    let characterData = {data: character.exportData, gallery: character.gallery};

    let minionsData = [];
    let sidekicksData = [];
    let summonsData = [];
    let metamorphsData = [];
    let minions = getAllMinionsSidekicks(character, true);
    let sidekicks = getAllMinionsSidekicks(character, false);
    let summons = findSummons(character);
    let metamorphs = findMetamorphs(character);
    
    for(let minion of minions)      minionsData.push({data: minion.exportData, gallery: minion.gallery});
    for(let sidekick of sidekicks)  sidekicksData.push({data: sidekick.exportData, gallery: sidekick.gallery});
    for(let summon of summons)      summonsData.push({data: summon.exportData, gallery: summon.gallery});
    for(let metamorph of metamorphs) metamorphsData.push({data: metamorph.exportData, gallery: metamorph.gallery});

    return [characterData].concat(minionsData, sidekicksData, summonsData, metamorphsData);
}

/**
 * Busca e retorna todos personagens Capangas e Parceiros que um personagem possui.
 * @param {Character} character Personagem a buscar os Capangas e Parceiros.
 * @param {boolean} isMinion Se o personagem é Capanga ou Parceiro.
 * @returns {Character[]}
 */
function getAllMinionsSidekicks(character, isMinion) {
    let advantageChars = getMinionSidekicks(character.advantages, isMinion);
    let enhancedAdvs = findEnhancedAdvantage((isMinion) ? 4037 : 4074, character.powers);
    let enhancedChars = getMinionSidekicks(enhancedAdvs, isMinion);
    return (advantageChars.concat(enhancedChars));
}

/**
 * Retorna uma lista de personagens que estão nas vantagens de Capanga ou Parceiro.
 * @param {Advantage[]} advantages Vantagens do Personagem
 * @param {boolean} isMinion Se o personagem é Capanga ou Parceiro
 * @returns {Character[]}
 */
function getMinionSidekicks(advantages, isMinion) {
    let characters = [];

    for(let advantage of advantages) {
        // Capanga
        if(advantage.id === 4037 && isMinion)  characters.push(advantage.character);
        // Parceiro
        if(advantage.id === 4074 && !isMinion) characters.push(advantage.character);
    }
    return characters;
}

/**
 * Busca uma determinada Vantagem que esteja Aumentada.
 * @param {number} advID ID da Vantagem.
 * @param {Power[]} powers Lista de Poderes.
 * @returns {Advantage[]} Lista da Vantagem Aumentada, se houver.
 */
function findEnhancedAdvantage(advID, powers) {
    let advList = findEnhancedAdvantages(powers).filter(elem => elem.id === advID);
    return advList;
}

/**
 * Busca todas as Vantagens Aumentadas.
 * @param {Power[]} powers Lista de Poderes.
 * @returns {Advantage[]} Lista de Vantagens.
 */
function findEnhancedAdvantages(powers) {
    let advantageList = [];

    let effectID;
    
    for(let power of powers) {
        if(!power.isActive) continue;

        for(let advantage of power.enhancedAdvantages) advantageList.push(advantage);

        effectID = Number(power.effectID);

        // Arranjo
        if(effectID === 5042) advantageList = advantageList.concat(findEnhancedAdvantages(power.alternateEffects));
        
        // Múltiplos Efeitos
        if(_MultiplePowersList.includes(effectID)) advantageList = advantageList.concat(findEnhancedAdvantages(power.powers));

        // Variável
        if(effectID === 5038) advantageList = advantageList.concat(findEnhancedAdvantages(power.powers));
    }

    return advantageList;
}

/**
 * Encontra todas Invocações de um determinado Personagem;
 * @param {Character} character Personagem a ser conferido.
 * @returns {Character[]} Lista de Invocações.
 */
function findSummons(character) {
    let summonList = [];
    let summonPowers = findPowersByEffect(5022, character.powers, false);
    for(let sumPower of summonPowers) summonList = summonList.concat([...sumPower.summons]);
    return summonList;
}

/**
 * Busca todos personagens de Metamorfose em um Personagem específico.
 * @param {Character} character Personagem a ser conferido.
 * @returns {Character[]} Lista de Metamorfos.
 */
function findMetamorphs(character) {
    let metamorphList = [];
    let morphs = findPowersByEffect(5025, character.powers, false);
    for(let morph of morphs) metamorphList = metamorphList.concat(morph.characters);
    return metamorphList;
}

/**
 * Encontra todos Poderes de um determinado Efeito.
 * @param {number} effectID ID do Efeit.
 * @param {Power[]} powers Poderes a ser consultados.
 * @returns {Power[]} Lista de Poderes do efeito.
 */
function findPowersByEffect(effectID, powers, isTest = true) {
    let powerList = [];

    for(let power of powers){
        if(isTest && !power.isActive) continue;

        // É o efeito que busco.
        if(power.effectID === effectID) powerList.push(power); 

        // Se são Dispositivos, Múltiplos Efeitos e Efeitos Ligados
        if(_MultiplePowersList.includes(power.effectID)) {
            powerList = powerList.concat(findPowersByEffect(effectID, power.powers, isTest));
        }
        // Se é Variável
        if(effectID === 5038) {
            powerList = powerList.concat(findPowersByEffect(effectID, power.powers, isTest));
        }
        
        powerList = powerList.concat(findPowersByEffect(effectID, power.alternateEffects, isTest));
    }

    return powerList;
}