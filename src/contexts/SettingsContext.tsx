import React, { createContext, useState, useEffect, useMemo } from 'react';
import { AppSettings, AppTheme } from '../types.ts';
import { DEFAULT_WORD_LENGTH } from '../../constants.ts';

type Translations = {
  [lang: string]: Record<string, string>;
};

// Since we can't statically analyze the JSON files with fetch,
// we relax the TranslationKey type to a generic string.
type TranslationKey = string;

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: AppSettings) => void;
  t: (key: TranslationKey) => string;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'tr',
  wordLength: DEFAULT_WORD_LENGTH,
  hapticsEnabled: true,
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  t: (key: TranslationKey) => key, // Return key as a fallback
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const storedSettings = localStorage.getItem('islamicWordleSettings');
      return storedSettings ? { ...defaultSettings, ...JSON.parse(storedSettings) } : defaultSettings;
    } catch (e) {
      return defaultSettings;
    }
  });

  const [translations, setTranslations] = useState<Translations | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        // Fetch translation files from the public path using relative paths for robustness.
        const [enResponse, trResponse] = await Promise.all([
          fetch('./src/locales/en.json'),
          fetch('./src/locales/tr.json'),
        ]);
        if (!enResponse.ok || !trResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const en = await enResponse.json();
        const tr = await trResponse.json();
        setTranslations({ en, tr });
      } catch (error) {
        console.error('Failed to load translation files:', error);
        // Set empty translations to prevent app crash on access
        setTranslations({ en: {}, tr: {} });
      }
    };
    fetchTranslations();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('islamicWordleSettings', JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
    
    // Theme application
    const body = document.querySelector('body');
    const isDarkMode = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        body?.classList.add('dark:bg-gray-900');
        body?.classList.remove('bg-gray-50');
    } else {
        document.documentElement.classList.remove('dark');
        body?.classList.add('bg-gray-50');
        body?.classList.remove('dark:bg-gray-900');
    }
  }, [settings]);

  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
  };
  
  const t = useMemo(() => (key: TranslationKey): string => {
    if (!translations) {
      return key; // Return key if translations are not loaded yet
    }
    return translations[settings.language]?.[key] || key;
  }, [settings.language, translations]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, t }}>
      {children}
    </SettingsContext.Provider>
  );
};