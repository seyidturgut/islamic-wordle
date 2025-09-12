import React, { useState, useRef } from 'react';
import { useSettings } from '../src/hooks/useSettings.ts';
import { useFocusTrap } from '../src/hooks/useFocusTrap.ts';

interface GameModalProps {
  isOpen: boolean;
  isWin: boolean;
  solution: string;
  onPlayAgain: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({ isOpen, isWin, solution, onPlayAgain }) => {
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
      <div ref={modalRef} className="bg-gray-800 rounded-lg p-6 md:p-8 text-center shadow-2xl max-w-sm w-full">
        <h2 id="game-modal-title" className="text-2xl md:text-3xl font-bold mb-4">
          {isWin ? t('modalWinTitle') : t('modalLossTitle')}
        </h2>
        <p className="mb-2 text-lg">{t('modalSolutionIs')}</p>
        <p className="text-2xl font-bold uppercase tracking-widest text-emerald-400 mb-6">{solution}</p>
        <button
          onClick={handleClick}
          className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 ${isBouncing ? 'animate-bounce-short' : ''}`}
        >
          {t('playAgain')}
        </button>
      </div>
    </div>
  );
};