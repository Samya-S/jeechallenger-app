'use client';

import React, { memo, useCallback } from 'react';
import Link from 'next/link';

const SUBJECT_MAP = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  mathematics: 'Mathematics',
};

/**
 * ChapterRow Component - Displays a chapter with checkboxes for different task types
 * @param {Object} props
 * @param {Object} props.chapter - Chapter data
 * @param {string} props.subject - Subject key
 * @param {Object} props.progress - Progress state for this chapter
 * @param {Function} props.onToggle - Handler for checkbox toggle
 */
const ChapterRow = memo(({ chapter, subject, progress, onToggle }) => {
  const { id, name, unit } = chapter;
  const isFullyCompleted = progress.theory && progress.pyqs && progress.revision;
  const subjectTitle = SUBJECT_MAP[subject?.toLowerCase()] || subject;
  const pyqParams = new URLSearchParams({
    subject: subjectTitle,
    chapter: name,
  });
  const pyqHref = `/previous-year-questions?${pyqParams.toString()}`;

  const handleCheckboxChange = useCallback((taskType) => {
    onToggle(subject, id, taskType, !progress[taskType]);
  }, [onToggle, subject, id, progress]);

  return (
    <div 
      className={`
        border-b border-gray-200 dark:border-gray-700 
        py-3 px-3 sm:py-4 sm:px-4 
        hover:bg-gray-100/50 dark:hover:bg-gray-700/30
        ${isFullyCompleted ? 'bg-green-50/50 dark:bg-green-900/10 border-l-4 border-l-green-500 dark:border-l-green-400' : ''}
      `}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Chapter Name and Unit */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                {name}
              </h3>
              {isFullyCompleted && (
                <span className="flex-shrink-0 text-green-600 dark:text-green-400 animate-pulse" title="Chapter Completed">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 sm:h-5 sm:w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </span>
              )}
            </div>
            <Link
              href={pyqHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 hover:border-orange-300 dark:hover:border-orange-700 transition-colors shrink-0"
              title={`Practice Previous Year Questions for ${name}`}
            >
              <span>Practice PYQs</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-3 w-3 opacity-70" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Checkboxes - Spread evenly across mobile with clean custom styling */}
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-6 md:gap-8 w-full sm:w-auto">
          {/* Theory Done */}
          <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group py-1.5 px-2 sm:py-1 sm:px-2 rounded-md hover:bg-gray-100/60 dark:hover:bg-gray-700/30 transition-colors select-none">
            <input
              type="checkbox"
              checked={progress.theory}
              onChange={() => handleCheckboxChange('theory')}
              className="sr-only peer"
              aria-label={`Theory completion for ${name}`}
            />
            <div 
              className={`
                w-4 h-4 sm:w-5 sm:h-5 rounded border transition-all flex items-center justify-center shrink-0
                peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-1 dark:peer-focus-visible:ring-offset-gray-800
                ${progress.theory 
                  ? 'bg-blue-600 border-blue-600 dark:bg-blue-600 dark:border-blue-500 text-white shadow-sm' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/80 group-hover:border-gray-400 dark:group-hover:border-gray-500'
                }
              `}
            >
              {progress.theory && (
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Theory
            </span>
          </label>

          {/* PYQs Done */}
          <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group py-1.5 px-2 sm:py-1 sm:px-2 rounded-md hover:bg-gray-100/60 dark:hover:bg-gray-700/30 transition-colors select-none">
            <input
              type="checkbox"
              checked={progress.pyqs}
              onChange={() => handleCheckboxChange('pyqs')}
              className="sr-only peer"
              aria-label={`PYQs completion for ${name}`}
            />
            <div 
              className={`
                w-4 h-4 sm:w-5 sm:h-5 rounded border transition-all flex items-center justify-center shrink-0
                peer-focus-visible:ring-2 peer-focus-visible:ring-orange-500 peer-focus-visible:ring-offset-1 dark:peer-focus-visible:ring-offset-gray-800
                ${progress.pyqs 
                  ? 'bg-orange-600 border-orange-600 dark:bg-orange-600 dark:border-orange-500 text-white shadow-sm' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/80 group-hover:border-gray-400 dark:group-hover:border-gray-500'
                }
              `}
            >
              {progress.pyqs && (
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              PYQs
            </span>
          </label>

          {/* Revision Done */}
          <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group py-1.5 px-2 sm:py-1 sm:px-2 rounded-md hover:bg-gray-100/60 dark:hover:bg-gray-700/30 transition-colors select-none">
            <input
              type="checkbox"
              checked={progress.revision}
              onChange={() => handleCheckboxChange('revision')}
              className="sr-only peer"
              aria-label={`Revision completion for ${name}`}
            />
            <div 
              className={`
                w-4 h-4 sm:w-5 sm:h-5 rounded border transition-all flex items-center justify-center shrink-0
                peer-focus-visible:ring-2 peer-focus-visible:ring-green-500 peer-focus-visible:ring-offset-1 dark:peer-focus-visible:ring-offset-gray-800
                ${progress.revision 
                  ? 'bg-green-600 border-green-600 dark:bg-green-600 dark:border-green-500 text-white shadow-sm' 
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900/80 group-hover:border-gray-400 dark:group-hover:border-gray-500'
                }
              `}
            >
              {progress.revision && (
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              Revision
            </span>
          </label>
        </div>
      </div>
    </div>
  );
});

ChapterRow.displayName = 'ChapterRow';

/**
 * ChapterList Component - Groups and displays chapter rows by unit
 * @param {Object} props
 * @param {string} props.subject - Subject key
 * @param {Array} props.chapters - Array of chapters
 * @param {Object} props.progressData - Progress data for all chapters
 * @param {Function} props.onToggle - Handler for checkbox toggle
 */
export const ChapterList = ({ subject, chapters, progressData, onToggle }) => {
  // Group chapters by unit
  const groupedChapters = chapters.reduce((acc, chapter) => {
    const unit = chapter.unit || 'Other';
    if (!acc[unit]) {
      acc[unit] = [];
    }
    acc[unit].push(chapter);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(groupedChapters).map(([unit, unitChapters]) => (
        <div key={unit} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Unit Header */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-700/80 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide">
              {unit}
            </h3>
          </div>

          {/* Chapters in this unit */}
          <div>
            {unitChapters.map(chapter => {
              const progress = progressData[chapter.id] || {
                theory: false,
                pyqs: false,
                revision: false
              };
              
              return (
                <ChapterRow
                  key={chapter.id}
                  chapter={chapter}
                  subject={subject}
                  progress={progress}
                  onToggle={onToggle}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChapterRow;
