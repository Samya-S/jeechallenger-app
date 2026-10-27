'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { History, ChevronDown, Check, Trophy, Calendar, Clock, Target, X } from 'lucide-react';

export default function CBTAttemptSwitcher({ paperSlug, allAttempts = [], currentSubmissionId }) {
  const router = useRouter();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  if (!allAttempts || allAttempts.length === 0) return null;

  // Total attempts count
  const totalCount = allAttempts.length;

  // Find index of current attempt (0 is latest)
  const currentIndex = allAttempts.findIndex(
    (a) => String(a._id) === String(currentSubmissionId)
  );

  const currentAttempt = allAttempts[currentIndex !== -1 ? currentIndex : 0];
  // Calculate display attempt number: oldest is Attempt 1, latest is Attempt N
  const currentAttemptNumber = currentIndex !== -1 ? totalCount - currentIndex : totalCount;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSelectAttempt = (submissionId) => {
    router.push(`/mock-test/${paperSlug}/results?submission=${submissionId}`);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {totalCount > 1 ? (
          /* Multi-Attempt Dropdown Selector */
          <div className="relative inline-block">
            <select
              value={String(currentAttempt?._id)}
              onChange={(e) => handleSelectAttempt(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 shadow-sm cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="Select test attempt"
            >
              {allAttempts.map((att, idx) => {
                const attNum = totalCount - idx;
                const isLatest = idx === 0;
                const score = att.summary?.total_score ?? 0;
                const max = att.summary?.max_marks ?? 300;
                const dateLabel = formatDate(att.submitted_at || att.started_at);

                return (
                  <option key={String(att._id)} value={String(att._id)}>
                    Attempt #{attNum}{isLatest ? ' (Latest)' : ''} • {score}/{max} ({dateLabel})
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ) : (
          /* Single Attempt Badge */
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
            Attempt #1 (Latest)
          </span>
        )}

        {/* View All Attempts History Button */}
        <button
          type="button"
          onClick={() => setIsHistoryModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-xs transition-all cursor-pointer"
          title="View all attempts comparison"
        >
          <History className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">Attempt History</span>
          <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
            {totalCount}
          </span>
        </button>
      </div>

      {/* History Comparison Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-gray-800 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-left">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/70 dark:bg-[#0d1320]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Attempt History & Progression
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Track your score improvements across attempts for this paper
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Attempts List */}
            <div className="p-5 overflow-y-auto space-y-3">
              {allAttempts.map((att, idx) => {
                const attNum = totalCount - idx;
                const isSelected = String(att._id) === String(currentSubmissionId);
                const score = att.summary?.total_score ?? 0;
                const max = att.summary?.max_marks ?? 300;
                const accuracy = att.summary?.accuracy_percentage ?? 0;
                const dateLabel = formatDate(att.submitted_at || att.started_at);
                const mins = Math.round((att.time_taken_seconds || 0) / 60);

                return (
                  <div
                    key={String(att._id)}
                    onClick={() => {
                      setIsHistoryModalOpen(false);
                      handleSelectAttempt(String(att._id));
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                        : 'border-slate-200 dark:border-gray-800 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                          idx === 0
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        #{attNum}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-gray-900 dark:text-white">
                            Attempt #{attNum}
                          </span>
                          {idx === 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              Latest
                            </span>
                          )}
                          {isSelected && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                              Currently Viewing
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{dateLabel}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{mins} mins</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 dark:border-gray-800">
                      <div>
                        <div className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                          {score} <span className="text-xs text-gray-400 font-semibold">/ {max}</span>
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <span>{accuracy.toFixed(1)}% Acc</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Viewing' : 'View Scorecard'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
