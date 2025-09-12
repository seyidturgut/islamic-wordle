
import React from 'react';
import type { Screen } from '../../../App.tsx';
import { useSettings } from '../../hooks/useSettings.ts';

interface PacksListScreenProps {
  navigate: (screen: Screen) => void;
}

const PacksListScreen: React.FC<PacksListScreenProps> = ({ navigate }) => {
  // FIX: The `useSettings` hook now provides the `t` function.
  const { t } = useSettings();

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('game')} className="p-2 rounded-full hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rtl-flip" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-bold">{t('packs')}</h1>
        <div className="w-8"></div>
      </header>
      
      <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">{t('featureComingSoon')}</h2>
        <p className="text-gray-400">{t('wordPackManagement')}</p>
      </div>

    </div>
  );
};

export default PacksListScreen;