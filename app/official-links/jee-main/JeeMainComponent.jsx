"use client";
import dynamic from 'next/dynamic';

const ScrollToTopButton = dynamic(() => import('@/components/ui/ScrollToTopButton'), {
  ssr: false
});
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';

const JeeMainComponent = () => {

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 dark:from-emerald-900 dark:to-teal-900 pb-16 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'Official Links' },
            { label: 'JEE Main', href: '/official-links/jee-main' },
          ]}
          hasBanner={true}
          className="pb-12"
        />
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              JEE Main
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto drop-shadow-md animate-fade-in-delay">
              Access official JEE Main resources, question papers, and comprehensive study materials
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto pb-12">
        {/* Official Website Section */}
        <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Official JEE Main Website
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access the official JEE Main portal for latest updates, notifications, and registration
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="text-center">
            <a
              href="https://jeemain.nta.nic.in/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
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

        {/* Previous Year Questions Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="p-8 md:p-10 md:w-2/3 flex flex-col justify-center text-left">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 py-1.5 px-4 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
                      Recommended
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    Looking for Previous Year Papers?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                    Access our comprehensive collection of JEE Main previous year question papers with detailed solutions, analysis, and official answer keys.
                  </p>
                  <div>
                    <Link href="/previous-year-questions">
                      <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3.5 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center group">
                        Explore PYQs
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-emerald-500 to-teal-600 justify-center items-center p-8 relative overflow-hidden">
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
        gradientColors="from-emerald-600 to-teal-600"
        hoverColors="hover:from-emerald-700 hover:to-teal-700"
      />
    </div>
  );
};

export default JeeMainComponent;
