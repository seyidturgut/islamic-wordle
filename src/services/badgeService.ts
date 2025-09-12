// FIX: Implemented a placeholder service to resolve module errors.
import { Badge, GameStats, Language, Guess } from '../types';

const allBadges: Badge[] = [
    {
        id: 'streak3',
        tier: 'bronze',
        nameKey: 'badge_streak3_name',
        descriptionKey: 'badge_streak3_desc',
        icon: '🥉',
        unlockFn: (stats) => stats.currentStreak >= 3,
    },
    {
        id: 'streak7',
        tier: 'silver',
        nameKey: 'badge_streak7_name',
        descriptionKey: 'badge_streak7_desc',
        icon: '🥈',
        unlockFn: (stats) => stats.currentStreak >= 7,
    },
    {
        id: 'streak15',
        tier: 'gold',
        nameKey: 'badge_streak15_name',
        descriptionKey: 'badge_streak15_desc',
        icon: '🥇',
        unlockFn: (stats) => stats.currentStreak >= 15,
    },
    {
        id: 'streak30',
        tier: 'diamond',
        nameKey: 'badge_streak30_name',
        descriptionKey: 'badge_streak30_desc',
        icon: '💎',
        unlockFn: (stats) => stats.currentStreak >= 30,
    },
    {
        id: 'perfect',
        tier: 'gold',
        nameKey: 'badge_perfect_name',
        descriptionKey: 'badge_perfect_desc',
        icon: '🎯',
        unlockFn: (stats, guesses) => guesses.length === 1,
    }
];

const getUnlockedBadgesKey = (language: Language) => `islamicWordleUnlockedBadges_${language}`;

const getUnlockedBadges = (language: Language): string[] => {
    try {
        const stored = localStorage.getItem(getUnlockedBadgesKey(language));
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to load unlocked badges", e);
        return [];
    }
};

const saveUnlockedBadges = (unlockedIds: string[], language: Language) => {
    try {
        localStorage.setItem(getUnlockedBadgesKey(language), JSON.stringify(unlockedIds));
    } catch (e) {
        console.error("Failed to save unlocked badges", e);
    }
};

/**
 * Checks player stats against all badges and returns the first newly unlocked badge.
 * Only one badge is returned per call to avoid overwhelming the player.
 * @param stats The player's current game statistics.
 * @param guesses The list of guesses from the winning game.
 * @param language The current game language.
 * @returns The first newly unlocked Badge object, or null if no new badge was unlocked.
 */
export const checkAndUnlockBadges = (stats: GameStats, guesses: Guess[], language: Language): Badge | null => {
    const unlockedIds = getUnlockedBadges(language);
    
    // Find the first badge that is not yet unlocked but meets the unlock criteria.
    const newBadge = allBadges.find(badge => 
        !unlockedIds.includes(badge.id) && badge.unlockFn(stats, guesses)
    );

    if (newBadge) {
        const updatedUnlockedIds = [...unlockedIds, newBadge.id];
        saveUnlockedBadges(updatedUnlockedIds, language);
        return newBadge;
    }

    return null;
};