'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  BookOpen, 
  Target, 
  Bookmark, 
  Loader2 
} from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import CBTMockTestModal from '@/components/modals/CBTMockTestModal';
import CBTHubPerformanceStrip from '@/components/cbt/hub/CBTHubPerformanceStrip';
import CBTAvailablePapersTab from '@/components/cbt/hub/tabs/CBTAvailablePapersTab';
import CBTAttemptsTab from '@/components/cbt/hub/tabs/CBTAttemptsTab';
import CBTMistakeVaultTab from '@/components/cbt/hub/tabs/CBTMistakeVaultTab';

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
          <CBTHubPerformanceStrip
            analytics={analytics}
            vaultCount={vaultCount}
          />
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

        {/* TAB 1: AVAILABLE MOCK TESTS */}
        {activeTab === 'papers' && (
          <CBTAvailablePapersTab
            papers={papers}
            papersLoading={papersLoading}
            totalPapers={totalPapers}
            totalPages={totalPages}
            page={page}
            onPageChange={(newPage) => {
              setPage(newPage);
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
            examTypeFilter={examTypeFilter}
            onExamTypeChange={handleExamTypeChange}
            yearFilter={yearFilter}
            onYearChange={handleYearChange}
            availableYears={availableYears}
            user={user}
            onSelectMockPaper={setSelectedMockPaper}
          />
        )}

        {/* TAB 2: MY TEST ATTEMPTS & PROGRESSION */}
        {activeTab === 'attempts' && (
          <CBTAttemptsTab
            user={user}
            submissions={submissions}
            papers={papers}
            onSelectMockPaper={setSelectedMockPaper}
            onBrowsePapers={() => handleTabSelect('papers')}
          />
        )}

        {/* TAB 3: MISTAKE VAULT (MONGODB PERSISTENT NOTEBOOK) */}
        {activeTab === 'vault' && (
          <CBTMistakeVaultTab
            user={user}
            vaultLoading={vaultLoading}
            vaultItems={vaultItems}
            filteredVaultItems={filteredVaultItems}
            vaultSubjectFilter={vaultSubjectFilter}
            onSubjectFilterChange={setVaultSubjectFilter}
            visibleVaultCount={visibleVaultCount}
            onVisibleVaultCountChange={setVisibleVaultCount}
          />
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
