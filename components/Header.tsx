import React from 'react';
import { useSettings } from '../src/hooks/useSettings';
import { GameMode } from '../src/types';

interface HeaderProps {
    onShowHelp?: () => void;
    onShowStats?: () => void;
    onShowSettings?: () => void;
    onBack?: () => void;
    gameMode?: GameMode;
    onRandomize?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShowHelp, onShowStats, onShowSettings, onBack, gameMode, onRandomize }) => {
    const { t } = useSettings();
    const focusRingClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";

    return (
        <header className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 w-full max-w-lg">
            <div className="w-12">
                {onBack ? (
                    <button onClick={onBack} className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${focusRingClasses}`} aria-label={t('back')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                ) : onShowHelp ? (
                     <button onClick={onShowHelp} className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${focusRingClasses}`} aria-label={t('help')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                ) : <div />}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight uppercase">
                İslami Wordle
            </h1>
            <div className="w-12 flex justify-end">
               {gameMode === 'practice' && onRandomize && (
                 <button onClick={onRandomize} className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${focusRingClasses}`} aria-label={t('randomWord')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 12M20 20l-1.5-1.5A9 9 0 003.5 12" />
                    </svg>
                 </button>
               )}
               {onShowSettings && (
                 <button onClick={onShowSettings} className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${focusRingClasses}`} aria-label={t('settings')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
               )}
            </div>
        </header>
    );
};

export default Header;