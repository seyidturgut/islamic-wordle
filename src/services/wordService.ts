import { tr_words } from '../seed/tr_extended.ts';
import { tr_core } from '../seed/tr_core.ts';

const getRandomWord = (wordLength: number): string => {
    const wordPool = tr_words.filter(w => w.length === wordLength);
    if (wordPool.length === 0) {
        // Ultimate failsafe if no words of the required length exist in the new list
        const defaultPool = tr_core.filter(w => w.length === 5);
        if (defaultPool.length > 0) {
          return defaultPool[Math.floor(Math.random() * defaultPool.length)];
        }
        // Hardcoded failsafe
        return "NAMAZ";
    }
    return wordPool[Math.floor(Math.random() * wordPool.length)];
}

export const fetchWordForGame = (wordLength: number): string => {
    // AI feature has been removed. Words are now fetched from a local, offline list.
    return getRandomWord(wordLength);
};