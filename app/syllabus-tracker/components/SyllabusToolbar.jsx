'use client';

import React from 'react';
import Link from 'next/link';
import {
  Cloud,
  CloudOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Share2,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';

export default function SyllabusToolbar({
  isAuthenticated,
  encodedReturnUrl,
  syncEnabled,
  syncStatus,
  isInitializingSync,
  onToggleSync,
  onOpenShareModal,
  onExport,
  onImport,
  onOpenResetConfirm,
}) {
  return (
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
            href={`/login?callbackUrl=${encodedReturnUrl}`}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 hover:border-blue-500/60 dark:hover:border-blue-500/60 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-2xs transition-colors"
            title="Log in to sync your progress across devices"
          >
            <Cloud className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Sign in to Cloud Sync</span>
          </Link>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={syncEnabled}
            onClick={onToggleSync}
            disabled={isInitializingSync}
            title={syncEnabled ? "Click to turn off cloud sync" : "Click to turn on cloud sync"}
            className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 shadow-2xs transition-all cursor-pointer select-none ${
              isInitializingSync ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
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

            {/* Toggle track and knob */}
            <div
              aria-hidden="true"
              className={`w-8 h-[18px] rounded-full transition-colors relative shrink-0 ${
                syncEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-[2px] left-[2px] bg-white rounded-full h-3.5 w-3.5 shadow-xs transition-transform duration-200 ease-in-out ${
                  syncEnabled ? 'translate-x-[14px]' : 'translate-x-0'
                }`}
              />
            </div>
          </button>
        )}

        {/* Share Button */}
        <button
          type="button"
          onClick={onOpenShareModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Progress</span>
        </button>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-solid border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-2xs transition-colors cursor-pointer"
          title="Export Progress JSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* Import Button */}
        <label
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-solid border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-2xs transition-colors cursor-pointer"
          title="Import Progress JSON"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Import</span>
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="hidden"
          />
        </label>

        {/* Reset Button */}
        <button
          type="button"
          onClick={onOpenResetConfirm}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-solid border-slate-200 dark:border-gray-800 hover:border-red-300 dark:hover:border-red-800/80 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold text-red-600 dark:text-red-400 shadow-2xs transition-colors cursor-pointer"
          title="Reset All Progress"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
