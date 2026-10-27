'use client';

import React, { useMemo } from 'react';
import { AlertTriangle, Zap, Clock, Hourglass } from 'lucide-react';

export default function CBTPacingHeatmap({ submission, onSelectQuestion }) {
  const attempts = submission?.question_attempts || [];

  // 1. Detect Time Traps (spent >= 240 seconds and wrong or unattempted)
  const timeTraps = useMemo(() => {
    return attempts.filter((att) => {
      const time = att.time_spent_seconds || 0;
      return time >= 240 && (!att.is_correct || !att.is_evaluated);
    });
  }, [attempts]);

  // 2. Detect Fast & Accurate (spent <= 90s and correct)
  const fastAndAccurate = useMemo(() => {
    return attempts.filter((att) => {
      const time = att.time_spent_seconds || 0;
      return time > 0 && time <= 90 && att.is_correct;
    });
  }, [attempts]);

  // 3. Subject-wise average time per attempted question
  const subjectAverages = useMemo(() => {
    const bySubject = {};
    attempts.forEach((att) => {
      const sub = att.subject || 'Other';
      if (!bySubject[sub]) bySubject[sub] = { totalTime: 0, count: 0 };
      if ((att.time_spent_seconds || 0) > 0) {
        bySubject[sub].totalTime += att.time_spent_seconds;
        bySubject[sub].count++;
      }
    });

    return Object.entries(bySubject).map(([sub, data]) => ({
      subject: sub,
      avgSeconds: data.count > 0 ? Math.round(data.totalTime / data.count) : 0,
      totalQuestions: data.count,
    }));
  }, [attempts]);

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    if (mins > 0) return `${mins}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="cbt-pacing-heatmap space-y-4" data-testid="cbt-pacing-heatmap">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Hourglass className="w-4 h-4 text-blue-500" />
          <span>Pacing & Time Traps Analysis</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Traps Warning Box */}
        <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Time Traps Identified ({timeTraps.length})</span>
          </div>

          <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
            Questions where you invested &ge; 4 minutes but resulted in 0 or negative marks. In competitive exams like JEE, dodging these preserves valuable time for scoring opportunities.
          </p>

          {timeTraps.length === 0 ? (
            <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-amber-200/60 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ✨ Great discipline! Zero severe time traps detected.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {timeTraps.map((att) => (
                <button
                  key={att.question_number}
                  type="button"
                  onClick={() => onSelectQuestion && onSelectQuestion(att.question_number)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-700 text-xs font-bold text-amber-900 dark:text-amber-200 shadow-xs hover:border-amber-500 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Q{att.question_number} ({att.subject})</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
                    {formatSeconds(att.time_spent_seconds)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Speed Wins Box */}
        <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 shadow-md space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Fast & Accurate Solutions ({fastAndAccurate.length})</span>
          </div>

          <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
            Questions answered correctly in &le; 90 seconds. These are your strong foundational areas generating high marks with minimal time cost.
          </p>

          {fastAndAccurate.length === 0 ? (
            <div className="p-3 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-emerald-200/60 text-xs text-gray-500">
              Focus on increasing solving speed on straightforward questions.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {fastAndAccurate.slice(0, 10).map((att) => (
                <button
                  key={att.question_number}
                  type="button"
                  onClick={() => onSelectQuestion && onSelectQuestion(att.question_number)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-emerald-900 dark:text-emerald-200 shadow-xs hover:border-emerald-500 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Q{att.question_number}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatSeconds(att.time_spent_seconds)}
                  </span>
                </button>
              ))}
              {fastAndAccurate.length > 10 && (
                <span className="text-xs text-emerald-700 font-semibold self-center">
                  +{fastAndAccurate.length - 10} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Average Time Per Subject Strip */}
      <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-lg ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
        <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Average Time Spent per Attempted Question:</span>
        </span>
        <div className="flex flex-wrap items-center gap-4">
          {subjectAverages.map((sub) => (
            <div key={sub.subject} className="flex items-center gap-1.5">
              <span className="text-gray-500 dark:text-gray-400">{sub.subject}:</span>
              <strong className="text-gray-900 dark:text-white font-mono">
                {formatSeconds(sub.avgSeconds)}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
