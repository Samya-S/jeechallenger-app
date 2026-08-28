"use client";
import Breadcrumbs from '@/components/common/Breadcrumbs';
import dynamic from 'next/dynamic';

const ScrollToTopButton = dynamic(() => import('@/components/ui/ScrollToTopButton'), {
  ssr: false
});

const PreviousYearQuestionsComponent = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 dark:from-orange-900 dark:to-red-900 pb-20 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'Resources', href: '/resources' },
            { label: 'Previous Year Questions', href: '/previous-year-questions' },
          ]}
          hasBanner={true}
          className="pb-12"
        />
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              Previous Year Questions
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto drop-shadow-md animate-fade-in-delay">
              Master JEE preparation with our comprehensive, integrated question bank of chapter-wise and year-wise previous year questions
            </p>
          </div>
        </div>
      </div>

      {/* Content Section - Coming Soon */}
      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative text-center p-12 md:p-20">

          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-50 dark:from-orange-900/20 to-transparent"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Icon */}
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 rounded-full flex items-center justify-center mb-8 shadow-inner border border-orange-200 dark:border-orange-800">
              <svg className="w-12 h-12 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>

            {/* Text */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
              A New Experience is Building...
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed mb-10">
              We are currently upgrading this page to feature our brand new, fully integrated Chapter-wise Question Bank. Get ready for a seamless practice experience!
            </p>

            {/* Progress/Sync indicator */}
            <div className="flex items-center justify-center gap-3 bg-gray-50 dark:bg-gray-900 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 shadow-inner">
              <svg className="w-5 h-5 text-orange-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Syncing Question Bank...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <ScrollToTopButton
        gradientColors="from-orange-600 to-red-600"
        hoverColors="hover:from-orange-700 hover:to-red-700"
      />
    </div>
  );
};

export default PreviousYearQuestionsComponent;
