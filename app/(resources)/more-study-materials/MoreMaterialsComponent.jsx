import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import Image from 'next/image';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';

const MoreMaterialsComponent = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-cyan-700 to-teal-700 dark:from-cyan-900 dark:to-teal-900 pb-20 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'Resources', href: '/resources' },
            { label: 'More Study Materials', href: '/more-study-materials' },
          ]}
          hasBanner={true}
          className="pb-12"
        />
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              More Study Materials
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto drop-shadow-md animate-fade-in-delay">
              Access comprehensive JEE preparation resources and contribute to our growing community
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto">

        {/* Telegram Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Join our Telegram Community
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Connect with thousands of JEE aspirants, stay updated with the latest news, and get access to community-shared study resources and discussions.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 mx-auto rounded-full"></div>
          </div>

          <div className="relative rounded-2xl p-[1px] max-w-4xl mx-auto bg-gradient-to-r from-gray-200 via-cyan-300 to-teal-300 dark:from-gray-700 dark:via-cyan-700 dark:to-teal-700 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-[15px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              {/* Subtle background element */}
              <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-gradient-to-bl from-cyan-100 to-transparent dark:from-cyan-900/20 dark:to-transparent rounded-full blur-2xl pointer-events-none"></div>

              {/* Content */}
              <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400 rounded-full blur-md opacity-20"></div>
                  <Image
                    src="/images/jcicon.jpg"
                    alt="JEE Challenger Telegram Channel Icon"
                    width={72}
                    height={72}
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white dark:border-gray-800 shadow-sm object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#0088cc] rounded-full p-1.5 border-2 border-white dark:border-gray-900 shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                    </svg>
                  </div>
                </div>
                
                <div className="text-center md:text-left">
                  <div className="inline-flex items-center gap-2 mb-1.5">
                    <span className="px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold tracking-wide uppercase border border-cyan-100 dark:border-cyan-800/50">
                      Official Community
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    JEE Challenger
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base max-w-sm">
                    Join fellow aspirants. Get the latest updates, notes, and discuss strategies together.
                  </p>
                </div>
              </div>

              {/* Button */}
              <div className="w-full md:w-auto shrink-0 relative z-10 group/btn">
                <a
                  href="https://t.me/+oOnj4y_ZYqYyZjA1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <button className="w-full md:w-auto relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold py-3.5 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5">
                    <span className="relative flex items-center justify-center gap-2 text-[15px]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                      </svg>
                      Join on Telegram
                    </span>
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contribute to JEE Challenger Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 content-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Contribute to JEE Challenger
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Help fellow JEE aspirants by sharing your study materials, notes, and resources
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-lg border border-blue-200 dark:border-blue-800 p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 text-center">Study Notes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Share your handwritten notes, summaries, and important formulas
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-800 p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2 text-center">Practice Papers</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Upload solved papers, mock tests, and practice questions
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl shadow-lg border border-indigo-200 dark:border-indigo-800 p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-indigo-700 dark:text-indigo-400 mb-2 text-center">Tips & Tricks</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  Share your study strategies, time management tips, and shortcuts
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-2xl shadow-lg border border-cyan-200 dark:border-cyan-800 p-6 mb-6">
              <h3 className="font-semibold text-cyan-800 dark:text-cyan-300 mb-3 text-center">How to Contribute:</h3>
              <ol className="text-sm text-gray-700 dark:text-gray-300 space-y-2 text-left w-fit mx-auto">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">1</span>
                  Click the &ldquo;Upload Files&rdquo; button below
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">2</span>
                  You&lsquo;ll be redirected to our Google Drive folder
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">3</span>
                  Upload your study materials (PDF, images, documents)
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">4</span>
                  Add a brief description of your content
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">5</span>
                  Your materials will be reviewed and added to the website
                </li>
              </ol>
            </div>

            <div className="relative overflow-hidden pb-4">
              <p className="contributorMarquee text-2xl text-cyan-600 dark:text-cyan-400 font-semibold whitespace-nowrap">
                <span className="inline-block pr-10">
                  🎉 Join our community of contributors! Your materials can help thousands of JEE aspirants 👇
                </span>
              </p>
            </div>

            <div className="text-center">
              <Link
                href="https://drive.google.com/drive/folders/1gs_ehca1F1-K9g3q_Q0mTteUSGzd6z8F?usp=sharing"
                target="_blank"
                aria-label="Upload your study materials to the website"
                className="inline-block"
              >
                <button className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg text-lg">
                  <span className="flex items-center justify-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Files
                  </span>
                </button>
              </Link>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                All contributions are reviewed to ensure quality and relevance
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Floating Action Button */}
      <ScrollToTopButton
        gradientColors="from-cyan-500 to-teal-600"
        hoverColors="hover:from-cyan-600 hover:to-teal-700"
      />
    </div>
  );
};

export default MoreMaterialsComponent;
