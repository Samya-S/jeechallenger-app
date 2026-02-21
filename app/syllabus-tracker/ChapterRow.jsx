'use client';

import React from 'react';

/**
 * ChapterRow Component - Displays a chapter with checkboxes for different task types
 * @param {Object} props
 * @param {Object} props.chapter - Chapter data
 * @param {string} props.subject - Subject key
 * @param {Object} props.progress - Progress state for this chapter
 * @param {Function} props.onToggle - Handler for checkbox toggle
 */
const ChapterRow = ({ chapter, subject, progress, onToggle }) => {
  const { id, name, unit } = chapter;
  const isFullyCompleted = progress.theory && progress.pyqs && progress.revision;

  const handleCheckboxChange = (taskType) => {
    onToggle(subject, id, taskType, !progress[taskType]);
  };

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
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {name}
            </h3>
            {isFullyCompleted && (
              <span className="flex-shrink-0 text-green-600 dark:text-green-400 animate-pulse">
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
        </div>

        {/* Checkboxes */}
        <div className="flex gap-4 sm:gap-6 md:gap-8">
          {/* Theory Done */}
          <label className="flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-md hover:bg-blue-500/10 dark:hover:bg-blue-500/20">
            <input
              type="checkbox"
              checked={progress.theory}
              onChange={() => handleCheckboxChange('theory')}
              className="w-5 h-5 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 cursor-pointer hover:scale-105 transition-transform"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Theory
            </span>
          </label>

          {/* PYQs Done */}
          <label className="flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-md hover:bg-purple-500/10 dark:hover:bg-purple-500/20">
            <input
              type="checkbox"
              checked={progress.pyqs}
              onChange={() => handleCheckboxChange('pyqs')}
              className="w-5 h-5 text-purple-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 cursor-pointer hover:scale-105 transition-transform"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              PYQs
            </span>
          </label>

          {/* Revision Done */}
          <label className="flex items-center gap-2 cursor-pointer group px-2 py-1 rounded-md hover:bg-orange-500/10 dark:hover:bg-orange-500/20">
            <input
              type="checkbox"
              checked={progress.revision}
              onChange={() => handleCheckboxChange('revision')}
              className="w-5 h-5 text-orange-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 cursor-pointer hover:scale-105 transition-transform"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
              Revision
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

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
