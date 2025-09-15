// FIX: Implemented the DailySummaryModal component.
import React, { useRef, useState, useEffect } from 'react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useSettings } from '../hooks/useSettings';
import { GameStats, Guess, Badge } from '../types';
import StatsChart from './StatsChart';
import { StatsSummary } from './StatsSummary';
import { formatShareText } from '../utils/shareFormatter';
import { Toast } from '../../components/Toast';
import { checkAndUnlockBadges } from '../services/badgeService';
import BadgeDisplay from './BadgeDisplay';

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  solution: string;
  solutionDefinition: string;
  guesses: Guess[];
  isWin: boolean;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({
  isOpen,
  onClose,
  stats,
  solution,
  solutionDefinition,
  guesses,
  isWin,
}) => {
  const { settings, t } = useSettings();
  const modalRef = useRef<HTMLDivElement>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  useFocusTrap(modalRef, isOpen);

  useEffect(() => {
    if (isOpen) {
        // Reset scroll to top when modal opens
        modalRef.current?.querySelector('.overflow-y-auto')?.scrollTo(0, 0);
        
        // Check for new badges only on a win
        if (isWin) {
            const newBadge = checkAndUnlockBadges(stats, guesses, settings.language);
            setNewlyUnlockedBadge(newBadge);
        } else {
            setNewlyUnlockedBadge(null); // Ensure no badge is shown on a loss
        }
    }
  }, [isOpen, isWin, stats, guesses, settings.language]);

  if (!isOpen) return null;

  const handleShare = () => {
    const shareText = formatShareText(solution, guesses, isWin, true, settings.language, newlyUnlockedBadge, t);
    if (navigator.share) {
      navigator.share({
        text: shareText,
      }).catch(err => console.error("Share failed", err));
    } else {
      navigator.clipboard.writeText(shareText);
      setToastMessage(t('copiedToClipboard'));
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-gray-50 dark:bg-[#2A2A2A] rounded-lg p-5 shadow-2xl max-w-md w-full text-black dark:text-[#F5F5F5] flex flex-col max-h-[90vh] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="summary-modal-title" className="text-2xl font-bold">{t('statistics')}</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white" aria-label={t('close')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto pr-2">
            <div className="text-center mb-4">
                <p className="text-lg">{t('modalSolutionIs')}</p>
                <p className="text-2xl font-bold uppercase tracking-widest text-[#E96306]">{solution}</p>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{solutionDefinition}</p>
            </div>

            {newlyUnlockedBadge && (
                <div className="my-4 text-center">
                    <h3 className="text-lg font-bold text-amber-400 animate-fade-in">{t('newBadgeUnlocked')}</h3>
                    <div className="mt-2 flex justify-center">
                        <BadgeDisplay badge={newlyUnlockedBadge} isNewlyUnlocked={true} />
                    </div>
                </div>
            )}
            
            <StatsSummary stats={stats} />
            <StatsChart stats={stats} />
        </div>

        <div className="mt-auto pt-4 flex items-center justify-center">
          <button
            onClick={handleShare}
            className="bg-[#E96306] hover:brightness-110 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 w-full"
          >
            {t('share')}
          </button>
        </div>
      </div>
       {toastMessage && <Toast message={toastMessage} onHide={() => setToastMessage('')} duration={2000}/>}
    </div>
  );
};