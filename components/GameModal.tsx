
import React, { useState, useRef } from 'react';
import { useSettings } from '../src/hooks/useSettings.ts';
import { useFocusTrap } from '../src/hooks/useFocusTrap.ts';

interface GameModalProps {
  isOpen: boolean;
  isWin: boolean;
  solution: string;
  solutionDefinition: string;
  onPlayAgain: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ isOpen, isWin, solution, solutionDefinition, onPlayAgain }) => {
  // FIX: The `useSettings` hook now provides the `t` function.
  const { t } = useSettings();
  const [isBouncing, setIsBouncing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  useFocusTrap(modalRef, isOpen);

  if (!isOpen) return null;
  
  const handleClick = () => {
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 500); // Animation duration
    onPlayAgain();
  };

  return (
    <div 
      className="absolute inset-0 bg-black/60 flex justify-center items-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-modal-title"
    >
      <div ref={modalRef} className="bg-gray-100 dark:bg-[#2A2A2A] rounded-lg p-6 md:p-8 text-center shadow-2xl max-w-sm w-full dark:text-[#F5F5F5]">
        <h2 id="game-modal-title" className="text-2xl md:text-3xl font-bold mb-4">
          {isWin ? t('modalWinTitle') : t('modalLossTitle')}
        </h2>
        <div className="mb-6">
            <p className="mb-2 text-lg">{t('modalSolutionIs')}</p>
            <p className="text-2xl font-bold uppercase tracking-widest text-[#E96306]">{solution}</p>
            {isWin && <p className="mt-2 text-base text-gray-600 dark:text-gray-400">{solutionDefinition}</p>}
        </div>
        <button
          onClick={handleClick}
          className={`bg-[#E96306] hover:brightness-110 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E96306] focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#2A2A2A] ${isBouncing ? 'animate-bounce-short' : ''}`}
        >
          {t('playAgain')}
        </button>
      </div>
    </div>
  );
};