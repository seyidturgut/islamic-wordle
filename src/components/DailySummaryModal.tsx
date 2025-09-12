import React, { useState, useEffect, useRef } from 'react';
import { GameStats } from '../types';
import { useSettings } from '../hooks/useSettings';
import StatsChart from './StatsChart';
import { StatsSummary } from './StatsSummary';
import { formatShareText } from '../utils/shareFormatter';
import { Guess } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface DailySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  solution: string;
  guesses: Guess[];
  isWin: boolean;
}

const getNextDayCountdown = () => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const DailySummaryModal: React.FC<DailySummaryModalProps> = ({ isOpen, onClose, stats, solution, guesses, isWin }) => {
    const { t } = useSettings();
    const [countdown, setCountdown] = useState(getNextDayCountdown());
    const [copied, setCopied] = useState(false);
    const [isBouncing, setIsBouncing] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const focusRingClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800";


    useEffect(() => {
        if (isOpen) {
            const timer = setInterval(() => {
                setCountdown(getNextDayCountdown());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isOpen]);

    useFocusTrap(modalRef, isOpen);
    
    if (!isOpen) return null;

    const handleShare = () => {
        const shareText = formatShareText(guesses, isWin);
        navigator.clipboard.writeText(shareText).then(() => {
            setCopied(true);
            setIsBouncing(true);
            setTimeout(() => setIsBouncing(false), 500); // Animation duration
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex justify-center items-center p-4 z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="summary-title"
        >
            <div 
                ref={modalRef}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 shadow-2xl max-w-md w-full text-black dark:text-white animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 id="summary-title" className="text-xl font-bold uppercase">{t('statistics')}</h2>
                    <button onClick={onClose} className={`text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-full ${focusRingClasses}`} aria-label={t('close')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-4 text-center">
                    <p className="text-sm">{t('modalSolutionIs')}</p>
                    <p className="text-2xl font-bold tracking-widest text-emerald-600 dark:text-emerald-400">{solution}</p>
                </div>


                <div className="mb-6">
                    <StatsSummary stats={stats} />
                    <StatsChart stats={stats} />
                </div>
                
                <hr className="border-gray-200 dark:border-gray-600 my-4" />

                <div className="flex justify-between items-center">
                    <div className="text-center">
                        <p className="text-sm uppercase tracking-widest">{t('nextPuzzle')}</p>
                        <p className="text-3xl font-bold font-mono">{countdown}</p>
                    </div>
                     <button
                        onClick={handleShare}
                        className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 ${focusRingClasses} ${isBouncing ? 'animate-bounce-short' : ''}`}
                    >
                        {copied ? t('copied') : t('share')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DailySummaryModal;