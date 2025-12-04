import { gameState, globalTimers } from './state.js';
import { updateUI, showNotification } from './ui.js';
import { saveGame } from './storage.js';
import { getCurrentArtifactData } from './gameLogic.js';

export function startEmissionTimer() {
    if (globalTimers.emission) {
        clearInterval(globalTimers.emission);
    }

    globalTimers.emission = setInterval(() => {
        gameState.emissionTimeLeft--;

        updateEmissionDisplay();

        if (gameState.emissionTimeLeft <= 0) {
            clearInterval(globalTimers.emission);
            triggerEmission();
        }
    }, 1000);

    updateEmissionDisplay();
}

function updateEmissionDisplay() {
    const minutes = Math.floor(gameState.emissionTimeLeft / 60);
    const seconds = gameState.emissionTimeLeft % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    const timerElement = document.getElementById('emission-timer');
    if (timerElement) {
        timerElement.textContent = timeString;
    }
}

export function startPassiveEffects() {
    if (globalTimers.passive) {
        clearInterval(globalTimers.passive);
    }

    globalTimers.passive = setInterval(() => {
        const currentArt = getCurrentArtifactData();
        
        let debuff = 0;
        if (currentArt && currentArt.debuff !== undefined) {
            debuff = currentArt.debuff;
        }
        
        gameState.money -= debuff;
        
        if (gameState.money < 0) {
            gameState.money = 0;
        }
        
        updateUI();
        
        saveGame();
    }, 1000);
}

export function triggerEmission() {
    
    const currentArt = getCurrentArtifactData();
    
    let artProtection = 0;
    if (currentArt && currentArt.protection !== undefined) {
        artProtection = currentArt.protection;
    }

    const totalProtection = Math.min(100, artProtection + gameState.protectionBonus);
    
    const damagePercent = (100 - totalProtection) / 100;
    
    const moneyLost = Math.floor(gameState.money * damagePercent);
    gameState.money -= moneyLost;
    
    if (moneyLost > 0) {
        showNotification(`Выброс! Потеряно ${moneyLost} KPN (${100 - totalProtection}% урона)`, 'warning');
    } else {
        showNotification('Выброс! Вы полностью защищены!', 'success');
    }
    
    gameState.emissionTimeLeft = 90;
    startEmissionTimer();
    
    saveGame();
    updateUI();
}