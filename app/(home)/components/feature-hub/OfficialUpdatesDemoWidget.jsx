import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Award, Clock, ArrowUpRight, Check } from "lucide-react";

export default function OfficialUpdatesDemoWidget() {
  return (
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

  );
}
