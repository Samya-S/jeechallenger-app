"use client";

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useState, useEffect } from 'react';
import { isAdExcluded } from '@/config/ad-config';

/**
 * Handles injection of ad script tags (Monetag and Google AdSense)
 */
function AdScriptLoader({ pathname }) {
  if (isAdExcluded(pathname)) {
    return null;
  }

  return (
    <>
      {/* Monetag Smart Tag */}
      <Script
        id="monetag-smart-tag"
        src="https://quge5.com/88/tag.min.js"
        data-zone="259240"
        strategy="afterInteractive"
        data-cfasync="false"
      />

      {/* Google AdSense */}
      <Script
        id="google-adsense"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566043353022333"
        strategy="lazyOnload"
        crossOrigin="anonymous"
      />
    </>
  );
}

/**
 * Detects ad blockers and shows lock screen overlay if necessary
 */
function AdBlockDetector({ pathname }) {
  // Cache the detection result across navigation in the same session.
  // null = not checked, true = adblocker found, false = no adblocker.
  const [adBlockStatus, setAdBlockStatus] = useState(null);

  useEffect(() => {
    // If ads are excluded on this route, don't perform any check now.
    if (isAdExcluded(pathname)) {
      return;
    }

    // If we already completed the check for this session, don't repeat it.
    if (adBlockStatus !== null) {
      return;
    }

    const checkAdBlocker = async () => {
      try {
        // Try fetching the ad script URLs that are crucial for the site
        // Ad blockers will typically intercept and block these network requests
        await Promise.all([
          fetch("https://quge5.com/88/tag.min.js", { method: "HEAD", mode: "no-cors", cache: "no-store" }),
          fetch("https://3nbf4.com/act/files/service-worker.min.js", { method: "HEAD", mode: "no-cors", cache: "no-store" })
        ]);

        // Secondary check using a known adblock bait
        const bait = document.createElement("div");
        bait.className = "ad-banner ad-container ad-placement public-api-ad";
        bait.style.position = "absolute";
        bait.style.top = "-999px";
        bait.style.left = "-999px";
        bait.style.height = "10px";
        document.body.appendChild(bait);

        setTimeout(() => {
          if (bait.offsetHeight === 0 || window.getComputedStyle(bait).display === 'none') {
            setAdBlockStatus(true);
          } else {
            setAdBlockStatus(false);
          }
          if (document.body.contains(bait)) {
            document.body.removeChild(bait);
          }
        }, 300);

      } catch (error) {
        // Fetch failed, meaning it was likely blocked by an ad blocker
        setAdBlockStatus(true);
      }
    };

    // Run the check after a short delay to ensure extensions have loaded
    const timer = setTimeout(checkAdBlocker, 500);
    return () => clearTimeout(timer);
  }, [pathname, adBlockStatus]);

  // Determine if we should show the block overlay
  const shouldBlock = !isAdExcluded(pathname) && adBlockStatus === true;

  // Manage body scroll lock
  useEffect(() => {
    if (shouldBlock) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [shouldBlock]);

  if (!shouldBlock) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4"
      style={{ zIndex: 2147483647 }}
    >
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl border border-gray-200 dark:border-gray-800">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Ad Blocker Detected
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We rely on ads to keep JEE Challenger free. Please disable your ad blocker or whitelist our site to continue using the platform.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          I have disabled it, Reload Page
        </button>
      </div>
    </div>
  );
}

/**
 * Unified Ad Manager combining loading and block detection
 */
export default function AdManager() {
  const pathname = usePathname();
  const isExcluded = isAdExcluded(pathname);

  // Monitor SPA transition from ad-enabled pages to ad-excluded pages.
  // Monetag registers persistent click/mousedown listeners globally on the document/window.
  // When navigating client-side, these listeners persist even when the script tag is unmounted.
  // A hard reload on entering an excluded page is the cleanest way to wipe the window event queue.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const wasAdEnabled = sessionStorage.getItem('was_ad_enabled') === 'true';

    if (isExcluded) {
      if (wasAdEnabled) {
        sessionStorage.setItem('was_ad_enabled', 'false');
        window.location.reload();
      }
    } else {
      sessionStorage.setItem('was_ad_enabled', 'true');
    }
  }, [pathname, isExcluded]);

  return (
    <>
      <AdScriptLoader pathname={pathname} />
      {/* <AdBlockDetector pathname={pathname} /> */}
    </>
  );
}
