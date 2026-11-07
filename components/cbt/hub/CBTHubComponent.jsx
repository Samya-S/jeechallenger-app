'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import CBTMockTestModal from '@/components/modals/CBTMockTestModal';
import { normalizeOptions } from '@/utils/cbt-helpers';
import { getExamBadgeColor, subjectColors } from '@/utils/pyq-helpers';
import PYQQuestionCard from '@/components/resources/pyqs/PYQQuestionCard';
import { YearFilterPills } from '@/components/resources/pyqs/PYQFilterBar';

export default function CBTHubComponent({
  user,
  submissions = [],
  initialVaultItems = [],
  initialVaultCount = 0,
  initialPapers = [],
  initialTotalPapers = 0,
  initialTotalPages = 1,
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
  const [selectedMockPaper, setSelectedMockPaper] = useState(null);

  // Navigate to mock test with instant exam curtain so website UI is never seen stretched in fullscreen
  const handleStartMockTest = (e, slug) => {
    e?.preventDefault?.();
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

  // Filter state for Available Papers (initialized from URL)
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const [page, setPage] = useState(Number.isInteger(initialPage) && initialPage > 0 ? initialPage : 1);
  const [examTypeFilter, setExamTypeFilter] = useState(searchParams.get('exam_type') || 'ALL');
  const [yearFilter, setYearFilter] = useState(searchParams.get('year') || 'ALL');

  // Papers data & pagination state (Server-side API Pagination matching PYQPapersList)
  const [papers, setPapers] = useState(initialPapers);
  const [totalPapers, setTotalPapers] = useState(initialTotalPapers);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [papersLoading, setPapersLoading] = useState(initialPapers.length === 0);
  const limit = 12;

  // Dynamic available years from dedicated API endpoint
  const [availableYears, setAvailableYears] = useState(['All', '2026', '2025', '2024']);
  useEffect(() => {
    fetch('/api/pyqs/papers/years')
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || [];
        if (list.length > 0) {
          const sorted = list.map(String).sort((a, b) => Number(b) - Number(a));
          setAvailableYears(['All', ...sorted]);
        }
      })
      .catch((err) => console.error('Error fetching available years in CBT Hub:', err));
  }, []);

  // Fetch papers from backend with server-side pagination & filter params
  const hasLoadedInitial = useRef(initialPapers.length > 0 && page === 1 && examTypeFilter === 'ALL' && yearFilter === 'ALL');

  useEffect(() => {
    // If initial papers were already pre-populated from SSR for page 1 and no filters are active, skip duplicate first fetch
    if (hasLoadedInitial.current) {
      hasLoadedInitial.current = false;
      return;
    }

    if (activeTab !== 'papers') return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPapersLoading(true);
    const params = new URLSearchParams();
    if (examTypeFilter && examTypeFilter !== 'ALL') params.set('exam_type', examTypeFilter);
    if (yearFilter && yearFilter !== 'ALL' && yearFilter !== 'All') params.set('exam_year', yearFilter);
    params.set('page', String(page));
    params.set('limit', String(limit));

    fetch(`/api/pyqs/papers?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || data.papers || [];
        setPapers(list);
        if (data.meta) {
          setTotalPages(data.meta.total_pages || 1);
          setTotalPapers(data.meta.total || 0);
        } else {
          setTotalPages(1);
          setTotalPapers(list.length);
        }
        setPapersLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching papers in CBT Hub:', err);
        setPapers([]);
        setTotalPages(1);
        setTotalPapers(0);
        setPapersLoading(false);
      });
  }, [activeTab, examTypeFilter, yearFilter, page, limit]);

  // Sync URL query params with active tab, filters, and page
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (activeTab && activeTab !== 'papers') {
      params.set('tab', activeTab === 'vault' ? 'mistake-vault' : activeTab);
    }

    if (activeTab === 'papers') {
      if (examTypeFilter && examTypeFilter !== 'ALL') params.set('exam_type', examTypeFilter);
      if (yearFilter && yearFilter !== 'ALL' && yearFilter !== 'All') params.set('year', yearFilter);
      if (page > 1) params.set('page', String(page));
    }

    const query = params.toString();
    const targetUrl = query ? `/mock-test?${query}` : '/mock-test';
    window.history.replaceState(null, '', targetUrl);
  }, [activeTab, examTypeFilter, yearFilter, page]);

  const handleExamTypeChange = (type) => {
    setExamTypeFilter(type);
    setPage(1);
  };

  const handleYearChange = (year) => {
    setYearFilter(year);
    setPage(1);
  };

  // Vault state (MongoDB-backed with on-demand deferred loading)
  const [vaultItems, setVaultItems] = useState(initialVaultItems);
  const [vaultLoading, setVaultLoading] = useState(
    (tabParam === 'vault' || tabParam === 'mistake-vault') && initialVaultItems.length === 0 && Boolean(user)
  );
  const [vaultSubjectFilter, setVaultSubjectFilter] = useState('ALL');
  const [expandedSolutions, setExpandedSolutions] = useState(() => new Set());
  const [visibleVaultCount, setVisibleVaultCount] = useState(10);
  const hasLoadedVaultRef = useRef(initialVaultItems.length > 0);
  const vaultCount = hasLoadedVaultRef.current ? vaultItems.length : (initialVaultCount ?? 0);

  // Lazy fetch mistake vault questions if directly navigating or active tab matches
  useEffect(() => {
    if (activeTab === 'vault' && !hasLoadedVaultRef.current && !vaultLoading && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVaultLoading(true);
      fetch('/api/cbt/mistake-vault')
        .then((res) => res.json())
        .then((data) => {
          const items = data.items || [];
          setVaultItems(items);
          hasLoadedVaultRef.current = true;
          setVaultLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load mistake vault questions:', err);
          setVaultItems([]);
          hasLoadedVaultRef.current = true;
          setVaultLoading(false);
        });
    }
  }, [activeTab, user, vaultLoading]);

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
        body: JSON.stringify({ question_id: item.question_id || item._id }),
      });
    } catch (err) {
      console.error('Failed to remove from mistake vault in MongoDB:', err);
    }
  };

  // Two-way URL Tab Selection
  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    setPage(1);
    if (tab === 'vault') {
      setVisibleVaultCount(10);
      if (!hasLoadedVaultRef.current && user) {
        setVaultLoading(true);
        fetch('/api/cbt/mistake-vault')
          .then((res) => res.json())
          .then((data) => {
            const items = data.items || [];
            setVaultItems(items);
            hasLoadedVaultRef.current = true;
            setVaultLoading(false);
          })
          .catch((err) => {
            console.error('Failed to load mistake vault questions:', err);
            setVaultItems([]);
            hasLoadedVaultRef.current = true;
            setVaultLoading(false);
          });
      }
    }
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
        <div className="space-y-2 text-left pb-2 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            JEE Mock Tests
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            Practice official full-length JEE Main and Advanced previous year papers under real exam conditions with timed test simulation, instant scorecards, and mistake revision.
          </p>
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
                  {vaultCount} Qs
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation Controls */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="grid grid-cols-3 sm:flex p-1 bg-gray-100 dark:bg-gray-800/90 rounded-2xl w-full sm:w-auto">
            {/* Tab 1: Available Mock Tests */}
            <button
              type="button"
              onClick={() => handleTabSelect('papers')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'papers'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Available Mock Tests ({totalPapers})</span>
              <span className="sm:hidden">Tests ({totalPapers})</span>
            </button>

            {/* Tab 2: My Test Attempts */}
            <button
              type="button"
              onClick={() => handleTabSelect('attempts')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'attempts'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">My Test Attempts ({submissions.length})</span>
              <span className="sm:hidden">Attempts ({submissions.length})</span>
            </button>

            {/* Tab 3: Mistake Vault */}
            <button
              type="button"
              onClick={() => handleTabSelect('vault')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'vault'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-400'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Mistake Vault ({vaultCount})</span>
              <span className="sm:hidden">Vault ({vaultCount})</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: AVAILABLE MOCK TESTS                                               */}
        {/* ========================================================================= */}
        {activeTab === 'papers' && (
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
                    onClick={() => handleExamTypeChange(et.value)}
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
                  onSelectYear={(y) => handleYearChange(y === 'All' ? 'ALL' : y)}
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
                            onClick={() => setSelectedMockPaper(paper)}
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
                  <span className="ml-2 text-xs text-gray-500">({totalPapers} Papers)</span>
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
                          <span>â€¢</span>
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <Target className="w-3.5 h-3.5" />
                            <span>{accuracy.toFixed(1)}% Accuracy</span>
                          </span>
                          <span>â€¢</span>
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
                              setSelectedMockPaper(matchedPaper);
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
                          onClick={() => setVisibleVaultCount((prev) => prev + 10)}
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
        )}
      </div>

      {/* Mock Test Launch Confirmation Modal */}
      <CBTMockTestModal
        isOpen={Boolean(selectedMockPaper)}
        onClose={() => setSelectedMockPaper(null)}
        onConfirm={(slug) => handleStartMockTest(null, slug)}
        paper={selectedMockPaper}
      />
    </div>
  );
}
