'use client';

import React, { useState, useMemo, useSyncExternalStore, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { RotateCcw } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { SYLLABUS_DATA } from '@/data/syllabus-data';
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
import SyllabusNoticeModal from './SyllabusNoticeModal';
import SyllabusToolbar from './components/SyllabusToolbar';
import SyllabusOverviewCard from './components/SyllabusOverviewCard';
import SyllabusFilterBar from './components/SyllabusFilterBar';

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
    () => calculateOverallProgress(SYLLABUS_DATA, progressData),
    [progressData]
  );

  const [expandedSubjects, setExpandedSubjects] = useState({
    physics: false,
    chemistry: false,
    mathematics: false,
  });

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'not-started' | 'in-progress' | 'completed'

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [noticeModal, setNoticeModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  // Sync state
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'synced', 'error'
  const [isInitializingSync, setIsInitializingSync] = useState(false);
  const isInitializingSyncRef = useRef(false);
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
          setNoticeModal({
            isOpen: true,
            type: 'success',
            title: 'Progress Imported Successfully',
            message: 'Your JEE syllabus progress and chapter tasks have been successfully loaded and updated.',
          });
        } else {
          setNoticeModal({
            isOpen: true,
            type: 'error',
            title: 'Import Failed',
            message: 'Failed to import progress. Please verify the file format and ensure it is a valid JEE syllabus progress backup JSON.',
          });
        }
      };
      reader.readAsText(file);
      event.target.value = '';
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

    Object.entries(SYLLABUS_DATA).forEach(([subjectKey, subjectObj]) => {
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

    return Object.entries(SYLLABUS_DATA)
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

  const visibleSubjectKeys = useMemo(
    () => filteredSubjects.map((s) => s.subjectKey),
    [filteredSubjects]
  );

  const allExpanded =
    visibleSubjectKeys.length > 0 &&
    visibleSubjectKeys.every((key) => expandedSubjects[key]);

  const handleToggleExpandAll = () => {
    const next = !allExpanded;
    setExpandedSubjects((prev) => {
      const updated = { ...prev };
      visibleSubjectKeys.forEach((key) => {
        updated[key] = next;
      });
      return updated;
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  return (
    <div className="text-left [main:has(&)]:min-h-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <Breadcrumbs
          crumbs={[
            { label: 'JEE Syllabus Tracker', href: '/syllabus-tracker' },
          ]}
          className="mb-6"
        />

        {/* Top Header + Action Toolbar */}
        <SyllabusToolbar
          isAuthenticated={isAuthenticated}
          encodedReturnUrl={encodedReturnUrl}
          syncEnabled={syncEnabled}
          syncStatus={syncStatus}
          isInitializingSync={isInitializingSync}
          onToggleSync={handleToggleSync}
          onOpenShareModal={() => setShowShareModal(true)}
          onExport={handleExport}
          onImport={handleImport}
          onOpenResetConfirm={() => setShowResetConfirm(true)}
        />

        {/* Overview Bento Card: Overall Progress + Task Breakdown */}
        <SyllabusOverviewCard
          overallStats={overallStats}
          statusSummary={statusSummary}
          progressData={progressData}
        />

        {/* Search & 4-Stage Status Filter Control Bar */}
        <SyllabusFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusSummary={statusSummary}
          allExpanded={allExpanded}
          onToggleExpandAll={handleToggleExpandAll}
        />

        {/* Empty State when filters/search match 0 chapters */}
        {filteredSubjects.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-12 text-center">
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
              const isExpanded = !!expandedSubjects[subjectKey];
              const subjectProgressData = progressData[subjectKey] || {};

              return (
                <div
                  key={subjectKey}
                  className="bg-white dark:bg-gray-900 rounded-3xl shadow-md shadow-slate-200/70 dark:shadow-none border border-slate-200 dark:border-gray-800 overflow-hidden"
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
                    <div className="p-4 sm:p-6 pt-4 sm:pt-5 border-t border-slate-200/80 dark:border-gray-800 bg-slate-50/50 dark:bg-[#0d1320]/50">
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
          syllabusData={SYLLABUS_DATA}
        />

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-gray-800">
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

        {/* Syllabus Tracker In-App Notice Modal (Replaces browser alerts) */}
        <SyllabusNoticeModal
          isOpen={noticeModal.isOpen}
          type={noticeModal.type}
          title={noticeModal.title}
          message={noticeModal.message}
          onClose={() => setNoticeModal((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    </div>
  );
};

export default SyllabusTrackerComponent;
