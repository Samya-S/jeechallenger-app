"use client";
import { useState, useMemo } from "react";
import KaTeXRenderer from "./KaTeXRenderer";

/**
 * FormulaSheets (Floating Cards Redesign)
 * A premium accordion layout where each chapter is an independent floating card.
 */
const FormulaSheets = ({ formulaData, colorTheme = "blue" }) => {
  const [openChapter, setOpenChapter] = useState(0);
  const [search, setSearch] = useState("");

  // Theme tokens
  const theme = useMemo(() => {
    switch (colorTheme) {
      case "green":
        return {
          accent: "from-green-500 to-teal-500",
          badge: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
          activeCard: "ring-2 ring-green-500 shadow-lg shadow-green-500/10 dark:shadow-green-500/20 border-transparent",
          activeText: "text-green-600 dark:text-green-400",
          searchFocus: "focus:ring-green-500 focus:border-green-500",
          pillBg: "bg-green-600",
          iconBg: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
        };
      case "purple":
        return {
          accent: "from-purple-500 to-pink-500",
          badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
          activeCard: "ring-2 ring-purple-500 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/20 border-transparent",
          activeText: "text-purple-600 dark:text-purple-400",
          searchFocus: "focus:ring-purple-500 focus:border-purple-500",
          pillBg: "bg-purple-600",
          iconBg: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
        };
      default: // blue
        return {
          accent: "from-blue-500 to-indigo-500",
          badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
          activeCard: "ring-2 ring-blue-500 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/20 border-transparent",
          activeText: "text-blue-600 dark:text-blue-400",
          searchFocus: "focus:ring-blue-500 focus:border-blue-500",
          pillBg: "bg-blue-600",
          iconBg: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
        };
    }
  }, [colorTheme]);

  // Filter logic
  const filteredData = useMemo(() => {
    if (!search.trim()) return formulaData;
    const q = search.toLowerCase();
    return formulaData
      .map((ch) => ({
        ...ch,
        formulas: ch.formulas.filter(
          (f) =>
            f.name.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q) ||
            f.latex.toLowerCase().includes(q)
        ),
      }))
      .filter((ch) => ch.formulas.length > 0 || ch.chapter.toLowerCase().includes(q));
  }, [formulaData, search]);

  const totalFormulas = formulaData.reduce((acc, ch) => acc + ch.formulas.length, 0);

  return (
    <section className="py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Formula Reference
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-2">
            Access essential equations and laws in a clean, interactive format.
          </p>
          <div className={`w-24 h-1 bg-gradient-to-r ${theme.accent} mx-auto rounded-full mt-6`} />

          <div className="inline-flex items-center gap-2 mt-6 px-5 py-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300">
            <span className={`w-2 h-2 rounded-full ${theme.pillBg} animate-pulse`} />
            {formulaData.length} Chapters &bull; {totalFormulas} Formulas
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenChapter(0); }}
            placeholder="Search formulas, laws, or chapters…"
            className={`w-full pl-11 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${theme.searchFocus} transition-colors shadow-sm`}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium text-gray-900 dark:text-white">No matches found</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Try searching for a different term or keyword.</p>
          </div>
        )}

        {/* Floating Cards Accordion */}
        <div className="space-y-4">
          {filteredData.map((chapterData, chIdx) => {
            const isOpen = openChapter === chIdx;

            return (
              <div
                key={chapterData.chapter}
                className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-300 ease-in-out ${isOpen
                  ? theme.activeCard
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                  }`}
              >
                {/* Chapter Header Button */}
                <button
                  onClick={() => setOpenChapter(isOpen ? -1 : chIdx)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left rounded-2xl focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon/Badge */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${theme.iconBg}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>

                    <div>
                      <h3 className={`font-semibold text-lg transition-colors ${isOpen ? theme.activeText : "text-gray-900 dark:text-white"}`}>
                        {chapterData.chapter}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {chapterData.formulas.length} Formulas
                      </p>
                    </div>
                  </div>

                  {/* Caret */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180 bg-gray-50 dark:bg-gray-700/50" : ""}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-2">
                      <div className="w-full h-px bg-gray-100 dark:bg-gray-700/50 mb-6" />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {chapterData.formulas.map((formula, fIdx) => (
                          <div
                            key={fIdx}
                            className="group relative bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700/50 p-5 flex flex-col gap-3 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm transition-all"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                {formula.name}
                              </h4>
                            </div>

                            <div className="overflow-x-auto py-2 min-h-[60px] custom-scrollbar">
                              <div className="w-max mx-auto">
                                <KaTeXRenderer
                                  latex={formula.latex}
                                  displayMode={true}
                                  className="text-gray-900 dark:text-white scale-[1.05]"
                                />
                              </div>
                            </div>

                            {formula.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed mt-2">
                                {formula.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FormulaSheets;
