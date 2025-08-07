"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const AIAnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if modal has been shown in this session
    const hasSeenModal = sessionStorage.getItem('hasSeenAIAnnouncement');
    if (!hasSeenModal) {
      setIsOpen(true);
      sessionStorage.setItem('hasSeenAIAnnouncement', 'true');
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
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto pr-2 -mr-2">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {/* <span className="text-blue-500 text-2xl sm:text-3xl">🤖</span> */}
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Introducing AI Tutor
              </h2>
              <span className="text-blue-500 text-2xl sm:text-3xl ml-1">🤖</span>
              {/* <span className="text-purple-500 text-2xl sm:text-3xl">✨</span> */}
            </div>
            <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-gray-700 dark:text-gray-300">
              Experience personalized JEE preparation with our advanced AI Tutor. Get instant help with:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-3 sm:p-4 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800/50">
                <p className="font-semibold text-blue-700 dark:text-blue-300">🎯 Personalized Learning</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-3 sm:p-4 rounded-lg shadow-sm border border-purple-100 dark:border-purple-800/50">
                <p className="font-semibold text-purple-700 dark:text-purple-300">📚 Concept Explanations</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 p-3 sm:p-4 rounded-lg shadow-sm border border-green-100 dark:border-green-800/50">
                <p className="font-semibold text-green-700 dark:text-green-300">📝 Problem Solving</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 p-3 sm:p-4 rounded-lg shadow-sm border border-amber-100 dark:border-amber-800/50">
                <p className="font-semibold text-amber-700 dark:text-amber-300">📄 File Analysis</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 sm:p-5 rounded-lg border border-green-100 dark:border-green-800/50">
              <p className="text-lg font-medium mb-2 text-green-800 dark:text-green-200">Key Features:</p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 text-left w-fit mx-auto">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Ask questions in natural language</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Upload study materials for analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span>Get step-by-step solutions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
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