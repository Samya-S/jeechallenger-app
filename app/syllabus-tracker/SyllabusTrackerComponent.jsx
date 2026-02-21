'use client';

import React, { useState, useEffect } from 'react';
import { syllabusData } from './syllabusData';
import {
  getProgressData,
  updateChapterProgress,
  calculateSubjectProgress,
  calculateOverallProgress,
  resetAllProgress,
  exportProgress,
  importProgress
} from './progressUtils';
import SubjectCard from './SubjectCard';
import { ChapterList } from './ChapterRow';

/**
 * SyllabusTrackerComponent - Main component for JEE Syllabus Tracker
 */
const SyllabusTrackerComponent = () => {
  const [progressData, setProgressData] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({
    physics: false,
    chemistry: false,
    mathematics: false
  });
  const [overallStats, setOverallStats] = useState({
    percentage: 0,
    completedTasks: 0,
    totalTasks: 0
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load progress data on mount
  useEffect(() => {
    const data = getProgressData();
    setProgressData(data);
    updateOverallStats();
  }, []);

  // Update overall statistics
  const updateOverallStats = () => {
    const stats = calculateOverallProgress(syllabusData);
    setOverallStats(stats);
  };

  // Handle checkbox toggle
  const handleToggle = (subject, chapterId, taskType, completed) => {
    const updatedData = updateChapterProgress(subject, chapterId, taskType, completed);
    setProgressData(updatedData);
    updateOverallStats();
  };

  // Toggle subject expansion
  const toggleSubject = (subject) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  // Handle reset all progress
  const handleResetAll = () => {
    resetAllProgress();
    setProgressData({});
    updateOverallStats();
    setShowResetConfirm(false);
  };

  // Handle export progress
  const handleExport = () => {
    const jsonData = exportProgress();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jee-syllabus-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Handle import progress
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const success = importProgress(e.target.result);
        if (success) {
          const data = getProgressData();
          setProgressData(data);
          updateOverallStats();
          alert('Progress imported successfully!');
        } else {
          alert('Failed to import progress. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 px-2">
            JEE Syllabus Tracker
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 px-4">
            Track your preparation progress across Physics, Chemistry, and Mathematics
          </p>

          {/* Overall Progress Card */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl max-w-2xl mx-auto border border-blue-400/20 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-white text-lg sm:text-xl font-bold mb-3 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Overall Progress
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Total Completion
                </span>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {overallStats.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 sm:h-5 overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 transition-all duration-500 ease-out rounded-full shadow-lg"
                  style={{ width: `${overallStats.percentage}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-3 text-center">
                {overallStats.completedTasks} of {overallStats.totalTasks} tasks completed
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <button
            onClick={handleExport}
            className="px-3 py-2 sm:px-5 sm:py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-sm sm:text-base font-semibold transition-colors duration-200 flex items-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg touch-manipulation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="sm:hidden">Export</span>
            <span className="hidden sm:inline">Export Progress</span>
          </button>

          <label className="px-3 py-2 sm:px-5 sm:py-2.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg text-sm sm:text-base font-semibold transition-colors duration-200 flex items-center gap-1.5 sm:gap-2 cursor-pointer shadow-md hover:shadow-lg touch-manipulation">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="sm:hidden">Import</span>
            <span className="hidden sm:inline">Import Progress</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-3 py-2 sm:px-5 sm:py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg text-sm sm:text-base font-semibold transition-colors duration-200 flex items-center gap-1.5 sm:gap-2 shadow-md hover:shadow-lg touch-manipulation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span className="sm:hidden">Reset</span>
            <span className="hidden sm:inline">Reset All</span>
          </button>
        </div>

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2 sm:p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Confirm Reset
                </h3>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to reset all progress? This action cannot be undone and all your tracked data will be permanently deleted.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleResetAll}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg text-sm sm:text-base font-semibold transition-colors duration-200 touch-manipulation"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg text-sm sm:text-base font-semibold transition-colors duration-200 touch-manipulation"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subject Cards */}
        <div className="space-y-6">
          {Object.entries(syllabusData).map(([subject, subjectData]) => {
            const stats = calculateSubjectProgress(subject, subjectData.chapters);
            const subjectProgressData = progressData[subject] || {};
            
            return (
              <div key={subject}>
                {/* Subject Summary Card */}
                <SubjectCard
                  subject={subject}
                  subjectData={subjectData}
                  stats={stats}
                  expanded={expandedSubjects[subject]}
                  onToggle={() => toggleSubject(subject)}
                />

                {/* Expanded Chapter List */}
                {expandedSubjects[subject] && (
                  <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 animate-slideDown">
                    <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                        {subjectData.name} Chapters
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                        Track your progress for each chapter by marking Theory, PYQs, and Revision as complete.
                      </p>
                    </div>
                    <ChapterList
                      subject={subject}
                      chapters={subjectData.chapters}
                      progressData={subjectProgressData}
                      onToggle={handleToggle}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 sm:mt-12 max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl border border-purple-400/20 transition-shadow duration-300">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3 flex items-center justify-center gap-2">
              Keep Going! 
              <span className="animate-bounce">🚀</span>
            </h3>
            <p className="text-white text-base sm:text-lg font-medium text-center">
              Consistency is the key to cracking JEE. Track your progress daily and stay motivated!
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 sm:mt-8 max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 sm:p-6 border border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-shadow duration-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl">📌</span>
              How to Use This Tracker
            </h3>
            <ul className="max-w-fit mx-auto space-y-2 sm:space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2 sm:gap-3 hover:translate-x-1 transition-transform duration-200">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-base sm:text-lg flex-shrink-0 mt-0.5">✓</span>
                <span className="text-sm sm:text-base font-medium">Click on any subject card to expand and view all chapters</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 hover:translate-x-1 transition-transform duration-200">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-base sm:text-lg flex-shrink-0 mt-0.5">✓</span>
                <span className="text-sm sm:text-base font-medium">Mark checkboxes for Theory, PYQs, and Revision as you complete them</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 hover:translate-x-1 transition-transform duration-200">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-base sm:text-lg flex-shrink-0 mt-0.5">✓</span>
                <span className="text-sm sm:text-base font-medium">Your progress is automatically saved in your browser</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 hover:translate-x-1 transition-transform duration-200">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-base sm:text-lg flex-shrink-0 mt-0.5">✓</span>
                <span className="text-sm sm:text-base font-medium">Export your progress to save a backup or transfer to another device</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyllabusTrackerComponent;
