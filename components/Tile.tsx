
import React from 'react';
// FIX: Corrected import path for types to use the root re-exporting types.ts
import { LetterStatus } from '../types';
import { useSettings } from '../src/hooks/useSettings.ts';

interface TileProps {
  letter: string;
  status?: LetterStatus;
  isRevealing?: boolean;
  isTyped?: boolean;
  animationDelay?: number;
  isStatic?: boolean;
  isSubmitted?: boolean;
  isWinningTile?: boolean;
}

export const Tile: React.FC<TileProps> = ({ letter, status = LetterStatus.Default, isRevealing, isTyped, animationDelay = 0, isStatic = false, isSubmitted = false, isWinningTile = false }) => {
  // FIX: The `useSettings` hook now provides the `t` function.
  const { t } = useSettings();

  const statusStyles = {
    [LetterStatus.Correct]: 'bg-[#E96306] border-[#E96306] text-white',
    [LetterStatus.Present]: 'bg-[#FFC857] border-[#FFC857] text-gray-900',
    [LetterStatus.Absent]: 'bg-[#444444] border-[#444444] text-white',
    [LetterStatus.Default]: 'bg-transparent border-gray-500 text-white dark:text-white',
  };
  
  const staticStatusStyles = {
    [LetterStatus.Correct]: 'bg-[#E96306] border-transparent text-white',
    [LetterStatus.Present]: 'bg-[#FFC857] border-transparent text-gray-900',
    [LetterStatus.Absent]: 'bg-[#444444] border-transparent text-white',
    [LetterStatus.Default]: 'bg-transparent border-gray-500 text-white dark:text-white',
  };

  const a11yStatusMap = {
    [LetterStatus.Correct]: t('statusCorrect'),
    [LetterStatus.Present]: t('statusPresent'),
    [LetterStatus.Absent]: t('statusAbsent'),
    [LetterStatus.Default]: t('statusEmpty'),
  };

  const ariaLabel = letter ? `${letter} - ${a11yStatusMap[status]}` : a11yStatusMap[LetterStatus.Default];
  
  if (isStatic) {
    return (
      <div className={`w-12 h-12 flex items-center justify-center text-2xl font-bold uppercase border-2 rounded-md ${staticStatusStyles[status]}`} aria-label={ariaLabel}>
        {letter}
      </div>
    );
  }

  const frontFaceClasses = `border-2 rounded-md ${letter ? 'border-gray-400 dark:border-gray-600' : 'border-gray-500 dark:border-gray-700'} ${isTyped ? 'animate-pop-in': ''}`;
  const backFaceClasses = `${statusStyles[status]} rounded-md`;
  
  const isRevealed = isSubmitted && !isRevealing;
  const winningAnimationClass = isWinningTile && isRevealed ? 'animate-jump animate-glow' : '';
  const tileContainerClasses = `tile ${isRevealing ? 'is-revealing' : ''} ${isRevealed ? 'is-revealed' : ''} ${winningAnimationClass}`;

  const animationStyle: React.CSSProperties = {};
  if (isWinningTile && isRevealed) {
      // Delay the animation so it happens after the flip transition completes (600ms).
      animationStyle.animationDelay = `${600 + animationDelay}ms`;
  }


  return (
    <div className={tileContainerClasses} aria-label={ariaLabel} style={animationStyle}>
      <div className="tile-inner" style={{ transitionDelay: `${animationDelay}ms` }}>
        <div className={`tile-face ${frontFaceClasses}`}>
          {letter}
        </div>
        <div className={`tile-face tile-back ${backFaceClasses}`}>
          {letter}
        </div>
      </div>
    </div>
  );
};