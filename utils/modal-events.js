export const MODAL_CLEARED_EVENT = 'siteModalClosed';
export const COMMON_MODAL_STORAGE_KEY = 'hasSeenModal';

/**
 * Checks whether the initial site modal has already been cleared in this session.
 */
export const isInitialModalCleared = () => {
  if (typeof window === 'undefined') return false;
  return Boolean(sessionStorage.getItem(COMMON_MODAL_STORAGE_KEY));
};

/**
 * Marks the site modal as cleared and notifies listeners (e.g. AdManager).
 */
export const notifyModalCleared = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(COMMON_MODAL_STORAGE_KEY, 'true');
  window.dispatchEvent(new CustomEvent(MODAL_CLEARED_EVENT));
};
