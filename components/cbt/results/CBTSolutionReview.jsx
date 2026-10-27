'use client';

import React, { useState, useMemo } from 'react';
import MarkdownMathRenderer from '@/components/common/MarkdownMathRenderer';
import { normalizeOptions } from '@/utils/cbt-helpers';
import { 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function CBTSolutionReview({ submission, questionsData = [] }) {
  const attempts = submission?.question_attempts || [];

  // Map question data by question_number
  const questionMap = useMemo(() => {
    const map = new Map();
    questionsData.forEach((q) => {
      map.set(q.question_number, q);
    });
    return map;
  }, [questionsData]);

  // Filters state
  const [activeSubject, setActiveSubject] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');
  const [savedVaultQNums, setSavedVaultQNums] = useState(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem('cbt_mistake_vault');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Extract unique subjects
  const subjects = useMemo(() => {
    const seen = new Set();
    attempts.forEach((a) => {
      if (a.subject) seen.add(a.subject);
    });
    return Array.from(seen);
  }, [attempts]);

  // Filter attempts
  const filteredAttempts = useMemo(() => {
    return attempts.filter((att) => {
      // Subject filter
      if (activeSubject !== 'ALL' && att.subject !== activeSubject) {
        return false;
      }
      // Status filter
      if (activeStatus === 'CORRECT' && !att.is_correct) return false;
      if (activeStatus === 'INCORRECT' && (!att.is_evaluated || att.is_correct)) return false;
      if (activeStatus === 'UNATTEMPTED' && att.is_evaluated) return false;
      if (activeStatus === 'TIME_TRAPS' && (att.time_spent_seconds < 240 || att.is_correct)) return false;

      return true;
    });
  }, [attempts, activeSubject, activeStatus]);

  // Toggle Mistake Vault Bookmark
  const handleToggleVault = (qNum) => {
    setSavedVaultQNums((prev) => {
      const next = new Set(prev);
      if (next.has(qNum)) {
        next.delete(qNum);
      } else {
        next.add(qNum);
      }
      try {
        localStorage.setItem('cbt_mistake_vault', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    if (mins > 0) return `${mins}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="cbt-solution-review space-y-6" data-testid="cbt-solution-review">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSubject('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubject === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            All Subjects ({attempts.length})
          </button>
          {subjects.map((sub) => {
            const count = attempts.filter((a) => a.subject === sub).length;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => setActiveSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSubject === sub
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {sub} ({count})
              </button>
            );
          })}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveStatus('ALL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeStatus === 'ALL'
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveStatus('CORRECT')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeStatus === 'CORRECT'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Correct</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStatus('INCORRECT')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeStatus === 'INCORRECT'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Incorrect</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStatus('UNATTEMPTED')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeStatus === 'UNATTEMPTED'
                ? 'bg-gray-600 text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <MinusCircle className="w-3.5 h-3.5" />
            <span>Unattempted</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveStatus('TIME_TRAPS')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeStatus === 'TIME_TRAPS'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            Time Traps
          </button>
        </div>
      </div>

      {/* Filtered Question Review Cards */}
      <div className="space-y-4">
        {filteredAttempts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 text-gray-500">
            No questions match the selected filter criteria.
          </div>
        ) : (
          filteredAttempts.map((att) => {
            const qDoc = questionMap.get(att.question_number);
            const isSaved = savedVaultQNums.has(att.question_number);

            const isCorrect = att.is_correct;
            const isAttempted = att.is_evaluated;
            const marksAwarded = att.marks_awarded ?? 0;
            const marksPrefix = marksAwarded > 0 ? `+${marksAwarded}` : `${marksAwarded}`;

            // Determine candidate answer display
            let candidateAns = 'None (Unattempted)';
            if (att.selected_option) {
              candidateAns = `Option (${att.selected_option})`;
            } else if (att.numeric_value !== null && att.numeric_value !== undefined) {
              candidateAns = String(att.numeric_value);
            }

            // Determine official answer display
            let officialAns = 'Refer Solution';
            if (qDoc) {
              if (qDoc.source_of_answer === 'MARKS_TO_ALL') {
                officialAns = '✨ Marks Awarded to All (Bonus / Dropped)';
              } else if (qDoc.correct_answer && qDoc.correct_answer.length > 0) {
                officialAns = `Option (${qDoc.correct_answer.join(', ')})`;
              } else if (qDoc.numeric_answer) {
                if (qDoc.numeric_answer.is_range) {
                  officialAns = `${qDoc.numeric_answer.min_value} to ${qDoc.numeric_answer.max_value}`;
                } else if (qDoc.numeric_answer.exact_value !== null) {
                  officialAns = String(qDoc.numeric_answer.exact_value);
                }
              }
            }

            return (
              <div
                key={att.question_number}
                className={`p-5 sm:p-6 rounded-2xl bg-white dark:bg-gray-800 border transition-all shadow-sm space-y-4 ${
                  isCorrect
                    ? 'border-emerald-200 dark:border-emerald-900/40'
                    : isAttempted
                    ? 'border-red-200 dark:border-red-900/40'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                data-testid={`review-q-${att.question_number}`}
              >
                {/* Question Top Metadata Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-700/60">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base sm:text-lg text-gray-900 dark:text-white">
                      Question {att.question_number}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold">
                      {att.subject}
                    </span>
                    {att.section_name && (
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        • {att.section_name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Time Spent */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{formatSeconds(att.time_spent_seconds || 0)}</span>
                    </div>

                    {/* Result Marks Badge */}
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : isAttempted
                          ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : isAttempted ? (
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                      ) : (
                        <MinusCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{marksPrefix} Marks</span>
                    </span>

                    {/* Bookmark to Mistake Vault */}
                    <button
                      type="button"
                      onClick={() => handleToggleVault(att.question_number)}
                      className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-amber-500 border-amber-600 text-white'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-500 hover:text-amber-500'
                      }`}
                      title={isSaved ? 'Saved in Mistake Vault' : 'Save to Mistake Vault'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                {qDoc?.question_text && (
                  <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 leading-relaxed font-sans">
                    <MarkdownMathRenderer content={qDoc.question_text} />
                  </div>
                )}

                {/* Diagrams */}
                {qDoc?.question_diagram_urls && qDoc.question_diagram_urls.length > 0 && (
                  <div className="flex flex-wrap gap-3 my-2">
                    {qDoc.question_diagram_urls.map((url, dIdx) => (
                      <img
                        key={dIdx}
                        src={url}
                        alt={`Question diagram ${dIdx + 1}`}
                        className="max-h-48 object-contain rounded-xl border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-800"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}

                {/* Options List for MCQ */}
                {(() => {
                  const normOptions = normalizeOptions(qDoc?.options);
                  if (normOptions.length === 0) return null;

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      {normOptions.map((opt) => {
                        const optKey = opt.key;
                        const isCandidatePick = att.selected_option === optKey;
                        const isCorrectPick = qDoc.correct_answer?.includes(optKey);

                        let cardStyle = 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-750/40 text-gray-700 dark:text-gray-300';
                        if (isCandidatePick && isCorrectPick) {
                          cardStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (isCandidatePick && !isCorrectPick) {
                          cardStyle = 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-bold';
                        } else if (isCorrectPick) {
                          cardStyle = 'border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-semibold';
                        }

                        return (
                          <div
                            key={optKey}
                            className={`p-3 rounded-xl border-2 flex items-start gap-2.5 transition-all ${cardStyle}`}
                          >
                            <span className="font-bold shrink-0">({optKey})</span>
                            <div className="flex-1 min-w-0">
                              {opt.text ? (
                                <MarkdownMathRenderer content={opt.text} />
                              ) : (
                                <span>Option {optKey}</span>
                              )}
                              {opt.diagram_urls && opt.diagram_urls.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {opt.diagram_urls.map((u, dIdx) => (
                                    <img
                                      key={dIdx}
                                      src={u}
                                      alt={`Option ${optKey} Diagram ${dIdx + 1}`}
                                      className="max-h-32 object-contain rounded border border-gray-200 dark:border-gray-700"
                                      loading="lazy"
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* Student Answer vs Official Key Comparison Strip */}
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-750/70 border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Your Response:</span>
                    <strong
                      className={`font-mono font-bold ${
                        isCorrect
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : isAttempted
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-500'
                      }`}
                    >
                      {candidateAns}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Official Key:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                      {officialAns}
                    </strong>
                  </div>
                </div>

                {/* Step-by-Step LaTeX Solution */}
                {qDoc?.solution && (
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Step-by-Step Verified Solution</span>
                    </h5>
                    <div className="p-4 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
                      <MarkdownMathRenderer content={qDoc.solution} />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
