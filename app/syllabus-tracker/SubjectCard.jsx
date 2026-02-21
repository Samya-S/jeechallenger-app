'use client';

import React from 'react';

/**
 * SubjectCard Component - Displays subject progress with visual progress bar
 * @param {Object} props
 * @param {string} props.subject - Subject key (physics, chemistry, mathematics)
 * @param {Object} props.subjectData - Subject data including name, color, chapters
 * @param {Object} props.stats - Progress statistics
 * @param {boolean} props.expanded - Whether the card is expanded
 * @param {Function} props.onToggle - Toggle expansion handler
 */
const SubjectCard = ({ subject, subjectData, stats, expanded, onToggle }) => {
  const { name, color } = subjectData;
  const { 
    percentage, 
    completedTasks, 
    totalTasks, 
    chaptersCompleted, 
    totalChapters,
    theoryDone,
    pyqsDone,
    revisionDone
  } = stats;

  // Determine color class for progress bar based on percentage
  const getProgressColor = () => {
    if (percentage >= 75) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600">
      {/* Header Section */}
      <div 
        className="p-4 sm:p-6 cursor-pointer select-none hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${color} shadow-lg ring-2 ring-white dark:ring-gray-800`}></div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {name}
            </h2>
          </div>
          <button 
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1.5 sm:p-2 transition-all duration-300 touch-manipulation"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 sm:h-6 sm:w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 overflow-hidden shadow-inner">
            <div 
              className={`h-full ${getProgressColor()} transition-all duration-500 ease-out rounded-full shadow-sm`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-3 sm:mt-4">
          <div className="text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 sm:p-3 hover:bg-blue-100/70 dark:hover:bg-blue-900/30 transition-colors duration-200">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
              {chaptersCompleted}/{totalChapters}
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
              Chapters
            </div>
          </div>
          <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-lg p-2 sm:p-3 hover:bg-green-100/70 dark:hover:bg-green-900/30 transition-colors duration-200">
            <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
              {theoryDone}
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
              Theory Done
            </div>
          </div>
          <div className="text-center bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 sm:p-3 hover:bg-purple-100/70 dark:hover:bg-purple-900/30 transition-colors duration-200">
            <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
              {pyqsDone}
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
              PYQs Done
            </div>
          </div>
          <div className="text-center bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 sm:p-3 hover:bg-orange-100/70 dark:hover:bg-orange-900/30 transition-colors duration-200">
            <div className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
              {revisionDone}
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">
              Revision Done
            </div>
          </div>
        </div>

        {/* Tasks Progress */}
        <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {completedTasks} of {totalTasks} tasks completed
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
