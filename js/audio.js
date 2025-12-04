import { gameState } from './state.js';
import { saveGame } from './storage.js';

let ambientMusic, clickSound, buySound, dailyBonusSound;

export function initAudio() {
    ambientMusic = document.getElementById('audio-ambient');
    clickSound = document.getElementById('audio-click');
    buySound = document.getElementById('audio-buy');
    dailyBonusSound = document.getElementById('audio-daily-bonus');
    
    if (ambientMusic) ambientMusic.volume = 0.4;
    if (clickSound) clickSound.volume = 0.7;
    if (buySound) buySound.volume = 0.8;
    if (dailyBonusSound) dailyBonusSound.volume = 1.0;
}

export function setupAudioControls() {
    const musicBtn = document.getElementById("btn-music");
    const soundBtn = document.getElementById("btn-sound");

    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            gameState.isMusicOn = !gameState.isMusicOn; 
            
            saveGame();
            startMusic(); 
            updateButtons(musicBtn, soundBtn); 
        });
    }

    if (soundBtn) {
        soundBtn.addEventListener("click", () => {
            gameState.isSoundOn = !gameState.isSoundOn;
            
            saveGame();
            updateButtons(musicBtn, soundBtn);
        });
    }

    updateButtons(musicBtn, soundBtn);
}

function updateButtons(musicBtn, soundBtn) {
    if (musicBtn) {
        musicBtn.innerText = gameState.isMusicOn ? '♪' : '♩';
    }
    if (soundBtn) {
        soundBtn.innerText = gameState.isSoundOn ? '🔊' : '🔇';
    }
}

export function playSound(type) {
    if (!gameState.isSoundOn) return; 

    let soundToPlay;
    switch (type) {
        case "click": soundToPlay = clickSound; break;
        case "buy": soundToPlay = buySound; break;
        case "bonus": soundToPlay = dailyBonusSound; break;
    }

    if (soundToPlay) {
        const clone = soundToPlay.cloneNode();
        clone.volume = soundToPlay.volume;
        clone.play().catch(e => console.error("Sound play error:", e));
    }
}

export function startMusic() {
    if (!ambientMusic) return;

    if (gameState.isMusicOn) { 
        ambientMusic.loop = true;
        ambientMusic.play().catch(() => {});
    } else {
        ambientMusic.pause();
    }
}