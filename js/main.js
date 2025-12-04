import { loadGame, saveGame } from './storage.js';
import { initCustomCursor, hideLoader, updateUI, createFloatingText } from './ui.js';
import { initAudio, setupAudioControls, playSound, startMusic } from './audio.js';
import { startEmissionTimer, startPassiveEffects } from './systems.js';
import { checkDailyBonus, buyUpgrade, buyArtifact, levelUp } from './gameLogic.js';
import { gameState } from './state.js';

window.buyUpgrade = buyUpgrade;
window.buyArtifact = buyArtifact;

let hasInteracted = false;

document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    initCustomCursor();
    
    initAudio(); 

    setTimeout(hideLoader, 2000);

    startEmissionTimer();
    startPassiveEffects(); 
    checkDailyBonus();

    updateUI();
    
    setupAudioControls();
    setupMainClickEvent();
});

function setupMainClickEvent() {
    const artifact = document.getElementById('main-artifact');
    if (artifact) {
        artifact.onclick = (e) => {
            
            if (!hasInteracted) {
                hasInteracted = true;
                startMusic();
            }
            
            gameState.money += gameState.clickPower;
            
            playSound('click'); 
            
            const currentArtProgress = gameState.artifactData.find(data => data.id === gameState.currentArtifactId);
            
            if (currentArtProgress) {
                currentArtProgress.currentClicks++;
                if(currentArtProgress.currentClicks >= currentArtProgress.clicksForNextLevel) {
                    levelUp(currentArtProgress);
                }
            }

            createFloatingText(e.clientX, e.clientY, `+${gameState.clickPower} KPN`);
            
            artifact.style.transform = "scale(0.95)";
            setTimeout(() => artifact.style.transform = "scale(1)", 50);

            saveGame();
            updateUI();
        };
    }
}