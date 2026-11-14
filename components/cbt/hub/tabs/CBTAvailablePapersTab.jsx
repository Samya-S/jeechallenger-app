'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Award, 
  FileText, 
  Play, 
  LogIn, 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { getExamBadgeColor } from '@/utils/pyq-helpers';
import { YearFilterPills } from '@/components/resources/pyqs/PYQFilterBar';

export default function CBTAvailablePapersTab({
  papers,
  papersLoading,
  totalPapers,
  totalPages,
  page,
  onPageChange,
  examTypeFilter,
  onExamTypeChange,
  yearFilter,
  onYearChange,
  availableYears,
  user,
  onSelectMockPaper,
}) {
  return (
    <div className="space-y-6">
      {/* Filter Bar matching PYQ Full Shift Papers pattern */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Exam Type for Papers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            {
              label: 'All Exams',
              value: 'ALL',
              activeClass: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md',
            },
            {
              label: 'JEE Main',
              value: 'JEE_MAIN',
              activeClass: 'bg-emerald-600 text-white shadow-md',
            },
            {
              label: 'JEE Advanced',
              value: 'JEE_ADVANCED',
              activeClass: 'bg-orange-600 text-white shadow-md',
            },
          ].map((et) => (
            <button
              key={et.value}
              type="button"
              onClick={() => onExamTypeChange(et.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                examTypeFilter === et.value
                  ? et.activeClass
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {et.label}
            </button>
          ))}
        </div>

        {/* Dynamic Year pills for Papers */}
        {availableYears.length > 0 && (
          <YearFilterPills
            availableYears={availableYears}
            selectedYear={yearFilter === 'ALL' ? 'All' : yearFilter}
            onSelectYear={(y) => onYearChange(y === 'All' ? 'ALL' : y)}
            activeClass="bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
            size="md"
          />
        )}
      </div>

      {/* Papers Grid */}
      {papersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] space-y-4 animate-pulse"
            >
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : papers.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-8 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Papers Found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
            No published question papers match your selected filters. Try choosing a different year or exam type.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => {
            const isAdv = paper.exam_type === 'JEE_ADVANCED';
            const totalQuestions =
              paper.sections?.reduce((sum, s) => sum + (s.total_questions || 0), 0) ||
              (isAdv ? 51 : 75);

            return (
              <div
                key={paper._id || paper.slug}
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-6 flex flex-col justify-between hover:shadow-xl transition-all text-left"
              >
                <div className="space-y-4">
                  {/* Official Exam Badge (Using getExamBadgeColor from pyq-helpers) */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-lg border ${getExamBadgeColor(
                        paper.exam_type
                      )}`}
                    >
                      {isAdv ? 'JEE Advanced' : 'JEE Main'}
                    </span>
                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700">
                      {paper.exam_year || 'Official'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
                    {paper.title || paper.paper_id?.replace(/_/g, ' ')}
                  </h3>

                  {/* Stat Strip */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{paper.duration_minutes || 180}m</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{paper.total_marks || 300} Marks</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-orange-500" />
                      <span>{totalQuestions} Qs</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 space-y-2">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => onSelectMockPaper(paper)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Mock Test</span>
                    </button>
                  ) : (
                    <Link
                      href={`/login?callbackUrl=/mock-test/${paper.slug}`}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white shadow-sm hover:shadow transition-all cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Attempt Test</span>
                    </Link>
                  )}

                  <Link
                    href={`/paper/${paper.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <span>View Questions Offline</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls matching PYQPapersList */}
      {!papersLoading && totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 tabular-nums">
            Page <strong className="font-bold text-gray-900 dark:text-white">{page}</strong> of{' '}
            <strong className="font-bold text-gray-900 dark:text-white">{totalPages}</strong>
            <span className="ml-2 text-xs text-gray-500">({totalPapers} Papers)</span>
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
