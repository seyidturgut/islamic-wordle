import React, { useState, useCallback } from 'react';
import GameScreen from './src/features/game/GameScreen';
import SettingsScreen from './src/features/settings/SettingsScreen';
import HomeScreen from './src/features/home/HomeScreen';
import { GameMode } from './types';
import { usePwaInstall } from './src/hooks/usePwaInstall';
import { InstallPwaPrompt } from './components/InstallPwaPrompt';


export type Screen = 'home' | 'game' | 'settings';

const App: React.FC = () => {
    const { isInstallVisible, isIos, handleInstall, handleDismiss } = usePwaInstall();
    const [currentScreen, setCurrentScreen] = useState<Screen>('home');
    const [gameMode, setGameMode] = useState<GameMode>('daily');

    const navigate = useCallback((screen: Screen) => {
        setCurrentScreen(screen);
    }, []);

    const startGame = useCallback((mode: GameMode) => {
        setGameMode(mode);
        navigate('game');
    }, [navigate]);

    const renderScreen = () => {
        switch (currentScreen) {
            case 'home':
                return <HomeScreen onStartGame={startGame} onNavigate={navigate} />;
            case 'game':
                return <GameScreen gameMode={gameMode} onBack={() => navigate('home')} />;
            case 'settings':
                return <SettingsScreen navigate={navigate} />;
            default:
                return <HomeScreen onStartGame={startGame} onNavigate={navigate} />;
        }
    };

    const isGameScreen = currentScreen === 'game';
    const containerClasses = `bg-gray-50 dark:bg-transparent text-black dark:text-[#F5F5F5] w-full font-sans flex flex-col ${
        isGameScreen ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'
    }`;

    return (
        <div className={containerClasses}>
           {renderScreen()}
           {isInstallVisible && (
              <InstallPwaPrompt
                isIos={isIos}
                onInstall={handleInstall}
                onDismiss={handleDismiss}
              />
           )}
        </div>
    );
};

export default App;