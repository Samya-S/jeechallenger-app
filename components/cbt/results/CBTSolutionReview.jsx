'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import MarkdownMathRenderer from '@/components/common/MarkdownMathRenderer';
import { normalizeOptions } from '@/utils/cbt-helpers';
import { 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles,
  Check,
  X,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Bug
} from 'lucide-react';
import ReportQuestionModal from '@/components/modals/ReportQuestionModal';

const subjectBadgeColors = {
  Physics: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60",
  Chemistry: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60",
  Mathematics: "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60",
};

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

  // Filters state - Default to first subject to prevent overwhelming 75-question scroll fatigue
  const [activeSubject, setActiveSubject] = useState(() => attempts[0]?.subject || 'ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');
  // Solutions collapsible state: Set of expanded question numbers. By default empty (all closed).
  const [expandedSolutions, setExpandedSolutions] = useState(() => new Set());
  // Persistent Mistake Vault state loaded from MongoDB
  const [savedVaultQNums, setSavedVaultQNums] = useState(() => new Set());
  // Reporting bug state for question bug modal
  const [reportingQuestion, setReportingQuestion] = useState(null);

  const handleReportBug = (att, qDoc) => {
    const bugQuestion = qDoc
      ? {
          ...qDoc,
          question_number: att.question_number,
          subject: qDoc.subject || att.subject,
          title: qDoc.title || `Q${att.question_number} - ${submission?.paper_title || ''}`,
        }
      : {
          _id: att.question_id,
          question_number: att.question_number,
          subject: att.subject,
          title: `Q${att.question_number} - ${submission?.paper_title || ''}`,
          exam_type: submission?.exam_type || 'JEE_MAIN',
        };
    setReportingQuestion(bugQuestion);
  };

  // Load saved Mistake Vault questions from MongoDB on mount
  useEffect(() => {
    if (!submission?.paper_id) return;
    fetch(`/api/cbt/mistake-vault?paper_id=${encodeURIComponent(submission.paper_id)}`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.savedQuestionNumbers) {
          setSavedVaultQNums(new Set(data.savedQuestionNumbers));
        }
      })
      .catch((err) => console.error('Failed to load mistake vault from MongoDB:', err));
  }, [submission?.paper_id]);

  // Extract unique subjects
  const subjects = useMemo(() => {
    const seen = new Set();
    attempts.forEach((a) => {
      if (a.subject) seen.add(a.subject);
    });
    return Array.from(seen);
  }, [attempts]);

  // Listen for jump to question events from Pacing Heatmap or external analysis
  useEffect(() => {
    const handleJump = (e) => {
      const qNum = e?.detail?.qNum;
      if (!qNum) return;

      const targetAtt = attempts.find((a) => a.question_number === Number(qNum) || a.question_number === qNum);
      if (!targetAtt) return;

      // 1. Ensure subject filter includes this question
      if (activeSubject !== 'ALL' && activeSubject !== targetAtt.subject) {
        setActiveSubject(targetAtt.subject);
      }

      // 2. Ensure status filter includes this question
      setActiveStatus((currentStatus) => {
        if (currentStatus === 'CORRECT' && !targetAtt.is_correct) return 'ALL';
        if (currentStatus === 'INCORRECT' && (!targetAtt.is_evaluated || targetAtt.is_correct)) return 'ALL';
        if (currentStatus === 'UNATTEMPTED' && targetAtt.is_evaluated) return 'ALL';
        if (currentStatus === 'TIME_TRAPS' && ((targetAtt.time_spent_seconds || 0) < 240 || targetAtt.is_correct)) return 'ALL';
        if (currentStatus === 'MISTAKE_VAULT' && !savedVaultQNums.has(targetAtt.question_number)) return 'ALL';
        return currentStatus;
      });

      // 3. Smooth scroll directly to question card and highlight pulse
      setTimeout(() => {
        const el = document.getElementById(`review-q-${targetAtt.question_number}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-4', 'ring-amber-500', 'shadow-2xl');
          setTimeout(() => {
            el.classList.remove('ring-4', 'ring-amber-500', 'shadow-2xl');
          }, 2500);
        }
      }, 150);
    };

    window.addEventListener('cbt-jump-to-question', handleJump);
    return () => window.removeEventListener('cbt-jump-to-question', handleJump);
  }, [attempts, activeSubject, savedVaultQNums]);

  // Filter attempts
  const filteredAttempts = useMemo(() => {
    return attempts.filter((att) => {
      if (activeSubject !== 'ALL' && att.subject !== activeSubject) {
        return false;
      }
      if (activeStatus === 'CORRECT' && !att.is_correct) return false;
      if (activeStatus === 'INCORRECT' && (!att.is_evaluated || att.is_correct)) return false;
      if (activeStatus === 'UNATTEMPTED' && att.is_evaluated) return false;
      if (activeStatus === 'TIME_TRAPS' && (att.time_spent_seconds < 240 || att.is_correct)) return false;
      if (activeStatus === 'MISTAKE_VAULT' && !savedVaultQNums.has(att.question_number)) return false;

      return true;
    });
  }, [attempts, activeSubject, activeStatus, savedVaultQNums]);

  // Toggle individual solution
  const toggleSolution = (qNum) => {
    setExpandedSolutions((prev) => {
      const next = new Set(prev);
      if (next.has(qNum)) {
        next.delete(qNum);
      } else {
        next.add(qNum);
      }
      return next;
    });
  };

  // Toggle all solutions
  const handleToggleAllSolutions = () => {
    if (expandedSolutions.size > 0) {
      setExpandedSolutions(new Set());
    } else {
      const allQNums = new Set(filteredAttempts.map((a) => a.question_number));
      setExpandedSolutions(allQNums);
    }
  };

  // Toggle Mistake Vault Bookmark with persistent MongoDB storage
  const handleToggleVault = async (att, qDoc) => {
    const qNum = att.question_number;
    const isCurrentlySaved = savedVaultQNums.has(qNum);

    // Optimistic UI update
    setSavedVaultQNums((prev) => {
      const next = new Set(prev);
      if (isCurrentlySaved) {
        next.delete(qNum);
      } else {
        next.add(qNum);
      }
      return next;
    });

    try {
      const res = await fetch('/api/cbt/mistake-vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper_id: submission.paper_id,
          paper_slug: submission.paper_slug || submission.paper_id,
          question_number: qNum,
          question_id: qDoc?._id || att.question_id,
          subject: att.subject || qDoc?.subject,
          chapter: qDoc?.chapter || att.section_name,
        }),
      });

      if (!res.ok) {
        // Rollback on failure
        setSavedVaultQNums((prev) => {
          const next = new Set(prev);
          if (isCurrentlySaved) {
            next.add(qNum);
          } else {
            next.delete(qNum);
          }
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to toggle mistake vault in MongoDB:', err);
      // Rollback on failure
      setSavedVaultQNums((prev) => {
        const next = new Set(prev);
        if (isCurrentlySaved) {
          next.add(qNum);
        } else {
          next.delete(qNum);
        }
        return next;
      });
    }
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    if (mins > 0) return `${mins}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="cbt-solution-review space-y-6" data-testid="cbt-solution-review">
      {/* Multi-Level Header and Filter Controls */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] space-y-4">
        {/* LEVEL 1: Subject Selection & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mr-1">
              Subject:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setActiveSubject('ALL')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSubject === 'ALL'
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md border border-gray-900 dark:border-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent'
                }`}
              >
                All Subjects ({attempts.length})
              </button>
              {subjects.map((sub) => {
                const count = attempts.filter((a) => a.subject === sub).length;
                const isSel = activeSubject === sub;
                let activeColorClass = 'bg-blue-600 text-white shadow-md border border-blue-600';
                let unselColorClass = 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60';
                if (sub === 'Chemistry') {
                  activeColorClass = 'bg-emerald-600 text-white shadow-md border border-emerald-600';
                  unselColorClass = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60';
                } else if (sub === 'Mathematics') {
                  activeColorClass = 'bg-purple-600 text-white shadow-md border border-purple-600';
                  unselColorClass = 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/60';
                }

                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setActiveSubject(sub)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isSel ? activeColorClass : unselColorClass
                    }`}
                  >
                    {sub} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium hidden sm:inline">
            Showing <strong className="text-gray-900 dark:text-white font-bold">{filteredAttempts.length}</strong> questions
          </span>
        </div>

        {/* LEVEL 2: Question Status Filters & Global Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mr-1">
              Filter:
            </span>
            <button
              type="button"
              onClick={() => setActiveStatus('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeStatus === 'ALL'
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setActiveStatus('CORRECT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStatus === 'CORRECT'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct ({attempts.filter((a) => (activeSubject === 'ALL' || a.subject === activeSubject) && a.is_correct).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStatus('INCORRECT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStatus === 'INCORRECT'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40 hover:bg-rose-100 dark:hover:bg-rose-900/40'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Incorrect ({attempts.filter((a) => (activeSubject === 'ALL' || a.subject === activeSubject) && a.is_evaluated && !a.is_correct).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStatus('UNATTEMPTED')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStatus === 'UNATTEMPTED'
                  ? 'bg-gray-700 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <MinusCircle className="w-3.5 h-3.5" />
              <span>Unattempted ({attempts.filter((a) => (activeSubject === 'ALL' || a.subject === activeSubject) && !a.is_evaluated).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStatus('TIME_TRAPS')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStatus === 'TIME_TRAPS'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40 hover:bg-amber-100 dark:hover:bg-amber-900/40'
              }`}
            >
              <span>Time Traps</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStatus('MISTAKE_VAULT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeStatus === 'MISTAKE_VAULT'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/40'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Mistake Vault ({savedVaultQNums.size})</span>
            </button>
          </div>

          {/* Global Expand / Collapse All Solutions Toggle */}
          <div className="flex items-center shrink-0 self-end lg:self-center">
            <button
              type="button"
              onClick={handleToggleAllSolutions}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all cursor-pointer border border-slate-200 dark:border-gray-700 shadow-xs"
            >
              {expandedSolutions.size > 0 ? (
                <>
                  <ChevronUp className="w-4 h-4 text-orange-500" />
                  <span>Collapse All Solutions</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-orange-500" />
                  <span>Expand All Solutions</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filtered Question Review Cards */}
      <div className="space-y-6">
        {filteredAttempts.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 text-gray-500 shadow-sm">
            {activeStatus === 'MISTAKE_VAULT' ? (
              <div className="space-y-2">
                <Bookmark className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="font-bold text-gray-700 dark:text-gray-300">No questions bookmarked in Mistake Vault yet</p>
                <p className="text-xs text-gray-500">Click the bookmark icon on any question card above to save it here for targeted revision.</p>
              </div>
            ) : (
              'No questions match the selected filter criteria.'
            )}
          </div>
        ) : (
          filteredAttempts.map((att) => {
            const qDoc = questionMap.get(att.question_number);
            const isSaved = savedVaultQNums.has(att.question_number);

            const isCorrect = att.is_correct;
            const isAttempted = att.is_evaluated;
            const marksAwarded = att.marks_awarded ?? 0;
            const marksPrefix = marksAwarded > 0 ? `+${marksAwarded}` : `${marksAwarded}`;
            const isNumeric = (att.question_type || qDoc?.input_format || '').toUpperCase() === 'NUMERIC';

            // Determine official answer display
            let officialAns = 'Refer Solution';
            if (qDoc) {
              if (qDoc.source_of_answer === 'MARKS_TO_ALL') {
                officialAns = 'Marks Awarded to All (Bonus / Dropped)';
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

            const normOptions = normalizeOptions(qDoc?.options);

            return (
              <div
                key={att.question_number}
                id={`review-q-${att.question_number}`}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] overflow-hidden text-left transition-all duration-500"
                data-testid={`review-q-${att.question_number}`}
              >
                {/* Question Header matching PaperDetailComponent */}
                <div className="p-4 md:p-6 bg-gray-50/70 dark:bg-[#0d1320] border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-lg shadow-sm">
                      Q{att.question_number}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${subjectBadgeColors[att.subject] || "text-gray-600 bg-gray-100 border-gray-200"}`}>
                      {att.subject}
                    </span>
                    {(qDoc?.chapter || att.section_name) && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                        {qDoc?.chapter || att.section_name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Time Spent */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-2xs">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{formatSeconds(att.time_spent_seconds || 0)}</span>
                    </div>

                    {/* Result Marks Badge */}
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-lg border flex items-center gap-1.5 ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : isAttempted
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : isAttempted ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      ) : (
                        <MinusCircle className="w-3.5 h-3.5 text-gray-400" />
                      )}
                      <span>{marksPrefix} Marks</span>
                    </span>

                    {/* Bookmark to Mistake Vault (Persisted to MongoDB) */}
                    <button
                      type="button"
                      onClick={() => handleToggleVault(att, qDoc)}
                      className={`p-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                        isSaved
                          ? 'bg-amber-500 border-amber-600 text-white'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:text-amber-500'
                      }`}
                      title={isSaved ? 'Saved in Mistake Vault' : 'Save to Mistake Vault'}
                      aria-label={isSaved ? 'Remove from Mistake Vault' : 'Save to Mistake Vault'}
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    {/* Report Bug Button */}
                    <button
                      type="button"
                      onClick={() => handleReportBug(att, qDoc)}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800/60 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs transition-all cursor-pointer"
                      title="Report a bug in this question"
                      aria-label="Report a bug"
                    >
                      <Bug className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Body */}
                <div className="p-6 md:p-8 space-y-6 text-gray-900 dark:text-gray-100">
                  {/* Optional Passage */}
                  {qDoc?.passage_text && (
                    <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#0d1320] border border-gray-200 dark:border-gray-800 text-sm">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                        Passage / Context
                      </div>
                      <MarkdownMathRenderer content={qDoc.passage_text} />
                    </div>
                  )}

                  {/* Question Text */}
                  <div className="text-base md:text-lg leading-relaxed text-left min-w-0">
                    <MarkdownMathRenderer content={qDoc?.question_text || ''} />
                  </div>

                  {/* Question Diagrams */}
                  {qDoc?.question_diagram_urls && qDoc.question_diagram_urls.length > 0 && (
                    <div className="flex flex-wrap items-start gap-4 pt-2">
                      {qDoc.question_diagram_urls.map((url, dIdx) => (
                        <div
                          key={dIdx}
                          className="relative rounded-2xl border border-gray-200 dark:border-gray-800 p-2 bg-white dark:bg-gray-800 shadow-sm max-w-md"
                        >
                          <img
                            src={url}
                            alt={`Question diagram ${dIdx + 1}`}
                            className="max-h-72 w-auto object-contain rounded-xl mr-auto"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Options List (For MCQ Questions) - Matches PaperDetailComponent */}
                  {!isNumeric && normOptions.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {normOptions.map((opt) => {
                        const key = opt.key;
                        const isSelected = att.selected_option === key;
                        const isCorrectAnswer = qDoc?.correct_answer?.includes(key);

                        let optionStyle = "border-gray-200 dark:border-gray-800 opacity-60";
                        let circleStyle = "border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400";
                        let badge = null;

                        if (isSelected && isCorrectAnswer) {
                          optionStyle = "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/50";
                          circleStyle = "bg-emerald-500 text-white font-bold";
                          badge = (
                            <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-md">
                              <Check className="w-3 h-3" />
                              Your Choice (Correct)
                            </span>
                          );
                        } else if (isSelected && !isCorrectAnswer) {
                          optionStyle = "border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/50";
                          circleStyle = "bg-rose-500 text-white font-bold";
                          badge = (
                            <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2.5 py-1 rounded-md">
                              <X className="w-3 h-3" />
                              Your Choice (Incorrect)
                            </span>
                          );
                        } else if (!isSelected && isCorrectAnswer) {
                          optionStyle = "border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200";
                          circleStyle = "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500 font-bold";
                          badge = (
                            <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 px-2.5 py-1 rounded-md">
                              <Check className="w-3 h-3" />
                              Correct Answer
                            </span>
                          );
                        }

                        return (
                          <div
                            key={key}
                            className={`p-4 rounded-2xl border-2 flex items-start justify-between gap-3 transition-all ${optionStyle}`}
                          >
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <div
                                className={`w-7 h-7 rounded-full text-xs flex items-center justify-center shrink-0 ${circleStyle}`}
                              >
                                {key}
                              </div>
                              <div className="flex-1 min-w-0 text-sm md:text-base pt-0.5 leading-relaxed text-gray-900 dark:text-gray-100">
                                {opt.text ? (
                                  <MarkdownMathRenderer content={opt.text} />
                                ) : (
                                  <span>Option {key}</span>
                                )}
                                {opt.diagram_urls && opt.diagram_urls.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {opt.diagram_urls.map((u, dIdx) => (
                                      <img
                                        key={dIdx}
                                        src={u}
                                        alt={`Option ${key} Diagram ${dIdx + 1}`}
                                        className="max-h-40 object-contain rounded-xl border border-gray-200 dark:border-gray-800"
                                        loading="lazy"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            {badge}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Numeric Input Display (For Numerical Questions) */}
                  {isNumeric && (
                    <div className="pt-2 max-w-sm text-left space-y-2">
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Numerical Response
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-[#0d1320] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-mono font-bold">
                          {att.numeric_value !== null && att.numeric_value !== undefined
                            ? String(att.numeric_value)
                            : 'Unattempted'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Feedback Alert Bar matching PaperDetailComponent */}
                  <div
                    className={`p-4 rounded-2xl flex items-center gap-3 border ${
                      isCorrect
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                        : isAttempted
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                        : "bg-gray-500/10 border-gray-500/30 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                    ) : isAttempted ? (
                      <XCircle className="w-5 h-5 shrink-0 text-rose-500" />
                    ) : (
                      <MinusCircle className="w-5 h-5 shrink-0 text-gray-400" />
                    )}
                    <div className="text-sm font-semibold leading-normal">
                      {isCorrect ? (
                        <span>
                          Correct! {isNumeric ? `Your answer (${att.numeric_value}) matches the official answer.` : `You selected Option (${att.selected_option}).`}
                        </span>
                      ) : isAttempted ? (
                        <span>
                          Incorrect. {isNumeric ? `You entered ${att.numeric_value} • Official Answer is ${officialAns}` : `You selected Option (${att.selected_option}) • Correct Answer is ${officialAns}`}
                        </span>
                      ) : (
                        <span>Unattempted • Correct Answer is {officialAns}</span>
                      )}
                    </div>
                  </div>

                  {/* Step-by-Step Solution Section (Collapsible & Closed by Default) */}
                  {qDoc?.solution && (
                    <div className="pt-2">
                      {!expandedSolutions.has(att.question_number) ? (
                        <button
                          type="button"
                          onClick={() => toggleSolution(att.question_number)}
                          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 hover:bg-orange-100/60 dark:hover:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40 text-orange-900 dark:text-orange-200 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 font-bold text-sm">
                            <div className="w-7 h-7 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <span>View Step-by-Step Solution</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                            <span>Show Solution</span>
                            <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                          </div>
                        </button>
                      ) : (
                        <div className="rounded-2xl border border-orange-200/80 dark:border-orange-900/60 bg-gradient-to-b from-orange-50/40 to-transparent dark:from-orange-950/20 dark:to-transparent overflow-hidden">
                          <button
                            type="button"
                            onClick={() => toggleSolution(att.question_number)}
                            className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-orange-50/80 dark:bg-orange-950/40 border-b border-orange-200/60 dark:border-orange-900/40 text-orange-900 dark:text-orange-200 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 font-bold text-sm">
                              <div className="w-7 h-7 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                              </div>
                              <span>Step-by-Step Solution</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                              <span>Hide Solution</span>
                              <ChevronUp className="w-4 h-4" />
                            </div>
                          </button>
                          <div className="p-5 sm:p-6 space-y-4">
                            {qDoc.slug && (
                              <div className="flex justify-end">
                                <Link
                                  href={`/question/${qDoc.slug}?view=solution`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                                >
                                  <span>Open standalone question</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            )}
                            <div className="text-sm md:text-base text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
                              <MarkdownMathRenderer content={qDoc.solution} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bug Report Modal */}
      <ReportQuestionModal
        isOpen={!!reportingQuestion}
        onClose={() => setReportingQuestion(null)}
        question={reportingQuestion}
      />
    </div>
  );
}
