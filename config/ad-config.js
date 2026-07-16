// Configuration for ad paths and exclusions

// List of path prefixes where ads should NOT be loaded and AdBlock warning should NOT be shown
export const EXCLUDED_AD_PATHS = [
  '/login',
  '/profile',
  '/ai-tutor',
  '/materials/chemistry/periodic-table',
  '/donate',
  '/disclaimer',
  '/privacy-policy',
  '/terms-of-service',
  '/contact-us',
];

/**
 * Checks if the given pathname is excluded from displaying ads.
 * Matches if the pathname is exactly the excluded path, or if it is a sub-route (e.g., /ai-tutor/chat).
 * @param {string} pathname 
 * @returns {boolean}
 */
export function isAdExcluded(pathname) {
  return EXCLUDED_AD_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );
}
