'use client';

import React from 'react';
import Link from 'next/link';
import { Target, LogIn, BookOpen, ArrowRight, Clock, RotateCcw } from 'lucide-react';

export default function CBTAttemptsTab({
  user,
  submissions = [],
  papers = [],
  onSelectMockPaper,
  onBrowsePapers,
}) {
  return (
    <div className="space-y-6 text-left">
      {!user ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-md space-y-4">
          <Target className="w-12 h-12 text-blue-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Sign in to view your test attempts
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Your mock test attempts, scores, and accuracy heatmaps are securely saved to your account.
          </p>
          <Link
            href="/login?callbackUrl=/mock-test?tab=attempts"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Google</span>
          </Link>
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-md space-y-4">
          <BookOpen className="w-12 h-12 text-blue-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            No mock test attempts recorded yet
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Start your first timed simulation from the Available Mock Tests tab to receive your official scorecard and speed analysis.
          </p>
          <button
            type="button"
            onClick={onBrowsePapers}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <span>Browse Available Papers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub, idx) => {
            const score = sub.summary?.total_score ?? 0;
            const max = sub.summary?.max_marks ?? 300;
            const accuracy = sub.summary?.accuracy_percentage ?? 0;
            const dateStr = sub.submitted_at
              ? new Date(sub.submitted_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Recent';
            const mins = Math.round((sub.time_taken_seconds || 0) / 60);
            const paperSlug = sub.paper_slug;

            return (
              <div
                key={String(sub._id)}
                className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-black bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      Attempt #{submissions.length - idx}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {dateStr}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                    {sub.paper_title || sub.paper_id}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{mins} mins elapsed</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Target className="w-3.5 h-3.5" />
                      <span>{accuracy.toFixed(1)}% Accuracy</span>
                    </span>
                    <span>&bull;</span>
                    <span>{sub.summary?.total_attempted ?? 0} Attempted</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 dark:border-gray-800 shrink-0">
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      {score} <span className="text-xs text-gray-400 font-semibold">/ {max}</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                      Final Score
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/mock-test/${paperSlug}/results?submission=${sub._id}`}
                      className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                    >
                      Review Scorecard
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        const matchedPaper = papers.find((p) => p.slug === paperSlug) || {
                          slug: paperSlug,
                          title: sub.paper_title || sub.paper_id,
                          paper_id: sub.paper_id,
                          duration_minutes: 180,
                          total_marks: sub.summary?.max_marks || 300,
                        };
                        onSelectMockPaper(matchedPaper);
                      }}
                      className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      title="Retake Exam"
                    >
                      <RotateCcw className="w-4 h-4 text-orange-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
