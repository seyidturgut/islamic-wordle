import { tr_words } from '../seed/tr_extended.ts';
import { en_words } from '../seed/en_extended.ts';
import { ar_words } from '../seed/ar_extended.ts';
import { tr_core } from '../seed/tr_core.ts';
import { AppSettings } from '../types.ts';

const getRandomWord = (wordLength: number, language: AppSettings['language']): string => {
    const wordList = language === 'en' ? en_words : language === 'ar' ? ar_words : tr_words;
    const wordPool = wordList.filter(w => w.length === wordLength);
    if (wordPool.length === 0) {
        // Ultimate failsafe if no words of the required length exist
        const defaultPool = tr_core.filter(w => w.length === 5);
        if (defaultPool.length > 0) {
          return defaultPool[Math.floor(Math.random() * defaultPool.length)];
        }
        // Hardcoded failsafe
        return language === 'en' ? "ALLAH" : "NAMAZ";
    }
    return wordPool[Math.floor(Math.random() * wordPool.length)];
}

export const fetchWordForGame = (wordLength: number, language: AppSettings['language']): string => {
    // AI feature has been removed. Words are now fetched from a local, offline list.
    return getRandomWord(wordLength, language);
};