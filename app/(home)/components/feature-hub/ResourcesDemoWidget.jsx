import Link from "next/link";
import { ArrowRight, Atom, FlaskConical, Calculator, ArrowUpRight, Table, Check } from "lucide-react";

export default function ResourcesDemoWidget() {
  return (
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

  );
}
