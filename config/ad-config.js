// Configuration for ad paths and exclusions

// List of path prefixes where ads should NOT be loaded and AdBlock warning should NOT be shown
export const EXCLUDED_AD_PATHS = [
  '/login',
  '/profile',

  '/ai-tutor',
  '/syllabus-tracker',
  '/chemistry/periodic-table',

  '/donate',
  '/disclaimer',
  '/privacy-policy',
  '/terms-of-service',
  '/contact-us',
];

/**
 * Checks if the given pathname is excluded from displaying ads.
 * Matches if the pathname is exactly the excluded path, or if it is a sub-route (e.g., /ai-tutor/chat).
 * Uses pure primitive operations to prevent ad-blockers / scriptlets from defusing checks via String.prototype tampering.
 * @param {string} pathname 
 * @returns {boolean}
 */
export function isAdExcluded(pathname) {
  if (process.env.NODE_ENV === 'development' || !pathname || pathname === '/') {
    return true;
  }

  // Strip query and hash if present using primitive loop
  let cleanPath = '';
  for (let i = 0; i < pathname.length; i++) {
    const ch = pathname[i];
    if (ch === '?' || ch === '#') break;
    cleanPath += ch;
  }

  // Strip trailing slash if present (e.g. /contact-us/ -> /contact-us)
  let end = cleanPath.length;
  while (end > 1 && cleanPath[end - 1] === '/') {
    end--;
  }
  let normalizedPath = '';
  for (let i = 0; i < end; i++) {
    normalizedPath += cleanPath[i];
  }

  for (let i = 0; i < EXCLUDED_AD_PATHS.length; i++) {
    const excluded = EXCLUDED_AD_PATHS[i];

    // 1. Exact match (e.g. /contact-us === /contact-us)
    if (normalizedPath === excluded) {
      return true;
    }

    // 2. Sub-route match (e.g. /contact-us/feedback starts with /contact-us/)
    // Evaluated via primitive character indexing to be immune to String.prototype tampering
    const prefix = excluded + '/';
    if (normalizedPath.length > prefix.length) {
      let matches = true;
      for (let j = 0; j < prefix.length; j++) {
        if (normalizedPath[j] !== prefix[j]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return true;
      }
    }
  }

  return false;
}

