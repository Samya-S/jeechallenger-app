"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const AIAnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if modal has been shown in this session
    const hasSeenModal = sessionStorage.getItem('hasSeenAIAnnouncement');
    if (!hasSeenModal) {
      // Delay modal appearance to prevent CLS
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      sessionStorage.setItem('hasSeenAIAnnouncement', 'true');
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 sm:p-8 max-w-2xl w-full mx-auto shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[90vh] flex flex-col">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          aria-label="Close announcement modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto pr-2 -mr-2">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 640 512">
                <path d="M208 352c-2.39 0-4.78.35-7.06 1.09C187.98 357.3 174.35 360 160 360c-14.35 0-27.98-2.7-40.95-6.91-2.28-.74-4.66-1.09-7.05-1.09C49.94 352-.33 402.48 0 464.62.14 490.88 21.73 512 48 512h224c26.27 0 47.86-21.12 48-47.38.33-62.14-49.94-112.62-112-112.62zm-48-32c53.02 0 96-42.98 96-96s-42.98-96-96-96-96 42.98-96 96 42.98 96 96 96zM592 0H208c-26.47 0-48 22.25-48 49.59V96c23.42 0 45.1 6.78 64 17.8V64h352v288h-64v-64H384v64h-76.24c19.1 16.69 33.12 38.73 39.69 64H592c26.47 0 48-22.25 48-49.59V49.59C640 22.25 618.47 0 592 0z" />
              </svg>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Introducing AI Tutor
              </h2>
            </div>
            <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-gray-700 dark:text-gray-300">
              Experience personalized JEE preparation with our advanced AI Tutor. Get instant help with:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 sm:p-4 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800/50">
                <p className="font-semibold text-blue-700 dark:text-blue-300">🎯 Personalized Learning</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-3 sm:p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800/50">
                <p className="font-semibold text-indigo-700 dark:text-indigo-300">📚 Concept Explanations</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-3 sm:p-4 rounded-lg shadow-sm border border-purple-100 dark:border-purple-800/50">
                <p className="font-semibold text-purple-700 dark:text-purple-300">📝 Problem Solving</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-purple-900/20 p-3 sm:p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-800/50">
                <p className="font-semibold text-indigo-700 dark:text-indigo-300">📄 File Analysis</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-4 sm:p-5 rounded-lg border border-blue-100 dark:border-blue-800/50">
              <p className="text-lg font-medium mb-2 text-blue-800 dark:text-blue-200">Key Features:</p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 text-left w-fit mx-auto">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Ask questions in natural language</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  <span>Upload study materials for analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  <span>Get step-by-step solutions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <span>Save chat history across devices</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Button - Fixed at bottom */}
        <div className="mt-6 text-center">
          <Link
            href="/ai-tutor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-lg sm:text-xl px-5 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105">
              Start Learning with AI Tutor
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AIAnnouncementModal;