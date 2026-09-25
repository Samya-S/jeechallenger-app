'use client';

import React, { memo } from 'react';
import { ChevronDown, Atom, FlaskConical, Calculator } from 'lucide-react';

const SUBJECT_THEME = {
  physics: {
    icon: Atom,
    iconBg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200/80 dark:border-blue-800/60',
    bar: 'bg-blue-600 dark:bg-blue-500',
    badge: 'text-blue-600 dark:text-blue-400',
  },
  chemistry: {
    icon: FlaskConical,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/60',
    bar: 'bg-emerald-600 dark:bg-emerald-500',
    badge: 'text-emerald-600 dark:text-emerald-400',
  },
  mathematics: {
    icon: Calculator,
    iconBg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200/80 dark:border-purple-800/60',
    bar: 'bg-purple-600 dark:bg-purple-500',
    badge: 'text-purple-600 dark:text-purple-400',
  },
};

const SubjectCard = memo(({ subject, subjectData, stats, expanded, onToggle, filteredCount }) => {
  const { name } = subjectData;
  const {
    percentage,
    completedTasks,
    totalTasks,
    chaptersCompleted,
    totalChapters,
    theoryDone,
    pyqsDone,
    revisionDone,
  } = stats;

  const theme = SUBJECT_THEME[subject] || SUBJECT_THEME.physics;
  const IconComponent = theme.icon;

  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      className="p-5 sm:p-6 cursor-pointer select-none flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-[#151e30] transition-colors"
    >
      {/* Left: Subject Icon, Name, and Progress Bar */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${theme.iconBg}`}>
          <IconComponent className="w-6 h-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              {name}
            </h2>
            <span className={`text-sm font-bold ${theme.badge}`}>
              {percentage}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({completedTasks}/{totalTasks} tasks)
            </span>
            {typeof filteredCount === 'number' && filteredCount !== totalChapters && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-slate-200 dark:border-gray-700">
                Showing {filteredCount} of {totalChapters}
              </span>
            )}
          </div>

          <div className="mt-2 w-full max-w-md bg-slate-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${theme.bar} rounded-full transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right: Compact Stat Pills + Expand Chevron */}
      <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0">
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 text-center">
          <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800">
            <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              {chaptersCompleted}/{totalChapters}
            </div>
            <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
              Chapters
            </div>
          </div>
          <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800">
            <div className="text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
              {theoryDone}
            </div>
            <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
              Theory
            </div>
          </div>
          <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800">
            <div className="text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400">
              {pyqsDone}
            </div>
            <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
              PYQs
            </div>
          </div>
          <div className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800">
            <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {revisionDone}
            </div>
            <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
              Revision
            </div>
          </div>
        </div>

        <div
          className={`w-9 h-9 rounded-xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-transform duration-200 shrink-0 ${
            expanded ? 'rotate-180' : ''
          }`}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
});

SubjectCard.displayName = 'SubjectCard';

export default SubjectCard;

