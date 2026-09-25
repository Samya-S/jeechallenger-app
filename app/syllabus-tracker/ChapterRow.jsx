'use client';

import React, { memo, useCallback } from 'react';
import Link from 'next/link';
import { Check, ArrowUpRight, CheckCircle2, Clock, Circle } from 'lucide-react';

const SUBJECT_MAP = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  mathematics: 'Mathematics',
};

/**
 * ChapterRow Component - Modern row with status indicator, PYQ link, and pill task toggles
 */
const ChapterRow = memo(({ chapter, subject, progress, onToggle }) => {
  const { id, name } = chapter;
  const doneCount = (progress.theory ? 1 : 0) + (progress.pyqs ? 1 : 0) + (progress.revision ? 1 : 0);
  const isFullyCompleted = doneCount === 3;
  const isInProgress = doneCount > 0 && doneCount < 3;

  const subjectTitle = SUBJECT_MAP[subject?.toLowerCase()] || subject;
  const pyqParams = new URLSearchParams({
    subject: subjectTitle,
    chapter: name,
  });
  const pyqHref = `/previous-year-questions?${pyqParams.toString()}`;

  const handleToggleTask = useCallback((taskType) => {
    onToggle(subject, id, taskType, !progress[taskType]);
  }, [onToggle, subject, id, progress]);

  return (
    <div
      className={`group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3.5 transition-colors border-b last:border-b-0 border-slate-200/80 dark:border-gray-800/80 ${
        isFullyCompleted
          ? 'bg-emerald-50/40 dark:bg-emerald-950/15 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/25'
          : 'bg-white dark:bg-[#111827] hover:bg-slate-50/80 dark:hover:bg-[#151e30]'
      }`}
    >
      {/* Left: Status Icon + Chapter Name + Practice PYQs Link */}
      <div className="flex items-start sm:items-center justify-between sm:justify-start gap-3 min-w-0 flex-1">
        <div className="flex items-center gap-2.5 min-w-0">
          {isFullyCompleted ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" title="Completed (3/3)" />
          ) : isInProgress ? (
            <Clock className="w-4 h-4 text-amber-500 shrink-0" title={`In Progress (${doneCount}/3)`} />
          ) : (
            <Circle className="w-4 h-4 text-slate-300 dark:text-gray-600 shrink-0" title="Not Started (0/3)" />
          )}
          <span
            className={`text-sm font-semibold leading-snug ${
              isFullyCompleted
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-800 dark:text-gray-200'
            }`}
          >
            {name}
          </span>
        </div>

        <Link
          href={pyqHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 hover:border-orange-300 dark:hover:border-orange-700 transition-colors shrink-0"
          title={`Practice Previous Year Questions for ${name}`}
        >
          <span>Practice PYQs</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Right: 3 Interactive Pill Checkboxes (Theory, PYQs, Revision) */}
      <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
        {/* Theory Toggle */}
        <button
          type="button"
          onClick={() => handleToggleTask('theory')}
          aria-pressed={progress.theory}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-solid transition-all cursor-pointer select-none ${
            progress.theory
              ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-500 shadow-2xs'
              : 'bg-slate-50 dark:bg-[#0d1320] text-gray-600 dark:text-gray-400 border-slate-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/60 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <span
            className={`w-3.5 h-3.5 rounded flex items-center justify-center border border-solid transition-colors ${
              progress.theory
                ? 'bg-white/20 border-transparent text-white'
                : 'border-slate-300 dark:border-gray-600 bg-white dark:bg-[#111827]'
            }`}
          >
            {progress.theory && <Check className="w-2.5 h-2.5 stroke-[3]" />}
          </span>
          <span>Theory</span>
        </button>

        {/* PYQs Toggle */}
        <button
          type="button"
          onClick={() => handleToggleTask('pyqs')}
          aria-pressed={progress.pyqs}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-solid transition-all cursor-pointer select-none ${
            progress.pyqs
              ? 'bg-orange-600 text-white border-orange-600 dark:bg-orange-600 dark:border-orange-500 shadow-2xs'
              : 'bg-slate-50 dark:bg-[#0d1320] text-gray-600 dark:text-gray-400 border-slate-200 dark:border-gray-800 hover:border-orange-400 dark:hover:border-orange-500/60 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <span
            className={`w-3.5 h-3.5 rounded flex items-center justify-center border border-solid transition-colors ${
              progress.pyqs
                ? 'bg-white/20 border-transparent text-white'
                : 'border-slate-300 dark:border-gray-600 bg-white dark:bg-[#111827]'
            }`}
          >
            {progress.pyqs && <Check className="w-2.5 h-2.5 stroke-[3]" />}
          </span>
          <span>PYQs</span>
        </button>

        {/* Revision Toggle */}
        <button
          type="button"
          onClick={() => handleToggleTask('revision')}
          aria-pressed={progress.revision}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-solid transition-all cursor-pointer select-none ${
            progress.revision
              ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-500 shadow-2xs'
              : 'bg-slate-50 dark:bg-[#0d1320] text-gray-600 dark:text-gray-400 border-slate-200 dark:border-gray-800 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <span
            className={`w-3.5 h-3.5 rounded flex items-center justify-center border border-solid transition-colors ${
              progress.revision
                ? 'bg-white/20 border-transparent text-white'
                : 'border-slate-300 dark:border-gray-600 bg-white dark:bg-[#111827]'
            }`}
          >
            {progress.revision && <Check className="w-2.5 h-2.5 stroke-[3]" />}
          </span>
          <span>Revision</span>
        </button>
      </div>
    </div>
  );
});

ChapterRow.displayName = 'ChapterRow';

/**
 * ChapterList Component - Groups and displays chapter rows by unit with unit progress badges
 */
export const ChapterList = ({ subject, chapters, progressData, onToggle }) => {
  // Group chapters by unit
  const groupedChapters = chapters.reduce((acc, chapter) => {
    const unit = chapter.unit || 'Other';
    if (!acc[unit]) {
      acc[unit] = [];
    }
    acc[unit].push(chapter);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groupedChapters).map(([unit, unitChapters]) => {
        const completedInUnit = unitChapters.filter((ch) => {
          const p = progressData[ch.id];
          return p && p.theory && p.pyqs && p.revision;
        }).length;

        return (
          <div
            key={unit}
            className="rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#111827]"
          >
            {/* Unit Header */}
            <div className="bg-slate-50 dark:bg-[#0d1320] px-4 py-2.5 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                {unit}
              </h4>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {completedInUnit}/{unitChapters.length} completed
              </span>
            </div>

            {/* Chapters in this unit */}
            <div>
              {unitChapters.map((chapter) => {
                const progress = progressData[chapter.id] || {
                  theory: false,
                  pyqs: false,
                  revision: false,
                };

                return (
                  <ChapterRow
                    key={chapter.id}
                    chapter={chapter}
                    subject={subject}
                    progress={progress}
                    onToggle={onToggle}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChapterRow;

