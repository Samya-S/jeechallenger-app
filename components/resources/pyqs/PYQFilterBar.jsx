"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Filter, BookOpen, FileText, ChevronDown } from "lucide-react";
import { syllabusData } from "@/data/syllabus-data";

const YEARS = ["All", "2026", "2025", "2024", "2023", "2022"];
const EXAM_TYPES = [
  { label: "All Exams", value: "ALL" },
  { label: "JEE Main", value: "JEE_MAIN" },
  { label: "JEE Advanced", value: "JEE_ADVANCED" },
];
const DIFFICULTIES = [
  { label: "All Difficulties", value: "ALL" },
  { label: "Easy", value: "Easy", color: "text-emerald-500" },
  { label: "Medium", value: "Medium", color: "text-amber-500" },
  { label: "Hard", value: "Hard", color: "text-rose-500" },
];
const QUESTION_TYPES = [
  { label: "All Types", value: "ALL" },
  { label: "Single Correct (MCQ)", value: "MCQ" },
  { label: "Numerical", value: "NUMERIC" },
  { label: "Multi-Correct", value: "MULTI_CORRECT" },
  { label: "Comprehension", value: "COMPREHENSION" },
];

export default function PYQFilterBar({
  activeTab,
  setActiveTab,
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  loading,
}) {
  const [searchInput, setSearchInput] = useState(filters.search || "");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange("search", searchInput);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Sync external search filter changes (e.g. on reset)
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  // Extract chapters based on current subject
  const currentChapters = React.useMemo(() => {
    if (!filters.subject || filters.subject === "ALL") {
      const allChaps = [
        ...(syllabusData.physics?.chapters || []),
        ...(syllabusData.chemistry?.chapters || []),
        ...(syllabusData.mathematics?.chapters || []),
      ];
      return Array.from(new Set(allChaps.map((c) => c.name))).sort();
    }
    const subKey = filters.subject.toLowerCase();
    const chaps = syllabusData[subKey]?.chapters || [];
    return chaps.map((c) => c.name);
  }, [filters.subject]);

  const hasActiveFilters =
    filters.subject !== "ALL" ||
    filters.chapter !== "ALL" ||
    filters.examType !== "ALL" ||
    filters.year !== "All" ||
    filters.difficulty !== "ALL" ||
    filters.questionType !== "ALL" ||
    filters.search !== "";

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-4 md:p-6 mb-8 transition-all">
      {/* Top Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("practice")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === "practice"
                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Chapter-Wise Practice
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("papers")}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              activeTab === "papers"
                ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            Full Shift Papers
          </button>
        </div>

        {/* Counter badge */}
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
          {loading ? (
            <span className="inline-block w-20 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ) : (
            <span>
              Found <strong className="text-gray-900 dark:text-white font-bold">{totalCount}</strong>{" "}
              {activeTab === "practice" ? "Questions" : "Papers"}
            </span>
          )}
        </div>
      </div>

      {activeTab === "practice" && (
        <div className="pt-5 space-y-4">
          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { label: "All Subjects", value: "ALL", color: "bg-gray-600" },
              { label: "Physics", value: "Physics", color: "bg-blue-600" },
              { label: "Chemistry", value: "Chemistry", color: "bg-emerald-600" },
              { label: "Mathematics", value: "Mathematics", color: "bg-purple-600" },
            ].map((sub) => {
              const isSelected = filters.subject === sub.value;
              return (
                <button
                  key={sub.value}
                  type="button"
                  onClick={() => {
                    onFilterChange("subject", sub.value);
                    onFilterChange("chapter", "ALL"); // reset chapter on subject change
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? `${sub.color} text-white shadow-md ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-${sub.color.replace('bg-', '')}`
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>

          {/* Search and Chapter Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Box */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search topics, questions, or formulas..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Chapter Dropdown */}
            <div className="md:col-span-6 relative">
              <select
                value={filters.chapter}
                onChange={(e) => onFilterChange("chapter", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer appearance-none pr-10"
              >
                <option value="ALL">All Chapters ({filters.subject === 'ALL' ? 'Select Subject for List' : filters.subject})</option>
                {currentChapters.map((chap) => (
                  <option key={chap} value={chap}>
                    {chap}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Quick Year Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs">
            <span className="font-semibold text-gray-500 dark:text-gray-400 shrink-0 mr-1">Year:</span>
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => onFilterChange("year", y)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  filters.year === y
                    ? "bg-orange-600 text-white shadow-sm"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {y}
              </button>
            ))}

            {/* Advanced Filters Toggle */}
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-all cursor-pointer shrink-0"
            >
              <Filter className="w-3.5 h-3.5" />
              {isAdvancedOpen ? "Hide Filters" : "More Filters"}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* Collapsible Advanced Filters Strip */}
          {isAdvancedOpen && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
              {/* Exam Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Exam Type
                </label>
                <select
                  value={filters.examType}
                  onChange={(e) => onFilterChange("examType", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  {EXAM_TYPES.map((et) => (
                    <option key={et.value} value={et.value}>
                      {et.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => onFilterChange("difficulty", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Question Format
                </label>
                <select
                  value={filters.questionType}
                  onChange={(e) => onFilterChange("questionType", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  {QUESTION_TYPES.map((qt) => (
                    <option key={qt.value} value={qt.value}>
                      {qt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "papers" && (
        <div className="pt-5 flex flex-wrap items-center gap-3">
          {/* Exam Type for Papers */}
          <div className="flex items-center gap-1.5">
            {EXAM_TYPES.map((et) => (
              <button
                key={et.value}
                type="button"
                onClick={() => onFilterChange("examType", et.value)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filters.examType === et.value
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {et.label}
              </button>
            ))}
          </div>

          {/* Year pills for Papers */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {YEARS.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => onFilterChange("year", y)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filters.year === y
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}