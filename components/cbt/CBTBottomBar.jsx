'use client';

import React from 'react';
import { useCBTStore } from './store/useCBTStore';
import { ChevronLeft, ChevronRight, CheckCheck, BookmarkPlus, RotateCcw, Send } from 'lucide-react';

export default function CBTBottomBar({ onOpenSubmitSummary }) {
  const saveAndNext = useCBTStore((s) => s.saveAndNext);
  const saveAndMarkForReview = useCBTStore((s) => s.saveAndMarkForReview);
  const markForReviewAndNext = useCBTStore((s) => s.markForReviewAndNext);
  const clearResponse = useCBTStore((s) => s.clearResponse);
  const goToPreviousQuestion = useCBTStore((s) => s.goToPreviousQuestion);
  const goToNextQuestion = useCBTStore((s) => s.goToNextQuestion);
  const activeQuestionIndex = useCBTStore((s) => s.activeQuestionIndex);
  const questions = useCBTStore((s) => s.questions);
  const isSyncing = useCBTStore((s) => s.isSyncing);

  const isFirstQuestion = activeQuestionIndex === 0;
  const isLastQuestion = activeQuestionIndex === questions.length - 1;

  return (
    <footer
      className="cbt-bottom-bar w-full min-h-[64px] bg-[#f8f9fa] dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5 select-none shrink-0 z-20 shadow-md"
      data-testid="cbt-bottom-bar"
    >
      {/* Left: Main Answering Action Buttons (NTA Official Sequence) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Save & Next */}
        <button
          type="button"
          onClick={saveAndNext}
          className="px-3.5 py-2 rounded-lg bg-[#28a745] hover:bg-[#218838] active:bg-[#1e7e34] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          data-testid="cbt-save-next-btn"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Save & Next</span>
        </button>

        {/* Save & Mark for Review */}
        <button
          type="button"
          onClick={saveAndMarkForReview}
          className="px-3.5 py-2 rounded-lg bg-[#6f42c1] hover:bg-[#5a32a3] active:bg-[#4d298d] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          data-testid="cbt-save-review-btn"
        >
          <BookmarkPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Save &</span>
          <span>Mark for Review</span>
        </button>

        {/* Clear Response */}
        <button
          type="button"
          onClick={clearResponse}
          className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 text-xs sm:text-sm font-semibold shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
          data-testid="cbt-clear-response-btn"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
          <span>Clear Response</span>
        </button>

        {/* Mark for Review & Next */}
        <button
          type="button"
          onClick={markForReviewAndNext}
          className="px-3.5 py-2 rounded-lg bg-[#fd7e14] hover:bg-[#e06903] active:bg-[#c95d02] text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95"
          data-testid="cbt-review-next-btn"
        >
          <span>Mark for Review & Next</span>
        </button>
      </div>

      {/* Right: Sequential Navigation (Prev/Next) & Submit */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={goToPreviousQuestion}
          disabled={isFirstQuestion}
          className={`px-3 py-2 rounded-lg border text-xs sm:text-sm font-semibold flex items-center gap-1 transition-all ${
            isFirstQuestion
              ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 cursor-pointer shadow-xs active:scale-95'
          }`}
          data-testid="cbt-prev-btn"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={goToNextQuestion}
          disabled={isLastQuestion}
          className={`px-3 py-2 rounded-lg border text-xs sm:text-sm font-semibold flex items-center gap-1 transition-all ${
            isLastQuestion
              ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
              : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 cursor-pointer shadow-xs active:scale-95'
          }`}
          data-testid="cbt-next-btn"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Final Submit Button */}
        <button
          type="button"
          onClick={onOpenSubmitSummary}
          className="ml-2 px-4 py-2 rounded-lg bg-[#007bff] hover:bg-[#0069d9] active:bg-[#0062cc] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          data-testid="cbt-submit-modal-btn"
        >
          <Send className="w-4 h-4" />
          <span>Submit</span>
        </button>
      </div>
    </footer>
  );
}
