'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  LogIn,
  Play,
  Loader2
} from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import MarkdownMathRenderer from '@/components/common/MarkdownMathRenderer';
import { normalizeOptions } from '@/utils/cbt-helpers';
import { getExamBadgeColor, subjectColors } from '@/utils/pyq-helpers';
import PYQQuestionCard from '@/components/resources/pyqs/PYQQuestionCard';
import { YearFilterPills } from '@/components/resources/pyqs/PYQFilterBar';

export default function CBTHubComponent({
  user,
  papers = [],
  submissions = [],
  initialVaultItems = [],
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Hub Tab: "papers" | "attempts" | "vault"
  const tabParam = searchParams.get('tab');
  const [prevTabParam, setPrevTabParam] = useState(tabParam);
  const [activeTab, setActiveTab] = useState(() => {
    if (tabParam === 'attempts') return 'attempts';
    if (tabParam === 'vault' || tabParam === 'mistake-vault') return 'vault';
    return 'papers';
  });

  // Adjust tab state during render when URL searchParams change
  if (tabParam !== prevTabParam) {
    setPrevTabParam(tabParam);
    if (tabParam === 'attempts') {
      setActiveTab('attempts');
    } else if (tabParam === 'vault' || tabParam === 'mistake-vault') {
      setActiveTab('vault');
    } else {
      setActiveTab('papers');
    }
  }

  // Instant launch transition state
  const [isLaunchingExam, setIsLaunchingExam] = useState(false);

  // Navigate to mock test with instant exam curtain so website UI is never seen stretched in fullscreen
  const handleStartMockTest = (e, slug) => {
    e.preventDefault();
    setIsLaunchingExam(true);
    try {
      if (typeof document !== 'undefined' && !document.fullscreenElement) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen().catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Native fullscreen trigger failed:', err);
    }
    router.push(`/mock-test/${slug}`);
  };

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

  // Pagination for Available Papers (12 papers per page, matching PYQPapersList)
  const [page, setPage] = useState(1);
  const [prevFilters, setPrevFilters] = useState({ examTypeFilter, yearFilter });
  const limit = 12;

  // Reset pagination during render when filters change
  if (prevFilters.examTypeFilter !== examTypeFilter || prevFilters.yearFilter !== yearFilter) {
    setPrevFilters({ examTypeFilter, yearFilter });
    setPage(1);
  }

  const totalPages = Math.ceil(filteredPapers.length / limit) || 1;
  const paginatedPapers = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredPapers.slice(start, start + limit);
  }, [filteredPapers, page, limit]);

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
      return { totalTests: 0, avgAccuracy: 0, bestScore: 0, bestMaxMarks: 300, bestPct: '0.0' };
    }
    const totalTests = submissions.length;
    let sumAccuracy = 0;
    let highestPct = -999;
    let bestScore = 0;
    let bestMaxMarks = 300;

    submissions.forEach((s) => {
      const acc = s.summary?.accuracy_percentage ?? 0;
      const score = s.summary?.total_score ?? 0;
      const max = s.summary?.max_marks || (s.exam_type === 'JEE_ADVANCED' ? 180 : 300);
      const pct = (score / max) * 100;
      sumAccuracy += acc;

      if (pct > highestPct) {
        highestPct = pct;
        bestScore = score;
        bestMaxMarks = max;
      }
    });

    return {
      totalTests,
      avgAccuracy: (sumAccuracy / totalTests).toFixed(1),
      bestScore: highestPct === -999 ? 0 : bestScore,
      bestMaxMarks: highestPct === -999 ? 300 : bestMaxMarks,
      bestPct: highestPct === -999 ? '0.0' : Math.max(0, highestPct).toFixed(1),
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
          question_id: item.question_id,
        }),
      });
    } catch (err) {
      console.error('Failed to remove from mistake vault in MongoDB:', err);
    }
  };

  // Two-way URL Tab Selection
  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    const targetUrl =
      tab === 'papers'
        ? '/mock-test'
        : `/mock-test?tab=${tab === 'vault' ? 'mistake-vault' : tab}`;
    window.history.pushState(null, '', targetUrl);
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      {/* Instant Exam Launch Curtain (prevents website UI from ever being seen stretched in fullscreen) */}
      {isLaunchingExam && (
        <div className="fixed inset-0 z-[9999] bg-[#162942] flex flex-col items-center justify-center text-white select-none">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            <h2 className="text-xl font-bold tracking-wide">
              Connecting to Assessment Terminal...
            </h2>
            <p className="text-sm text-blue-200">
              Initializing secure full-screen examination kiosk (Terminal C001)...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs
          crumbs={[
            { label: 'Mock Tests', href: '/mock-test' },
          ]}
          className="pb-2"
        />

        {/* Clean Student-Facing Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-gray-200 dark:border-gray-800">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
              JEE Mock Tests
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              Practice official full-length JEE Main and Advanced previous year papers under real exam conditions with timed test simulation, instant scorecards, and mistake revision.
            </p>
          </div>

          {!user && (
            <Link
              href="/login?callbackUrl=/mock-test"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all shrink-0 self-start md:self-end"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Track History</span>
            </Link>
          )}
        </div>

        {/* Performance Overview Strip for Authenticated Student */}
        {user && (
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
                  {vaultItems.length} Qs
                </span>
              </div>
            </div>
          </div>
        )}

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
            {/* Filter Bar with Official Color Chips */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1">
                  Exam Type:
                </span>
                <button
                  type="button"
                  onClick={() => setExamTypeFilter('ALL')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    examTypeFilter === 'ALL'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  All Exams
                </button>
                {/* Official JEE Main Badge Color (Emerald) */}
                <button
                  type="button"
                  onClick={() => setExamTypeFilter('JEE_MAIN')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    examTypeFilter === 'JEE_MAIN'
                      ? 'bg-emerald-600 text-white shadow-sm border border-emerald-600'
                      : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  }`}
                >
                  JEE Main
                </button>
                {/* Official JEE Advanced Badge Color (Orange) */}
                <button
                  type="button"
                  onClick={() => setExamTypeFilter('JEE_ADVANCED')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    examTypeFilter === 'JEE_ADVANCED'
                      ? 'bg-orange-600 text-white shadow-sm border border-orange-600'
                      : 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 hover:bg-orange-100 dark:hover:bg-orange-900/60'
                  }`}
                >
                  JEE Advanced
                </button>
              </div>

              {availableYears.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0 mr-1">
                    Exam Year:
                  </span>
                  <YearFilterPills
                    availableYears={availableYears}
                    selectedYear={yearFilter === 'ALL' ? 'All' : yearFilter}
                    onSelectYear={(y) => setYearFilter(y === 'All' ? 'ALL' : y)}
                    activeClass="bg-blue-600 text-white shadow-sm"
                    inactiveClass="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                    size="sm"
                  />
                </div>
              )}
            </div>

            {/* Papers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPapers.map((paper) => {
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
                      <button
                        type="button"
                        onClick={(e) => handleStartMockTest(e, paper.slug)}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white shadow-sm hover:shadow transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Start Mock Test</span>
                      </button>

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

            {/* Pagination Controls matching PYQPapersList */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => {
                    const newPage = Math.max(1, page - 1);
                    setPage(newPage);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 tabular-nums">
                  Page <strong className="font-bold text-gray-900 dark:text-white">{page}</strong> of{' '}
                  <strong className="font-bold text-gray-900 dark:text-white">{totalPages}</strong>
                  <span className="ml-2 text-xs text-gray-500">({filteredPapers.length} Papers)</span>
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => {
                    const newPage = Math.min(totalPages, page + 1);
                    setPage(newPage);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MY TEST ATTEMPTS & PROGRESSION                                     */}
        {/* ========================================================================= */}
        {activeTab === 'attempts' && (
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
                  onClick={() => handleTabSelect('papers')}
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
                          <button
                            type="button"
                            onClick={(e) => handleStartMockTest(e, paperSlug)}
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
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MISTAKE VAULT (MONGODB PERSISTENT NOTEBOOK)                        */}
        {/* ========================================================================= */}
        {activeTab === 'vault' && (
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
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-1">
                      Subject:
                    </span>
                    <button
                      type="button"
                      onClick={() => setVaultSubjectFilter('ALL')}
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
                          onClick={() => setVaultSubjectFilter(sub)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSel ? activeClass : unselClass
                          }`}
                        >
                          {sub} ({count})
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Questions bookmarked from your test attempts for revision
                  </span>
                </div>

                {/* Vault Questions Feed */}
                {filteredVaultItems.length === 0 ? (
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
                    {filteredVaultItems.map((item, idx) => {
                      if (!item.question) return null;
                      const qDoc = {
                        ...item.question,
                        subject: item.question.subject || item.subject,
                        chapter: item.question.chapter || item.chapter,
                        exam_type: item.question.exam_type || (item.paper_id?.includes('Advanced') ? 'JEE_ADVANCED' : 'JEE_MAIN'),
                        paper_slug: item.question.paper_slug || item.paper_slug || item.paper_id,
                      };

                      return (
                        <PYQQuestionCard
                          key={String(item._id)}
                          question={qDoc}
                          practiceIndex={idx + 1}
                          extraHeaderAction={
                            <button
                              type="button"
                              onClick={() => handleRemoveFromVault(item)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-all cursor-pointer"
                              title="Remove from Mistake Vault"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          }
                        />
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
