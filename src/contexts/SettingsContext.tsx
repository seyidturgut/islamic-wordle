import React, { createContext, useState, useEffect, useMemo } from 'react';
import { AppSettings, AppTheme } from '../types.ts';
import { DEFAULT_WORD_LENGTH } from '../../constants.ts';

type Translations = {
  [lang: string]: Record<string, string>;
};

// we relax the TranslationKey type to a generic string.
type TranslationKey = string;

// By embedding the translation data directly, we eliminate the need for a network request (fetch),
// which was failing during deployment due to incorrect file paths. This makes the translation
// system more robust and independent of the server's file structure.
const translations: Translations = {
  en: {
    "back": "Back",
    "help": "Help",
    "settings": "Settings",
    "statistics": "Statistics",
    "close": "Close",
    "packs": "Word Packs",
    "featureComingSoon": "Feature Coming Soon!",
    "wordPackManagement": "Word pack management will be available here.",
    "packDetails": "Pack Details",
    "createPack": "Create Pack",
    "areYouSure": "Are you sure?",
    "modalWinTitle": "Congratulations!",
    "modalLossTitle": "Better luck next time!",
    "modalSolutionIs": "The word was:",
    "playAgain": "Play Again",
    "notEnoughLetters": "Not enough letters",
    "notInWordList": "Word not in list",
    "statusCorrect": "Correct",
    "statusPresent": "Present",
    "statusAbsent": "Absent",
    "statusEmpty": "Empty",
    "nextPuzzle": "Next Wordle in",
    "copied": "Copied!",
    "share": "Share",
    "guessDistribution": "Guess Distribution",
    "theme": "Theme",
    "light": "Light",
    "dark": "Dark",
    "system": "System",
    "language": "Language",
    "wordLength": "Word Length",
    "haptics": "Haptic Feedback",
    "howToPlayTitle": "How to Play",
    "howToPlayIntro1": "Guess the word in 6 tries.",
    "howToPlayIntro2": "Each guess must be a valid word of the correct length.",
    "howToPlayIntro3": "After each guess, the color of the tiles will change to show how close your guess was to the word.",
    "examples": "Examples",
    "exampleWord1": "KIBLE",
    "exampleCorrectDesc": "<b>K</b> is in the word and in the correct spot.",
    "exampleWord2": "SALAT",
    "examplePresentDesc": "<b>A</b> is in the word but in the wrong spot.",
    "exampleWord3": "TAZIM",
    "exampleAbsentDesc": "<b>İ</b> is not in the word in any spot.",
    "startPlaying": "Start Playing!",
    "gamesPlayed": "Played",
    "winPercentage": "Win %",
    "currentStreak": "Streak",
    "maxStreak": "Max Streak",
    "avgGuesses": "Avg. Guesses",
    "dailyChallenge": "Daily Challenge",
    "practiceMode": "Practice Mode",
    "randomWord": "Random Word",
    "guessSummary": "Guess {guessNum}"
  },
  tr: {
    "back": "Geri",
    "help": "Yardım",
    "settings": "Ayarlar",
    "statistics": "İstatistikler",
    "close": "Kapat",
    "packs": "Kelime Paketleri",
    "featureComingSoon": "Bu Özellik Yakında Gelecek!",
    "wordPackManagement": "Kelime paketi yönetimi burada mevcut olacak.",
    "packDetails": "Paket Detayları",
    "createPack": "Paket Oluştur",
    "areYouSure": "Emin misiniz?",
    "modalWinTitle": "Tebrikler!",
    "modalLossTitle": "Bir dahaki sefere!",
    "modalSolutionIs": "Doğru kelime:",
    "playAgain": "Tekrar Oyna",
    "notEnoughLetters": "Yeterli harf yok",
    "notInWordList": "Kelime listede yok",
    "statusCorrect": "Doğru",
    "statusPresent": "Mevcut",
    "statusAbsent": "Yok",
    "statusEmpty": "Boş",
    "nextPuzzle": "Sonraki Kelimeye Kalan Süre",
    "copied": "Kopyalandı!",
    "share": "Paylaş",
    "guessDistribution": "Tahmin Dağılımı",
    "theme": "Tema",
    "light": "Açık",
    "dark": "Koyu",
    "system": "Sistem",
    "language": "Dil",
    "wordLength": "Kelime Uzunluğu",
    "haptics": "Dokunsal Geribildirim",
    "howToPlayTitle": "Nasıl Oynanır?",
    "howToPlayIntro1": "Kelimeyi 6 denemede tahmin et.",
    "howToPlayIntro2": "Her tahmin, kelime uzunluğunda anlamlı bir kelime olmalıdır.",
    "howToPlayIntro3": "Her denemeden sonra kutuların renkleri, tahmininizin doğruluğuna göre değişecektir.",
    "examples": "Örnekler",
    "exampleWord1": "KIBLE",
    "exampleCorrectDesc": "<b>K</b> harfi kelimede var ve doğru yerde.",
    "exampleWord2": "SALAT",
    "examplePresentDesc": "<b>A</b> harfi kelimede var ama yanlış yerde.",
    "exampleWord3": "TAZİM",
    "exampleAbsentDesc": "<b>İ</b> harfi kelimede yok.",
    "startPlaying": "Oyna Başla!",
    "gamesPlayed": "Oynanan",
    "winPercentage": "Kazanma %",
    "currentStreak": "Seri",
    "maxStreak": "En Yüksek Seri",
    "avgGuesses": "Ort. Tahmin",
    "dailyChallenge": "Günlük Görev",
    "practiceMode": "Alıştırma Modu",
    "randomWord": "Rastgele Kelime",
    "guessSummary": "Tahmin {guessNum}"
  }
};


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

  // The fetch call for translations has been removed.
  // Translations are now embedded directly in the `translations` constant above.

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
    return translations[settings.language]?.[key] || key;
  }, [settings.language]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, t }}>
      {children}
    </SettingsContext.Provider>
  );
};