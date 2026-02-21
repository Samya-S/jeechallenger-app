// Utility functions for progress tracking and localStorage management

const STORAGE_KEY = 'jee_syllabus_progress';

/**
 * Get progress data from localStorage
 * @returns {Object} Progress data object
 */
export const getProgressData = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading progress data:', error);
    return {};
  }
};

/**
 * Save progress data to localStorage
 * @param {Object} data - Progress data to save
 */
export const saveProgressData = (data) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving progress data:', error);
  }
};

/**
 * Update progress for a specific chapter and task
 * @param {string} subject - Subject name (physics, chemistry, mathematics)
 * @param {string} chapterId - Chapter ID
 * @param {string} taskType - Task type (theory, pyqs, revision)
 * @param {boolean} completed - Completion status
 */
export const updateChapterProgress = (subject, chapterId, taskType, completed) => {
  const progressData = getProgressData();
  
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
  saveProgressData(progressData);
  
  return progressData;
};

/**
 * Get progress for a specific chapter
 * @param {string} subject - Subject name
 * @param {string} chapterId - Chapter ID
 * @returns {Object} Chapter progress object
 */
export const getChapterProgress = (subject, chapterId) => {
  const progressData = getProgressData();
  
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
 * @param {string} subject - Subject name
 * @param {Array} chapters - Array of chapters
 * @returns {Object} Progress statistics
 */
export const calculateSubjectProgress = (subject, chapters) => {
  const progressData = getProgressData();
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
 * @param {Object} syllabusData - Complete syllabus data
 * @returns {Object} Overall progress statistics
 */
export const calculateOverallProgress = (syllabusData) => {
  let totalTasks = 0;
  let completedTasks = 0;
  
  Object.keys(syllabusData).forEach(subject => {
    const stats = calculateSubjectProgress(subject, syllabusData[subject].chapters);
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
export const resetAllProgress = () => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting progress data:', error);
  }
};

/**
 * Export progress data as JSON
 * @returns {string} JSON string of progress data
 */
export const exportProgress = () => {
  const data = getProgressData();
  return JSON.stringify(data, null, 2);
};

/**
 * Import progress data from JSON
 * @param {string} jsonString - JSON string to import
 * @returns {boolean} Success status
 */
export const importProgress = (jsonString) => {
  try {
    const data = JSON.parse(jsonString);
    saveProgressData(data);
    return true;
  } catch (error) {
    console.error('Error importing progress data:', error);
    return false;
  }
};
