import React, { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings.ts';
import type { AppTheme, GameStats } from '../../types.ts';
import type { Screen } from '../../../App.tsx';
import { MIN_WORD_LENGTH, MAX_WORD_LENGTH } from '../../../constants.ts';
import { loadStats } from '../../services/statsService.ts';
import StatsChart from '../../components/StatsChart.tsx';
import { StatsSummary } from '../../components/StatsSummary.tsx';

interface SettingsScreenProps {
  navigate: (screen: Screen) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigate }) => {
  const { settings, updateSettings, t } = useSettings();
  const [stats, setStats] = useState<GameStats | null>(null);
  const focusRingClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";


  useEffect(() => {
    setStats(loadStats());
  }, []);

  const handleThemeChange = (theme: AppTheme) => {
    updateSettings({ ...settings, theme });
  };
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ ...settings, language: e.target.value as 'tr' | 'en' });
  };
  
  const handleWordLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ ...settings, wordLength: parseInt(e.target.value) });
  };

  const Toggle: React.FC<{ label: string; checked: boolean; onChange: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
      <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg">{label}</span>
        <button onClick={() => onChange(!checked)} className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${focusRingClasses} ${checked ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
          <span className={`block w-6 h-6 rounded-full bg-white transform transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`} />
        </button>
      </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-4 h-full flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <button onClick={() => navigate('home')} className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${focusRingClasses}`}>
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
        <div className="w-8"></div>
      </header>
      
      <div className="flex-grow overflow-y-auto">
        {/* Statistics Section */}
        {stats && (
          <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-bold text-center mb-4">{t('statistics')}</h2>
              <StatsSummary stats={stats} />
              <StatsChart stats={stats} />
          </div>
        )}

        <div className="space-y-4">
          <div className="py-4 border-b border-gray-200 dark:border-gray-700">
            <label className="text-lg">{t('theme')}</label>
            <div className="flex justify-around mt-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg">
               {(['light', 'dark', 'system'] as AppTheme[]).map(theme => (
                   <button key={theme} onClick={() => handleThemeChange(theme)} className={`w-full py-2 rounded-md font-semibold transition-colors ${focusRingClasses} ${settings.theme === theme ? 'bg-emerald-600 text-white' : 'hover:bg-gray-300 dark:hover:bg-gray-700'}`}>{t(theme)}</button>
               ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700">
              <label htmlFor="language-select" className="text-lg">{t('language')}</label>
              <select id="language-select" value={settings.language} onChange={handleLanguageChange} className={`bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md p-2 ${focusRingClasses}`}>
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
              </select>
          </div>

          <div className="py-4 border-b border-gray-200 dark:border-gray-700">
              <label htmlFor="word-length-slider" className="text-lg flex justify-between">
                  <span>{t('wordLength')}</span>
                  <span className="font-bold">{settings.wordLength}</span>
              </label>
              <input id="word-length-slider" type="range" min={MIN_WORD_LENGTH} max={MAX_WORD_LENGTH} value={settings.wordLength} onChange={handleWordLengthChange} className={`w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2 ${focusRingClasses}`} />
          </div>

          <Toggle label={t('haptics')} checked={settings.hapticsEnabled} onChange={checked => updateSettings({...settings, hapticsEnabled: checked})} />

        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;