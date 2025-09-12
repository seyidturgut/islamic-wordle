import React, { useRef } from 'react';
import { useSettings } from '../hooks/useSettings.ts';
import { Tile } from '../../components/Tile.tsx';
import { LetterStatus } from '../types.ts';
import { useFocusTrap } from '../hooks/useFocusTrap.ts';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExampleRow: React.FC<{ word: string; highlightIndex: number; status: LetterStatus; description: string; }> = ({ word, highlightIndex, status, description }) => {
    const letters = word.split('');
    return (
        <div className="mb-6">
            <div className="flex justify-center gap-1.5 mb-2">
                {letters.map((letter, index) => (
                    <Tile 
                        key={index} 
                        letter={letter} 
                        status={index === highlightIndex ? status : LetterStatus.Default}
                        isStatic={true}
                    />
                ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
    );
};

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  const { t } = useSettings();
  const modalRef = useRef<HTMLDivElement>(null);
  const focusRingClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800";

  useFocusTrap(modalRef, isOpen);

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="how-to-play-title"
    >
      <div 
        ref={modalRef}
        className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 shadow-2xl max-w-md w-full text-black dark:text-white animate-slide-up"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
            <h2 id="how-to-play-title" className="text-2xl font-bold">{t('howToPlayTitle')}</h2>
            <button onClick={onClose} className={`text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-full ${focusRingClasses}`} aria-label={t('close')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="text-base space-y-3 mb-6">
            <p>{t('howToPlayIntro1')}</p>
            <p>{t('howToPlayIntro2')}</p>
            <p>{t('howToPlayIntro3')}</p>
        </div>
        
        <hr className="border-gray-200 dark:border-gray-600 my-4" />
        <h3 className="font-bold text-lg mb-4">{t('examples')}</h3>
        
        <ExampleRow 
            word={t('exampleWord1')} 
            highlightIndex={0} 
            status={LetterStatus.Correct} 
            description={t('exampleCorrectDesc')}
        />
        <ExampleRow 
            word={t('exampleWord2')} 
            highlightIndex={1} 
            status={LetterStatus.Present} 
            description={t('examplePresentDesc')}
        />
        <ExampleRow 
            word={t('exampleWord3')}
            highlightIndex={3} 
            status={LetterStatus.Absent} 
            description={t('exampleAbsentDesc')}
        />

        <button
          onClick={onClose}
          className={`mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 w-full ${focusRingClasses}`}
        >
          {t('startPlaying')}
        </button>
      </div>
    </div>
  );
};