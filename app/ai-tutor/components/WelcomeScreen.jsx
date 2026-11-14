"use client";

import React from "react";
import { FaChalkboardTeacher } from "react-icons/fa";

const SUGGESTIONS = [
  "What are the important topics for JEE Physics?",
  "How to solve integration problems?",
  "Best books for JEE Chemistry",
  "Time management tips for JEE"
];

export default function WelcomeScreen({ onSelectSuggestion }) {
  return (
    <div className="text-center py-8 sm:py-16">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
        <FaChalkboardTeacher className="text-white text-2xl sm:text-3xl" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
        Welcome to JEE Challenger AI Tutor!
      </h1>
      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-md mx-auto">
        Your personalized JEE preparation assistant
      </p>
      <div className="max-w-2xl mx-auto space-y-4 text-left bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
        <p className="text-gray-700 dark:text-gray-200 text-sm font-semibold">
          What I can help you with:
        </p>
        <ul className="text-gray-600 dark:text-gray-300 text-sm space-y-2 ml-4">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Physics, Chemistry, and Mathematics concepts</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>JEE Main and Advanced preparation strategies</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Study material recommendations</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Problem-solving techniques</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Exam tips and time management</span>
          </li>
        </ul>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          Just type your question below and I&lsquo;ll help you excel in your JEE journey!
        </p>
        <div className="mt-4 sm:mt-6 space-y-3">
          <p className="text-gray-700 dark:text-gray-200 text-sm font-medium">
            Try asking:
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSelectSuggestion(suggestion)}
                className="text-xs sm:text-sm bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 sm:px-4 py-2 rounded-full transition-all duration-200 border border-blue-200 dark:border-blue-800"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
