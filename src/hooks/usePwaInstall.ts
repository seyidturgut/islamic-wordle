import { useState, useEffect, useCallback } from 'react';

// Define the event type for beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// FIX: Add MSStream to the Window interface to fix a TypeScript error.
// This property is used for detecting Internet Explorer to correctly identify Safari on iOS.
declare global {
  interface Window {
    MSStream?: unknown;
  }
}

const IOS_SAFARI_USER_AGENT = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const PWA_PROMPT_DISMISSED_KEY = 'pwaInstallDismissed_v1';

export const usePwaInstall = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallVisible, setIsInstallVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const castedEvent = event as BeforeInstallPromptEvent;
      setInstallPromptEvent(castedEvent);

      const hasBeenDismissed = localStorage.getItem(PWA_PROMPT_DISMISSED_KEY);
      if (!hasBeenDismissed) {
        setIsInstallVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check for iOS on initial load
    const hasBeenDismissed = localStorage.getItem(PWA_PROMPT_DISMISSED_KEY);
    if (IOS_SAFARI_USER_AGENT && !hasBeenDismissed) {
        setIsInstallVisible(true);
    }


    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!installPromptEvent) return;

    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the PWA installation');
    } else {
      console.log('User dismissed the PWA installation');
    }
    
    // The prompt can only be used once. Clear it.
    setInstallPromptEvent(null);
    setIsInstallVisible(false);
    localStorage.setItem(PWA_PROMPT_DISMISSED_KEY, 'true');
  }, [installPromptEvent]);

  const handleDismiss = useCallback(() => {
    setIsInstallVisible(false);
    localStorage.setItem(PWA_PROMPT_DISMISSED_KEY, 'true');
  }, []);

  return {
    isInstallVisible,
    isIos: IOS_SAFARI_USER_AGENT,
    handleInstall,
    handleDismiss,
  };
};
