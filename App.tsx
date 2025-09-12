import React, { useState, useCallback } from 'react';
import GameScreen from './src/features/game/GameScreen';
import SettingsScreen from './src/features/settings/SettingsScreen';
import HomeScreen from './src/features/home/HomeScreen';
import { GameMode } from './src/types';

export type Screen = 'home' | 'game' | 'settings';

const App: React.FC = () => {
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

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white min-h-screen font-sans">
           <div className="h-screen w-screen flex flex-col items-center">
             {renderScreen()}
           </div>
        </div>
    );
};

export default App;