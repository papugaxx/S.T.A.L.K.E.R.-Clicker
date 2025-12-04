import { gameState, prices } from './state.js';
import { ARTIFACT_CONFIG } from './config.js';
import { getCurrentArtifactData } from './gameLogic.js';

export function updateUI() {
    const currentArt = getCurrentArtifactData();
    
    const moneyCounter = document.getElementById('money-counter');
    if(moneyCounter) moneyCounter.innerText = Math.floor(gameState.money);
    
    const totalProtection = Math.min(100, currentArt.protection + gameState.protectionBonus);
    const protDisplay = document.getElementById('protection-display');
    if(protDisplay) protDisplay.innerText = `${totalProtection}%`;
    
    const nameEl = document.getElementById('art-name');
    if(nameEl) nameEl.innerText = currentArt.name;

    const levelEl = document.getElementById('art-level');
    if(levelEl) levelEl.innerText = currentArt.level;

    const debuffEl = document.getElementById('debuff-display');
    if(debuffEl) debuffEl.innerText = `-${currentArt.debuff.toFixed(2)} KPN/сек`; 
    
    const priceClick = document.getElementById('price-click');
    if(priceClick) priceClick.innerText = prices.click + " KPN";
    
    const priceProt = document.getElementById('price-protection');
    if(priceProt) priceProt.innerText = prices.protection + " KPN";

    const fill = document.querySelector('.progress-bar-fill');
    if(fill) {
        const currentArtProgress = gameState.artifactData.find(data => data.id === gameState.currentArtifactId);
        let percent = (currentArtProgress.currentClicks / currentArtProgress.clicksForNextLevel) * 100;
        fill.style.width = percent + "%";
    }

    const jellyItem = document.getElementById('jellyfish-item');
    if(jellyItem) {
        jellyItem.classList.toggle('owned', gameState.currentArtifactId === 'jellyfish');
        const status = jellyItem.querySelector('.status');
        if(status) status.innerText = gameState.currentArtifactId === 'jellyfish' ? 'ИСПОЛЬЗУЕТСЯ' : 'В СУМКЕ';
    }

    const stoneflowerItem = document.getElementById('stoneflower-item');
    const stoneflowerProgress = gameState.artifactData.find(d => d.id === 'stoneflower');

    if (stoneflowerItem && stoneflowerProgress) {
        if (stoneflowerProgress.isOwned) {
            stoneflowerItem.classList.remove('locked');
            stoneflowerItem.classList.toggle('owned', gameState.currentArtifactId === 'stoneflower');
            
            const lock = stoneflowerItem.querySelector('.lock-overlay');
            if(lock) lock.style.display = 'none';

            const priceLabel = document.getElementById('stoneflower-price-label');
            if(priceLabel) {
                priceLabel.innerText = gameState.currentArtifactId === 'stoneflower' ? 'ИСПОЛЬЗУЕТСЯ' : 'В СУМКЕ';
                priceLabel.classList.add('status'); 
                priceLabel.style.color = '#4caf50'; 
            }
            
            const priceVal = document.getElementById('price-stoneflower');
            if(priceVal) priceVal.innerText = '';

        } else {
            stoneflowerItem.classList.add('locked');
            
            const stoneConfig = ARTIFACT_CONFIG.find(a => a.id === 'stoneflower');
            const priceVal = document.getElementById('price-stoneflower');
            if(priceVal && stoneConfig) priceVal.innerText = stoneConfig.price + " KPN";
        }
    }
}

export function showNotification(text, type) {
    const note = document.createElement('div');
    note.innerText = text;
    note.style.position = 'fixed';
    note.style.top = '20px';
    note.style.left = '50%';
    note.style.transform = 'translateX(-50%)';
    note.style.padding = '10px 20px';
    note.style.background = type === 'error' ? 'rgba(200,0,0,0.8)' : type === 'warning' ? 'rgba(255,165,0,0.8)' : 'rgba(0,100,0,0.8)';
    note.style.color = '#fff';
    note.style.borderRadius = '5px';
    note.style.zIndex = '10000';
    note.style.fontFamily = 'Share Tech Mono';
    
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 3000);
}

export function hideLoader() {
    const loader = document.getElementById('loader');
    if(loader) loader.style.display = 'none';
}

export function createFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.innerText = text;
    el.style.position = 'fixed';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.color = '#39ff14';
    el.style.pointerEvents = 'none';
    el.style.fontSize = '1.2rem';
    el.style.zIndex = '1000';
    el.style.transition = 'all 1s';
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.transform = 'translateY(-50px)';
        el.style.opacity = '0';
    }, 10);
    setTimeout(() => el.remove(), 1000);
}

export function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if(cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
    }
}