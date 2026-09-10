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

  const handleScriptError = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('adBlockDetected'));
    }
  };

  return (
    <>
      {/* Monetag Smart Tag */}
      <Script
        id="monetag-smart-tag"
        src="https://quge5.com/88/tag.min.js"
        data-zone="259240"
        strategy="afterInteractive"
        data-cfasync="false"
        onError={handleScriptError}
      />

      {/* Google AdSense */}
      <Script
        id="google-adsense"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5566043353022333"
        strategy="lazyOnload"
        crossOrigin="anonymous"
        onError={handleScriptError}
      />
    </>
  );
}

/**
 * Detects ad blockers quietly in the background, but only displays
 * the blocking overlay once the user has cleared/closed the Donation Modal.
 */
function AdBlockDetector({ pathname, isModalCleared }) {
  // Cache the detection result across navigation in the same session.
  // null = not checked, true = adblocker found, false = no adblocker.
  const [adBlockStatus, setAdBlockStatus] = useState(null);

  // Listen for script error events dispatched by AdScriptLoader
  useEffect(() => {
    const handleAdBlockEvent = () => {
      setAdBlockStatus(true);
    };

    window.addEventListener('adBlockDetected', handleAdBlockEvent);
    return () => window.removeEventListener('adBlockDetected', handleAdBlockEvent);
  }, []);

  useEffect(() => {
    // If ads are excluded on this route, don't perform any check.
    if (isAdExcluded(pathname)) {
      return;
    }

    // If we already determined that an adblocker is present, no need to re-probe.
    if (adBlockStatus === true) {
      return;
    }

    const checkAdBlocker = async () => {
      try {
        // 1. Universal Network Probe:
        // Test essential ad scripts with Promise.allSettled.
        // Ad blockers (including Brave Shields, uBlock, AdBlock, AdGuard) intercept
        // and reject one or both of these ad network domains.
        const networkResults = await Promise.allSettled([
          fetch("https://quge5.com/88/tag.min.js", { method: "HEAD", mode: "no-cors", cache: "no-store" }),
          fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", { method: "HEAD", mode: "no-cors", cache: "no-store" })
        ]);

        const isNetworkBlocked = networkResults.some((res) => res.status === 'rejected');
        if (isNetworkBlocked) {
          setAdBlockStatus(true);
          return;
        }

        // 2. Universal Cosmetic Filter Probe:
        // Extensions inject CSS rules hiding standard ad class names.
        const bait = document.createElement("div");
        bait.className = "ad-banner ad-container ad-placement public-api-ad adsbox";
        bait.setAttribute("aria-hidden", "true");
        bait.style.position = "absolute";
        bait.style.top = "-9999px";
        bait.style.left = "-9999px";
        bait.style.width = "1px";
        bait.style.height = "1px";
        document.body.appendChild(bait);

        setTimeout(() => {
          const computed = window.getComputedStyle(bait);
          const isCosmeticallyHidden =
            bait.offsetHeight === 0 ||
            bait.offsetWidth === 0 ||
            computed.display === 'none' ||
            computed.visibility === 'hidden';

          if (document.body.contains(bait)) {
            document.body.removeChild(bait);
          }

          setAdBlockStatus(isCosmeticallyHidden);
        }, 250);

      } catch (error) {
        // Any fetch / execution failure indicates blocking
        setAdBlockStatus(true);
      }
    };

    // Run the check quietly in the background after a short delay
    const timer = setTimeout(checkAdBlocker, 400);
    return () => clearTimeout(timer);
  }, [pathname, adBlockStatus]);

  // Determine if we should show the block overlay:
  // ONLY freeze and show the overlay if:
  // 1. Path is not excluded
  // 2. An ad blocker was detected
  // 3. AND the user has dismissed/cleared the donation modal (respecting the reading experience)
  const shouldBlock = !isAdExcluded(pathname) && adBlockStatus === true && isModalCleared;

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
          We rely on ads to keep JEE Challenger free for all aspirants. Please disable your ad blocker or Shields to continue using the platform.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-md"
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
  const [isModalCleared, setIsModalCleared] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasSeen = sessionStorage.getItem('hasSeenDonationModal');
    if (hasSeen) {
      setIsModalCleared(true);
    }

    const handleModalClose = () => {
      setIsModalCleared(true);
    };

    window.addEventListener('donationModalClosed', handleModalClose);
    return () => window.removeEventListener('donationModalClosed', handleModalClose);
  }, []);

  // Intercept SPA navigations to excluded pages before Next.js's router starts.
  //
  // Next.js calls history.pushState() for every client-side navigation. By patching
  // it here (while on an ad-enabled page), we can redirect to a full page load
  // BEFORE any RSC fetch or React render happens — eliminating any visible flash.
  // popstate covers the browser Back/Forward buttons (which bypass pushState).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isExcluded) return;

    const originalPushState = history.pushState.bind(history);

    history.pushState = function (state, title, url) {
      if (typeof url === 'string') {
        const pathname = (url[0] === '/'
          ? url
          : new URL(url, window.location.href).pathname
        ).split('?')[0].split('#')[0];

        if (isAdExcluded(pathname)) {
          window.location.href = url;
          return;
        }
      }
      return originalPushState(state, title, url);
    };

    const handlePopState = () => {
      if (isAdExcluded(window.location.pathname)) {
        window.location.reload();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      history.pushState = originalPushState;
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isExcluded]);


  return (
    <>
      {/* 
        Background detection starts immediately on non-excluded routes,
        but the alert overlay will wait until the user has dismissed the donation modal.
      */}
      <AdBlockDetector pathname={pathname} isModalCleared={isModalCleared} />

      {/* 
        Only inject ad scripts once the donation modal has been dismissed
      */}
      {isModalCleared && (
        <AdScriptLoader pathname={pathname} />
      )}
    </>
  );
}

