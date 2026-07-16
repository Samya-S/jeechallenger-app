// Utility functions for progress tracking and localStorage management

export const LEGACY_STORAGE_KEY = 'jee_syllabus_progress';
export const ANONYMOUS_STORAGE_KEY = 'jee_syllabus_progress_anonymous';

const progressListeners = new Set();

function notifyProgressListeners() {
  progressListeners.forEach((fn) => fn());
}

export function getStorageKey(userId) {
  return userId ? `jee_syllabus_progress_${userId}` : ANONYMOUS_STORAGE_KEY;
}

/**
 * Perform a one-time migration from the legacy key to the anonymous key
 * if the anonymous key doesn't exist yet, but the legacy one does.
 */
function migrateLegacyIfNeeded() {
  if (typeof window === 'undefined') return;
  try {
    const anonymousData = localStorage.getItem(ANONYMOUS_STORAGE_KEY);
    if (!anonymousData) {
      const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyData) {
        localStorage.setItem(ANONYMOUS_STORAGE_KEY, legacyData);
        // We keep the legacy key around for any very old open tabs, 
        // but ANONYMOUS_STORAGE_KEY is now the source of truth for logged-out users.
      }
    }
  } catch (error) {
    console.error('Error migrating legacy data:', error);
  }
}

// Run migration immediately on load if possible
if (typeof window !== 'undefined') {
  migrateLegacyIfNeeded();
}

/**
 * Subscribe to progress changes (same tab + other tabs via storage event).
 * Used with useSyncExternalStore for hydration-safe reads.
 */
export function subscribeProgressData(userId, onStoreChange) {
  if (typeof window === 'undefined') return () => {};
  
  const key = getStorageKey(userId);

  const onStorage = (e) => {
    if (e.key === key || e.key === null) onStoreChange();
  };
  window.addEventListener('storage', onStorage);
  
  // Wrap the callback so notifyProgressListeners can trigger it for same-tab updates
  const listenerWrapper = () => onStoreChange();
  progressListeners.add(listenerWrapper);
  
  return () => {
    window.removeEventListener('storage', onStorage);
    progressListeners.delete(listenerWrapper);
  };
}

/** Raw localStorage snapshot string for useSyncExternalStore getSnapshot */
export function getProgressStorageSnapshot(userId) {
  if (typeof window === 'undefined') return '{}';
  const key = getStorageKey(userId);
  try {
    return localStorage.getItem(key) ?? '{}';
  } catch {
    return '{}';
  }
}

/**
 * Get progress data from localStorage
 */
export const getProgressData = (userId) => {
  if (typeof window === 'undefined') return {};
  const key = getStorageKey(userId);
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading progress data:', error);
    return {};
  }
};

/**
 * Get anonymous progress data specifically (useful for migration/claiming)
 */
export const getAnonymousProgressData = () => {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem(ANONYMOUS_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

/**
 * Delete the anonymous progress data after it has been claimed
 */
export const deleteAnonymousProgressData = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(ANONYMOUS_STORAGE_KEY);
    // Also remove legacy to be completely clean
    localStorage.removeItem(LEGACY_STORAGE_KEY); 
  } catch (error) {
    console.error('Error deleting anonymous progress data:', error);
  }
};


/**
 * Save progress data to localStorage
 */
export const saveProgressData = (userId, data) => {
  if (typeof window === 'undefined') return;
  const key = getStorageKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyProgressListeners();
  } catch (error) {
    console.error('Error saving progress data:', error);
  }
};

/**
 * Update progress for a specific chapter and task
 */
export const updateChapterProgress = (userId, subject, chapterId, taskType, completed) => {
  const progressData = getProgressData(userId);
  
  if (!progressData[subject]) {
    progressData[subject] = {};
  }
  
  if (!progressData[subject][chapterId]) {
    progressData[subject][chapterId] = {
      theory: false,
      pyqs: false,
      revision: false
    };
  }
  
  progressData[subject][chapterId][taskType] = completed;
  saveProgressData(userId, progressData);
  
  return progressData;
};

/**
 * Get progress for a specific chapter
 */
export const getChapterProgress = (userId, subject, chapterId) => {
  const progressData = getProgressData(userId);
  
  if (progressData[subject] && progressData[subject][chapterId]) {
    return progressData[subject][chapterId];
  }
  
  return {
    theory: false,
    pyqs: false,
    revision: false
  };
};

/**
 * Calculate overall progress for a subject
 */
export const calculateSubjectProgress = (subject, chapters, progressData) => {
  const subjectData = progressData[subject] || {};
  
  let totalTasks = chapters.length * 3; // 3 tasks per chapter (theory, pyqs, revision)
  let completedTasks = 0;
  
  let theoryDone = 0;
  let pyqsDone = 0;
  let revisionDone = 0;
  
  chapters.forEach(chapter => {
    const chapterProgress = subjectData[chapter.id] || {
      theory: false,
      pyqs: false,
      revision: false
    };
    
    if (chapterProgress.theory) {
      completedTasks++;
      theoryDone++;
    }
    if (chapterProgress.pyqs) {
      completedTasks++;
      pyqsDone++;
    }
    if (chapterProgress.revision) {
      completedTasks++;
      revisionDone++;
    }
  });
  
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return {
    percentage,
    completedTasks,
    totalTasks,
    theoryDone,
    pyqsDone,
    revisionDone,
    chaptersCompleted: chapters.filter(chapter => {
      const chapterProgress = subjectData[chapter.id];
      return chapterProgress && 
             chapterProgress.theory && 
             chapterProgress.pyqs && 
             chapterProgress.revision;
    }).length,
    totalChapters: chapters.length
  };
};

/**
 * Calculate overall progress across all subjects
 */
export const calculateOverallProgress = (syllabusData, progressData) => {
  let totalTasks = 0;
  let completedTasks = 0;
  
  Object.keys(syllabusData).forEach(subject => {
    const stats = calculateSubjectProgress(subject, syllabusData[subject].chapters, progressData);
    totalTasks += stats.totalTasks;
    completedTasks += stats.completedTasks;
  });
  
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return {
    percentage,
    completedTasks,
    totalTasks
  };
};

/**
 * Reset all progress data
 */
export const resetAllProgress = (userId) => {
  if (typeof window === 'undefined') return;
  const key = getStorageKey(userId);
  try {
    localStorage.removeItem(key);
    notifyProgressListeners();
  } catch (error) {
    console.error('Error resetting progress data:', error);
  }
};

/**
 * Export progress data as JSON
 */
export const exportProgress = (userId) => {
  const data = getProgressData(userId);
  return JSON.stringify(data, null, 2);
};

/**
 * Import progress data from JSON
 */
export const importProgress = (userId, jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    saveProgressData(userId, data);
    return true;
  } catch (error) {
    console.error('Error importing progress data:', error);
    return false;
  }
};
