"use client";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ExamCountdown from '@/components/common/ExamCountdown';

const ScrollToTopButton = dynamic(() => import('@/components/ui/ScrollToTopButton'), {
  ssr: false
});

const JeeAdvancedComponent = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-700 to-orange-700 dark:from-yellow-900 dark:to-orange-900 pb-16 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'JEE Advanced', href: '/jee-advanced' },
          ]}
          hasBanner={true}
          className="pb-12"
        />
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              JEE Advanced
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto drop-shadow-md animate-fade-in-delay">
              Access official JEE Advanced resources, syllabus, and comprehensive study materials
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto pb-12">
        {/* Exam Countdown Widget */}
        <div className="-mt-10 sm:-mt-12 relative z-20 px-4 sm:px-6 lg:px-8 mb-4 sm:mb-8">
          <ExamCountdown examKey="JEE_ADVANCED" />
        </div>

        {/* Official Website Section */}
        <section className="pt-8 sm:pt-12 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Official JEE Advanced Website
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access the official JEE Advanced portal for latest updates, notifications, and registration
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="text-center">
            <a
              href="https://jeeadv.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visit Official Website
                </span>
              </button>
            </a>
          </div>
        </section>

        {/* More Official Links Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              More Official Links
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access comprehensive JEE Advanced resources including past papers, syllabus, and reports
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Past Question Papers */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] overflow-hidden flex flex-col">
              <div className="p-6 text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Past Question Papers & Keys
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Official archive of past question papers, answer keys, and solutions
                </p>
                <div className="mt-auto">
                  <a
                    href="https://jeeadv.ac.in/archive.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm">
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Papers
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] overflow-hidden flex flex-col">
              <div className="p-6 text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Eligibility Criteria 2027
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Official rules on age limit, number of attempts, and qualifying criteria
                </p>
                <div className="mt-auto">
                  <a
                    href="https://jeeadv.ac.in/eligibility.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm">
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Criteria
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Syllabus */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] overflow-hidden flex flex-col">
              <div className="p-6 text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  JEE Advanced Syllabus
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Official syllabus and information brochure from organizing institute
                </p>
                <div className="mt-auto">
                  <a
                    href="https://jeeadv.ac.in/syllabus.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm">
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Syllabus
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Previous Years Reports */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] overflow-hidden flex flex-col">
              <div className="p-6 text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  JEE Advanced Reports
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Official annual reports, candidate statistics, and opening-closing ranks
                </p>
                <div className="mt-auto">
                  <a
                    href="https://jeeadv.ac.in/reports.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-sm">
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Reports
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Telegram Live Updates Banner */}
        <section className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 border border-amber-500/30 shadow-xl shadow-amber-950/20 p-8 sm:p-10 text-white">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase mb-4">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Instant Push Alerts
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    Instant JEE Advanced Alerts on Your Phone
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Exam dates, eligibility circulars, and registration schedules are published across different IIT portals. Join our Telegram channel to receive verified real-time notifications on your phone.
                  </p>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <a
                    href="https://t.me/+oOnj4y_ZYqYyZjA1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#229ED9] to-[#0088cc] hover:from-[#1b8bc2] hover:to-[#0077b5] shadow-lg shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-base"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.26 13.837l-2.938-.916c-.638-.203-.651-.638.136-.953l11.48-4.43c.532-.194.995.13.957.683z" />
                    </svg>
                    <span>Join Telegram Channel</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Previous Year Questions Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] overflow-hidden border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="p-8 md:p-10 md:w-2/3 flex flex-col justify-center text-left">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-500 py-1.5 px-4 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
                      Recommended
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    Looking for Previous Year Papers?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                    Access our comprehensive collection of JEE Advanced previous year question papers with detailed solutions, analysis, and official answer keys.
                  </p>
                  <div>
                    <Link href="/previous-year-questions?tab=papers&exam_type=JEE_ADVANCED">
                      <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium py-3.5 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center group">
                        Explore PYQs
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-yellow-500 to-orange-600 justify-center items-center p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-16 -mr-16 bg-white opacity-10 rounded-full w-48 h-48 blur-2xl"></div>
                  <div className="absolute bottom-0 left-0 -mb-16 -ml-16 bg-white opacity-10 rounded-full w-32 h-32 blur-xl"></div>
                  <svg className="w-32 h-32 text-white/90 drop-shadow-xl relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Floating Action Button */}
      <ScrollToTopButton
        gradientColors="from-yellow-600 to-orange-600"
        hoverColors="hover:from-yellow-700 hover:to-orange-700"
      />
    </div>
  );
};

export default JeeAdvancedComponent;
