
import { DailyChallengeState, GameState, Guess } from '../types';
import { tr_words } from '../seed/tr_extended';
import { tr_core } from '../seed/tr_core';

const DAILY_CHALLENGE_KEY = 'islamicWordleDaily';

// Simple seedable PRNG to ensure the same word for everyone on a given day
const seededRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

// Gets a deterministic word for the day based on the date
export const getDailyWord = (wordLength: number): string => {
    const today = new Date();
    // Use UTC date to avoid timezone issues
    const dayIndex = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / (1000 * 60 * 60 * 24));
    
    // Ensure words are correctly filtered by the specified length from the main list
    const wordPool = tr_words.filter(w => w.length === wordLength);
    
    if (wordPool.length > 0) {
        const randomIndex = Math.floor(seededRandom(dayIndex) * wordPool.length);
        return wordPool[randomIndex].toUpperCase();
    }
    
    // Failsafe mechanism: If no words of the specified length are found in the main list,
    // try to find one in the core list. This ensures the game doesn't break
    // if a rare word length is selected for the daily challenge.
    console.warn(`No daily word of length ${wordLength} found in main list. Trying core list as a failsafe.`);
    const coreWordPool = tr_core.filter(w => w.length === wordLength);

    if (coreWordPool.length > 0) {
        const randomIndex = Math.floor(seededRandom(dayIndex) * coreWordPool.length);
        return coreWordPool[randomIndex].toUpperCase();
    }

    // Ultimate failsafe: If no words of the required length exist in any list,
    // return a hardcoded failsafe word. This might cause a length mismatch but prevents a crash.
    console.error(`Ultimate Failsafe: No words of length ${wordLength} found. Returning default word.`);
    return "NAMAZ";
};

const getTodayString = (): string => {
    const today = new Date();
    // Use a consistent format YYYY-MM-DD
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

export const loadDailyChallengeState = (): DailyChallengeState | null => {
    try {
        const stateJSON = localStorage.getItem(DAILY_CHALLENGE_KEY);
        if (stateJSON) {
            const state: DailyChallengeState = JSON.parse(stateJSON);
            // If the saved state is not for today, ignore it
            if (state.date === getTodayString()) {
                return state;
            }
        }
        return null;
    } catch (error) {
        console.error("Failed to load daily challenge state:", error);
        return null;
    }
};

export const saveDailyChallengeState = (solution: string, guesses: Guess[], gameState: GameState) => {
    try {
        const state: DailyChallengeState = {
            solution,
            guesses,
            gameState,
            date: getTodayString(),
        };
        localStorage.setItem(DAILY_CHALLENGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save daily challenge state:", error);
    }
};