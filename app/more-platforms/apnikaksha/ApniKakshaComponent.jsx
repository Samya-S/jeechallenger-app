"use client";
import Image from 'next/image';
import ScrollToTopButton from '@/components/utils/ScrollToTopButton';

const ApniKakshaComponent = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      {/* Banner Image - Kept Intact */}
      <Image
        className="w-full"
        src="/images/apnikaksha.jpg"
        alt="Apni Kaksha Banner"
        width={1920}
        height={1080}
        style={{ width: '100%', boxSizing: 'border-box' }}
        priority
      />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto">
        {/* Platform Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Apni Kaksha Platform
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Access Apni Kaksha's comprehensive JEE preparation resources across multiple platforms
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* YouTube Channel */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  YouTube Channel
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Free JEE preparation content
                </p>
                <div className="mb-6 relative w-full" style={{ aspectRatio: '4/3' }}>
                  <Image
                    className="rounded-lg"
                    src="/images/apnikaksha-ytchannel.png"
                    alt="YouTube Channel"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="mt-auto">
                  <a
                    href="https://www.youtube.com/channel/UCF7BExjT2zH_mmyqOB139Dg/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        Watch Channel
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Official Website */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Official Website
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comprehensive online platform
                </p>
                <div className="mb-6 relative w-full" style={{ aspectRatio: '4/3' }}>
                  <Image
                    className="rounded-lg"
                    src="/images/apnikaksha-website.png"
                    alt="Official Website"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="mt-auto">
                  <a
                    href="https://www.apnikaksha.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Visit Website
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Mobile App */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 text-center flex flex-col h-full">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Mobile App
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Download the mobile application
                </p>
                <div className="mb-6 relative w-full" style={{ aspectRatio: '4/3' }}>
                  <Image
                    className="rounded-lg"
                    src="/images/apnikaksha-app.png"
                    alt="Mobile App"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="mt-auto">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.apni.kaksha"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                      <span className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download App
                      </span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <ScrollToTopButton 
        gradientColors="from-blue-600 to-purple-600"
        hoverColors="hover:from-blue-700 hover:to-purple-700"
      />
    </div>
  );
};

export default ApniKakshaComponent;
