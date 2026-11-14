"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, BookOpen, FileText, Sparkles, Check, ArrowUpRight } from "lucide-react";
import MarkdownMathRenderer from "@/components/common/MarkdownMathRenderer";

export default function PYQDemoWidget() {
  const [pyqActiveTab, setPyqActiveTab] = useState("practice");
  const [pyqSelectedOption, setPyqSelectedOption] = useState(null);
  const [pyqChecked, setPyqChecked] = useState(false);

  // Dynamic years fetched from backend endpoint
  const [availableYears, setAvailableYears] = useState(["2026", "2025", "2024"]);
  const [yearsLoading, setYearsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pyqs/papers/years")
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || [];
        if (list.length > 0) {
          const sorted = list.map(String).sort((a, b) => Number(b) - Number(a));
          setAvailableYears(sorted);
        }
        setYearsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching available years:", err);
        setYearsLoading(false);
      });
  }, []);

  // Compute year range text for PYQ display
  const minYear = availableYears.length > 0 ? availableYears[availableYears.length - 1] : "2024";
  const maxYear = availableYears.length > 0 ? availableYears[0] : "2026";
  const yearRangeDisplay = minYear === maxYear ? minYear : `${minYear}–${maxYear}`;

  return (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left / PYQ Bank Preview matching PreviousYearQuestionsComponent.jsx */}
              <div className="order-2 lg:order-1 lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-5 sm:p-7 space-y-5">

                {/* 1. Top Mode Selector & Contextual Indicators */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200/80 dark:border-gray-800">
                  {/* Left: Mode Switcher */}
                  <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-800/90 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPyqActiveTab("practice")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${pyqActiveTab === "practice"
                          ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Chapter-Wise</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPyqActiveTab("papers")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${pyqActiveTab === "papers"
                          ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-sm"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Shift Papers</span>
                    </button>
                  </div>

                  {/* Right: Subject Selection (Practice mode) or Session Indicator (Papers mode) */}
                  {pyqActiveTab === "practice" ? (
                    <div className="flex items-center gap-1.5 select-none">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-xs cursor-default">
                        Physics
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-default">
                        Chemistry
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-default">
                        Maths
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 select-none">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        JEE Main 2026
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        Session 1
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Interactive View depending on pyqActiveTab */}
                {pyqActiveTab === "practice" ? (
                  /* Authentic Question Card matching PYQQuestionCard.jsx */
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 space-y-4 shadow-xs">
                    {/* Question Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200/80 dark:border-gray-800">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-lg shadow-xs">
                          #1
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg border text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900">
                          Physics
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
                          Electrostatics
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg border text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900">
                          Medium
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        JEE Main 2026 (24 Jan Shift 1)
                      </span>
                    </div>

                    {/* Question Statement */}
                    <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 leading-relaxed font-medium">
                      <MarkdownMathRenderer content="Two point charges $+q$ and $-q$ form an electric dipole ($p = qa$). A third charge $+Q$ is placed at distance $r$ on the equatorial plane ($r \gg a$). What is the magnitude of the net electrostatic force on $+Q$?" />
                    </div>

                    {/* 4 Interactive Options (A, B, C, D) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        { key: "A", math: "\\frac{1}{4\\pi\\varepsilon_0} \\frac{2qaQ}{r^3}", isCorrect: false },
                        { key: "B", math: "\\frac{1}{4\\pi\\varepsilon_0} \\frac{qaQ}{r^3}", isCorrect: true },
                        { key: "C", math: "\\frac{1}{4\\pi\\varepsilon_0} \\frac{qaQ}{2r^3}", isCorrect: false },
                        { key: "D", math: "\\text{Zero}", isCorrect: false },
                      ].map((opt) => {
                        const isSelected = pyqSelectedOption === opt.key;
                        let optionStyle = "border-gray-200 dark:border-gray-800 hover:border-orange-500/50 bg-white dark:bg-gray-900/90";

                        if (isSelected && !pyqChecked) {
                          optionStyle = "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-2 ring-orange-500/50";
                        } else if (pyqChecked) {
                          if (opt.isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/50";
                          } else if (isSelected && !opt.isCorrect) {
                            optionStyle = "border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/50";
                          } else {
                            optionStyle = "border-gray-200 dark:border-gray-800 opacity-50 bg-white dark:bg-gray-900/50";
                          }
                        }

                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => {
                              if (!pyqChecked) setPyqSelectedOption(opt.key);
                            }}
                            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${optionStyle}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-md shrink-0 flex items-center justify-center font-bold text-xs ${isSelected && !pyqChecked
                                  ? "bg-orange-600 text-white"
                                  : pyqChecked && opt.isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : pyqChecked && isSelected
                                      ? "bg-rose-600 text-white"
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                }`}
                            >
                              {opt.key}
                            </span>
                            <div className="flex-1 text-xs text-gray-900 dark:text-gray-100">
                              <MarkdownMathRenderer content={`$${opt.math}$`} />
                            </div>
                            {pyqChecked && opt.isCorrect && (
                              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Check Answer Feedback Banner */}
                    {pyqChecked && (
                      <div
                        className={`p-3 rounded-xl flex items-center gap-2.5 text-xs font-bold border ${pyqSelectedOption === "B"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                          }`}
                      >
                        {pyqSelectedOption === "B" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span>
                          {pyqSelectedOption === "B"
                            ? "Correct! Official Answer is Option (B) • Verified Solution"
                            : "Incorrect • Correct Answer is Option (B)"}
                        </span>
                      </div>
                    )}

                    {/* Action Row */}
                    <div className="pt-2 border-t border-gray-200/80 dark:border-gray-800 flex items-center justify-between gap-3">
                      <div>
                        {!pyqChecked ? (
                          <button
                            type="button"
                            disabled={!pyqSelectedOption}
                            onClick={() => setPyqChecked(true)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-sm hover:from-orange-700 hover:to-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            Check Answer
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setPyqChecked(false);
                              setPyqSelectedOption(null);
                            }}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
                          >
                            Reset & Try Again
                          </button>
                        )}
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 select-none cursor-default">
                        <span>View Step-by-Step Solution</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Shift Papers Mode Preview with 4 papers total */
                  <div className="space-y-2.5">
                    {[
                      {
                        exam: "JEE Main 2026",
                        session: "Session 1 • 24 Jan Shift 1",
                        info: "90 Questions • 300 Marks • Full Official Paper & Solutions",
                      },
                      {
                        exam: "JEE Main 2026",
                        session: "Session 1 • 24 Jan Shift 2",
                        info: "90 Questions • 300 Marks • Full Official Paper & Solutions",
                      },
                      {
                        exam: "JEE Main 2026",
                        session: "Session 1 • 28 Jan Shift 1",
                        info: "90 Questions • 300 Marks • Full Official Paper & Solutions",
                      },
                      {
                        exam: "JEE Main 2026",
                        session: "Session 1 • 28 Jan Shift 2",
                        info: "90 Questions • 300 Marks • Full Official Paper & Solutions",
                      },
                    ].map((paper, idx) => (
                      <div
                        key={idx}
                        className="p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 flex items-center justify-between gap-3 sm:gap-4 shadow-xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {paper.exam}
                            </span>
                            <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {paper.session}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                            {paper.info}
                          </p>
                        </div>
                        <div
                          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-600 to-red-600 text-white shrink-0 shadow-xs cursor-default select-none"
                        >
                          Solve Paper
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-1 text-[11px] text-gray-500 dark:text-gray-400 italic">
                  *More questions and shift papers are continuously being added.
                </div>
              </div>

              {/* Right / PYQ Details */}
              <div className="order-1 lg:order-2 lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">Exam Pattern Mastery</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    Authentic Chapter-Wise Practice
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Practice with authentic previous year questions. Filter chapter-by-chapter to cement conceptual understanding, or solve shift papers to simulate exam conditions.
                  </p>
                </div>

                <ul className="space-y-3.5 text-sm text-gray-700 dark:text-gray-200">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Chapter & Shift Paper Modes:</strong> Seamlessly switch between practice feed and full official shift papers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">KaTeX Mathematical Formatting:</strong> Clear step-by-step verified solutions and formulas.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Continuous Library Expansion*:</strong> New shift papers and verified solutions uploaded regularly.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Link
                    href="/previous-year-questions"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Practice PYQs Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

  );
}
