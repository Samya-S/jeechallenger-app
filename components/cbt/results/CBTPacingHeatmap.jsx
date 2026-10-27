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
    <div className="cbt-pacing-heatmap space-y-4 text-left" data-testid="cbt-pacing-heatmap">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Hourglass className="w-4 h-4 text-blue-500" />
          <span>Pacing & Time Traps Analysis</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time Traps Analysis Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-md ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                  Time Traps
                </span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-0.5 block">
                  {timeTraps.length}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
              &ge; 4 mins lost
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Questions where you invested &ge; 4 minutes but resulted in 0 or negative marks. Avoiding prolonged deadlocks preserves vital time for scoring.
          </p>

          {timeTraps.length === 0 ? (
            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <span>✨</span>
              <span>Zero severe time traps detected. Strong time discipline!</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {timeTraps.map((att) => (
                <button
                  key={att.question_number}
                  type="button"
                  onClick={() => onSelectQuestion && onSelectQuestion(att.question_number)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50/80 dark:bg-gray-800 border border-amber-200 dark:border-amber-700/60 text-xs font-bold text-amber-900 dark:text-amber-200 shadow-2xs hover:border-amber-400 transition-all cursor-pointer flex items-center gap-1.5"
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

        {/* Speed Wins Analysis Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-md ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                  Speed Wins
                </span>
                <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-0.5 block">
                  {fastAndAccurate.length}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              &le; 90s correct
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Questions answered correctly in &le; 90 seconds. These are your foundational mastery areas generating maximum marks with minimum time overhead.
          </p>

          {fastAndAccurate.length === 0 ? (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200/80 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>🎯</span>
              <span>Focus on increasing speed on high-confidence questions.</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {fastAndAccurate.slice(0, 10).map((att) => (
                <button
                  key={att.question_number}
                  type="button"
                  onClick={() => onSelectQuestion && onSelectQuestion(att.question_number)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700/60 text-xs font-bold text-emerald-900 dark:text-emerald-200 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer flex items-center gap-1.5"
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
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-md ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Average Time Spent per Attempted Question:</span>
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {subjectAverages.map((sub) => {
            let colorBadge = "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60";
            if (sub.subject === "Chemistry") {
              colorBadge = "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60";
            } else if (sub.subject === "Mathematics") {
              colorBadge = "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60";
            }

            return (
              <div
                key={sub.subject}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 ${colorBadge}`}
              >
                <span className="font-bold">{sub.subject}:</span>
                <span className="font-mono font-bold">
                  {sub.count > 0 ? formatSeconds(sub.avgSeconds) : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
