"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  FileText,
  Award,
  ArrowRight,
  Sparkles,
  Check,
  Layers,
  BarChart2,
  Atom,
  FlaskConical,
  Calculator,
  ArrowUpRight,
  Clock,
  Circle,
  Table,
  Newspaper
} from "lucide-react";
import { FaUser, FaChalkboardTeacher, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import BlogCard from "@/components/ui/BlogCard";
import MarkdownMathRenderer from "@/components/common/MarkdownMathRenderer";

export default function FeatureHub({ latestArticles = [] }) {
  const [activeTab, setActiveTab] = useState("ai-tutor");

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

  // Interactive mock state for AI Tutor tab
  const [aiSelectedPrompt, setAiSelectedPrompt] = useState(0);

  // Interactive mock state for PYQ Question Bank preview (matching PreviousYearQuestionsComponent.jsx)
  const [pyqActiveTab, setPyqActiveTab] = useState("practice"); // "practice" | "papers"
  const [pyqSelectedOption, setPyqSelectedOption] = useState(null);
  const [pyqChecked, setPyqChecked] = useState(false);

  // Realistic demo state for Syllabus Tracker preview (based on full 88 chapters & 264 tasks)
  const trackerDemoData = {
    overall: {
      percentage: 64,
      completedTasks: 170,
      totalTasks: 264,
      totalChapters: 88,
      theoryDone: 68,
      pyqsDone: 58,
      revisionDone: 44,
    },
    subjects: [
      {
        key: "physics",
        name: "Physics",
        totalChapters: 29,
        chaptersCompleted: 21,
        totalTasks: 87,
        completedTasks: 62,
        percentage: 71,
        accentStroke: "text-blue-600 dark:text-blue-500",
        accentFill: "fill-blue-600 dark:fill-blue-400",
      },
      {
        key: "chemistry",
        name: "Chemistry",
        totalChapters: 30,
        chaptersCompleted: 19,
        totalTasks: 90,
        completedTasks: 58,
        percentage: 64,
        accentStroke: "text-emerald-600 dark:text-emerald-500",
        accentFill: "fill-emerald-600 dark:fill-emerald-400",
      },
      {
        key: "mathematics",
        name: "Mathematics",
        totalChapters: 29,
        chaptersCompleted: 16,
        totalTasks: 87,
        completedTasks: 50,
        percentage: 57,
        accentStroke: "text-purple-600 dark:text-purple-500",
        accentFill: "fill-purple-600 dark:fill-purple-400",
      },
    ],
  };

  const sampleAiQuestions = [
    {
      q: "Explain work done in an isothermal reversible expansion of an ideal gas.",
      a: "For an isothermal process ($T = \\text{constant}$):\n\n- **First Law**: $\\Delta U = q + w = 0 \\implies q = -w$\n- **Work Done**: $W = -\\int P \\, dV = -nRT \\ln\\left(\\frac{V_2}{V_1}\\right)$\n- **In terms of pressure**: $W = -nRT \\ln\\left(\\frac{P_1}{P_2}\\right)$\n\nSince temperature is constant, internal energy change $\\Delta U = 0$ for an ideal gas.",
      topic: "Thermodynamics"
    },
    {
      q: "Why is o-nitrophenol more volatile than p-nitrophenol?",
      a: "- **Ortho-nitrophenol** exhibits intramolecular hydrogen bonding (chelation between -OH and -NO₂).\n- **Para-nitrophenol** forms intermolecular hydrogen bonds with neighboring molecules.\n- **Intermolecular H-bonds** create extensive association, raising boiling point and reducing volatility.",
      topic: "Organic Chemistry"
    },
    {
      q: "Find the limit: lim(x→0) [sin(x) - x] / x³",
      a: "Using the Taylor series expansion of $\\sin(x)$:\n\n- $\\sin(x) = x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\dots$\n- $\\sin(x) - x = -\\frac{x^3}{6} + \\mathcal{O}(x^5)$\n- Dividing by $x^3$: $\\lim_{x \\to 0} \\left[-\\frac{1}{6} + \\mathcal{O}(x^2)\\right] = -\\frac{1}{6}$\n\nAlternatively, applying L'Hôpital's rule 3 times yields the identical $-\\frac{1}{6}$.",
      topic: "Calculus & Limits"
    }
  ];

  const tabs = [
    {
      id: "ai-tutor",
      label: "AI Tutor",
      badge: "24/7 Live",
      icon: FaChalkboardTeacher,
    },
    {
      id: "syllabus-tracker",
      label: "Syllabus Tracker",
      badge: "88 Chapters",
      icon: CheckCircle2,
    },
    {
      id: "pyqs",
      label: "PYQ Question Bank",
      badge: `${yearRangeDisplay}*`,
      icon: BookOpen,
    },
    {
      id: "resources",
      label: "Subject Resources",
      badge: "Formula & Tools",
      icon: Layers,
    },
    {
      id: "official",
      label: "JEE Papers & Links",
      badge: "Main & Adv",
      icon: FileText,
    },
    {
      id: "blogs",
      label: "Articles & Insights",
      badge: "Topper Guides",
      icon: Newspaper,
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative bg-slate-50/70 dark:bg-transparent border-y border-slate-200/60 dark:border-transparent transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Platform Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Engineered for Serious Aspirants
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-200 leading-relaxed">
            Eliminate chaotic tabs and disorganised study material. Everything required to conquer JEE Main & Advanced is unified right here.
          </p>
        </div>

        {/* Feature Tabs Selector (Responsive wrap - NO horizontal scrolling) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30"
                    : "bg-white hover:bg-slate-50 dark:bg-gray-800/90 dark:hover:bg-gray-700/90 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-white border border-slate-300/90 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 shadow-sm shadow-slate-200/80 hover:shadow-md hover:shadow-slate-300/50 dark:shadow-none ring-1 ring-black/[0.03] dark:ring-white/[0.05]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300"
                  }`}
                />
                <span className={`whitespace-nowrap ${isActive ? "text-white" : ""}`}>
                  {tab.label}
                </span>
                <span
                  className={`hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-slate-200/80 dark:border-transparent group-hover:bg-indigo-50 dark:group-hover:bg-gray-600 group-hover:text-indigo-600 dark:group-hover:text-white"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Feature Showcase Container */}
        <div className="bg-white dark:bg-gray-900/90 rounded-3xl border border-gray-200/90 dark:border-gray-700/80 p-4 sm:p-7 lg:p-10 shadow-xl shadow-gray-200/40 dark:shadow-black/50 transition-all duration-300">

          {/* TAB 1: AI TUTOR */}
          {activeTab === "ai-tutor" && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left / Live Interactive Preview matching real AITutorComponent UI */}
              <div className="order-2 lg:order-1 lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-3.5 sm:p-6 lg:p-7 space-y-4 sm:space-y-5 overflow-hidden">
                {/* Try asking suggestion pills matching AITutorComponent */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-2 border-b border-slate-200/80 dark:border-gray-800">
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Try asking:
                  </span>
                  {sampleAiQuestions.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setAiSelectedPrompt(idx)}
                      className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                        aiSelectedPrompt === idx
                          ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                          : "bg-slate-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 border-blue-200/90 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                      }`}
                    >
                      {item.topic}
                    </button>
                  ))}
                </div>

                {/* User Message Bubble matching AITutorComponent */}
                <div className="flex justify-end pt-1">
                  <div className="flex items-start gap-2.5 max-w-[92%] sm:max-w-[85%] flex-row-reverse">
                    <div className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white items-center justify-center shrink-0 shadow-xs">
                      <FaUser className="text-white text-xs sm:text-sm" />
                    </div>
                    <div className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl rounded-tr-[2px] bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xs text-xs sm:text-sm font-medium leading-relaxed break-words">
                      {sampleAiQuestions[aiSelectedPrompt].q}
                    </div>
                  </div>
                </div>

                {/* AI Tutor Response Bubble matching AITutorComponent */}
                <div className="flex justify-start">
                  <div className="flex items-start gap-2.5 w-full max-w-full sm:max-w-[92%]">
                    <div className="hidden sm:flex w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white items-center justify-center shrink-0 shadow-md">
                      <FaChalkboardTeacher className="text-white text-xs sm:text-sm" />
                    </div>
                    <div className="flex-1 min-w-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-slate-200 dark:border-gray-700/80 shadow-md shadow-slate-200/40 dark:shadow-none rounded-2xl rounded-tl-[2px] p-3 sm:p-4 text-xs sm:text-sm leading-relaxed overflow-hidden">
                      <MarkdownMathRenderer
                        content={sampleAiQuestions[aiSelectedPrompt].a}
                        className="!text-xs sm:!text-sm [&_.katex]:text-xs sm:[&_.katex]:text-sm [&_.katex-display]:my-1.5 sm:[&_.katex-display]:my-2 [&_.katex-display]:py-0.5 sm:[&_.katex-display]:py-1 [&_ul]:list-disc [&_ul]:pl-4 sm:[&_ul]:pl-5 [&_ul]:space-y-1 sm:[&_ul]:space-y-1.5 [&_li]:leading-relaxed [&_p]:mb-1.5 sm:[&_p]:mb-2 [&_p:last-child]:mb-0 font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Authentic Chat Input Area matching AITutorComponent */}
                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 border border-slate-200 dark:border-gray-700/80 rounded-2xl bg-white dark:bg-gray-800/90 shadow-xs">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0">
                    <FaPaperclip className="text-xs sm:text-sm" />
                  </div>
                  <div className="flex-1 px-1 sm:px-2 text-xs sm:text-sm text-gray-400 dark:text-gray-500 truncate select-none">
                    Ask me anything about JEE preparation...
                  </div>
                  <div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0 select-none"
                    aria-hidden="true"
                  >
                    <FaPaperPlane className="text-xs" />
                  </div>
                </div>
              </div>

              {/* Right / Capabilities Breakdown */}
              <div className="order-1 lg:order-2 lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">24/7 Personal Mentor</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    Never Stay Stuck on a Problem Again
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Designed specifically for IIT JEE syllabus. Ask high-level conceptual questions, upload photo problems, and get detailed LaTeX-formatted derivations instantly.
                  </p>
                </div>

                <ul className="space-y-3.5 text-sm text-gray-700 dark:text-gray-200">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Step-by-Step Problem Derivations:</strong> Rigorous multi-step breakdowns with complete mathematical equations and chemical formulas.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Photo & Diagram Doubt Solver:</strong> Snap a picture of textbook questions, circuit schematics, or organic mechanisms for instant analysis.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Interactive Concept Clarification:</strong> Ask follow-up questions to understand the underlying theory, alternative methods, and common exam traps.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Link
                    href="/ai-tutor"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <FaChalkboardTeacher className="w-4 h-4" />
                    <span>Launch AI Tutor Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYLLABUS TRACKER */}
          {activeTab === "syllabus-tracker" && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left / Authentic Syllabus Tracker Preview matching SyllabusTrackerComponent.jsx */}
              <div className="order-2 lg:order-1 lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-5 sm:p-7 space-y-6">

                {/* 1. Overall Progress Bento Card matching SyllabusTrackerComponent.jsx lines 536-593 */}
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                        Overall Progress
                      </span>
                      <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mt-1">
                        {trackerDemoData.overall.percentage}%
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {trackerDemoData.overall.completedTasks} / {trackerDemoData.overall.totalTasks}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">
                        tasks completed
                      </span>
                    </div>
                  </div>

                  {/* Progress bar with EXACT gradient from SyllabusTrackerComponent.jsx (Physics=Blue, Chemistry=Emerald, Maths=Purple) */}
                  <div className="w-full bg-slate-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 via-emerald-500 to-purple-600 rounded-full transition-all duration-300"
                      style={{ width: `${trackerDemoData.overall.percentage}%` }}
                    />
                  </div>

                  {/* Task Type Totals Row matching SyllabusTrackerComponent.jsx lines 567-592 */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 text-center">
                      <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                        {trackerDemoData.overall.theoryDone}/{trackerDemoData.overall.totalChapters}
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Theory Done
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 text-center">
                      <div className="text-base sm:text-lg font-bold text-orange-600 dark:text-orange-400">
                        {trackerDemoData.overall.pyqsDone}/{trackerDemoData.overall.totalChapters}
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        PYQs Done
                      </div>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 text-center">
                      <div className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {trackerDemoData.overall.revisionDone}/{trackerDemoData.overall.totalChapters}
                      </div>
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Revision Done
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 3 Subject Progress Cards with Open-Bottom Circular Arc matching SyllabusTrackerComponent.jsx lines 595-690 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  {trackerDemoData.subjects.map((st) => {
                    const radius = 36;
                    const circumference = 2 * Math.PI * radius;
                    const arcDegrees = 240; // 240deg arc leaves a 120deg gap at the bottom
                    const startAngle = 270 - arcDegrees / 2; // 150deg keeps arc symmetric around top center
                    const arcLength = circumference * (arcDegrees / 360);
                    const filledLength = (st.percentage / 100) * arcLength;

                    return (
                      <div
                        key={st.key}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 flex flex-col items-center justify-between"
                      >
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {st.name}
                        </span>

                        {/* Open-Bottom Circular Arc Gauge (240deg) */}
                        <div className="relative w-28 sm:w-32 h-24 sm:h-26 my-1 flex items-center justify-center">
                          <svg
                            viewBox="0 0 100 84"
                            className="w-full h-full overflow-visible"
                          >
                            {/* Background Arc Track */}
                            <circle
                              cx="50"
                              cy="46"
                              r={radius}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={`${arcLength} ${circumference}`}
                              transform={`rotate(${startAngle} 50 46)`}
                              className="text-slate-200 dark:text-gray-800"
                            />
                            {/* Active Progress Arc */}
                            <circle
                              cx="50"
                              cy="46"
                              r={radius}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="8"
                              strokeLinecap="round"
                              strokeDasharray={`${filledLength} ${circumference}`}
                              transform={`rotate(${startAngle} 50 46)`}
                              className={`${st.accentStroke} transition-all duration-300`}
                            />
                            {/* Center: Percentage */}
                            <text
                              x="50"
                              y="44"
                              textAnchor="middle"
                              dominantBaseline="central"
                              className={`text-[18px] font-extrabold ${st.accentFill}`}
                            >
                              {st.percentage}%
                            </text>
                            {/* Inside Open Gap: X/Y tasks */}
                            <text
                              x="50"
                              y="71"
                              textAnchor="middle"
                              dominantBaseline="central"
                              className="text-[9.5px] font-semibold fill-gray-500 dark:fill-gray-400"
                            >
                              {st.completedTasks}/{st.totalTasks} tasks
                            </text>
                          </svg>
                        </div>

                        {/* Chapters Completed Footer */}
                        <div className="w-full pt-2.5 border-t border-slate-200/80 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
                          <strong className="text-gray-800 dark:text-gray-200 font-bold">
                            {st.chaptersCompleted}/{st.totalChapters}
                          </strong>{" "}
                          chapters done
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right / Value Proposition */}
              <div className="order-1 lg:order-2 lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">Systematic Progress</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    Total Control Over Your JEE Preparation
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Structured tracking across all 88 chapters. Bridge the gap between understanding theory, solving past shift papers, and revision without guesswork.
                  </p>
                </div>

                <ul className="space-y-3.5 text-sm text-gray-700 dark:text-gray-200">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">3-Stage Mastery Workflow:</strong> Track every chapter across Theory coverage, PYQ problem-solving, and Revision cycles — never mistake reading once for exam readiness.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Direct PYQ Integration:</strong> Jump immediately from any chapter in your checklist straight to its dedicated past shift question bank with a single tap.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Cloud Sync & Smart Filtering:</strong> Auto-saves locally with zero setup, with one-tap cloud sync across phone and PC, plus search and status filters (Not Started, In Progress, Done).</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Link
                    href="/syllabus-tracker"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Open Syllabus Tracker</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PYQ QUESTION BANK */}
          {activeTab === "pyqs" && (
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
          )}

          {/* TAB 4: SUBJECT RESOURCES (Physics, Chemistry, Mathematics actual tools) */}
          {activeTab === "resources" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">Subject Resources</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    Formula Sheets, Interactive Tools & Study Notes
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Every subject carries equal weight in JEE. Explore dedicated study tools, high-yield formula sheets, and chapter summaries.
                  </p>
                </div>

                <div>
                  <Link
                    href="/resources"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                  >
                    <span>View All Resources</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">

                {/* Physics Card */}
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-800/80 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-xl ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center gap-3.5 sm:gap-4 mb-3.5">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0">
                        <Atom className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Physics</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                          Mechanics, Electrodynamics, Thermodynamics, Optics & Modern Physics.
                        </p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <Link
                          href="/physics"
                          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>High-Yield Formula Sheets</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <Link
                          href="/physics/unit-converter"
                          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Interactive Unit Converter</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>Chapter Notes & Concept Summaries</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200/80 dark:border-gray-800">
                    <Link
                      href="/physics"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
                    >
                      <span>Explore Physics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Chemistry Card */}
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-800/80 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-xl ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center gap-3.5 sm:gap-4 mb-3.5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                        <FlaskConical className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Chemistry</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                          Physical Calculations, Organic Reaction Mechanisms & Inorganic Trends.
                        </p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <Link
                          href="/chemistry"
                          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Reaction & Formula Sheets</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <Link
                          href="/chemistry/periodic-table"
                          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Interactive Periodic Table</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <Link
                          href="/chemistry/unit-converter"
                          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Gas & Pressure Converter</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200/80 dark:border-gray-800">
                    <Link
                      href="/chemistry"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
                    >
                      <span>Explore Chemistry</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Mathematics Card */}
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-800/80 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-xl ring-1 ring-black/[0.03] dark:ring-white/[0.06] flex flex-col justify-between transition-all">
                  <div>
                    <div className="flex items-center gap-3.5 sm:gap-4 mb-3.5">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 flex items-center justify-center shrink-0">
                        <Calculator className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">Mathematics</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                          Calculus, Coordinate Geometry, Vectors & 3D, and Advanced Algebra.
                        </p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <Link
                          href="/mathematics"
                          className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Calculus & Algebra Formula Sheets</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <Link
                          href="/mathematics/unit-converter"
                          className="text-purple-600 dark:text-purple-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>Angle & Unit Converter</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        <span>Chapter Theorems & Notes</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200/80 dark:border-gray-800">
                    <Link
                      href="/mathematics"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all"
                    >
                      <span>Explore Mathematics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: JEE PAPERS & OFFICIAL LINKS */}
          {activeTab === "official" && (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left / JEE Main & JEE Advanced internal pages */}
              <div className="order-2 lg:order-1 lg:col-span-7 grid sm:grid-cols-2 gap-4">

                {/* JEE Main Card */}
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 sm:gap-4 mb-3.5">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">JEE Main</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                          Official NTA portal gateway, registration notifications, and direct access to JEE Main PYQ archives.
                        </p>
                      </div>
                    </div>
                    <ul className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 space-y-2.5 pt-3">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Direct official NTA portal gateway</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Previous year papers with verified solutions</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Latest exam updates & registration links</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/jee-main"
                      className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      <span>Explore JEE Main</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* JEE Advanced Card */}
                <div className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 sm:gap-4 mb-3.5">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 flex items-center justify-center shrink-0">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">JEE Advanced</h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                          Official organizing IIT portal, official syllabus PDF, past paper archives, and exam reports.
                        </p>
                      </div>
                    </div>
                    <ul className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 space-y-2.5 pt-3">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0" /> Official organizing IIT portal & notices</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0" /> Past question papers & final answer keys</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-orange-500 shrink-0" /> Official syllabus PDF & annual reports</li>
                    </ul>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/jee-advanced"
                      className="w-full inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 py-2.5 rounded-xl transition-colors shadow-sm"
                    >
                      <span>Explore JEE Advanced</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right / Information */}
              <div className="order-1 lg:order-2 lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">Direct Source Archives</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    Official Examination Papers & Verified Keys
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Access dedicated archives of JEE Main and Advanced papers right on this platform, along with verified source links for NTA and IIT portals.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 space-y-2">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">External Official Portals:</span>
                  <div className="flex flex-col gap-2.5 text-xs sm:text-sm pt-1">
                    <Link
                      href="https://jeemain.nta.nic.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1.5"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      <span>jeemain.nta.nic.in</span>
                      <span className="text-gray-500 dark:text-gray-400 font-normal">(Official JEE Main Portal)</span>
                    </Link>
                    <Link
                      href="https://jeeadv.ac.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1.5"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      <span>jeeadv.ac.in</span>
                      <span className="text-gray-500 dark:text-gray-400 font-normal">(Official JEE Advanced Portal)</span>
                    </Link>
                    <Link
                      href="https://nta.ac.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1.5"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      <span>nta.ac.in</span>
                      <span className="text-gray-500 dark:text-gray-400 font-normal">(National Testing Agency - NTA)</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ARTICLES & INSIGHTS (Unified directly into Feature Hub) */}
          {activeTab === "blogs" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">Preparation Insights</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    Latest Articles & Preparation Guides
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    Stay updated with topper strategies, exam insights, and revision planning guides.
                  </p>
                </div>

                <div>
                  <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <span>View All Articles</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {latestArticles && latestArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {latestArticles.map((article) => (
                    <BlogCard key={article.slug} post={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Explore our complete blog collection for in-depth JEE preparation advice.</p>
                  <Link
                    href="/blogs"
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                  >
                    <span>Browse All Articles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
