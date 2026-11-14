'use client';

import React from 'react';
import { Search, X, ChevronsDownUp, ChevronsUpDown } from 'lucide-react';

export default function SyllabusFilterBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  statusFilter,
  onStatusFilterChange,
  statusSummary,
  allExpanded,
  onToggleExpandAll,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-800 p-4 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chapters or units (e.g. Thermodynamics, Optics, Organic)..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-sm text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
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
                onClick={() => onStatusFilterChange(tab.key)}
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

          <button
            type="button"
            onClick={onToggleExpandAll}
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
        </div>
      </div>
    </div>
  );
}
