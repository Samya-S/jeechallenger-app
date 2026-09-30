"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Atom,
  FlaskConical,
  Calculator,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import KaTeXRenderer from "./KaTeXRenderer";

/**
 * FormulaSheets — Modern Bento Grid Cheat-Sheet Design
 * 
 * Clean, fast, distraction-free formula reference for JEE Main & Advanced (Class 11 & 12):
 * - Horizontal smooth-scrolling chapter tab bar with quick left/right arrow controls
 * - Quick chapter jump dropdown selector
 * - Bento-grid formula cards giving equations generous breathing room
 * - Dedicated mathematical display with horizontal scroll protection
 * - Variable and condition callout notes
 * - Instant global search with live match count and chapter tags
 * - Direct "Practice Chapter PYQs" integration
 * - Smooth next/previous chapter revision buttons with theme colors
 */
const FormulaSheets = ({ formulaData = [], colorTheme = "blue" }) => {
  // Theme settings
  const theme = useMemo(() => {
    switch (colorTheme) {
      case "green":
        return {
          subject: "Chemistry",
          icon: FlaskConical,
          gradient: "from-emerald-500 via-teal-500 to-cyan-500",
          activeTab: "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30",
          cardHover: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
          accentBadge: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
          accentText: "text-emerald-600 dark:text-emerald-400",
          primaryBtn: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25",
          ringFocus: "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
          dotColor: "bg-emerald-500",
        };
      case "purple":
        return {
          subject: "Mathematics",
          icon: Calculator,
          gradient: "from-purple-500 via-violet-500 to-pink-500",
          activeTab: "bg-purple-600 text-white shadow-lg shadow-purple-600/30",
          cardHover: "hover:border-purple-500/40 hover:shadow-purple-500/5",
          accentBadge: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60",
          accentText: "text-purple-600 dark:text-purple-400",
          primaryBtn: "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/25",
          ringFocus: "focus:ring-2 focus:ring-purple-500 focus:border-purple-500",
          dotColor: "bg-purple-500",
        };
      default: // blue
        return {
          subject: "Physics",
          icon: Atom,
          gradient: "from-blue-500 via-indigo-500 to-cyan-500",
          activeTab: "bg-blue-600 text-white shadow-lg shadow-blue-600/30",
          cardHover: "hover:border-blue-500/40 hover:shadow-blue-500/5",
          accentBadge: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60",
          accentText: "text-blue-600 dark:text-blue-400",
          primaryBtn: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25",
          ringFocus: "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          dotColor: "bg-blue-500",
        };
    }
  }, [colorTheme]);

  const SubjectIcon = theme.icon;

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const tabsScrollRef = useRef(null);
  const boardTopRef = useRef(null);

  // Total formulas count
  const totalFormulas = useMemo(
    () => formulaData.reduce((acc, ch) => acc + ch.formulas.length, 0),
    [formulaData]
  );

  // Global search filtering
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results = [];
    formulaData.forEach((ch, chIdx) => {
      ch.formulas.forEach((f, fIdx) => {
        const matchesName = f.name.toLowerCase().includes(q);
        const matchesDesc = f.description && f.description.toLowerCase().includes(q);
        const matchesLatex = f.latex && f.latex.toLowerCase().includes(q);
        const matchesChapter = ch.chapter.toLowerCase().includes(q);

        if (matchesName || matchesDesc || matchesLatex || matchesChapter) {
          results.push({
            chapter: ch.chapter,
            chapterIndex: chIdx,
            formula: f,
            formulaIndex: fIdx,
          });
        }
      });
    });
    return results;
  }, [formulaData, searchQuery]);

  // Current active chapter
  const currentChapter = formulaData[activeChapterIndex] || formulaData[0];

  // Scroll active tab into view when active chapter changes
  useEffect(() => {
    if (tabsScrollRef.current) {
      const activeEl = tabsScrollRef.current.querySelector(
        `[data-tab-index="${activeChapterIndex}"]`
      );
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeChapterIndex]);

  // Scroll tabs horizontally
  const handleScrollTabs = (direction) => {
    if (tabsScrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      tabsScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Change chapter handler
  const handleSelectChapter = (index) => {
    setActiveChapterIndex(index);
    if (searchQuery) setSearchQuery("");
    if (boardTopRef.current) {
      boardTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Previous & Next Chapter navigation
  const handlePrev = () => {
    if (activeChapterIndex > 0) {
      handleSelectChapter(activeChapterIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeChapterIndex < formulaData.length - 1) {
      handleSelectChapter(activeChapterIndex + 1);
    }
  };

  // PYQ link
  const pyqUrl = currentChapter
    ? `/previous-year-questions?subject=${encodeURIComponent(
      theme.subject
    )}&chapter=${encodeURIComponent(currentChapter.chapter)}`
    : "#";

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ========================================================================= */}
        {/* Modern Section Header                                                     */}
        {/* ========================================================================= */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-xs bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800">
            <span className={`w-2 h-2 rounded-full ${theme.dotColor} animate-pulse`} />
            <span className="text-gray-800 dark:text-gray-200">
              {theme.subject} Formula Handbook
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Essential Formula Sheets
          </h2>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            High-yield formulas, laws, and equations organized chapter-wise for rapid revision and problem solving.
          </p>

          {/* Accent Line */}
          <div className={`w-20 h-1.5 bg-gradient-to-r ${theme.gradient} mx-auto rounded-full mt-5 shadow-sm`} />
        </div>

        {/* ========================================================================= */}
        {/* Quick Search & Chapter Selector Bar                                      */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${theme.subject} formulas or laws (e.g. projectile, bernoulli, current)...`}
                className={`w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950/60 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base outline-none transition-all ${theme.ringFocus}`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded-full p-0.5" />
                </button>
              )}
            </div>

            {/* Subject Stats Pill (hidden on mobile to prevent wrapping) */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300">
                <GraduationCap className={`w-4 h-4 ${theme.accentText}`} />
                <span>{formulaData.length} Chapters • {totalFormulas} Formulas</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* Chapter Tabs Horizontal Carousel                                         */}
          {/* ========================================================================= */}
          {!searchQuery.trim() && (
            <div className="relative mt-4 pt-4 border-t border-slate-100 dark:border-gray-800/80 flex items-center gap-2">

              {/* Scroll Left Button */}
              <button
                type="button"
                onClick={() => handleScrollTabs("left")}
                aria-label="Scroll chapters left"
                className="hidden sm:flex w-8 h-8 rounded-xl items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shrink-0 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Horizontal Scrollable Tabs */}
              <div
                ref={tabsScrollRef}
                className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide w-full scroll-smooth"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {formulaData.map((ch, idx) => {
                  const isActive = activeChapterIndex === idx;
                  return (
                    <button
                      key={ch.chapter}
                      type="button"
                      data-tab-index={idx}
                      onClick={() => handleSelectChapter(idx)}
                      className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 shrink-0 cursor-pointer ${isActive
                          ? theme.activeTab
                          : "bg-slate-100 hover:bg-slate-200 dark:bg-gray-800/80 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                        }`}
                    >
                      <span className={`text-[11px] font-mono opacity-80 ${isActive ? "text-white" : "text-gray-400"}`}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span>{ch.chapter}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive
                            ? "bg-white/25 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                      >
                        {ch.formulas.length}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Scroll Right Button */}
              <button
                type="button"
                onClick={() => handleScrollTabs("right")}
                aria-label="Scroll chapters right"
                className="hidden sm:flex w-8 h-8 rounded-xl items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 shrink-0 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Anchor for smooth scroll */}
        <div ref={boardTopRef} />

        {/* ========================================================================= */}
        {/* VIEW A: GLOBAL SEARCH RESULTS                                             */}
        {/* ========================================================================= */}
        {searchQuery.trim() ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Search results for</span>
                <span className={theme.accentText}>&ldquo;{searchQuery}&rdquo;</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {searchResults.length} {searchResults.length === 1 ? "formula" : "formulas"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                Clear search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-slate-300 dark:border-gray-800 shadow-sm max-w-md mx-auto">
                <Search className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">No matching formulas</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Try checking spelling or search for broader concepts like laws or units.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${theme.primaryBtn}`}
                >
                  Reset search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {searchResults.map(({ chapter, formula, formulaIndex }) => (
                  <BentoFormulaCard
                    key={`${chapter}-${formulaIndex}`}
                    chapter={chapter}
                    formula={formula}
                    index={formulaIndex}
                    theme={theme}
                    showChapterBadge={true}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW B: ACTIVE CHAPTER BENTO DECK                                         */
          /* ========================================================================= */
          currentChapter && (
            <div className="space-y-6">

              {/* Active Chapter Header Banner */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-gray-800 shadow-sm ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg ${theme.accentBadge}`}>
                        Chapter {String(activeChapterIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {currentChapter.formulas.length} High-Yield Equations
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                      {currentChapter.chapter}
                    </h3>
                  </div>

                  {/* Practice PYQs Button */}
                  <Link
                    href={pyqUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-orange-700 dark:text-orange-300 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/50 dark:hover:bg-orange-900/60 border border-orange-200 dark:border-orange-800/60 transition-all shadow-xs shrink-0 self-start sm:self-auto"
                    title={`Practice previous year questions on ${currentChapter.chapter}`}
                  >
                    <span>Practice PYQs</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Bento Grid: 2-Column High-Comfort Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentChapter.formulas.map((formula, fIdx) => (
                  <BentoFormulaCard
                    key={`${currentChapter.chapter}-${fIdx}`}
                    chapter={currentChapter.chapter}
                    formula={formula}
                    index={fIdx}
                    theme={theme}
                    showChapterBadge={false}
                  />
                ))}
              </div>

              {/* Flow Navigation Footer */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 flex items-center justify-between gap-4 shadow-sm">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={activeChapterIndex === 0}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border border-slate-200/80 dark:border-gray-800 ${activeChapterIndex === 0
                      ? "opacity-40 cursor-not-allowed bg-slate-100 dark:bg-gray-800/40 text-gray-400"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 cursor-pointer shadow-xs"
                    }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous Chapter</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <div className="text-center">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {activeChapterIndex + 1} of {formulaData.length} Chapters
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={activeChapterIndex === formulaData.length - 1}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${activeChapterIndex === formulaData.length - 1
                      ? "opacity-40 cursor-not-allowed bg-slate-100 dark:bg-gray-800/40 text-gray-400 border border-slate-200/80 dark:border-gray-800"
                      : `${theme.primaryBtn} cursor-pointer`
                    }`}
                >
                  <span className="hidden sm:inline">Next Chapter</span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )
        )}

      </div>
    </section>
  );
};

/**
 * BentoFormulaCard
 * Modern, clean formula card designed for maximum mathematical readability
 */
const BentoFormulaCard = ({
  chapter,
  formula,
  index,
  theme,
  showChapterBadge = false,
}) => {
  return (
    <div
      className={`group relative bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-gray-800 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.04] flex flex-col justify-between transition-all duration-200 hover:shadow-md text-left ${theme.cardHover}`}
    >
      <div className="text-left">
        {/* Card Header: Badge + Title inline, strictly left-aligned */}
        <div className="flex items-start gap-2.5 mb-3 text-left">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 mt-0.5 ${theme.accentBadge}`}
          >
            #{String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1 text-left">
            <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug text-left">
              {formula.name}
            </h4>
            {showChapterBadge && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 truncate max-w-[200px] text-left">
                {chapter}
              </span>
            )}
          </div>
        </div>

        {/* Pure Mathematical Canvas (KaTeX) */}
        <div className="my-2 px-3 py-4 sm:py-5 rounded-2xl bg-slate-50/90 dark:bg-gray-950/70 border border-slate-100 dark:border-gray-800/80 flex items-center justify-center min-h-[86px]">
          <div className="w-full overflow-x-auto overflow-y-hidden text-center custom-scrollbar py-1">
            <KaTeXRenderer
              latex={formula.latex}
              displayMode={true}
              className="text-gray-900 dark:text-white font-medium text-base sm:text-lg inline-block [&_.katex-display]:my-0 [&_.katex-display]:py-0.5"
            />
          </div>
        </div>
      </div>

      {/* Description / Variables Breakdown */}
      {formula.description && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-gray-800/80 text-xs text-gray-600 dark:text-gray-400 text-left leading-relaxed">
          {formula.description}
        </div>
      )}
    </div>
  );
};

export default FormulaSheets;
