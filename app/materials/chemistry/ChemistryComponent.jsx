"use client";
import { useState, useEffect } from 'react';
import ChemistryResources from './ChemistryResources';
import CategorySection from '../CategorySection';
import PYQandMoreSection from '../PYQandMoreSection';
import TelegramPost from '@/components/utils/TelegramPost';
import ScrollToTopButton from '@/components/utils/ScrollToTopButton';

const ChemistryComponent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading Chemistry Resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-teal-700 dark:from-green-900 dark:to-teal-900 py-20">
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              Chemistry
            </h1>
            <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto drop-shadow-md animate-fade-in-delay">
              Explore physical, organic, and inorganic chemistry with expert-curated study materials
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
              Complete Chemistry Resources
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              From molecular structures to chemical reactions, access comprehensive chemistry materials for JEE success
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
          </div>

          {ChemistryResources.map((resource, index) => (
            <CategorySection
              key={index}
              category={resource.category}
              backgroundColor={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
              items={resource.items}
              colorTheme="green"
            />
          ))}
        </div>

        {/* Additional Sections */}
        <PYQandMoreSection />

        {/* Telegram Section */}
        <div className="py-8">
          <TelegramPost url="jeechallengerindex/5" themeGradient="from-green-600 to-teal-600" />
        </div>
      </div>

      {/* Floating Action Button */}
      <ScrollToTopButton 
        gradientColors="from-green-600 to-teal-600"
        hoverColors="hover:from-green-700 hover:to-teal-700"
      />
    </div>
  );
};

export default ChemistryComponent;
