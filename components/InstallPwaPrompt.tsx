import React from 'react';
import { useSettings } from '../src/hooks/useSettings';

interface InstallPwaPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
  isIos: boolean;
}

export const InstallPwaPrompt: React.FC<InstallPwaPromptProps> = ({ onInstall, onDismiss, isIos }) => {
  const { t } = useSettings();

  const focusRingClasses = "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-50 animate-slide-up" role="dialog" aria-labelledby="pwa-prompt-title">
      <div className="bg-gray-800 text-white rounded-lg shadow-2xl p-4 flex items-center justify-between space-x-4 rtl:space-x-reverse">
        <div className="flex-shrink-0">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
           </svg>
        </div>
        <div className="flex-grow">
          {isIos ? (
            <div>
              <h3 id="pwa-prompt-title" className="font-bold text-sm">Uygulama Gibi Yükle</h3>
              <p className="text-xs text-gray-300">
                "Paylaş"
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mx-1" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.875-1.025l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
                 simgesine ve sonra "Ana Ekrana Ekle"ye dokun.
              </p>
            </div>
          ) : (
            <div>
              <h3 id="pwa-prompt-title" className="font-bold">Tam Deneyim için Yükle</h3>
              <p className="text-sm text-gray-300">Çevrimdışı erişim ve daha fazlası!</p>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            {!isIos && (
                <button
                    onClick={onInstall}
                    className={`px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md text-sm whitespace-nowrap ${focusRingClasses}`}
                >
                    Yükle
                </button>
            )}
            <button
                onClick={onDismiss}
                className={`p-2 rounded-full hover:bg-gray-700 ${focusRingClasses}`}
                aria-label={t('close')}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
      </div>
    </div>
  );
};