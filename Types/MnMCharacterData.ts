// Esse arquivo existe apenas para referência.

type MnMCharacterData = {
    name: string,
    playerName: string,
    parentCharacter?: string,
    powerLevel: number,

    characterType: number,

    abilities: AbilityData[];
    defenses: DefenseData[];
    skills: SkillData[];
    advantages: FeatData[];
    powers: PowerData[];
    equipments: EquipmentData[];
    offensive: OffensiveData,

    points: {
        abilities: number;
        defenses: number;
        skills: number;
        advantages: number;
        powers: number;
        equipment: number;
    }

    otherTraits: CharacterOtherTraits,
    complications: Complication[],
    personalInfo: PersonalInfo;
    errors: TraitError[],
    journals: Journal[],
}

type OffensiveData = {
    initiative: number;
    closeBonus: number;
    rangedBonus: number;
    attacks: AttackData[];
}

type CharacterOtherTraits = {
    languages: string;
    liftingCap: string;
    size: string;
    groundSpeed: string;
    flightSpeed: string;
}

type AbilityData = {
    id: number;
    name: string;
    rank: number;
    abrev: string;
    isNull: boolean;
    enhanced: number;
    total: (number | string);
}

type DefenseData = {
    id: number,
    name: string;
    total: number;
    totalText: string;
}

type SkillData = {
    id: number;
    name: string;
    rank: (number|string);
    abiValues: string;
    otherValues: string;
    total: (number|string);
}

type FeatData = {
    id: string;
    name: string;
    rank: number;
    trait: string;
}

type PowerData = {
    id: number;
    name: string;
    effect: string;
    effectID: number;

    rank: number;
    showRank: boolean;
    
    resistedBy: string;
    affectedTrait: string;
    
    action: string;
    range: string;
    duration: string;
    flats: ModifierData[];
    extras: ModifierData[];
    flaws: ModifierData[];
    removable: number;
    
    isAlternateEffect: boolean;
    isDynamicEffect: boolean;
    descriptors: string[];

    description: string;
    powerBenefits: string;
    
    enhancedAdvantages: FeatData[];
    alternativeEffects: PowerData[];
    extraEfforts: PowerData[];
    
    totalSpent: number;
    
    powerOptions?: PowerOptionData[];
    
    // Dano
    strengthRanks?: number;
    strengthBased?: boolean;
    
    // Aflição
    overcomedBy?: string;
    firstDegree?: string;
    secondDegree?: string;
    thirdDegree?: string;
    variableDegree?: number;
    limitedDegree?: number;

    // Arranjo
    biggest?: string;
    
    // Características Aumentadas
    enhancedTraits?: EnhancedTraitData[];
    
    // Múltiplos Poderes & Variável / Ativação
    powers?: PowerData[];
    activationNumber?: number;

}

type PowerOptionData = {
    id: string;
    name: string;
    rank: number;
    isRanked: boolean;
    hasTrait: boolean;
    traitText: string;
    benefits: string;
}

type ModifierData = {
    id: string;
    name: string;
    rank: number;
    extra: boolean;
    isRanked: boolean;
    hasTrait: boolean;
    traitText: string;
    parcial: number;
}

type EnhancedTraitData = {
    id: number;
    trait: string;
    rank: number;
}

type EquipmentData = {
    id: string;
    name: string;
    // NORMAL | PODER | VEÍCULO | QUARTEL-GENERAL | MÚLTIPLOS | ARRANJO
    // NE | PE | V | QG | ME | AE
    equipType: string; 
    totalPoints: number;
    
    powerEquipData?: PowerData;

    size?: string;
    strength?: number;
    toughness?: number;
    defense?: number;

    powers?: PowerData[];
    features?: FeatData[];
    rooms?: FeatData[];

    // Para Múltiplos e Arranjo
    equipList?: EquipmentData[];
}

type AttackData = {
    id: number;
    name: string;
    effect: string;
    parentName: string;
    hitBonus: number;
    crit: number;
    cd: number;
    resistedBy: string;
    overcomedBy?: string;
    range: number; // 1- Close, 2- Ranged, 3- Perception
    isArea: boolean;
    isFullArea: boolean;
    areaRanks: number;
    isEquip: boolean;
    firstDegree?: string;
    secondDegree?: string;
    thirdDegree?: string;
    areaDescription?: string;
}

type PersonalInfo = {
    heroicName: string,
    realName: string,
    gender: string,
    age: number,
    height: number,
    weight: number,
    hair: string,
    eyes: string,
    story: string,
    customInfoCC: number,
}

type Complication = {
    id: number,
    title: string,
    description: string,
}


type Journal = {
    id: number;
    active: boolean;
    date: string;
    powerLevel: number;
    powerPoints: number;
    title: string;
    description: string;
}

type TraitError = {
    errorCode: number,
    traitID: number,
    description: string,
}