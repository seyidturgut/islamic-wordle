
import React, { useState, useEffect } from 'react';
// FIX: Corrected import path for types to use the root re-exporting types.ts
import { GameMode, GameStats } from '../../types';
import type { Screen } from '../../../App';
import { useSettings } from '../../hooks/useSettings';
import Header from '../../../components/Header';
import { HowToPlayModal } from '../../components/HowToPlayModal';
import { AdsenseAd } from '../../components/AdsenseAd';
import * as statsService from '../../services/statsService';


interface HomeScreenProps {
    onStartGame: (mode: GameMode) => void;
    onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, onNavigate }) => {
    // FIX: The `useSettings` hook now provides `settings` and `t`.
    const { settings, t } = useSettings();
    const [stats, setStats] = useState<GameStats | null>(null);
    const [isHowToPlayOpen, setHowToPlayOpen] = useState(false);
    const focusRingClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";

    useEffect(() => {
      setStats(statsService.loadStats(settings.language));
    }, [settings.language]);


    return (
        <div className="flex flex-col items-center justify-between flex-grow w-full max-w-lg">
            <Header
                onShowHelp={() => setHowToPlayOpen(true)}
                onShowSettings={() => onNavigate('settings')}
            />
            
            <main className="flex flex-col items-center justify-center flex-grow w-full px-4">
                <div className="text-center mb-8">
                     <p className="text-lg text-gray-600 dark:text-gray-400">{t('homeSubtitle')}</p>
                </div>

                {stats && stats.currentStreak > 0 && (
                  <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse mb-8 animate-fade-in text-gray-800 dark:text-gray-200">
                    <span className="text-4xl animate-jump" role="img" aria-label="streak-flame">🔥</span>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{stats.currentStreak}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('dailyStreak')}</div>
                    </div>
                  </div>
                )}


                <div className="w-full max-w-xs space-y-4">
                    <button
                        onClick={() => onStartGame('daily')}
                        className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xl py-4 px-6 rounded-lg transition-transform transform hover:scale-105 duration-200 ${focusRingClasses}`}
                    >
                        {t('dailyChallenge')}
                    </button>
                    <button
                        onClick={() => onStartGame('practice')}
                        className={`w-full bg-gray-600 hover:bg-gray-700 text-white font-bold text-xl py-4 px-6 rounded-lg transition-transform transform hover:scale-105 duration-200 ${focusRingClasses}`}
                    >
                        {t('practiceMode')}
                    </button>
                </div>
            </main>
            
            <footer className="p-4 text-center text-xs text-gray-500 w-full">
                <AdsenseAd />
                <p>{t('homeFooter')}</p>
            </footer>

            <HowToPlayModal 
                isOpen={isHowToPlayOpen}
                onClose={() => setHowToPlayOpen(false)}
            />
        </div>
    );
};

export default HomeScreen;