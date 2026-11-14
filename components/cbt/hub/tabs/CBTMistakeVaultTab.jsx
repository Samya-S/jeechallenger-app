'use client';

import React from 'react';
import Link from 'next/link';
import { Bookmark, LogIn, ArrowUpRight, BookmarkCheck } from 'lucide-react';
import PYQQuestionCard from '@/components/resources/pyqs/PYQQuestionCard';

export default function CBTMistakeVaultTab({
  user,
  vaultLoading,
  vaultItems = [],
  filteredVaultItems = [],
  vaultSubjectFilter,
  onSubjectFilterChange,
  visibleVaultCount,
  onVisibleVaultCountChange,
}) {
  return (
    <div className="space-y-6 text-left">
      {!user ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-md space-y-4">
          <Bookmark className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Sign in to access your Mistake Vault
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Your Mistake Vault syncs securely to your account and is available across all your devices.
          </p>
          <Link
            href="/login?callbackUrl=/mock-test?tab=mistake-vault"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Google</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Vault Header & Filter Bar */}
          {vaultLoading ? (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-4 w-14 bg-gray-200 dark:bg-gray-800 rounded" />
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              </div>
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded hidden sm:block" />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
                  Subject:
                </span>
                <button
                  type="button"
                  onClick={() => onSubjectFilterChange('ALL')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    vaultSubjectFilter === 'ALL'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm border border-gray-900 dark:border-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-transparent'
                  }`}
                >
                  All ({vaultItems.length})
                </button>
                {[
                  {
                    sub: 'Physics',
                    activeClass: 'bg-blue-600 text-white shadow-sm border border-blue-600',
                    unselClass: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60',
                  },
                  {
                    sub: 'Chemistry',
                    activeClass: 'bg-emerald-600 text-white shadow-sm border border-emerald-600',
                    unselClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60',
                  },
                  {
                    sub: 'Mathematics',
                    activeClass: 'bg-purple-600 text-white shadow-sm border border-purple-600',
                    unselClass: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 hover:bg-purple-100 dark:hover:bg-purple-900/60',
                  },
                ].map(({ sub, activeClass, unselClass }) => {
                  const count = vaultItems.filter((i) => i.subject === sub).length;
                  const isSel = vaultSubjectFilter === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => onSubjectFilterChange(sub)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSel ? activeClass : unselClass
                      }`}
                    >
                      {sub} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Questions bookmarked from your test attempts for revision
                </span>
                <Link
                  href="/lists"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  Open in Lists <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Vault Questions Feed */}
          {vaultLoading ? (
            <div className="space-y-6 animate-pulse" data-testid="cbt-vault-skeleton">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-6 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 rounded-md" />
                      <div className="h-6 w-28 bg-gray-200 dark:bg-gray-800 rounded-md" />
                    </div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  </div>
                  <div className="space-y-2 py-2">
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-800 rounded" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-800" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVaultItems.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-md space-y-3">
              <BookmarkCheck className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No questions in Mistake Vault
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Whenever you complete a mock test and review your scorecard, click the bookmark ribbon icon on questions you answered wrong or found tricky to build your revision list.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredVaultItems.slice(0, visibleVaultCount).map((item, idx) => {
                if (!item.question) return null;
                const qDoc = {
                  ...item.question,
                  subject: item.question.subject || item.subject,
                  chapter: item.question.chapter || item.chapter,
                  exam_type: item.question.exam_type || (item.paper_id?.includes('Advanced') ? 'JEE_ADVANCED' : 'JEE_MAIN'),
                  paper_slug: item.question?.paper_slug || item.paper_slug,
                };

                return (
                  <PYQQuestionCard
                    key={String(item._id)}
                    question={qDoc}
                    practiceIndex={idx + 1}
                    solutionBehavior="dropdown"
                  />
                );
              })}

              {filteredVaultItems.length > visibleVaultCount && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => onVisibleVaultCountChange((prev) => prev + 10)}
                    className="px-6 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 hover:border-amber-400 dark:hover:border-amber-500 font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200 shadow-sm transition-all cursor-pointer"
                  >
                    Load More Questions ({filteredVaultItems.length - visibleVaultCount} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
