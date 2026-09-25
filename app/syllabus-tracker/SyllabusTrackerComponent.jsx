'use client';

import React, { useState, useMemo, useSyncExternalStore, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Cloud,
  CloudOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Search,
  X,
  Share2,
  Download,
  Upload,
  RotateCcw,
  ChevronsDownUp,
  ChevronsUpDown,
} from 'lucide-react';
import { syllabusData } from '@/data/syllabus-data';
import {
  subscribeProgressData,
  getProgressStorageSnapshot,
  updateChapterProgress,
  calculateSubjectProgress,
  calculateOverallProgress,
  resetAllProgress,
  exportProgress,
  importProgress,
  saveProgressData,
  getAnonymousProgressData,
  deleteAnonymousProgressData,
} from './progressUtils';
import { mergeProgress, isSameProgress, isEmptyProgress } from './syncUtils';
import SubjectCard from './SubjectCard';
import { ChapterList } from './ChapterRow';
import ShareProgressModal from './ShareProgressModal';
import SyncConflictModal from './SyncConflictModal';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';

import { usePathname, useSearchParams } from 'next/navigation';

function useProgressDataFromStorage(userId) {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => subscribeProgressData(userId, onStoreChange),
    () => getProgressStorageSnapshot(userId),
    () => '{}'
  );
  return useMemo(() => {
    try {
      return JSON.parse(snapshot);
    } catch {
      return {};
    }
  }, [snapshot]);
}

const getChapterStatus = (progress) => {
  if (!progress) return 'not-started';
  const count = (progress.theory ? 1 : 0) + (progress.pyqs ? 1 : 0) + (progress.revision ? 1 : 0);
  if (count === 3) return 'completed';
  if (count > 0) return 'in-progress';
  return 'not-started';
};

const SyllabusTrackerComponent = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userId = session?.user?.id;
  const isAuthenticated = status === 'authenticated';

  const currentSearchParams = searchParams ? searchParams.toString() : '';
  const fullCurrentPath = currentSearchParams ? `${pathname}?${currentSearchParams}` : (pathname || '/syllabus-tracker');
  const encodedReturnUrl = encodeURIComponent(fullCurrentPath);

  const progressData = useProgressDataFromStorage(userId);
  const overallStats = useMemo(
    () => calculateOverallProgress(syllabusData, progressData),
    [progressData]
  );

  const [expandedSubjects, setExpandedSubjects] = useState({
    physics: true,
    chemistry: false,
    mathematics: false,
  });

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'not-started' | 'in-progress' | 'completed'

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Sync state
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'synced', 'error'
  const [isInitializingSync, setIsInitializingSync] = useState(false);
  const isInitializingSyncRef = React.useRef(false);
  const [syncInitialized, setSyncInitialized] = useState(false);

  // Conflict modal state
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState({ local: null, cloud: null });

  // Load sync preference
  useEffect(() => {
    if (isAuthenticated) {
      const storedPref = localStorage.getItem(`jee_syllabus_sync_enabled_${userId}`);
      if (storedPref !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSyncEnabled(storedPref === 'true');
      } else {
        // Default to true on first login
        setSyncEnabled(true);
        localStorage.setItem(`jee_syllabus_sync_enabled_${userId}`, 'true');
      }
    }
  }, [isAuthenticated, userId]);

  // Handle toggling cloud sync
  const handleToggleSync = () => {
    const newVal = !syncEnabled;
    setSyncEnabled(newVal);
    if (isAuthenticated) {
      localStorage.setItem(`jee_syllabus_sync_enabled_${userId}`, String(newVal));
      if (!newVal) {
        setSyncInitialized(false);
        setSyncStatus('idle');
        isInitializingSyncRef.current = false;
      }
    }
  };

  // Perform initial sync / migration
  useEffect(() => {
    let isMounted = true;

    async function performInitialSync() {
      if (!isAuthenticated || !syncEnabled || syncInitialized || isInitializingSyncRef.current) return;

      isInitializingSyncRef.current = true;
      setIsInitializingSync(true);
      setSyncStatus('syncing');

      try {
        const response = await fetch('/api/syllabus-tracker/sync');
        if (!response.ok) throw new Error('Failed to fetch cloud progress');

        const { progress: cloudProgress } = await response.json();

        // Check local state. If empty, check anonymous data.
        let localData = progressData;
        let claimingAnonymous = false;

        if (isEmptyProgress(localData)) {
          const anonData = getAnonymousProgressData();
          if (!isEmptyProgress(anonData)) {
            localData = anonData;
            claimingAnonymous = true;
          }
        }

        const isLocalEmpty = isEmptyProgress(localData);
        const isCloudEmpty = isEmptyProgress(cloudProgress);

        if (isLocalEmpty && !isCloudEmpty) {
          saveProgressData(userId, cloudProgress);
          setSyncInitialized(true);
          setSyncStatus('synced');
        } else if (!isLocalEmpty && isCloudEmpty) {
          saveProgressData(userId, localData);
          // eslint-disable-next-line react-hooks/immutability
          await pushToCloud(localData);
          if (claimingAnonymous) deleteAnonymousProgressData();
          setSyncInitialized(true);
        } else if (!isLocalEmpty && !isCloudEmpty && !isSameProgress(localData, cloudProgress)) {
          setConflictData({ local: localData, cloud: cloudProgress, claimingAnonymous });
          setShowConflictModal(true);
        } else {
          if (claimingAnonymous) {
            saveProgressData(userId, localData);
            deleteAnonymousProgressData();
          }
          setSyncInitialized(true);
          setSyncStatus('synced');
        }
      } catch (error) {
        console.error('Initial sync failed', error);
        if (isMounted) {
          setSyncStatus('error');
          isInitializingSyncRef.current = false;
        }
      } finally {
        if (isMounted) setIsInitializingSync(false);
      }
    }

    performInitialSync();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, syncEnabled, syncInitialized, userId, progressData]);

  const handleConflictResolve = async (resolution) => {
    setSyncStatus('syncing');
    setShowConflictModal(false);

    try {
      let finalData;
      if (resolution === 'merge') {
        finalData = mergeProgress(conflictData.local, conflictData.cloud);
      } else if (resolution === 'local') {
        finalData = conflictData.local;
      } else if (resolution === 'cloud') {
        finalData = conflictData.cloud;
      }

      saveProgressData(userId, finalData);
      await pushToCloud(finalData);

      if (conflictData.claimingAnonymous) {
        deleteAnonymousProgressData();
      }

      setSyncInitialized(true);
    } catch (error) {
      console.error('Failed to resolve conflict', error);
      setSyncStatus('error');
    }
  };

  const pushToCloud = async (data) => {
    const res = await fetch('/api/syllabus-tracker/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progress: data }),
    });
    if (!res.ok) throw new Error('Sync push failed');
    setSyncStatus('synced');
  };

  // Debounced Auto-sync on changes
  useEffect(() => {
    if (!isAuthenticated || !syncEnabled || !syncInitialized) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSyncStatus('syncing');
    const timer = setTimeout(() => {
      pushToCloud(progressData).catch((err) => {
        console.error('Auto-sync failed', err);
        setSyncStatus('error');
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [progressData, isAuthenticated, syncEnabled, syncInitialized]);

  const handleToggle = (subject, chapterId, taskType, completed) => {
    updateChapterProgress(userId, subject, chapterId, taskType, completed);
  };

  const toggleSubject = (subject) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subject]: !prev[subject],
    }));
  };

  const allExpanded = expandedSubjects.physics && expandedSubjects.chemistry && expandedSubjects.mathematics;
  const handleToggleExpandAll = () => {
    const next = !allExpanded;
    setExpandedSubjects({
      physics: next,
      chemistry: next,
      mathematics: next,
    });
  };

  const handleResetAll = async () => {
    resetAllProgress(userId);
    setShowResetConfirm(false);
  };

  const handleExport = () => {
    const jsonData = exportProgress(userId);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `jee-syllabus-progress-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const success = importProgress(userId, e.target.result);
        if (success) {
          alert('Progress imported successfully!');
        } else {
          alert('Failed to import progress. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Compute global status counts & task totals across the active subject filter
  const statusSummary = useMemo(() => {
    let all = 0;
    let notStarted = 0;
    let inProgress = 0;
    let completed = 0;
    let totalTheory = 0;
    let totalPyqs = 0;
    let totalRevision = 0;

    Object.entries(syllabusData).forEach(([subjectKey, subjectObj]) => {
      const subjProgress = progressData[subjectKey] || {};
      subjectObj.chapters.forEach((ch) => {
        const p = subjProgress[ch.id];
        if (p?.theory) totalTheory++;
        if (p?.pyqs) totalPyqs++;
        if (p?.revision) totalRevision++;

        all++;
        const st = getChapterStatus(p);
        if (st === 'completed') completed++;
        else if (st === 'in-progress') inProgress++;
        else notStarted++;
      });
    });

    return {
      all,
      'not-started': notStarted,
      'in-progress': inProgress,
      completed,
      totalTheory,
      totalPyqs,
      totalRevision,
    };
  }, [progressData]);

  // Filter chapters per subject
  const filteredSubjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return Object.entries(syllabusData)
      .map(([subjectKey, subjectObj]) => {
        const subjProgress = progressData[subjectKey] || {};
        const filteredChapters = subjectObj.chapters.filter((ch) => {
          const matchesQuery =
            !q ||
            ch.name.toLowerCase().includes(q) ||
            (ch.unit && ch.unit.toLowerCase().includes(q));
          if (!matchesQuery) return false;

          if (statusFilter === 'all') return true;
          const st = getChapterStatus(subjProgress[ch.id]);
          return st === statusFilter;
        });

        return {
          subjectKey,
          subjectData: subjectObj,
          filteredChapters,
          stats: calculateSubjectProgress(subjectKey, subjectObj.chapters, progressData),
        };
      })
      .filter((item) => item.filteredChapters.length > 0);
  }, [searchQuery, statusFilter, progressData]);

  const isFiltering = searchQuery.trim() !== '' || statusFilter !== 'all';

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="bg-slate-100 dark:bg-[#090d16] text-left [main:has(&)]:min-h-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <Breadcrumbs
          crumbs={[
            { label: 'JEE Syllabus Tracker', href: '/syllabus-tracker' },
          ]}
          className="mb-6"
        />

        {/* Top Header + Action Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
              JEE Syllabus Tracker
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Track your preparation progress across Physics, Chemistry, and Mathematics
            </p>
          </div>

          {/* Utility Toolbar: Cloud Sync + Share / Export / Import / Reset */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Cloud Sync Pill */}
            {!isAuthenticated ? (
              <Link
                href={`/login?returnUrl=${encodedReturnUrl}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-gray-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-2xs transition-colors"
                title="Log in to sync your progress across devices"
              >
                <Cloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Sign in to Cloud Sync</span>
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-gray-800 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {!syncEnabled ? (
                    <>
                      <CloudOff className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-500 dark:text-gray-400">Sync Off</span>
                    </>
                  ) : syncStatus === 'syncing' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                      <span className="text-blue-600 dark:text-blue-400">Syncing...</span>
                    </>
                  ) : syncStatus === 'error' ? (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                      <span className="text-red-600 dark:text-red-400">Sync Error</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Cloud Synced</span>
                    </>
                  )}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={syncEnabled}
                    onChange={handleToggleSync}
                    disabled={isInitializingSync}
                  />
                  <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                </label>
              </div>
            )}

            {/* Share Button */}
            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Progress</span>
            </button>

            {/* Export Button */}
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#111827] border border-solid border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-2xs transition-colors cursor-pointer"
              title="Export Progress JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Import Button */}
            <label
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#111827] border border-solid border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-2xs transition-colors cursor-pointer"
              title="Import Progress JSON"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>

            {/* Reset Button */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#111827] border border-solid border-slate-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-800/80 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold text-red-600 dark:text-red-400 shadow-2xs transition-colors cursor-pointer"
              title="Reset All Progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Overview Bento Card: Overall Progress + Task Breakdown */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-md shadow-slate-200/70 dark:shadow-none border border-slate-200 dark:border-gray-800 p-6 sm:p-8 mb-6">
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
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
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

            {/* Right: 3 Subject Progress Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {Object.entries(syllabusData).map(([subjectKey, subjectObj]) => {
                const st = calculateSubjectProgress(subjectKey, subjectObj.chapters, progressData);
                const accentBar =
                  subjectKey === 'physics'
                    ? 'bg-blue-600'
                    : subjectKey === 'chemistry'
                    ? 'bg-emerald-600'
                    : 'bg-purple-600';
                const accentText =
                  subjectKey === 'physics'
                    ? 'text-blue-600 dark:text-blue-400'
                    : subjectKey === 'chemistry'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-purple-600 dark:text-purple-400';

                return (
                  <div
                    key={subjectKey}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 text-left flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {subjectObj.name}
                        </span>
                        <span className={`text-sm font-extrabold ${accentText}`}>
                          {st.percentage}%
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-slate-200/80 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full ${accentBar} rounded-full transition-all duration-300`}
                          style={{ width: `${st.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        <strong className="text-gray-800 dark:text-gray-200">
                          {st.chaptersCompleted}/{st.totalChapters}
                        </strong>{' '}
                        chapters
                      </span>
                      <span>{st.completedTasks}/{st.totalTasks} tasks</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search & 4-Stage Status Filter Control Bar */}
        <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chapters or units (e.g. Thermodynamics, Optics, Organic)..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 4-Stage Status Filter Pills + Expand/Collapse All */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'all', label: 'All' },
                { key: 'not-started', label: 'Not Started' },
                { key: 'in-progress', label: 'In Progress' },
                { key: 'completed', label: 'Completed' },
              ].map((tab) => {
                const active = statusFilter === tab.key;
                const count = statusSummary[tab.key];
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-solid transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 dark:bg-[#0d1320] text-gray-600 dark:text-gray-300 border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[11px] ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/70 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              {!isFiltering && (
                <button
                  type="button"
                  onClick={handleToggleExpandAll}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 bg-slate-50 dark:bg-[#0d1320] border border-solid border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 transition-colors cursor-pointer ml-1"
                >
                  {allExpanded ? (
                    <>
                      <ChevronsDownUp className="w-3.5 h-3.5" />
                      <span>Collapse All</span>
                    </>
                  ) : (
                    <>
                      <ChevronsUpDown className="w-3.5 h-3.5" />
                      <span>Expand All</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State when filters/search match 0 chapters */}
        {filteredSubjects.length === 0 ? (
          <div className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-gray-800 p-12 text-center">
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              No chapters match your current filters
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Try searching for a different keyword or switching the status filter.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          /* Subject Sections */
          <div className="space-y-5">
            {filteredSubjects.map(({ subjectKey, subjectData, filteredChapters, stats }) => {
              const isExpanded = isFiltering ? true : expandedSubjects[subjectKey];
              const subjectProgressData = progressData[subjectKey] || {};

              return (
                <div
                  key={subjectKey}
                  className="bg-white dark:bg-[#111827] rounded-3xl shadow-md shadow-slate-200/70 dark:shadow-none border border-slate-200 dark:border-gray-800 overflow-hidden"
                >
                  <SubjectCard
                    subject={subjectKey}
                    subjectData={subjectData}
                    stats={stats}
                    expanded={isExpanded}
                    onToggle={() => toggleSubject(subjectKey)}
                    filteredCount={filteredChapters.length}
                  />

                  {isExpanded && (
                    <div className="p-4 sm:p-6 pt-0 sm:pt-2 border-t border-slate-200/80 dark:border-gray-800 bg-slate-50/50 dark:bg-[#0d1320]/50">
                      <ChapterList
                        subject={subjectKey}
                        chapters={filteredChapters}
                        progressData={subjectProgressData}
                        onToggle={handleToggle}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <SyncConflictModal
          isOpen={showConflictModal}
          onResolve={handleConflictResolve}
        />

        <ShareProgressModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          progressData={progressData}
          overallStats={overallStats}
          syllabusData={syllabusData}
        />

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-2.5">
                  <RotateCcw className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Confirm Reset
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Are you sure you want to reset all progress? This action cannot be undone and all your tracked data will be permanently deleted.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SyllabusTrackerComponent;

