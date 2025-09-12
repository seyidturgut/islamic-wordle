import { GameStats, AppSettings } from '../types.ts';
import { MAX_GUESSES } from '../../constants.ts';

const getStatsKey = (language: AppSettings['language']) => `islamicWordleStats_${language}`;

/**
 * Provides a default, empty stats object.
 */
const getDefaultStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {
      ...Array.from({length: MAX_GUESSES}, (_, i) => i + 1).reduce((acc, val) => ({...acc, [val]: 0}), {})
  },
});

/**
 * Loads the user's game statistics from localStorage for a specific language.
 * If no stats are found, it returns a default stats object.
 */
export const loadStats = (language: AppSettings['language']): GameStats => {
  try {
    const statsJson = localStorage.getItem(getStatsKey(language));
    const savedStats = statsJson ? JSON.parse(statsJson) : getDefaultStats();
    // Ensure guessDistribution is fully populated for compatibility with older versions.
    const defaultDist = getDefaultStats().guessDistribution;
    savedStats.guessDistribution = { ...defaultDist, ...savedStats.guessDistribution };
    return savedStats;
  } catch (error) {
    console.error("Failed to load stats:", error);
    return getDefaultStats();
  }
};

/**
 * Saves the user's game statistics to localStorage for a specific language.
 * @param stats The stats object to save.
 * @param language The language for which to save the stats.
 */
export const saveStats = (stats: GameStats, language: AppSettings['language']) => {
  try {
    localStorage.setItem(getStatsKey(language), JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save stats:", error);
  }
};

/**
 * Updates the user's statistics after a daily challenge game is completed for a specific language.
 * @param isWin Whether the user won the game.
 * @param guessCount The number of guesses it took to win.
 * @param language The language of the completed game.
 * @returns The updated stats object.
 */
export const updateStats = (isWin: boolean, guessCount: number, language: AppSettings['language']): GameStats => {
    const stats = loadStats(language);

    // Statistics are only tracked for the daily challenge mode.
    stats.gamesPlayed += 1;

    if (isWin) {
        stats.gamesWon += 1;
        stats.currentStreak += 1;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        // The key is guaranteed to exist by loadStats, so we can safely increment.
        stats.guessDistribution[guessCount]++;
    } else {
        // If the game is lost, reset the current streak.
        stats.currentStreak = 0;
    }
    
    saveStats(stats, language);
    return stats;
};