
const CACHE_NAME = 'islamic-wordle-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/metadata.json',
  '/App.tsx',
  '/constants.ts',
  '/types.ts',
  '/services/geminiService.ts',
  '/components/Header.tsx',
  '/components/GameBoard.tsx',
  '/components/Tile.tsx',
  '/components/Keyboard.tsx',
  '/components/GameModal.tsx',
  '/components/Loader.tsx',
  '/components/Toast.tsx',
  '/src/features/game/GameScreen.tsx',
  '/src/features/home/HomeScreen.tsx',
  '/src/features/settings/SettingsScreen.tsx',
  '/src/services/dailyChallengeService.ts',
  '/src/services/statsService.ts',
  '/src/services/wordService.ts',
  '/src/services/soundService.ts',
  '/src/contexts/SettingsContext.tsx',
  '/src/hooks/useSettings.ts',
  '/src/hooks/useFocusTrap.ts',
  '/src/components/AdsenseAd.tsx',
  '/src/components/DailySummaryModal.tsx',
  '/src/components/HowToPlayModal.tsx',
  '/src/components/StatsChart.tsx',
  '/src/components/StatsSummary.tsx',
  '/src/utils/shareFormatter.ts',
  '/src/types.ts',
  '/src/seed/ar_extended.ts',
  '/src/seed/en_extended.ts',
  '/src/seed/tr_core.ts',
  '/src/seed/tr_extended.ts',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Inter:wght@400;600;700;800&display=swap',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE.map(url => new Request(url, { mode: 'no-cors' })))
          .catch(err => {
            console.error('Failed to cache URLs during install:', err);
          });
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
