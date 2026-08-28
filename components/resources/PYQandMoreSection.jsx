import Link from "next/link"

const PYQandMoreSection = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Additional Resources
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore more study materials and resources to enhance your JEE preparation
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Previous Year Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-6 text-center flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Previous Year Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Chapter-wise previous year JEE questions with detailed step-by-step solutions
              </p>
              <div className="mt-auto">
                <Link href="/previous-year-questions" aria-label="View Chapter wise solved previous year JEE papers">
                  <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                    Explore PYQs
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* AI Tutor */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-6 text-center flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 640 512">
                  <path d="M208 352c-2.39 0-4.78.35-7.06 1.09C187.98 357.3 174.35 360 160 360c-14.35 0-27.98-2.7-40.95-6.91-2.28-.74-4.66-1.09-7.05-1.09C49.94 352-.33 402.48 0 464.62.14 490.88 21.73 512 48 512h224c26.27 0 47.86-21.12 48-47.38.33-62.14-49.94-112.62-112-112.62zm-48-32c53.02 0 96-42.98 96-96s-42.98-96-96-96-96 42.98-96 96 42.98 96 96 96zM592 0H208c-26.47 0-48 22.25-48 49.59V96c23.42 0 45.1 6.78 64 17.8V64h352v288h-64v-64H384v64h-76.24c19.1 16.69 33.12 38.73 39.69 64H592c26.47 0 48-22.25 48-49.59V49.59C640 22.25 618.47 0 592 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Personalized AI Tutor
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Experience personalized JEE preparation with our advanced AI Tutor
              </p>
              <div className="mt-auto">
                <Link href="/ai-tutor" aria-label="Start learning with AI Tutor">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                    Try AI Tutor Now
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* More Study Materials */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="p-6 text-center flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                More Study Materials
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Additional resources and study materials to boost your preparation
              </p>
              <div className="mt-auto">
                <Link href="/more-study-materials" aria-label="Explore more study materials">
                  <button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                    Explore More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Resources Banner */}
        <div className="mt-20 relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 group">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 dark:from-indigo-800 dark:via-purple-900 dark:to-indigo-900"></div>
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-fuchsia-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-20"></div>
          
          <div className="relative px-8 py-14 md:py-16 md:px-16 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-10 backdrop-blur-sm">
            
            <div className="flex-1 max-w-3xl flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              {/* Icon Container */}
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-white/20">
                <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              
              {/* Text Content */}
              <div>
                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight drop-shadow-sm">
                  Supercharge Your Preparation
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl font-medium">
                  Stop searching, start learning. Access our entire library of premium study materials, interactive tools, and chapter-wise question banks all in one place.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex-shrink-0 w-full md:w-auto">
              <Link href="/resources" aria-label="Explore all resources" className="block">
                <button className="w-full md:w-auto relative overflow-hidden bg-white text-gray-900 font-bold text-lg py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center group">
                  <span className="relative z-10 flex items-center">
                    Explore Resources Hub
                    <svg className="w-6 h-6 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default PYQandMoreSection
