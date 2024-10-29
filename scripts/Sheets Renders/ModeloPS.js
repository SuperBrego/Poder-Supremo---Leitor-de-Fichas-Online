// ***************************************
// Ficha Modelo Poder Supremo
// ***************************************
/**
* Componente que renderiza a ficha de Personagem, modelo João Brasil.
* @param {{data: MnMCharacterData, gallery: string[]}} character Personagem a ser renderizado.
* @return {string} HTMLElement como string.
*/
function renderPSCharacterSheet(character) {
    let data = character.data;
    let points = data.points;
    
    let headerImage = new Image();
    headerImage.src = character.gallery[0];

    let powerList = spreadPowers(data.powers);
    let equipList = spreadEquipments(data.equipments);

    let offensiveData = data.offensive;
    let initiative = (offensiveData.initiative > 0) ? `+${offensiveData.initiative}` : `${offensiveData.initiative}`;

    let totalSpent = Number(points.abilities + points.advantages + points.skills + points.defenses + points.powers);

    let personalInfo = data.personalInfo;

}