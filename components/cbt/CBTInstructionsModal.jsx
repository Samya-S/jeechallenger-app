'use client';

import React from 'react';
import { X, HelpCircle, Check, Info } from 'lucide-react';

export default function CBTInstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 select-none"
      data-testid="cbt-instructions-modal"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-3xl w-full h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-slate-50 dark:bg-gray-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                General Instructions & Marking Rules
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Official Computer-Based Test (CBT) Guidelines
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {/* Section 1: General */}
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
              General Instructions
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>The clock will be set at the server. The countdown timer at the top right of screen will display the remaining time available for you to finish the examination.</li>
              <li>When the timer reaches zero, the examination will end automatically. You will not be required to manually submit your exam when time expires.</li>
              <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the 5 official color symbols.</li>
            </ul>
          </div>

          {/* Section 2: Question Palette Color Codes */}
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
              Question Palette Color Legend
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700">
                <span className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 font-bold flex items-center justify-center shrink-0">1</span>
                <span>You have not visited the question yet.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700">
                <span className="w-6 h-6 rounded-b-md bg-[#dc3545] text-white font-bold flex items-center justify-center shrink-0">2</span>
                <span>You have not answered the question.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700">
                <span className="w-6 h-6 rounded-t-md bg-[#28a745] text-white font-bold flex items-center justify-center shrink-0">3</span>
                <span>You have answered the question.</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-700">
                <span className="w-6 h-6 rounded-full bg-[#6f42c1] text-white font-bold flex items-center justify-center shrink-0">4</span>
                <span>You have marked the question for review (not answered).</span>
              </div>
              <div className="col-span-1 sm:col-span-2 flex items-center gap-2.5 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <div className="w-6 h-6 rounded-full bg-[#6f42c1] text-white font-bold flex items-center justify-center relative shrink-0">
                  <span>5</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#28a745] rounded-xs flex items-center justify-center">
                    <Check className="w-1.5 h-1.5 text-white" />
                  </span>
                </div>
                <span>The question is answered and marked for review. <strong>It will be evaluated</strong> during final scoring.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Navigation and Saving Responses */}
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
              Navigating & Saving Responses
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>To answer a question, select your chosen option and click <strong>Save & Next</strong>.</li>
              <li>To clear your chosen answer, click <strong>Clear Response</strong>.</li>
              <li><strong>Crucial NTA Rule:</strong> If you select an option and then click directly on a question number in the Question Palette without clicking "Save & Next", your selection will NOT be saved.</li>
              <li>For Numerical Value questions, use the on-screen mouse keypad. Physical keyboard keystrokes are blocked for test security.</li>
              <li>In Section B, you may attempt answers across any of the questions. Only the <strong>first 5 attempted questions in numerical order</strong> will be evaluated.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-slate-50 dark:bg-gray-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
