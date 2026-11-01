'use client';

import React, { useMemo } from 'react';
import { Award, Target, Clock, CheckCircle2, XCircle, MinusCircle, CheckSquare, BookOpen } from 'lucide-react';

export default function CBTScorecard({ submission }) {
  const summary = submission?.summary || {};
  const totalScore = summary.total_score ?? 0;
  const maxMarks = summary.max_marks ?? 300;
  const accuracy = summary.accuracy_percentage ?? 0;
  const totalAttempted = summary.total_attempted ?? 0;
  const totalCorrect = summary.total_correct ?? 0;
  const totalIncorrect = summary.total_incorrect ?? 0;
  const totalUnattempted = summary.total_unattempted ?? 0;
  const timeTakenSeconds = submission?.time_taken_seconds ?? 0;

  // Format time taken: HH:MM:SS or Xh Ym
  const formattedTime = useMemo(() => {
    const hours = Math.floor(timeTakenSeconds / 3600);
    const mins = Math.floor((timeTakenSeconds % 3600) / 60);
    const secs = timeTakenSeconds % 60;
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
    return `${mins}m ${secs}s`;
  }, [timeTakenSeconds]);

  // Format exam start timestamp in Indian Standard Time (IST)
  const startedAt = submission?.started_at;
  const formattedStartTime = useMemo(() => {
    if (!startedAt) return null;
    const d = new Date(startedAt);
    if (isNaN(d.getTime())) return null;
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  }, [startedAt]);

  // Factual Attempt Rate calculation (questions answered / total questions in paper)
  const totalQuestions =
    (totalAttempted + totalUnattempted) ||
    submission?.question_attempts?.length ||
    0;
  const attemptRate =
    totalQuestions > 0 ? ((totalAttempted / totalQuestions) * 100).toFixed(1) : '0';

  const subjectScores = summary.subject_scores || {};
  const subjects = Object.keys(subjectScores);

  return (
    <div className="cbt-scorecard space-y-6" data-testid="cbt-scorecard">
      {/* Top Banner: Score, Accuracy, Time & Percentile */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-gradient-to-br dark:from-[#162942] dark:via-[#1b365d] dark:to-[#0f1d30] border border-slate-200 dark:border-blue-900/50 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Score Block */}
          <div className="space-y-2 min-w-0 flex-1 max-w-xl text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
              <span className="truncate">Official Scorecard • {submission.paper_title || submission.paper_id}</span>
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-gray-900 dark:text-white" data-testid="total-score-val">
                {totalScore}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-gray-500 dark:text-blue-300">
                / {maxMarks}
              </span>
              <span className="ml-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-400/30">
                {((totalScore / (maxMarks || 1)) * 100).toFixed(1)}% Marks
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-blue-200/80 leading-relaxed">
              {formattedStartTime ? (
                <>
                  Attempted on: <strong className="font-semibold text-gray-700 dark:text-blue-100">{formattedStartTime} IST</strong> • Review detailed subject breakdown and question solutions below.
                </>
              ) : (
                'Review detailed subject breakdown, pacing insights, and question solutions below.'
              )}
            </p>
          </div>

          {/* Quick Metrics Pills - shrink-0 to guarantee 0 wrapping on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            {/* Attempt Rate */}
            <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-200/90 font-semibold">
                <CheckSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Attempt Rate</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-300">
                  {attemptRate}%
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-gray-500 dark:text-amber-200/70">
                  ({totalAttempted}/{totalQuestions})
                </span>
              </div>
            </div>

            {/* Overall Accuracy */}
            <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-200/90 font-semibold">
                <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Accuracy</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-300 mt-1" data-testid="accuracy-val">
                {accuracy.toFixed(1)}%
              </span>
            </div>

            {/* Time Used */}
            <div className="col-span-2 sm:col-span-1 p-3 sm:p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40 flex flex-col justify-center">
              <div className="flex items-center gap-1.5 text-xs text-blue-800 dark:text-blue-200/90 font-semibold">
                <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Time Used</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-100 mt-1">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Stat Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Attempted */}
        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Attempted</span>
            <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {totalAttempted}
            </div>
          </div>
        </div>

        {/* Total Correct */}
        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-900/40 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Correct</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {totalCorrect}
            </div>
          </div>
        </div>

        {/* Total Incorrect */}
        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-900/40 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 font-bold">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-rose-700 dark:text-rose-400 font-medium">Incorrect</span>
            <div className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400">
              {totalIncorrect}
            </div>
          </div>
        </div>

        {/* Unattempted */}
        <div className="p-4 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 font-bold">
            <MinusCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Unattempted</span>
            <div className="text-xl sm:text-2xl font-black text-gray-700 dark:text-gray-300">
              {totalUnattempted}
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Performance Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          <span>Subject-Wise Performance Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((sub) => {
            const data = subjectScores[sub] || {};
            const subScore = data.score ?? 0;
            const subAttempted = data.attempted ?? 0;
            const subCorrect = data.correct ?? 0;
            const subIncorrect = data.incorrect ?? 0;
            const subAccuracy = subAttempted > 0 ? ((subCorrect / subAttempted) * 100).toFixed(1) : 0;

            let borderTheme = 'border-gray-200 dark:border-gray-700';
            let badgeBg = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300';
            if (sub === 'Physics') {
              borderTheme = 'border-blue-200 dark:border-blue-900/40';
              badgeBg = 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300';
            } else if (sub === 'Chemistry') {
              borderTheme = 'border-emerald-200 dark:border-emerald-900/40';
              badgeBg = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300';
            } else if (sub === 'Mathematics') {
              borderTheme = 'border-purple-200 dark:border-purple-900/40';
              badgeBg = 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300';
            }

            return (
              <div
                key={sub}
                className={`p-6 rounded-3xl bg-white dark:bg-gray-900 border ${borderTheme} shadow-lg ring-1 ring-black/[0.03] dark:ring-white/[0.06] space-y-4`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${badgeBg}`}>
                    {sub}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Accuracy: <strong className="text-gray-900 dark:text-white">{subAccuracy}%</strong>
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-black text-gray-900 dark:text-white">
                      {subScore}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">
                      Marks
                    </span>
                  </div>
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 text-right">
                    <div>{subAttempted} Attempted</div>
                  </div>
                </div>

                {/* Micro Stat Bar */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 text-xs text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{subCorrect} Correct</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{subIncorrect} Incorrect</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
