// FIX: Implemented the SettingsContext to provide settings, an updater, and a translation function to the entire app.
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppSettings, AppTheme, Language } from '../types';
import { DEFAULT_WORD_LENGTH } from '../../constants';

// Basic translations
const translations: Record<string, Record<string, string>> = {
  en: {
    // Modal titles
    modalWinTitle: 'Congratulations!',
    modalLossTitle: 'Better luck next time!',
    modalSolutionIs: 'The word was:',
    playAgain: 'Play Again',
    // Toasts
    notEnoughLetters: 'Not enough letters',
    notInWordList: 'Not in word list',
    copiedToClipboard: 'Copied to clipboard!',
    // Keyboard
    Enter: 'Enter',
    // Settings
    settings: 'Settings',
    statistics: 'Statistics',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    language: 'Language',
    wordLength: 'Word Length',
    haptics: 'Haptic Feedback',
    // Stats
    gamesPlayed: 'Played',
    winPercentage: 'Win %',
    currentStreak: 'Current Streak',
    maxStreak: 'Max Streak',
    guessDistribution: 'Guess Distribution',
    avgGuesses: 'Avg. Guesses',
    // How to Play
    howToPlayTitle: 'How to Play',
    close: 'Close',
    howToPlayIntro1: 'Guess the word in 6 tries.',
    howToPlayIntro2: 'Each guess must be a valid word. Hit the enter button to submit.',
    howToPlayIntro3: 'After each guess, the color of the tiles will change to show how close your guess was to the word.',
    examples: 'Examples',
    exampleWord1: 'SABIR',
    exampleCorrectDesc: "The letter <strong>S</strong> is in the word and in the correct spot.",
    exampleWord2: 'HELAL',
    examplePresentDesc: "The letter <strong>L</strong> is in the word but in the wrong spot.",
    exampleWord3: 'KADER',
    exampleAbsentDesc: "The letter <strong>R</strong> is not in the word in any spot.",
    startPlaying: "Let's Play!",
    // Header
    back: 'Back',
    help: 'Help',
    randomWord: 'New Word',
    // Home Screen
    homeSubtitle: 'A daily word game with an Islamic theme.',
    dailyChallenge: 'Daily Challenge',
    practiceMode: 'Practice Mode',
    dailyStreak: 'Daily Streak',
    homeFooter: 'Inspired by Wordle.',
    // Packs Screen
    packs: 'Word Packs',
    featureComingSoon: 'Feature Coming Soon!',
    wordPackManagement: 'Word pack management will be available here in a future update.',
    // Misc A11y
    statusCorrect: 'Correct',
    statusPresent: 'Present',
    statusAbsent: 'Absent',
    statusEmpty: 'Empty',
    // GameScreen announcements
    guessSummary: "Guess {guessNum}",
    // Pack Detail
    packDetails: "Pack Details",
    // Create Pack
    createPack: "Create Pack",
    // Confirmation
    areYouSure: "Are you sure?",
    // Sharing
    share: 'Share',
    // Badges
    newBadgeUnlocked: 'NEW BADGE UNLOCKED!',
    unlockedBadge: 'Unlocked Badge',
    badge_streak3_name: 'Rising Star',
    badge_streak3_desc: 'Achieved a 3-day streak.',
    badge_streak7_name: 'Consistent Scholar',
    badge_streak7_desc: 'Achieved a 7-day streak.',
    badge_streak15_name: 'Devoted Learner',
    badge_streak15_desc: 'Achieved a 15-day streak.',
    badge_streak30_name: 'Master of Patience',
    badge_streak30_desc: 'Achieved a 30-day streak.',
    badge_perfect_name: 'Divine Inspiration',
    badge_perfect_desc: 'Guessed the word in a single try.',
    // PWA Prompt
    pwaInstallTitle: 'Install for the Full Experience',
    pwaInstallBody: 'Offline access and more!',
    pwaInstallButton: 'Install',
    pwaInstallTitleIos: 'Install as an App',
    pwaInstallBodyIos: 'Tap the "Share" <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.875-1.025l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg> icon and then "Add to Home Screen".',
  },
  tr: {
    // Modal titles
    modalWinTitle: 'Tebrikler!',
    modalLossTitle: 'Bir dahaki sefere!',
    modalSolutionIs: 'Doğru kelime:',
    playAgain: 'Tekrar Oyna',
    // Toasts
    notEnoughLetters: 'Yeterli harf yok',
    notInWordList: 'Kelime listesinde yok',
    copiedToClipboard: 'Panoya kopyalandı!',
    // Keyboard
    Enter: 'Giriş',
    // Settings
    settings: 'Ayarlar',
    statistics: 'İstatistikler',
    theme: 'Tema',
    light: 'Açık',
    dark: 'Koyu',
    system: 'Sistem',
    language: 'Dil',
    wordLength: 'Kelime Uzunluğu',
    haptics: 'Titreşimli Geri Bildirim',
    // Stats
    gamesPlayed: 'Oynanan',
    winPercentage: 'Kazanma %',
    currentStreak: 'Mevcut Seri',
    maxStreak: 'Maks. Seri',
    guessDistribution: 'Tahmin Dağılımı',
    avgGuesses: 'Ort. Tahmin',
    // How to Play
    howToPlayTitle: 'Nasıl Oynanır?',
    close: 'Kapat',
    howToPlayIntro1: 'Kelimeyi 6 denemede tahmin et.',
    howToPlayIntro2: 'Her tahmin geçerli bir kelime olmalıdır. Göndermek için giriş tuşuna bas.',
    howToPlayIntro3: 'Her tahminden sonra, kutucukların rengi tahmininizin kelimeye ne kadar yakın olduğunu göstermek için değişecektir.',
    examples: 'Örnekler',
    exampleWord1: 'SABIR',
    exampleCorrectDesc: "<strong>S</strong> harfi kelimede var ve doğru yerde.",
    exampleWord2: 'HELAL',
    examplePresentDesc: "<strong>L</strong> harfi kelimede var ama yanlış yerde.",
    exampleWord3: 'KADER',
    exampleAbsentDesc: "<strong>R</strong> harfi kelimede hiçbir yerde yok.",
    startPlaying: "Hadi Oynayalım!",
    // Header
    back: 'Geri',
    help: 'Yardım',
    randomWord: 'Yeni Kelime',
    // Home Screen
    homeSubtitle: 'İslami temalı günlük bir kelime oyunu.',
    dailyChallenge: 'Günlük Görev',
    practiceMode: 'Alıştırma Modu',
    dailyStreak: 'Günlük Seri',
    homeFooter: 'Wordle\'dan esinlenilmiştir.',
    // Packs Screen
    packs: 'Kelime Paketleri',
    featureComingSoon: 'Bu Özellik Yakında Gelecek!',
    wordPackManagement: 'Kelime paketi yönetimi gelecekteki bir güncellemede burada mevcut olacak.',
    // Misc A11y
    statusCorrect: 'Doğru',
    statusPresent: 'Mevcut',
    statusAbsent: 'Yok',
    statusEmpty: 'Boş',
     // GameScreen announcements
    guessSummary: "Tahmin {guessNum}",
    // Pack Detail
    packDetails: "Paket Detayları",
    // Create Pack
    createPack: "Paket Oluştur",
    // Confirmation
    areYouSure: "Emin misiniz?",
    // Sharing
    share: 'Paylaş',
     // Badges
    newBadgeUnlocked: 'YENİ ROZET KAZANILDI!',
    unlockedBadge: 'Kazanılan Rozet',
    badge_streak3_name: 'Yükselen Yıldız',
    badge_streak3_desc: '3 günlük bir seriye ulaştın.',
    badge_streak7_name: 'İstikrarlı Alim',
    badge_streak7_desc: '7 günlük bir seriye ulaştın.',
    badge_streak15_name: 'Sadık Öğrenci',
    badge_streak15_desc: '15 günlük bir seriye ulaştın.',
    badge_streak30_name: 'Sabır Ustası',
    badge_streak30_desc: '30 günlük bir seriye ulaştın.',
    badge_perfect_name: 'İlahi İlham',
    badge_perfect_desc: 'Kelimeyi tek denemede bildin.',
    // PWA Prompt
    pwaInstallTitle: 'Tam Deneyim için Yükle',
    pwaInstallBody: 'Çevrimdışı erişim ve daha fazlası!',
    pwaInstallButton: 'Yükle',
    pwaInstallTitleIos: 'Uygulama Gibi Yükle',
    pwaInstallBodyIos: '"Paylaş" <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.875-1.025l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg> simgesine ve sonra "Ana Ekrana Ekle"ye dokun.',
  },
  ar: {
    // Modal titles
    modalWinTitle: 'تهانينا!',
    modalLossTitle: 'حظ أوفر في المرة القادمة!',
    modalSolutionIs: 'الكلمة الصحيحة كانت:',
    playAgain: 'العب مرة أخرى',
    // Toasts
    notEnoughLetters: 'أحرف غير كافية',
    notInWordList: 'ليست في قائمة الكلمات',
    copiedToClipboard: 'تم النسخ إلى الحافظة!',
    // Keyboard
    Enter: 'إدخال',
    // Settings
    settings: 'الإعدادات',
    statistics: 'الإحصائيات',
    theme: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    system: 'النظام',
    language: 'اللغة',
    wordLength: 'طول الكلمة',
    haptics: 'ردود الفعل اللمسية',
    // Stats
    gamesPlayed: 'لعبت',
    winPercentage: 'نسبة الفوز',
    currentStreak: 'سلسلة حالية',
    maxStreak: 'أقصى سلسلة',
    guessDistribution: 'توزيع التخمين',
    avgGuesses: 'متوسط التخمينات',
    // How to Play
    howToPlayTitle: 'كيفية اللعب',
    close: 'إغلاق',
    howToPlayIntro1: 'خمن الكلمة في 6 محاولات.',
    howToPlayIntro2: 'يجب أن يكون كل تخمين كلمة صحيحة. اضغط على زر الإدخال للإرسال.',
    howToPlayIntro3: 'بعد كل تخمين، سيتغير لون المربعات ليظهر مدى قرب تخمينك من الكلمة.',
    examples: 'أمثلة',
    exampleWord1: 'صبر',
    exampleCorrectDesc: "حرف <strong>ص</strong> موجود في الكلمة وفي المكان الصحيح.",
    exampleWord2: 'حلال',
    examplePresentDesc: "حرف <strong>ل</strong> موجود في الكلمة ولكن في المكان الخطأ.",
    exampleWord3: 'قدر',
    exampleAbsentDesc: "حرف <strong>ر</strong> غير موجود في الكلمة في أي مكان.",
    startPlaying: "هيا نلعب!",
    // Header
    back: 'رجوع',
    help: 'مساعدة',
    randomWord: 'كلمة جديدة',
    // Home Screen
    homeSubtitle: 'لعبة كلمات يومية ذات طابع إسلامي.',
    dailyChallenge: 'التحدي اليومي',
    practiceMode: 'وضع التمرين',
    dailyStreak: 'سلسلة يومية',
    homeFooter: 'مستوحاة من لعبة Wordle.',
    // Packs Screen
    packs: 'حزم الكلمات',
    featureComingSoon: 'الميزة قادمة قريبا!',
    wordPackManagement: 'ستكون إدارة حزم الكلمات متاحة هنا في تحديث مستقبلي.',
    // Misc A11y
    statusCorrect: 'صحيح',
    statusPresent: 'موجود',
    statusAbsent: 'غير موجود',
    statusEmpty: 'فارغ',
     // GameScreen announcements
    guessSummary: "تخمين {guessNum}",
    // Pack Detail
    packDetails: "تفاصيل الحزمة",
    // Create Pack
    createPack: "إنشاء حزمة",
    // Confirmation
    areYouSure: "هل أنت متأكد؟",
    // Sharing
    share: 'مشاركة',
    // Badges
    newBadgeUnlocked: 'تم فتح وسام جديد!',
    unlockedBadge: 'الوسام المفتوح',
    badge_streak3_name: 'النجم الصاعد',
    badge_streak3_desc: 'أحرزت سلسلة انتصارات لـ 3 أيام.',
    badge_streak7_name: 'العالم المثابر',
    badge_streak7_desc: 'أحرزت سلسلة انتصارات لـ 7 أيام.',
    badge_streak15_name: 'المتعلم المخلص',
    badge_streak15_desc: 'أحرزت سلسلة انتصارات لـ 15 يومًا.',
    badge_streak30_name: 'سيد الصبر',
    badge_streak30_desc: 'أحرزت سلسلة انتصارات لـ 30 يومًا.',
    badge_perfect_name: 'الإلهام الإلهي',
    badge_perfect_desc: 'خمنت الكلمة من المحاولة الأولى.',
    // PWA Prompt
    pwaInstallTitle: 'ثبّت للحصول على التجربة الكاملة',
    pwaInstallBody: 'وصول بدون انترنت والمزيد!',
    pwaInstallButton: 'تثبيت',
    pwaInstallTitleIos: 'تثبيت كتطبيق',
    pwaInstallBodyIos: 'اضغط على أيقونة "مشاركة" <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.875-1.025l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg> ثم "إضافة إلى الشاشة الرئيسية".',
  },
};
interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  t: (key: string) => string;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const getSystemTheme = (): AppTheme => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const storedSettings = localStorage.getItem('islamicWordleSettings');
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
    } catch (e) {
      console.error('Failed to parse settings from localStorage', e);
    }
    return {
      wordLength: DEFAULT_WORD_LENGTH,
      language: 'tr',
      theme: 'system',
      hapticsEnabled: true,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('islamicWordleSettings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }

    const root = window.document.documentElement;
    const isDark = settings.theme === 'dark' || (settings.theme === 'system' && getSystemTheme() === 'dark');
    root.classList.toggle('dark', isDark);

    // Update html lang and dir for accessibility
    root.lang = settings.language;
    root.dir = settings.language === 'ar' ? 'rtl' : 'ltr';

  }, [settings]);

  useEffect(() => {
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const root = window.document.documentElement;
        root.classList.toggle('dark', mediaQuery.matches);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);
  
  const t = useCallback((key: string): string => {
    const lang = settings.language as Language;
    const translation = translations[lang]?.[key] || translations['en']?.[key] || key;
    return translation;
  }, [settings.language]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, t }}>
      {children}
    </SettingsContext.Provider>
  );
};