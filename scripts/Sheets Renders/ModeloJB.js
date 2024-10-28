// ***************************************
// Ficha Modelo João Brasil
// ***************************************
/**
* Componente que renderiza a ficha de Personagem, modelo João Brasil.
* @param {{data: MnMCharacterData, gallery: string[]}} character Personagem a ser renderizado.
* @return {string} HTMLElement como string.
*/
function renderJBCharacterSheet(character) {
    let characterData = character.data;
    let points = characterData.points;
    
    let headerImage = new Image();
    headerImage.src = character.gallery[0];

    let powerList = spreadPowers(characterData.powers);
    let equipList = spreadEquipments(characterData.equipments);

    let offensiveData = characterData.offensive;
    let initiative = (offensiveData.initiative > 0) ? `+${offensiveData.initiative}` : `${offensiveData.initiative}`;

    let totalSpent = Number(points.abilities + points.advantages + points.skills + points.defenses + points.powers);

    let personalInfo = characterData.personalInfo;

    let sheetOutput = `
    <link rel="stylesheet" href="styles/Sheets Styles/jb-style.css">
        <header class="text-center">
            <h2>${characterData.name}<h2>
            <img src=${headerImage.src} alt=${characterData.name} />
        </header>
        <header><h4><b>NP ${characterData.powerLevel} (${totalSpent} pontos)</b><h4></header>
            
        <header><h4><b>Habilidades</b> (${points.abilities} pontos)</h4></header> 
        <div class="grid-4x4">
            ${characterData.abilities.map(ability => `<div>
                ${ability.abrev} ${ability.isNull ? '' : `${ability.rank}`}${(ability.total !== ability.rank) ? `/${ability.total}` : ''}
            </div>`).join('')}
        </div>
        
        <header><h4><b>Perícias</b> (${points.skills} pontos - ${Number(points.skills * 2)} graduações)</h4></header> 
        <p>${renderJBSkills(characterData.skills)}.</p>
        
        <header><h4><b>Vantagens</b> (${points.advantages} pontos)</h4></header> 
        <p>${characterData.advantages.map(advantage => `${renderFeatDefault(advantage)}`).join(', ')}.</p>
        
        <header><h4><b>Poderes</b> (${points.powers} pontos)</h4></header>
        ${powerList.map(power => {
            let powerBlock = document.createElement('p');
            
            // Se for poder dentro de Múltiplos Poderes ou Poderes Alternativos...
            if(power.name.includes('>', 0)) {
                powerBlock.className += ` child-power`;
                let paddingCount = power.name.split('>').length - 1;
                powerBlock.style.paddingLeft = `${paddingCount * 1.75}rem`
            }
            
            let alternativeNameHeader = (power.isAlternateEffect) ? ((power.IsDynamicEffect) ? '• EAD: ' : '• EA: ') : '';
            let headerTxt = `${alternativeNameHeader}${power.name.replaceAll('>', '')}`;
            if(power.showRank) headerTxt += ` ${power.rank}`;
            powerBlock.innerHTML = `<b>${headerTxt}</b>: ${renderPowerDefault(power)}`;
            
            return `${powerBlock.outerHTML}`;
        }).join('')}

        <header><h4><b>Ofensiva</b></h4></header>
        <span>Iniciativa ${initiative}</span><br/>
        ${offensiveData.attacks.map(attack => `<span>${renderJBAttack(attack)}</span>`).join('<br/>')}
        
        <header><h4><b>Defesas</b> (${points.defenses})</h4></header>
        <div class='grid-2x20'>
        ${characterData.defenses.map(defense => `<div>${defense.name} ${defense.totalText}</div>`).join('')}
        </div>

        <header><h4><b>Equipamentos</b></h4></header>
        ${equipList.map(equip => `<span>${renderEquipmentDefault(equip)}</span>`).join('<br />')}
        
        
        <header><h4><b>Complicações</b></h4></header>
        ${characterData.complications.map(complication => `
            <span><b>${complication.title}</b> ${complication.description.length > 0 ? `: ${complication.description}` : ''}</span>
        `).join('<br/>')}

        <header><h4><b>Total:</b></h4></header> <span>Habilidades ${points.abilities} + Perícias ${points.skills} (${Number(points.skills * 2)} graduações) + Vantagens ${points.advantages} + Poderes ${points.powers} + Defesas ${points.defenses} = ${totalSpent} pontos</span>
        
        <header><h4><b>Dados Pessoais</b></h4></header>
        <ul>
            ${personalInfo.realName.length > 0 ? `<li><b>Nome Real:</b> ${personalInfo.realName}</li>` : ''}
            ${personalInfo.gender.length > 0 ? `<li><b>Gênero:</b> ${personalInfo.gender}</li>` : ''}
            <li><b>Idade:</b> ${personalInfo.age}</li>
            <li><b>Altura:</b> ${personalInfo.height} cm</li>
            <li><b>Peso:</b> ${personalInfo.weight} kg</li>
            ${personalInfo.hair.length > 0 ? `<li><b>Cor Cabelo:</b> ${personalInfo.hair}</li>` : ''}
            ${personalInfo.eyes.length > 0 ? `<li><b>Cor Olhos:</b> ${personalInfo.eyes}</li>` : ''}
        </ul>

        ${personalInfo.story.length > 0 
            ? `<header><h4><b>História</b></h4></header> 
            ${personalInfo.story.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}` 
            : ''
        }

        ${character.gallery.length > 1 ? `
            <header><h4><b>Galeria</b></h4></header>
            <div class='grid-2x40 w-100'>
                ${character.gallery.slice(1).map((elem, index) => `<img src='${elem}' alt='Img${index}' />`).join('')}
            </div>
            `
        : ''}

        `;

    return sheetOutput;
}

/**
 * Renderiza, como string, as Perícias do personagem. Corrige também união de perícias de Combate e Especialidade.
 * @param {SkillData[]} skills Perícias do Personagem
 * @returns {string}
*/
function renderJBSkills(skills) {
    let traitSkill = '';
    let output = [];
    let skillName;

    for(let skill of skills) {
        if(skill.name.startsWith('Combate')) {
            traitSkill = skill.name;
            continue;
        }
        else if(skill.name.startsWith('Especialidade')) {
            traitSkill = skill.name;
            continue;
        }
        if(skill.name.startsWith('•') && traitSkill.length > 0) skillName = skill.name.replaceAll('•', `${traitSkill}:`)
        else skillName = skill.name;
        output.push(`${skillName} +${skill.rank} (${skill.total > 0 ? `+${skill.total}` : `${skill.total}`})`)
    }

    return output.join(', ');
}

/**
 * Renderiza, como string, o elemento de ataque.
 * @param {AttackData} attack Ataque a ser renderizado.
 * @returns {string}
*/
function renderJBAttack(attack) {
    let bonus = (attack.hitBonus > 0) ? `+${attack.hitBonus}` : `${attack.hitBonus}`;

    let range;
    switch(attack.range) {
        default:
        case 1: range = 'Corpo-a-corpo'; break;
        case 2: range = 'À Distância'; break;
        case 3: range = 'Percepção'; break;
    }

    return `${attack.name} ${bonus} - ${range}, ${attack.effect} CD ${attack.cd}`;
}

/**
 * Informa os dados e funções para troca de cores da ficha.
 * @returns {{name: string, baseValue: string, callback: any}}
 */
function colorChangeJBSheet() {
    let baseColor = '#c04f15';

    const changeHeader = (colorStr) => {
        document.documentElement.style.setProperty('--headerFC', colorStr);
    }

    return [{ name: 'Cabeçalho', baseValue: baseColor, callback: changeHeader }];
}