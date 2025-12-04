import { gameState, prices } from './state.js';

export function saveGame() {
    localStorage.setItem('stalkerSave_v5', JSON.stringify({
        state: gameState,
        prices: prices
    }));
}

export function loadGame() {
    const data = JSON.parse(localStorage.getItem('stalkerSave_v5')); 
    if (data) {
        const loadedState = data.state;
        
        gameState.money = loadedState.money || 0;
        gameState.clickPower = loadedState.clickPower || 1;
        gameState.protectionBonus = loadedState.protectionBonus || 0;
        gameState.lastLogin = loadedState.lastLogin || null;
        gameState.currentArtifactId = loadedState.currentArtifactId || 'jellyfish';
        
        if (typeof loadedState.isMusicOn !== 'undefined') gameState.isMusicOn = loadedState.isMusicOn;
        if (typeof loadedState.isSoundOn !== 'undefined') gameState.isSoundOn = loadedState.isSoundOn;
        
        gameState.emissionTimeLeft = loadedState.emissionTimeLeft || 90;
        
        if (loadedState.artifactData) {
            gameState.artifactData = loadedState.artifactData;
        }

        gameState.maxLevel = loadedState.maxLevel || 10;
        
        Object.assign(prices, data.prices);
    }
    
    gameState.artifactData.forEach(d => {
        if (typeof d.isOwned === 'undefined') {
            d.isOwned = (d.id === 'jellyfish');
        }
    });
}