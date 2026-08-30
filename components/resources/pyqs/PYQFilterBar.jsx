"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, RotateCcw, Filter, BookOpen, FileText } from "lucide-react";
import { syllabusData } from "@/data/syllabus-data";
import CustomSelect from "@/components/ui/CustomSelect";

const EXAM_TYPES = [
  { label: "All Exams", value: "ALL" },
  { label: "JEE Main", value: "JEE_MAIN" },
  { label: "JEE Advanced", value: "JEE_ADVANCED" },
];

const DIFFICULTIES = [
  { label: "All Difficulties", value: "ALL" },
  { label: "Easy", value: "Easy" },
  { label: "Medium", value: "Medium" },
  { label: "Hard", value: "Hard" },
];

const QUESTION_TYPES = [
  { label: "All Formats", value: "ALL" },
  { label: "Single Correct (MCQ)", value: "MCQ" },
  { label: "Numerical Value", value: "NUMERIC" },
  { label: "Multi-Correct", value: "MULTI_CORRECT" },
  { label: "Comprehension / Passage", value: "COMPREHENSION" },
];

export default function PYQFilterBar({
  activeTab,
  setActiveTab,
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  loading,
  availableYears = ["All", "2026", "2025", "2024"],
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

  // Sync external search changes
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  // Extract chapters based on current subject
  const chapterOptions = useMemo(() => {
    let list = [];
    if (!filters.subject || filters.subject === "ALL") {
      const allChaps = [
        ...(syllabusData.physics?.chapters || []),
        ...(syllabusData.chemistry?.chapters || []),
        ...(syllabusData.mathematics?.chapters || []),
      ];
      list = Array.from(new Set(allChaps.map((c) => c.name))).sort();
    } else {
      const subKey = filters.subject.toLowerCase();
      const chaps = syllabusData[subKey]?.chapters || [];
      list = chaps.map((c) => c.name);
    }

    return [
      { label: `All Chapters (${filters.subject === "ALL" ? "All Subjects" : filters.subject})`, value: "ALL" },
      ...list.map((c) => ({ label: c, value: c })),
    ];
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
      {/* Top Mode Switcher & Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800/90 rounded-xl w-full sm:w-auto">
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

        {/* Counter */}
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
          {loading ? (
            <span className="inline-block w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
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
          {/* Subject Pills (Segmented control container with inner padding to prevent boundary clipping) */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/70 rounded-2xl overflow-x-auto scrollbar-hide max-w-fit">
            {[
              { label: "All Subjects", value: "ALL", activeBg: "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm" },
              { label: "Physics", value: "Physics", activeBg: "bg-blue-600 text-white shadow-sm" },
              { label: "Chemistry", value: "Chemistry", activeBg: "bg-emerald-600 text-white shadow-sm" },
              { label: "Mathematics", value: "Mathematics", activeBg: "bg-purple-600 text-white shadow-sm" },
            ].map((sub) => {
              const isSelected = filters.subject === sub.value;
              return (
                <button
                  key={sub.value}
                  type="button"
                  onClick={() => onFilterChange("subject", sub.value)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? sub.activeBg
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700/50"
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>

          {/* Search Box and Custom Chapter Dropdown */}
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

            {/* Custom Chapter Select with search filter inside */}
            <div className="md:col-span-6">
              <CustomSelect
                value={filters.chapter}
                onChange={(val) => onFilterChange("chapter", val)}
                options={chapterOptions}
                placeholder="Select Chapter"
                searchable={true}
                searchPlaceholder="Filter chapters..."
              />
            </div>
          </div>

          {/* Dynamic Year Pills & Filter Actions */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs">
            <span className="font-semibold text-gray-500 dark:text-gray-400 shrink-0 mr-1">Year:</span>
            {availableYears.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => onFilterChange("year", y)}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
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

          {/* Collapsible Advanced Filters with CustomSelects */}
          {isAdvancedOpen && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
              {/* Exam Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Exam Type
                </label>
                <CustomSelect
                  value={filters.examType}
                  onChange={(val) => onFilterChange("examType", val)}
                  options={EXAM_TYPES}
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Difficulty Level
                </label>
                <CustomSelect
                  value={filters.difficulty}
                  onChange={(val) => onFilterChange("difficulty", val)}
                  options={DIFFICULTIES}
                />
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Question Format
                </label>
                <CustomSelect
                  value={filters.questionType}
                  onChange={(val) => onFilterChange("questionType", val)}
                  options={QUESTION_TYPES}
                />
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

          {/* Dynamic Year pills for Papers */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {availableYears.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => onFilterChange("year", y)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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