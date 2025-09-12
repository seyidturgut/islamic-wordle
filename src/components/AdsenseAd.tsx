import React, { useEffect } from 'react';

// Define the type for the adsbygoogle array on the window object
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdsenseAd: React.FC = () => {
  useEffect(() => {
    try {
      // This script corresponds to the (adsbygoogle = window.adsbygoogle || []).push({}); call
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('Adsense error:', e);
    }
  }, []);

  // This JSX represents the <ins> tag provided in the AdSense code
  return (
    <div className="my-4 w-full" aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="auto"
        data-ad-client="ca-pub-9655763725113422"
        data-ad-slot="9921304398"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdsenseAd;
