'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Award, 
  Target, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  ArrowUpRight, 
  RotateCcw, 
  Sparkles, 
  Filter, 
  FileText, 
  Trash2, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp,
  LogIn
} from 'lucide-react';
import MarkdownMathRenderer from '@/components/common/MarkdownMathRenderer';
import { normalizeOptions } from '@/utils/cbt-helpers';

const subjectBadgeColors = {
  Physics: "text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60",
  Chemistry: "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60",
  Mathematics: "text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60",
};

export default function CBTHubComponent({
  user,
  papers = [],
  submissions = [],
  initialVaultItems = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Hub Tab: "papers" | "attempts" | "vault"
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'attempts') return 'attempts';
    if (tabParam === 'vault' || tabParam === 'mistake-vault') return 'vault';
    return 'papers';
  });

  // Filter state for Available Papers
  const [examTypeFilter, setExamTypeFilter] = useState('ALL');
  const [yearFilter, setYearFilter] = useState('ALL');

  // Vault state (MongoDB-backed)
  const [vaultItems, setVaultItems] = useState(initialVaultItems);
  const [vaultSubjectFilter, setVaultSubjectFilter] = useState('ALL');
  const [expandedSolutions, setExpandedSolutions] = useState(() => new Set());

  // Filter papers
  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      if (examTypeFilter !== 'ALL' && p.exam_type !== examTypeFilter) return false;
      if (yearFilter !== 'ALL' && String(p.exam_year) !== String(yearFilter)) return false;
      return true;
    });
  }, [papers, examTypeFilter, yearFilter]);

  // Unique years for papers
  const availableYears = useMemo(() => {
    const set = new Set();
    papers.forEach((p) => {
      if (p.exam_year) set.add(String(p.exam_year));
    });
    return Array.from(set).sort((a, b) => Number(b) - Number(a));
  }, [papers]);

  // Filter vault items
  const filteredVaultItems = useMemo(() => {
    return vaultItems.filter((item) => {
      if (vaultSubjectFilter !== 'ALL' && item.subject !== vaultSubjectFilter) return false;
      return true;
    });
  }, [vaultItems, vaultSubjectFilter]);

  // Performance analytics summary across attempts
  const analytics = useMemo(() => {
    if (!submissions || submissions.length === 0) {
      return { totalTests: 0, avgAccuracy: 0, highestScore: 0, totalAttempts: 0 };
    }
    const totalTests = submissions.length;
    let sumAccuracy = 0;
    let highest = -999;
    submissions.forEach((s) => {
      const acc = s.summary?.accuracy_percentage ?? 0;
      const score = s.summary?.total_score ?? 0;
      sumAccuracy += acc;
      if (score > highest) highest = score;
    });

    return {
      totalTests,
      avgAccuracy: (sumAccuracy / totalTests).toFixed(1),
      highestScore: highest === -999 ? 0 : highest,
    };
  }, [submissions]);

  // Toggle single solution
  const toggleSolution = (itemId) => {
    setExpandedSolutions((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Remove question from Mistake Vault (MongoDB API)
  const handleRemoveFromVault = async (item) => {
    const itemId = String(item._id);
    // Optimistic removal
    setVaultItems((prev) => prev.filter((i) => String(i._id) !== itemId));

    try {
      await fetch('/api/cbt/mistake-vault', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper_id: item.paper_id,
          question_number: item.question_number,
        }),
      });
    } catch (err) {
      console.error('Failed to remove from mistake vault in MongoDB:', err);
    }
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    const query = tab === 'papers' ? '' : `?tab=${tab === 'vault' ? 'mistake-vault' : tab}`;
    router.replace(`/mock-test${query}`, { scroll: false });
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-[#162942] via-[#1b365d] to-[#0f1d30] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-blue-900/50 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-blue-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>JEE Challenger • CBT Mock Test Center</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Official Timed Mock Test Engine & Mistake Vault
            </h1>
            <p className="text-sm sm:text-base text-blue-100/80 leading-relaxed font-normal">
              Experience the authentic NTA JEE Main and TCS iON JEE Advanced interface with countdown kiosk simulation, deterministic scoring, pacing heatmaps, and a persistent Mistake Vault.
            </p>
          </div>

          {/* Quick Metrics Strip for Authenticated Student */}
          {user ? (
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-blue-800/60 mt-6">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-xs font-semibold text-blue-300 block">Tests Completed</span>
                <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
                  {analytics.totalTests}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-xs font-semibold text-blue-300 block">Avg Accuracy</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-300 mt-1 block">
                  {analytics.avgAccuracy}%
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-xs font-semibold text-blue-300 block">Highest Score</span>
                <span className="text-xl sm:text-2xl font-black text-amber-300 mt-1 block">
                  {analytics.highestScore}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="text-xs font-semibold text-blue-300 block">Mistake Vault</span>
                <span className="text-xl sm:text-2xl font-black text-blue-100 mt-1 block">
                  {vaultItems.length} Qs
                </span>
              </div>
            </div>
          ) : (
            <div className="relative z-10 pt-4 mt-4 border-t border-blue-800/60 flex items-center justify-between">
              <span className="text-xs sm:text-sm text-blue-200">
                Sign in to save test attempt history, track speed vs accuracy, and sync your Mistake Vault across devices.
              </span>
              <Link
                href="/login?callbackUrl=/mock-test"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-gray-900 hover:bg-blue-50 transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </div>
          )}
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800/90 rounded-2xl overflow-x-auto no-scrollbar">
            {/* Tab 1: Available Mock Tests */}
            <button
              type="button"
              onClick={() => handleTabSelect('papers')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'papers'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Available Mock Tests ({papers.length})</span>
            </button>

            {/* Tab 2: My Test Attempts */}
            <button
              type="button"
              onClick={() => handleTabSelect('attempts')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'attempts'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>My Test Attempts ({submissions.length})</span>
            </button>

            {/* Tab 3: Mistake Vault */}
            <button
              type="button"
              onClick={() => handleTabSelect('vault')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Mistake Vault ({vaultItems.length})</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: AVAILABLE MOCK TESTS                                               */}
        {/* ========================================================================= */}
        {activeTab === 'papers' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1">
                  Exam:
                </span>
                <button
                  type="button"
                  onClick={() => setExamTypeFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    examTypeFilter === 'ALL'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  All Exams
                </button>
                <button
                  type="button"
                  onClick={() => setExamTypeFilter('JEE_MAIN')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    examTypeFilter === 'JEE_MAIN'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  JEE Main
                </button>
                <button
                  type="button"
                  onClick={() => setExamTypeFilter('JEE_ADVANCED')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    examTypeFilter === 'JEE_ADVANCED'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  JEE Advanced
                </button>
              </div>

              {availableYears.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Year:
                  </span>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    <option value="ALL">All Years</option>
                    {availableYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Papers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPapers.map((paper) => {
                const isAdv = paper.exam_type === 'JEE_ADVANCED';
                const totalQuestions = paper.sections?.reduce(
                  (sum, s) => sum + (s.total_questions || 0),
                  0
                ) || (isAdv ? 51 : 75);

                return (
                  <div
                    key={paper._id || paper.slug}
                    className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-6 flex flex-col justify-between hover:shadow-xl transition-all text-left"
                  >
                    <div className="space-y-4">
                      {/* Badge Row */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-lg border ${
                            isAdv
                              ? 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200'
                              : 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200'
                          }`}
                        >
                          {isAdv ? 'JEE Advanced' : 'JEE Main'}
                        </span>
                        <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg">
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
                      <Link
                        href={`/mock-test/${paper.slug}`}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Start Mock Test</span>
                      </Link>

                      <Link
                        href={`/paper/${paper.slug}`}
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
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY TEST ATTEMPTS & PROGRESSION                                     */}
        {/* ========================================================================= */}
        {activeTab === 'attempts' && (
          <div className="space-y-6 text-left">
            {!user ? (
              <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 space-y-4">
                <Target className="w-12 h-12 text-blue-500 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Sign in to view your test attempts
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Your mock test attempts, scores, and accuracy heatmaps are securely saved to your account.
                </p>
                <Link
                  href="/login?callbackUrl=/mock-test?tab=attempts"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Google</span>
                </Link>
              </div>
            ) : submissions.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 space-y-4">
                <BookOpen className="w-12 h-12 text-blue-500 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  No mock test attempts recorded yet
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Start your first timed simulation from the Available Mock Tests tab to receive your official scorecard and speed analysis.
                </p>
                <button
                  type="button"
                  onClick={() => handleTabSelect('papers')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-sm"
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
                  const paperSlug = sub.paper_slug || sub.paper_id;

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
                          <span>•</span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Target className="w-3.5 h-3.5" />
                            <span>{accuracy.toFixed(1)}% Accuracy</span>
                          </span>
                          <span>•</span>
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
                          <Link
                            href={`/mock-test/${paperSlug}`}
                            className="p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Retake Exam"
                          >
                            <RotateCcw className="w-4 h-4 text-orange-500" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MISTAKE VAULT (MONGODB PERSISTENT NOTEBOOK)                        */}
        {/* ========================================================================= */}
        {activeTab === 'vault' && (
          <div className="space-y-6 text-left">
            {!user ? (
              <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 space-y-4">
                <Bookmark className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Sign in to access your Mistake Vault
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Your Mistake Vault is saved directly in MongoDB Atlas and syncs automatically across all your devices.
                </p>
                <Link
                  href="/login?callbackUrl=/mock-test?tab=mistake-vault"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-white shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In with Google</span>
                </Link>
              </div>
            ) : (
              <>
                {/* Vault Header & Filter Bar */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
                      Subject:
                    </span>
                    <button
                      type="button"
                      onClick={() => setVaultSubjectFilter('ALL')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        vaultSubjectFilter === 'ALL'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      All ({vaultItems.length})
                    </button>
                    {['Physics', 'Chemistry', 'Mathematics'].map((sub) => {
                      const count = vaultItems.filter((i) => i.subject === sub).length;
                      return (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setVaultSubjectFilter(sub)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            vaultSubjectFilter === sub
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {sub} ({count})
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Questions saved in your personal MongoDB Notebook
                  </span>
                </div>

                {/* Vault Questions Feed */}
                {filteredVaultItems.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 space-y-3">
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
                    {filteredVaultItems.map((item) => {
                      const qDoc = item.question;
                      const isExpanded = expandedSolutions.has(String(item._id));
                      const normOptions = normalizeOptions(qDoc?.options);

                      return (
                        <div
                          key={String(item._id)}
                          className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] overflow-hidden text-left"
                        >
                          {/* Card Header */}
                          <div className="p-4 md:p-6 bg-gray-50/70 dark:bg-[#0d1320] border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-lg shadow-sm">
                                Q{item.question_number}
                              </span>
                              {item.subject && (
                                <span
                                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                                    subjectBadgeColors[item.subject] ||
                                    'text-gray-600 bg-gray-100 border-gray-200'
                                  }`}
                                >
                                  {item.subject}
                                </span>
                              )}
                              {(item.chapter || qDoc?.chapter) && (
                                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                  {item.chapter || qDoc?.chapter}
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {item.paper_slug || item.paper_id}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveFromVault(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-all cursor-pointer"
                              title="Remove from Mistake Vault"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>

                          {/* Card Body */}
                          <div className="p-6 md:p-8 space-y-6">
                            {qDoc?.passage_text && (
                              <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-[#0d1320] border border-gray-200 dark:border-gray-800 text-sm">
                                <MarkdownMathRenderer content={qDoc.passage_text} />
                              </div>
                            )}

                            {/* Question Text */}
                            <div className="text-base md:text-lg leading-relaxed text-gray-900 dark:text-gray-100">
                              <MarkdownMathRenderer
                                content={qDoc?.question_text || 'Loading question statement...'}
                              />
                            </div>

                            {/* Question Diagrams */}
                            {qDoc?.question_diagram_urls && qDoc.question_diagram_urls.length > 0 && (
                              <div className="flex flex-wrap gap-4 pt-2">
                                {qDoc.question_diagram_urls.map((url, dIdx) => (
                                  <img
                                    key={dIdx}
                                    src={url}
                                    alt={`Question diagram ${dIdx + 1}`}
                                    className="max-h-72 object-contain rounded-xl border border-gray-200 dark:border-gray-800"
                                    loading="lazy"
                                  />
                                ))}
                              </div>
                            )}

                            {/* Options with Official Key Highlighted */}
                            {normOptions.length > 0 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                {normOptions.map((opt) => {
                                  const isCorrect = qDoc?.correct_answer?.includes(opt.key);
                                  return (
                                    <div
                                      key={opt.key}
                                      className={`p-4 rounded-2xl border-2 flex items-start gap-3 ${
                                        isCorrect
                                          ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                                          : 'border-gray-200 dark:border-gray-800 opacity-70'
                                      }`}
                                    >
                                      <div
                                        className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                                          isCorrect
                                            ? 'bg-emerald-500 text-white'
                                            : 'border border-gray-300 dark:border-gray-700 text-gray-500'
                                        }`}
                                      >
                                        {opt.key}
                                      </div>
                                      <div className="flex-1 min-w-0 text-sm">
                                        <MarkdownMathRenderer content={opt.text} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Collapsible Step-by-Step Solution */}
                            {qDoc?.solution && (
                              <div className="pt-2">
                                {!isExpanded ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleSolution(String(item._id))}
                                    className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 hover:bg-orange-100/60 dark:hover:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40 text-orange-900 dark:text-orange-200 transition-all cursor-pointer group"
                                  >
                                    <div className="flex items-center gap-2.5 font-bold text-sm">
                                      <Sparkles className="w-4 h-4 text-orange-500" />
                                      <span>View Step-by-Step Solution</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                                      <span>Show</span>
                                      <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                                    </div>
                                  </button>
                                ) : (
                                  <div className="rounded-2xl border border-orange-200/80 dark:border-orange-900/60 bg-gradient-to-b from-orange-50/40 to-transparent dark:from-orange-950/20 dark:to-transparent overflow-hidden">
                                    <button
                                      type="button"
                                      onClick={() => toggleSolution(String(item._id))}
                                      className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-orange-50/80 dark:bg-orange-950/40 border-b border-orange-200/60 dark:border-orange-900/40 text-orange-900 dark:text-orange-200 transition-all cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2.5 font-bold text-sm">
                                        <Sparkles className="w-4 h-4 text-orange-500" />
                                        <span>Step-by-Step Solution</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
                                        <span>Hide</span>
                                        <ChevronUp className="w-4 h-4" />
                                      </div>
                                    </button>
                                    <div className="p-5 sm:p-6 space-y-4">
                                      <div className="text-sm md:text-base text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
                                        <MarkdownMathRenderer content={qDoc.solution} />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
