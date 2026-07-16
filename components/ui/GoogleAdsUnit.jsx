"use client";
import { useEffect } from 'react';

const GoogleAdsUnit = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566043353022333';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <div style={{ minHeight: '250px' }} className="flex items-center justify-center">
      {/* Ad unit 2 */}
      <ins className="adsbygoogle"
           style={{ display: 'block', minHeight: '250px' }}
           data-ad-client="ca-pub-5566043353022333"
           data-ad-slot="4992040057"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

export default GoogleAdsUnit;