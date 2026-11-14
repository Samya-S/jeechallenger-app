'use client';

import React from 'react';
import { TrendingUp, Bookmark } from 'lucide-react';

export default function CBTHubPerformanceStrip({ analytics, vaultCount }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-gray-800 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] text-left">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span>Your Mock Test Performance Overview</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block">Tests Attempted</span>
          <span className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-1 block">
            {analytics.totalTests}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 block">Average Accuracy</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
            {analytics.avgAccuracy}%
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40">
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 block">Best Score</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {analytics.bestScore}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400">
              / {analytics.bestMaxMarks}
            </span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 block">Mistake Vault</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
            {vaultCount} Qs
          </span>
        </div>
      </div>
    </div>
  );
}
