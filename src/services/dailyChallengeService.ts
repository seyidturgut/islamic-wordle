

import { DailyChallengeState, GameState, Guess, AppSettings, WordWithDefinition } from '../types';
import { tr_words } from '../seed/tr_extended';
import { en_words } from '../seed/en_extended';
import { ar_words } from '../seed/ar_extended';
import { tr_core } from '../seed/tr_core';

const getDailyChallengeKey = (language: AppSettings['language']) => `islamicWordleDaily_${language}`;

// Simple seedable PRNG to ensure the same word for everyone on a given day
const seededRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Gets a deterministic word for the day based on the date
export const getDailyWord = (wordLength: number, language: AppSettings['language']): WordWithDefinition => {
    const today = new Date();
    // Use UTC date to avoid timezone issues
    const dayIndex = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / (1000 * 60 * 60 * 24));
    
    const wordList = language === 'en' ? en_words : language === 'ar' ? ar_words : tr_words;
    
    const wordPool = wordList.filter(w => w.word.length === wordLength);
    
    if (wordPool.length > 0) {
        const randomIndex = Math.floor(seededRandom(dayIndex) * wordPool.length);
        return wordPool[randomIndex];
    }
    
    console.warn(`No daily word of length ${wordLength} found in ${language} list. Trying core list as a failsafe.`);
    const coreWordPool = tr_core.filter(w => w.word.length === wordLength);

    if (coreWordPool.length > 0) {
        const randomIndex = Math.floor(seededRandom(dayIndex) * coreWordPool.length);
        return coreWordPool[randomIndex];
    }

    console.error(`Ultimate Failsafe: No words of length ${wordLength} found. Returning default word.`);
    return language === 'en' 
        ? { word: "ALLAH", definition: "The Arabic name for the one and only God in Islam." } 
        : { word: "NAMAZ", definition: "İslam'ın beş şartından biri olan, belirli hareket ve dualardan oluşan ibadet." };
};

const getTodayString = (): string => {
    const today = new Date();
    // Use a consistent format YYYY-MM-DD
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export const loadDailyChallengeState = (language: AppSettings['language']): DailyChallengeState | null => {
    try {
        const stateJSON = localStorage.getItem(getDailyChallengeKey(language));
        if (stateJSON) {
            const state: DailyChallengeState = JSON.parse(stateJSON);
            if (state.date === getTodayString()) {
                // Basic validation to ensure the loaded solution is in the new format
                if (state.solution && typeof state.solution.word === 'string') {
                    return state;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Failed to load daily challenge state:", error);
        return null;
    }
};

export const saveDailyChallengeState = (solution: WordWithDefinition, guesses: Guess[], gameState: GameState, language: AppSettings['language']) => {
    try {
        const state: DailyChallengeState = {
            solution,
            guesses,
            gameState,
            date: getTodayString(),
        };
        localStorage.setItem(getDailyChallengeKey(language), JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save daily challenge state:", error);
    }
};