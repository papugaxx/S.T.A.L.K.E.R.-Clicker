import { ARTIFACT_CONFIG } from './config.js';

export const gameState = {
    money: 0,
    clickPower: 1,
    protectionBonus: 0,
    lastLogin: null,
    currentArtifactId: 'jellyfish',
    isMusicOn: true,
    isSoundOn: true,
    emissionTimeLeft: 90,
    maxLevel: 10,
    artifactData: ARTIFACT_CONFIG.map(art => ({
        id: art.id,
        level: 1,
        currentClicks: 0,
        clicksForNextLevel: 100,
        isOwned: (art.id === 'jellyfish')
    }))
};

export const prices = {
    click: 250,
    protection: 100
};

export const globalTimers = {
    emission: null,
    passive: null
};