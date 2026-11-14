'use client';

import React from 'react';
import { SYLLABUS_DATA } from '@/data/syllabus-data';
import { calculateSubjectProgress } from '../progressUtils';

export default function SyllabusOverviewCard({
  overallStats,
  statusSummary,
  progressData,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md shadow-slate-200/70 dark:shadow-none border border-slate-200 dark:border-gray-800 p-6 sm:p-8 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left: Overall Completion */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                Overall Progress
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1">
                {overallStats.percentage}%
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                {overallStats.completedTasks} / {overallStats.totalTasks}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                tasks completed
              </span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-600 rounded-full transition-all duration-300"
              style={{ width: `${overallStats.percentage}%` }}
            />
          </div>

          {/* Task Type Totals Row */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800">
              <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                {statusSummary.totalTheory}/88
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Theory Done
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800">
              <div className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400">
                {statusSummary.totalPyqs}/88
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                PYQs Done
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800">
              <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {statusSummary.totalRevision}/88
              </div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Revision Done
              </div>
            </div>
          </div>
        </div>

        {/* Right: 3 Subject Progress Cards with Open-Bottom Circular Arc */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {Object.entries(SYLLABUS_DATA).map(([subjectKey, subjectObj]) => {
            const st = calculateSubjectProgress(subjectKey, subjectObj.chapters, progressData);
            const radius = 36;
            const circumference = 2 * Math.PI * radius;
            const arcDegrees = 240; // 240deg arc leaves a 120deg gap at the bottom
            const startAngle = 270 - arcDegrees / 2; // 150deg keeps the arc symmetric around top center
            const arcLength = circumference * (arcDegrees / 360);
            const filledLength = (st.percentage / 100) * arcLength;

            const accentStroke =
              subjectKey === 'physics'
                ? 'text-blue-600 dark:text-blue-500'
                : subjectKey === 'chemistry'
                  ? 'text-emerald-600 dark:text-emerald-500'
                  : 'text-purple-600 dark:text-purple-500';
            const accentFill =
              subjectKey === 'physics'
                ? 'fill-blue-600 dark:fill-blue-400'
                : subjectKey === 'chemistry'
                  ? 'fill-emerald-600 dark:fill-emerald-400'
                  : 'fill-purple-600 dark:fill-purple-400';

            return (
              <div
                key={subjectKey}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 flex flex-col items-center justify-between"
              >
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {subjectObj.name}
                </span>

                {/* Open-Bottom Circular Arc Gauge (240deg) */}
                <div className="relative w-32 h-26 my-1 flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 84"
                    className="w-full h-full overflow-visible"
                  >
                    {/* Background Arc Track */}
                    <circle
                      cx="50"
                      cy="46"
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${arcLength} ${circumference}`}
                      transform={`rotate(${startAngle} 50 46)`}
                      className="text-slate-200 dark:text-gray-800"
                    />
                    {/* Active Progress Arc */}
                    <circle
                      cx="50"
                      cy="46"
                      r={radius}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${filledLength} ${circumference}`}
                      transform={`rotate(${startAngle} 50 46)`}
                      className={`${accentStroke} transition-all duration-300`}
                    />
                    {/* Exact Center of Circle (x=50, y=44): Percentage */}
                    <text
                      x="50"
                      y="44"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`text-[18px] font-extrabold ${accentFill}`}
                    >
                      {st.percentage}%
                    </text>
                    {/* Inside Open Bottom Gap of Circle (x=50, y=71): X/Y tasks */}
                    <text
                      x="50"
                      y="71"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[9.5px] font-semibold fill-gray-500 dark:fill-gray-400"
                    >
                      {st.completedTasks}/{st.totalTasks} tasks
                    </text>
                  </svg>
                </div>

                <div className="w-full pt-2.5 border-t border-slate-200/80 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
                  <strong className="text-gray-800 dark:text-gray-200">
                    {st.chaptersCompleted}/{st.totalChapters}
                  </strong>{' '}
                  chapters done
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
