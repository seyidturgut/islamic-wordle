import React, { useState } from 'react';
import GameScreen from './features/game/GameScreen.tsx';
import SettingsScreen from './features/settings/SettingsScreen.tsx';
import PacksListScreen from './features/packs/PacksListScreen.tsx';
// FIX: Import Screen type from root App and GameMode to resolve type conflicts.
import type { Screen as RootScreen } from '../App.tsx';
import type { GameMode } from './types.ts';

// Note: This is a duplicate of the root App.tsx component.
// In a typical project structure, you would only have one.
// This is provided to fill the placeholder and resolve the error.

// FIX: Expanded Screen type to be compatible with components expecting the root Screen type.
export type Screen = RootScreen | 'packs';

const App: React.FC = () => {
    const [currentScreen, setCurrentScreen] = useState<Screen>('game');

    // FIX: Updated navigate function to handle 'home' screen and have a compatible type signature.
    const navigate = (screen: Screen) => {
        if (screen === 'home') {
            setCurrentScreen('game');
        } else {
            setCurrentScreen(screen);
        }
    };

    const renderScreen = () => {
        switch (currentScreen) {
            case 'game':
                // FIX: Passed correct props `gameMode` and `onBack` to GameScreen.
                return <GameScreen gameMode={'practice'} onBack={() => navigate('settings')} />;
            case 'settings':
                return <SettingsScreen navigate={navigate} />;
            case 'packs':
                return <PacksListScreen navigate={navigate} />;
            case 'home':
                 // This case is handled by redirection in `navigate`, but as a fallback, render game screen.
                return <GameScreen gameMode={'practice'} onBack={() => navigate('settings')} />;
            default:
                // FIX: Passed correct props `gameMode` and `onBack` to GameScreen.
                return <GameScreen gameMode={'practice'} onBack={() => navigate('settings')} />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen font-sans">
           {renderScreen()}
        </div>
    );
};

export default App;
