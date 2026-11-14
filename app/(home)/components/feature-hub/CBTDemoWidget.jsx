"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Monitor, Check, Sparkles } from "lucide-react";

export default function CBTDemoWidget() {
  const [cbtActivePill, setCbtActivePill] = useState("mains");

  return (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Authentic Kiosk Frame with 3-Stage Image Showcase */}
              <div className="order-2 lg:order-1 lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-md shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-4 sm:p-6 space-y-4">
                
                {/* Stage Switcher Pills matching AI Tutor suggestion pills */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 mr-1 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Live Preview:
                  </span>
                  <button
                    type="button"
                    onClick={() => setCbtActivePill("mains")}
                    className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                      cbtActivePill === "mains"
                        ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                        : "bg-slate-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 border-blue-200/90 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                    }`}
                  >
                    JEE Main (NTA Kiosk)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCbtActivePill("advanced")}
                    className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                      cbtActivePill === "advanced"
                        ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                        : "bg-slate-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 border-blue-200/90 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                    }`}
                  >
                    JEE Advanced (IIT iON)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCbtActivePill("scorecard")}
                    className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full border transition-all cursor-pointer font-medium ${
                      cbtActivePill === "scorecard"
                        ? "bg-blue-600 text-white border-blue-600 font-semibold shadow-xs"
                        : "bg-slate-50 dark:bg-gray-800 text-blue-700 dark:text-blue-300 border-blue-200/90 dark:border-blue-900/60 hover:bg-blue-50 dark:hover:bg-blue-950/50"
                    }`}
                  >
                    Performance Scorecard
                  </button>
                </div>

                {/* Screenshot Display in Browser/Kiosk Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-gray-200/90 dark:border-gray-800 bg-gray-950 shadow-inner group">
                  {/* Window Control Bar */}
                  <div className="flex items-center px-3.5 py-2 bg-gray-900 border-b border-gray-800 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                      <span className="ml-2 text-[10px] font-mono text-gray-400">
                        {cbtActivePill === "mains" && "nta-exam-terminal://jee-main-2026-candidate-console"}
                        {cbtActivePill === "advanced" && "iit-ion-terminal://jee-advanced-2026-console"}
                        {cbtActivePill === "scorecard" && "nta-analytics://candidate-scorecard-audit"}
                      </span>
                    </div>
                  </div>

                  {/* Stage Images */}
                  <div className="relative overflow-hidden bg-gray-950 flex items-center justify-center min-h-[260px] sm:min-h-[340px]">
                    {cbtActivePill === "mains" && (
                      <Image
                        src="/images/cbt/mains-exam-room.png"
                        alt="Official JEE Main NTA Exam Terminal Interface"
                        width={1440}
                        height={900}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                        priority
                      />
                    )}
                    {cbtActivePill === "advanced" && (
                      <Image
                        src="/images/cbt/advanced-exam-room.png"
                        alt="Official JEE Advanced IIT iON Digital Assessment Terminal"
                        width={1440}
                        height={900}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                    )}
                    {cbtActivePill === "scorecard" && (
                      <Image
                        src="/images/cbt/scorecard-2880x1800.png"
                        alt="CBT Performance Scorecard Official Cards"
                        width={1440}
                        height={900}
                        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                      />
                    )}
                  </div>
                </div>

                {/* Dynamic Stage Caption */}
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 border border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300">
                  <p className="leading-relaxed">
                    {cbtActivePill === "mains" && (
                      <span>Exact live replica of the JEE Main test environment featuring the 5-state question palette, subject switching, live countdown timer, and authentic single-choice options.</span>
                    )}
                    {cbtActivePill === "advanced" && (
                      <span>Real test environment showing multi-correct questions with partial marking rules, Section 1-4 subject tabs, and official candidate workstation details.</span>
                    )}
                    {cbtActivePill === "scorecard" && (
                      <span>Official score breakdown showing overall marks, attempt rate, accuracy, subject-wise performance (Physics, Chemistry, Math), and pacing time-trap analysis.</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Column: Feature Copy & Direct CTA (Styled identically to AI Tutor and other tabs) */}
              <div className="order-1 lg:order-2 lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">1:1 Exam Simulation</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
                    Real Exam Hall Environment. Zero Surprises on D-Day.
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    Practicing on casual quiz apps won&apos;t prepare you for the pressure of the actual exam hall. Train inside the exact computer-based test environment you&apos;ll face on exam day so you perform at your absolute peak.
                  </p>
                </div>

                <ul className="space-y-3.5 text-sm text-gray-700 dark:text-gray-200">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Conquer Exam-Hall Panic:</strong> Practice in the exact test interface you&apos;ll face on D-Day — eliminating unfamiliarity so you stay calm and focused under pressure.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Identify &amp; Avoid Time Traps:</strong> Spot the tough questions where you wasted minutes for zero return, learning exactly when to skip and protect your 3-hour clock.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Cut Down Negative Marking:</strong> Uncover subject-wise blind spots and reckless guesses so you stop throwing away 20+ easy marks.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-gray-900 dark:text-white font-bold">Step-by-Step Solution Reviews:</strong> Instantly learn the optimal solution method for every question you got wrong or left unattempted.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <Link
                    href="/mock-test"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Launch CBT Mock Test Hub</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

  );
}
