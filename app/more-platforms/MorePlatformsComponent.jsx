import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import Image from 'next/image';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';

const MorePlatformsComponent = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-blue-900 dark:to-purple-900 pb-20 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'More Platforms', href: '/more-platforms' },
          ]}
          hasBanner={true}
          className="pb-12"
        />
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              More Platforms
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-3xl mx-auto drop-shadow-md animate-fade-in-delay">
              Explore top learning platforms for your JEE Main and JEE Advanced preparation
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto">
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 flex flex-col flex-grow">
                <div className="relative w-full mb-4" style={{ aspectRatio: '2/1' }}>
                  <Image
                    className="rounded-lg"
                    src="/images/Unacademy-banner.jpg"
                    alt="Unacademy - India's Largest Online Learning Platform for JEE Main and Advanced preparation"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Unacademy</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow">
                  India's Largest Learning Platform. Coaching by Top Educators.
                </p>
                <Link href="/more-platforms/unacademy" aria-label="Visit Unacademy for India's largest learning platform" className="mt-auto">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg w-full">
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Platform
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 flex flex-col flex-grow">
                <div className="relative w-full mb-4" style={{ aspectRatio: '2/1' }}>
                  <Image
                    className="rounded-lg"
                    src="/images/apnikaksha2.jpg"
                    alt="Apni Kaksha - Premium JEE Education Platform at Affordable Prices for all students"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Apni Kaksha</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow">
                  Premium Education for All for free or at the most affordable price
                </p>
                <Link href="/more-platforms/apnikaksha" aria-label="Visit Apni Kaksha for affordable education" className="mt-auto">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg w-full">
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Platform
                    </span>
                  </button>
                </Link>
              </div>
            </div>

            <div className="transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="p-6 flex flex-col flex-grow">
                <div className="relative w-full mb-4" style={{ aspectRatio: '2/1' }}>
                  <Image
                    className="rounded-lg"
                    src="/images/pwallah.jpg"
                    alt="Physics Wallah - Most Affordable Online JEE Coaching Platform for IIT JEE aspirants"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Physics Wallah</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm flex-grow">
                  The most affordable learning platform that cares about you
                </p>
                <Link href="/more-platforms/physicswallah" aria-label="Visit Physics Wallah for affordable learning" className="mt-auto">
                  <button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg w-full">
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Platform
                    </span>
                  </button>
                </Link>
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

export default MorePlatformsComponent;
