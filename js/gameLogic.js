import { gameState, prices } from './state.js';
import { ARTIFACT_CONFIG } from './config.js';
import { showNotification, updateUI } from './ui.js';
import { playSound } from './audio.js';
import { saveGame } from './storage.js';

export function getCurrentArtifactData() {
    const artConfig = ARTIFACT_CONFIG.find(art => art.id === gameState.currentArtifactId);
    const artProgress = gameState.artifactData.find(data => data.id === gameState.currentArtifactId);
    
    if (!artConfig || !artProgress) {
        return { ...ARTIFACT_CONFIG[0], ...gameState.artifactData[0] };
    }
    return { ...artConfig, ...artProgress };
}

export function buyUpgrade(type) {
    if (type === 'click') {
        if (gameState.money >= prices.click) {
            gameState.money -= prices.click;
            gameState.clickPower += 2;
            prices.click = Math.floor(prices.click * 1.5);
            showNotification("Клик усилен!", "success");
            playSound('buy');
        } else {
            showNotification("Не хватает Купонов!", "error");
        }
    } 
    else if (type === 'protection') {
        if (gameState.money >= prices.protection) {
            if (gameState.protectionBonus >= 75) { 
                showNotification("Улучшение защиты не требуется!", "warning");
                return;
            }
            gameState.money -= prices.protection;
            gameState.protectionBonus += 5;      
            prices.protection = Math.floor(prices.protection * 1.5);
            showNotification("Защита +5% к бонусу!", "success");
            playSound('buy');
        } else {
            showNotification("Не хватает Купонов!", "error");
        }
    }
    
    saveGame();
    updateUI();
}

export function buyArtifact(artifactId) {
    const artConfig = ARTIFACT_CONFIG.find(art => art.id === artifactId);
    const artProgress = gameState.artifactData.find(data => data.id === artifactId);
    
    if (!artConfig || !artProgress) return;
    
    if (artProgress.isOwned) {
        if (gameState.currentArtifactId === artifactId) {
            showNotification(`Артефакт "${artConfig.name}" уже экипирован.`, "warning");
            return;
        }
        
        gameState.currentArtifactId = artifactId; 
        document.getElementById('main-artifact').src = artConfig.img;
        showNotification(`Артефакт "${artConfig.name}" экипирован!`, "success");
        
        saveGame();
        updateUI();
        return; 
    }
    
    if (artifactId !== 'jellyfish') {
        const jellyfishProgress = gameState.artifactData.find(d => d.id === 'jellyfish');
        if (jellyfishProgress.level < gameState.maxLevel) {
            showNotification(`Артефакт нестабилен. Нужна Медуза ${gameState.maxLevel} ур.!`, "error");
            return;
        }
    }

    if (gameState.money >= artConfig.price) {
        gameState.money -= artConfig.price; 
        artProgress.isOwned = true; 
        
        gameState.currentArtifactId = artConfig.id; 
        document.getElementById('main-artifact').src = artConfig.img;
        
        showNotification(`Новый артефакт "${artConfig.name}" куплен!`, "success");
        playSound('buy');
        
    } else {
        showNotification("Не хватает Купонов на контейнер!", "error");
    }
    
    saveGame();
    updateUI();
}

export function levelUp(artProgress) {
    if(artProgress.level < gameState.maxLevel) {
        artProgress.level++;
        artProgress.currentClicks = 0;
        artProgress.clicksForNextLevel = Math.floor(artProgress.clicksForNextLevel * 1.5);
        showNotification(`Уровень ${artProgress.level} получен!`, "success");
    }
}

export function checkDailyBonus() {
    const today = new Date().toDateString(); 
    
    if (gameState.lastLogin !== today) {
        const modal = document.getElementById('daily-bonus');
        if(modal) {
            modal.classList.remove('hidden'); 
            
            const btn = modal.querySelector('.btn-claim');
            if(btn) {
                btn.onclick = () => {
                    playSound('bonus');
                    gameState.money += 500;
                    gameState.lastLogin = today;
                    modal.classList.add('hidden');
                    showNotification("Получен бонус: 500 KPN", "success");
                    saveGame();
                    updateUI();
                };
            }
        }
    }
}
