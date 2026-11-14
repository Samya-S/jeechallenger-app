"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, ArrowRight, Sparkles, Check } from "lucide-react";
import { FaUser, FaChalkboardTeacher, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import MarkdownMathRenderer from "@/components/common/MarkdownMathRenderer";
import { sampleAiQuestions } from "./featureHubData";

export default function AITutorDemoWidget() {
  const [aiSelectedPrompt, setAiSelectedPrompt] = useState(0);

  return (
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

  );
}
