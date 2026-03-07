"use client";
import dynamic from 'next/dynamic';
import MathematicsResources from './MathematicsResources';
import CategorySection from '../CategorySection';
import PYQandMoreSection from '../PYQandMoreSection';

// Lazy load client-only components
const TelegramPost = dynamic(() => import('@/components/utils/TelegramPost'), {
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <div className="animate-pulse space-y-4 w-full max-w-4xl px-4">
        <div className="h-8 bg-purple-200 dark:bg-purple-800 rounded w-1/3 mx-auto"></div>
        <div className="h-32 bg-purple-100 dark:bg-purple-900/30 rounded-xl"></div>
      </div>
    </div>
  )
});
const ScrollToTopButton = dynamic(() => import('@/components/utils/ScrollToTopButton'), {
  ssr: false
});

const MathematicsComponent = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-pink-700 dark:from-purple-900 dark:to-pink-900 py-20">
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              Mathematics
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto drop-shadow-md animate-fade-in-delay">
              Master calculus, algebra, and geometry with comprehensive mathematical resources
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto">
        {/* Resources Grid */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Mathematics Resources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From basic concepts to advanced problem-solving techniques, access the best mathematics materials for JEE
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {MathematicsResources.map((resource, index) => (
            <CategorySection
              key={index}
              category={resource.category}
              backgroundColor={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
              items={resource.items}
              colorTheme="purple"
            />
          ))}
        </div>

        {/* Additional Sections */}
        <PYQandMoreSection />

        {/* Telegram Section */}
        <div className="py-8">
          <TelegramPost url="jeechallengerindex/6" themeGradient="from-purple-600 to-pink-600" />
        </div>
      </div>

      {/* Floating Action Button */}
      <ScrollToTopButton 
        gradientColors="from-purple-600 to-pink-600"
        hoverColors="hover:from-purple-700 hover:to-pink-700"
      />
    </div>
  );
};

export default MathematicsComponent;
