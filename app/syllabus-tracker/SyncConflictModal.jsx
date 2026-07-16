'use client';

import React from 'react';
import { AlertTriangle, Cloud, HardDrive, Merge } from 'lucide-react';

export default function SyncConflictModal({ isOpen, onResolve }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-700">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-100 dark:bg-amber-900/30 rounded-full p-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Sync Conflict Detected
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We found different progress saved on this browser and in your cloud account. How would you like to resolve this?
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {/* Option 1: Merge Both */}
          <button
            onClick={() => onResolve('merge')}
            className="w-full text-left p-4 rounded-xl border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-2 mt-0.5 group-hover:scale-110 transition-transform">
                <Merge className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                  Merge Both
                  <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Recommended</span>
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Combines progress from both sources. No data will be lost.
                </p>
              </div>
            </div>
          </button>

          {/* Option 2: Keep Local */}
          <button
            onClick={() => onResolve('local')}
            className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mt-0.5 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                <HardDrive className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                  Keep Browser Progress
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Overwrites your cloud account with the data from this browser.
                </p>
              </div>
            </div>
          </button>

          {/* Option 3: Keep Cloud */}
          <button
            onClick={() => onResolve('cloud')}
            className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2 mt-0.5 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/50 transition-colors">
                <Cloud className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-pink-600 dark:group-hover:text-pink-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                  Keep Cloud Progress
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Overwrites this browser&apos;s progress with data from your cloud account.
                </p>
              </div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
