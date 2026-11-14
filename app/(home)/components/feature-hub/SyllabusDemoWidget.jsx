import Link from "next/link";
import { Layers, ArrowRight, CheckCircle2, Circle, Check } from "lucide-react";
import { trackerDemoData } from "./featureHubData";

export default function SyllabusDemoWidget() {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  return (
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

  );
}
