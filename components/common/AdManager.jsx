"use client";

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { isAdExcluded } from '@/config/ad-config';

// Module-scoped flag: coordinates smooth navigation from AdBlock modal to excluded pages
let isNavigatingFromAdBlockModal = false;

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

  const modalRef = useRef(null);
  const observerRef = useRef(null);
  const isNavigatingRef = useRef(false);

  // Active DOM tamper defense:
  // - Purely event-driven via MutationObserver (0ms CPU while idle).
  // - If user attempts style manipulation (e.g. display: none, opacity: 0, removing overflow: hidden),
  //   it directly undoes the change in place without reloading.
  // - If undo fails or if the user completely deletes/removes the modal element,
  //   it falls back to window.location.reload().
  useEffect(() => {
    if (!shouldBlock || typeof window === 'undefined') {
      return;
    }

    isNavigatingRef.current = false;

    const styleId = 'adblock-tamper-shield';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      styleTag.textContent = `
        body.adblock-active-freeze > *:not(#adblock-detector-overlay) {
          filter: blur(12px) !important;
          pointer-events: none !important;
          user-select: none !important;
          -webkit-user-select: none !important;
        }
        body.adblock-active-freeze {
          overflow: hidden !important;
        }
      `;
      document.head.appendChild(styleTag);
    }

    document.body.classList.add('adblock-active-freeze');
    document.body.style.setProperty('overflow', 'hidden', 'important');

    let isEnforcing = false;

    const checkAndEnforce = () => {
      if (isEnforcing || isNavigatingRef.current) return;
      if (isAdExcluded(pathname) || (typeof window !== 'undefined' && isAdExcluded(window.location.pathname))) return;
      isEnforcing = true;

      try {
        const modal = document.getElementById('adblock-detector-overlay');

        // Check if modal element or its inner card was removed from DOM
        // (Cannot undo cleanly without desyncing React Virtual DOM -> Reload page)
        if (!modal || !document.body.contains(modal) || !modal.firstElementChild) {
          window.location.reload();
          return;
        }

        // Try to directly undo style tampering
        if (!document.body.classList.contains('adblock-active-freeze')) {
          document.body.classList.add('adblock-active-freeze');
        }
        if (document.body.style.overflow !== 'hidden') {
          document.body.style.setProperty('overflow', 'hidden', 'important');
        }

        modal.style.setProperty('display', 'flex', 'important');
        modal.style.setProperty('visibility', 'visible', 'important');
        modal.style.setProperty('opacity', '1', 'important');
        modal.style.setProperty('z-index', '2147483647', 'important');
        modal.style.setProperty('pointer-events', 'auto', 'important');

        // Verify if undo succeeded
        const computed = window.getComputedStyle(modal);
        const isStillHidden =
          computed.display === 'none' ||
          computed.visibility === 'hidden' ||
          parseFloat(computed.opacity) < 0.1 ||
          modal.offsetHeight === 0;

        if (isStillHidden) {
          // If undo failed (e.g. extension forced !important external rule), reload
          window.location.reload();
        }
      } catch (err) {
        window.location.reload();
      } finally {
        setTimeout(() => {
          isEnforcing = false;
        }, 0);
      }
    };

    // Attach MutationObserver on document.body to react ONLY when DOM is touched
    const observer = new MutationObserver(() => {
      checkAndEnforce();
    });
    observerRef.current = observer;

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden'],
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      document.body.classList.remove('adblock-active-freeze');
      document.body.style.overflow = 'unset';
      const existingStyle = document.getElementById(styleId);
      if (existingStyle && document.head.contains(existingStyle)) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [shouldBlock, pathname]);

  const handleLegitimateLeave = () => {
    isNavigatingRef.current = true;
    isNavigatingFromAdBlockModal = true;
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    document.body.classList.remove('adblock-active-freeze');
    document.body.style.overflow = 'unset';
    const existingStyle = document.getElementById('adblock-tamper-shield');
    if (existingStyle && document.head.contains(existingStyle)) {
      document.head.removeChild(existingStyle);
    }
  };

  if (!shouldBlock) return null;

  return (
    <div
      id="adblock-detector-overlay"
      ref={modalRef}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl p-4"
      style={{ zIndex: 2147483647 }}
    >
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl max-w-md w-full text-center shadow-2xl border border-gray-200 dark:border-gray-800 animate-fade-in">
        <div className="mx-auto w-14 h-14 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Ad Blocker Detected
        </h2>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
          We are committed to keeping JEE Challenger 100% free for all aspirants. Maintaining our infrastructure and AI tools costs real money, and we currently rely on ads to keep the platform running—<strong>though we hate them as much as you do!</strong>
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl p-3.5 mb-6 text-xs text-blue-800 dark:text-blue-200 text-left leading-relaxed">
          🎯 <strong>Our Community Goal:</strong> Once we reach our bare minimum funding goal to cover infrastructure costs, we will permanently remove all pop-up ads and redirects for everyone!
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm"
          >
            I have disabled it, Reload Page
          </button>

          <Link
            href="/donate"
            onClick={handleLegitimateLeave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLegitimateLeave();
              }
            }}
            className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-gray-300 dark:border-gray-700 text-sm flex items-center justify-center gap-2"
          >
            <span>❤️ Support Us (Help Reach the Goal)</span>
          </Link>
        </div>
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
  const [isModalCleared, setIsModalCleared] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(sessionStorage.getItem('hasSeenDonationModal'));
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
          if (isNavigatingFromAdBlockModal) {
            isNavigatingFromAdBlockModal = false;
            return originalPushState(state, title, url);
          }
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

