import React, { useState } from 'react';
import { GameMode } from '../../types';
import type { Screen } from '../../../App';
import { useSettings } from '../../hooks/useSettings';
import Header from '../../../components/Header';
import { HowToPlayModal } from '../../components/HowToPlayModal';
import { AdsenseAd } from '../../components/AdsenseAd';

interface HomeScreenProps {
    onStartGame: (mode: GameMode) => void;
    onNavigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartGame, onNavigate }) => {
    const { t } = useSettings();
    const [isHowToPlayOpen, setHowToPlayOpen] = useState(false);
    const focusRingClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";


    return (
        <div className="flex flex-col items-center justify-between h-full w-full max-w-lg">
            <Header
                onShowHelp={() => setHowToPlayOpen(true)}
                onShowSettings={() => onNavigate('settings')}
            />
            
            <main className="flex flex-col items-center justify-center flex-grow w-full px-4">
                <div className="text-center mb-12">
                     <p className="text-lg text-gray-600 dark:text-gray-400">Yeni bir kelime her gün.</p>
                </div>

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
                <p>Her gün yeni bir İslami kelime öğren.</p>
            </footer>

            <HowToPlayModal 
                isOpen={isHowToPlayOpen}
                onClose={() => setHowToPlayOpen(false)}
            />
        </div>
    );
};

export default HomeScreen;