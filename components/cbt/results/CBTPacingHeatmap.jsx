'use client';

import React, { useMemo, useState } from 'react';
import { AlertTriangle, Zap, Clock, Hourglass, Target, ChevronDown, ChevronUp } from 'lucide-react';

export default function CBTPacingHeatmap({ submission, onSelectQuestion }) {
  const attempts = submission?.question_attempts || [];
  const [isAllSpeedWinsExpanded, setIsAllSpeedWinsExpanded] = useState(false);

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

  // 3. Subject-wise average time per attempted question & benchmarks
  const { subjectAverages, overallAvgSeconds, totalAttemptedCount } = useMemo(() => {
    const bySubject = {};
    let totalTime = 0;
    let totalCount = 0;

    attempts.forEach((att) => {
      const sub = att.subject || 'Other';
      if (!bySubject[sub]) bySubject[sub] = { totalTime: 0, count: 0 };
      if ((att.time_spent_seconds || 0) > 0) {
        bySubject[sub].totalTime += att.time_spent_seconds;
        bySubject[sub].count++;
        totalTime += att.time_spent_seconds;
        totalCount++;
      }
    });

    const averages = Object.entries(bySubject).map(([sub, data]) => ({
      subject: sub,
      avgSeconds: data.count > 0 ? Math.round(data.totalTime / data.count) : 0,
      totalQuestions: data.count,
    }));

    return {
      subjectAverages: averages,
      overallAvgSeconds: totalCount > 0 ? Math.round(totalTime / totalCount) : 0,
      totalAttemptedCount: totalCount,
    };
  }, [attempts]);

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    if (mins > 0) return `${mins}m ${s}s`;
    return `${s}s`;
  };

  const handleJumpToQuestion = (qNum) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cbt-jump-to-question', { detail: { qNum } }));
    }
    if (onSelectQuestion) {
      onSelectQuestion(qNum);
    }
  };

  const visibleSpeedWins = isAllSpeedWinsExpanded ? fastAndAccurate : fastAndAccurate.slice(0, 8);

  return (
    <div className="cbt-pacing-heatmap space-y-4 text-left" data-testid="cbt-pacing-heatmap">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <Hourglass className="w-4 h-4 text-blue-500" />
          <span>Pacing &amp; Time Traps Analysis</span>
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:inline">
          Click any question pill below to inspect its detailed step-by-step solution
        </span>
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
            Questions where you invested &ge; 4 minutes but resulted in 0 or negative marks. Avoiding prolonged deadlocks preserves vital scoring time.
          </p>

          {timeTraps.length === 0 ? (
            <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <span>✨</span>
              <span>Zero severe time traps detected. Strong examination discipline!</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {timeTraps.map((att) => {
                const isPenalty = (att.marks_awarded || 0) < 0;
                const outcomeLabel = isPenalty ? '-1' : '0';
                return (
                  <button
                    key={att.question_number}
                    type="button"
                    onClick={() => handleJumpToQuestion(att.question_number)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50/80 dark:bg-gray-800/90 border border-amber-200 dark:border-amber-700/60 text-xs font-bold text-amber-950 dark:text-amber-100 shadow-2xs hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-100/70 transition-all cursor-pointer flex items-center gap-2 group"
                    title={`Click to inspect Solution for Q${att.question_number} (${att.subject})`}
                  >
                    <span className="group-hover:text-amber-700 dark:group-hover:text-amber-300">
                      Q{att.question_number} <span className="font-normal text-amber-800/80 dark:text-amber-300/80">({att.subject})</span>
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 font-mono bg-amber-100/90 dark:bg-amber-950/80 px-1.5 py-0.5 rounded">
                      {formatSeconds(att.time_spent_seconds)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isPenalty
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {outcomeLabel}
                    </span>
                  </button>
                );
              })}
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
            Questions answered correctly in &le; 90 seconds. Foundational mastery areas yielding maximum marks with minimal time overhead.
          </p>

          {fastAndAccurate.length === 0 ? (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200/80 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span>🎯</span>
              <span>Focus on increasing speed on high-confidence questions.</span>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 pt-1">
              {visibleSpeedWins.map((att) => (
                <button
                  key={att.question_number}
                  type="button"
                  onClick={() => handleJumpToQuestion(att.question_number)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-gray-800/90 border border-emerald-200 dark:border-emerald-700/60 text-xs font-bold text-emerald-950 dark:text-emerald-100 shadow-2xs hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-100/70 transition-all cursor-pointer flex items-center gap-2 group"
                  title={`Click to inspect Solution for Q${att.question_number} (${att.subject})`}
                >
                  <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                    Q{att.question_number} <span className="font-normal text-emerald-800/80 dark:text-emerald-300/80">({att.subject})</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono bg-emerald-100/90 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
                    {formatSeconds(att.time_spent_seconds)}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    +4
                  </span>
                </button>
              ))}

              {fastAndAccurate.length > 8 && (
                <button
                  type="button"
                  onClick={() => setIsAllSpeedWinsExpanded(!isAllSpeedWinsExpanded)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>{isAllSpeedWinsExpanded ? 'Show Less ▴' : `+${fastAndAccurate.length - 8} more (Show All ▾)`}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Subject-wise Pacing & Benchmark Dashboard */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-md ring-1 ring-black/[0.03] dark:ring-white/[0.06] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Average Time Spent per Attempted Question vs JEE Target Guidelines
            </h4>
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            Standard 3-Hour Exam Allocation Benchmark
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Overall Test Average */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700/80 flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              Overall Test Average
            </span>
            <div className="text-xl font-black text-gray-900 dark:text-white mt-1">
              {formatSeconds(overallAvgSeconds)}
            </div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
              Benchmark: ~2m 15s / Q
            </span>
          </div>

          {/* Subject Cards with Specific Target Benchmarks */}
          {subjectAverages.map((sub) => {
            let colorBadge = "bg-blue-50/60 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60";
            let targetLabel = "Target: ~2m 00s";
            let isPacedWell = sub.avgSeconds <= 135;

            if (sub.subject === "Chemistry") {
              colorBadge = "bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60";
              targetLabel = "Target: ~1m 15s";
              isPacedWell = sub.avgSeconds <= 90;
            } else if (sub.subject === "Mathematics") {
              colorBadge = "bg-purple-50/60 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60";
              targetLabel = "Target: ~2m 45s";
              isPacedWell = sub.avgSeconds <= 180;
            }

            return (
              <div
                key={sub.subject}
                className={`p-3.5 rounded-2xl border flex flex-col justify-between ${colorBadge}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {sub.subject}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isPacedWell
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                  }`}>
                    {isPacedWell ? 'On Pace' : 'Moderate'}
                  </span>
                </div>

                <div className="text-xl font-black text-gray-900 dark:text-white mt-1">
                  {sub.totalQuestions > 0 ? formatSeconds(sub.avgSeconds) : "—"}
                </div>

                <span className="text-[10px] font-medium opacity-80 mt-1">
                  {targetLabel} ({sub.totalQuestions} Qs attempted)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
