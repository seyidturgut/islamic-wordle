import { GameStats } from '../types.ts';
import { MAX_GUESSES } from '../../constants.ts';

const STATS_KEY = 'islamicWordleStats';

const getDefaultStats = (): GameStats => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {
      ...Array.from({length: MAX_GUESSES}, (_, i) => i + 1).reduce((acc, val) => ({...acc, [val]: 0}), {})
  },
});


export const loadStats = (): GameStats => {
  try {
    const statsJson = localStorage.getItem(STATS_KEY);
    const savedStats = statsJson ? JSON.parse(statsJson) : getDefaultStats();
    // Ensure guessDistribution is fully populated
    const defaultDist = getDefaultStats().guessDistribution;
    savedStats.guessDistribution = { ...defaultDist, ...savedStats.guessDistribution };
    return savedStats;
  } catch (error) {
    console.error("Failed to load stats:", error);
    return getDefaultStats();
  }
};

export const saveStats = (stats: GameStats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save stats:", error);
  }
};

export const updateStats = (isWin: boolean, guessCount: number): GameStats => {
    const stats = loadStats();
    stats.gamesPlayed += 1;
    if(isWin) {
        stats.gamesWon += 1;
        stats.currentStreak += 1;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        if (stats.guessDistribution[guessCount]) {
            stats.guessDistribution[guessCount]++;
        } else {
            stats.guessDistribution[guessCount] = 1;
        }
    } else {
        stats.currentStreak = 0;
    }
    saveStats(stats);
    return stats;
};