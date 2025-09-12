import React, { useEffect, useRef } from 'react';

// Define the type for the adsbygoogle array on the window object
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdsenseAd: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adPushedRef = useRef(false);

  useEffect(() => {
    const adContainer = adContainerRef.current;
    if (!adContainer) return;

    // Use ResizeObserver to push the ad only when the container has a valid width.
    // This is the most reliable way to avoid the "availableWidth=0" error, as it waits
    // for the browser to confirm the layout is stable and sized.
    const observer = new ResizeObserver(entries => {
      // Check if the ad has already been pushed.
      if (adPushedRef.current) {
        observer.disconnect();
        return;
      }
      
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            // Mark the ad as pushed to prevent this from running again.
            adPushedRef.current = true;
          } catch (e) {
            console.error('Adsense push error:', e);
          }
          // Once the ad is pushed, we can stop observing.
          observer.disconnect();
        }
      }
    });

    observer.observe(adContainer);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={adContainerRef} className="my-4 w-full min-h-[50px]" aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="auto"
        data-ad-client="ca-pub-9655763725113422"
        data-ad-slot="9921304398"
      ></ins>
    </div>
  );
};

export default AdsenseAd;
