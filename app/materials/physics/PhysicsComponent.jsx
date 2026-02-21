"use client";
import PhysicsResources from './PhysicsResources';
import CategorySection from '../CategorySection';
import PYQandMoreSection from '../PYQandMoreSection';
import TelegramPost from '@/components/utils/TelegramPost';
import ScrollToTopButton from '@/components/utils/ScrollToTopButton';

const PhysicsComponent = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-blue-900 dark:to-purple-900 py-20">
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              Physics
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto drop-shadow-md animate-fade-in-delay">
              Master the fundamentals of mechanics, electricity, and modern physics with comprehensive study materials
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
              Comprehensive Physics Resources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From foundational concepts to advanced problem-solving, access the best physics materials for JEE preparation
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {PhysicsResources.map((resource, index) => (
            <CategorySection
              key={index}
              category={resource.category}
              backgroundColor={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
              items={resource.items}
              colorTheme="blue"
            />
          ))}
        </div>

        {/* Additional Sections */}
        <PYQandMoreSection />

        {/* Telegram Section */}
        <div className="py-8">
          <TelegramPost url="jeechallengerindex/4" themeGradient="from-blue-600 to-purple-600" />
        </div>
      </div>

      {/* Floating Action Button */}
      <ScrollToTopButton 
        gradientColors="from-blue-600 to-purple-600"
        hoverColors="hover:from-blue-700 hover:to-purple-700"
      />
    </div>
  );
};

export default PhysicsComponent;
