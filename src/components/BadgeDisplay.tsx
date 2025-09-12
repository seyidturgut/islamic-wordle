// FIX: Implemented a placeholder component to resolve module errors.
import React from 'react';
import { Badge } from '../types';
import { useSettings } from '../hooks/useSettings';

interface BadgeDisplayProps {
  badge: Badge;
  isNewlyUnlocked?: boolean;
}

const tierStyles = {
    bronze: {
        bg: 'bg-orange-900',
        border: 'border-orange-400',
        text: 'text-orange-300',
        shadow: 'shadow-orange-500/50'
    },
    silver: {
        bg: 'bg-gray-700',
        border: 'border-gray-400',
        text: 'text-gray-200',
        shadow: 'shadow-gray-400/50'
    },
    gold: {
        bg: 'bg-yellow-800',
        border: 'border-yellow-400',
        text: 'text-yellow-200',
        shadow: 'shadow-yellow-400/50'
    },
    diamond: {
        bg: 'bg-sky-900',
        border: 'border-sky-400',
        text: 'text-sky-200',
        shadow: 'shadow-sky-400/50'
    },
};

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badge, isNewlyUnlocked = false }) => {
    const { t } = useSettings();
    const styles = tierStyles[badge.tier];

    const containerClasses = `
        relative p-4 rounded-lg border-2 flex flex-col items-center gap-2
        ${styles.bg} ${styles.border} ${styles.text} shadow-lg ${styles.shadow}
        ${isNewlyUnlocked ? 'animate-pop-in' : ''}
    `;

    const shimmerClass = `
        after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full
        after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent
        after:animate-shimmer after:delay-500
    `;

    return (
        <div className={containerClasses}>
            {isNewlyUnlocked && <div className={`absolute inset-0 overflow-hidden rounded-lg ${shimmerClass}`} />}
            <div className={`text-5xl ${isNewlyUnlocked ? 'animate-glow' : ''}`}>
                {badge.icon}
            </div>
            <div className="font-bold text-center text-sm">{t(badge.nameKey)}</div>
        </div>
    );
};

export default BadgeDisplay;