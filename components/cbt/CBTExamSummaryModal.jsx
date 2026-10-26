'use client';

import React, { useState, useMemo } from 'react';
import { useCBTStore } from './store/useCBTStore';
import { X, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export default function CBTExamSummaryModal({ isOpen, onClose }) {
  const paperMetadata = useCBTStore((s) => s.paperMetadata);
  const questions = useCBTStore((s) => s.questions);
  const paletteStates = useCBTStore((s) => s.paletteStates);
  const submitExam = useCBTStore((s) => s.submitExam);
  const isExamSubmitted = useCBTStore((s) => s.isExamSubmitted);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const sections = paperMetadata?.sections || [];

  // Compute stats per section
  const sectionStats = useMemo(() => {
    return sections.map((sec) => {
      const start = sec.start_question_number || 1;
      const end = sec.end_question_number || 100;

      const secQuestions = questions.filter((q) => {
        if (sec.start_question_number && sec.end_question_number) {
          return q.question_number >= start && q.question_number <= end;
        }
        return q.subject === sec.subject;
      });

      const stats = {
        name: sec.name || `${sec.subject} (${sec.section_type})`,
        total: secQuestions.length,
        answered: 0,
        notAnswered: 0,
        markedForReview: 0,
        answeredAndMarked: 0,
        notVisited: 0,
      };

      secQuestions.forEach((q) => {
        const state = paletteStates[q.question_number] || 1;
        if (state === 3) stats.answered++;
        else if (state === 2) stats.notAnswered++;
        else if (state === 4) stats.markedForReview++;
        else if (state === 5) stats.answeredAndMarked++;
        else stats.notVisited++;
      });

      return stats;
    });
  }, [sections, questions, paletteStates]);

  // Total aggregate
  const totals = useMemo(() => {
    return sectionStats.reduce(
      (acc, s) => ({
        total: acc.total + s.total,
        answered: acc.answered + s.answered,
        notAnswered: acc.notAnswered + s.notAnswered,
        markedForReview: acc.markedForReview + s.markedForReview,
        answeredAndMarked: acc.answeredAndMarked + s.answeredAndMarked,
        notVisited: acc.notVisited + s.notVisited,
      }),
      { total: 0, answered: 0, notAnswered: 0, markedForReview: 0, answeredAndMarked: 0, notVisited: 0 }
    );
  }, [sectionStats]);

  if (!isOpen) return null;

  const handleConfirmSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await submitExam();
      // On success, submitExam redirects window.location.href to results
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'Submission failed. Please check your network and retry.');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none"
      data-testid="cbt-summary-modal"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-slate-50 dark:bg-gray-800/80">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Exam Submission Summary
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Review your question attempt status before final submission.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-[#1b365d] text-white uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-3 py-2.5 font-bold">Section</th>
                  <th className="px-3 py-2.5 text-center font-bold">Total</th>
                  <th className="px-3 py-2.5 text-center text-emerald-300 font-bold">Answered</th>
                  <th className="px-3 py-2.5 text-center text-red-300 font-bold">Not Ans</th>
                  <th className="px-3 py-2.5 text-center text-purple-300 font-bold">Review</th>
                  <th className="px-3 py-2.5 text-center text-purple-200 font-bold">Ans+Rev</th>
                  <th className="px-3 py-2.5 text-center text-gray-300 font-bold">Not Visited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 font-medium">
                {sectionStats.map((sec, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-3 py-2 font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                      {sec.name}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">
                      {sec.total}
                    </td>
                    <td className="px-3 py-2 text-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/40 dark:bg-emerald-950/20">
                      {sec.answered}
                    </td>
                    <td className="px-3 py-2 text-center text-red-600 dark:text-red-400 font-bold bg-red-50/40 dark:bg-red-950/20">
                      {sec.notAnswered}
                    </td>
                    <td className="px-3 py-2 text-center text-purple-600 dark:text-purple-400 font-bold">
                      {sec.markedForReview}
                    </td>
                    <td className="px-3 py-2 text-center text-purple-600 dark:text-purple-400 font-bold">
                      {sec.answeredAndMarked}
                    </td>
                    <td className="px-3 py-2 text-center text-gray-500">
                      {sec.notVisited}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100 dark:bg-gray-900 font-bold text-gray-900 dark:text-white border-t-2 border-gray-300 dark:border-gray-600">
                <tr>
                  <td className="px-3 py-2.5 uppercase tracking-wider">Total</td>
                  <td className="px-3 py-2.5 text-center">{totals.total}</td>
                  <td className="px-3 py-2.5 text-center text-emerald-600 dark:text-emerald-400">
                    {totals.answered}
                  </td>
                  <td className="px-3 py-2.5 text-center text-red-600 dark:text-red-400">
                    {totals.notAnswered}
                  </td>
                  <td className="px-3 py-2.5 text-center text-purple-600 dark:text-purple-400">
                    {totals.markedForReview}
                  </td>
                  <td className="px-3 py-2.5 text-center text-purple-600 dark:text-purple-400">
                    {totals.answeredAndMarked}
                  </td>
                  <td className="px-3 py-2.5 text-center text-gray-500">{totals.notVisited}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Warning Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold">Are you sure you want to submit?</p>
              <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
                Once confirmed, your test will be evaluated immediately. You will not be able to resume or change any answers.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-semibold">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-850">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50"
            data-testid="cbt-summary-cancel-btn"
          >
            Return to Test
          </button>

          <button
            type="button"
            onClick={handleConfirmSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-[#28a745] hover:bg-[#218838] active:bg-[#1e7e34] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            data-testid="cbt-summary-confirm-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Yes, Submit Exam</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
