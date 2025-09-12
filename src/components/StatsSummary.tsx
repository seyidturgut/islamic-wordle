
import React from 'react';
import { useSettings } from '../hooks/useSettings.ts';
import { GameStats } from '../types.ts';

interface StatsSummaryProps {
    stats: GameStats;
}

const StatItem: React.FC<{ value: string | number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-2xl md:text-3xl font-bold">{value}</span>
        <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
);

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
    const { t } = useSettings();

    const winPercentage = stats.gamesPlayed > 0
        ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
        : 0;
    
    // FIX: With correct GameStats typing, `gamesWon` is a number, resolving the type error.
    const totalGuesses = Object.entries(stats.guessDistribution).reduce(
        (acc, [guessCount, gamesWon]) => acc + parseInt(guessCount) * gamesWon,
        0
    );
    
    const averageGuesses = stats.gamesWon > 0 
        ? (totalGuesses / stats.gamesWon).toFixed(1) 
        : '0.0';

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center my-4">
            <StatItem value={stats.gamesPlayed} label={t('gamesPlayed')} />
            <StatItem value={`${winPercentage}%`} label={t('winPercentage')} />
            <StatItem value={stats.currentStreak} label={t('currentStreak')} />
            <StatItem value={stats.maxStreak} label={t('maxStreak')} />
            <div className="col-span-2 md:col-span-1">
                <StatItem value={averageGuesses} label={t('avgGuesses')} />
            </div>
        </div>
    );
};