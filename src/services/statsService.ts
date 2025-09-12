import { GameStats } from '../types.ts';
import { MAX_GUESSES } from '../../constants.ts';

const STATS_KEY = 'islamicWordleStats';

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
 * Loads the user's game statistics from localStorage.
 * If no stats are found, it returns a default stats object.
 */
export const loadStats = (): GameStats => {
  try {
    const statsJson = localStorage.getItem(STATS_KEY);
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
 * Saves the user's game statistics to localStorage.
 * @param stats The stats object to save.
 */
export const saveStats = (stats: GameStats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save stats:", error);
  }
};

/**
 * Updates the user's statistics after a daily challenge game is completed.
 * @param isWin Whether the user won the game.
 * @param guessCount The number of guesses it took to win.
 * @returns The updated stats object.
 */
export const updateStats = (isWin: boolean, guessCount: number): GameStats => {
    const stats = loadStats();

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
    
    saveStats(stats);
    return stats;
};