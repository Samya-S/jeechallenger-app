
import PYQandMoreSection from '@/components/materials/PYQandMoreSection';
import FormulaSheets from '@/components/materials/FormulaSheets';
import MathematicsFormulaData from '@/data/materials/mathematics-formula-data';
import TelegramPost from '@/components/ui/TelegramPost';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';
import { Calculator } from 'lucide-react';

const MathematicsComponent = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-pink-700 dark:from-purple-900 dark:to-pink-900 pb-20 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'Study Materials', href: '/materials' },
            { label: 'Mathematics', href: '/materials/mathematics' },
          ]} 
          hasBanner={true}
          className="pb-12"
        />
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
        {/* Formula Sheets */}
        <FormulaSheets formulaData={MathematicsFormulaData} colorTheme="purple" />

        {/* Interactive Study Tools */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Study Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate unit conversions and explore mathematical properties with premium interactive widgets designed for JEE prep.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
          </div>

          <Link 
            href="/materials/mathematics/unit-converter"
            className="group block relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-purple-700 to-pink-700 dark:from-purple-900 dark:to-pink-900 p-8 sm:p-10 transition-transform duration-300 hover:scale-[1.02] shadow-xl hover:shadow-2xl"
          >
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-700 ease-out blur-3xl"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                  <Calculator className="w-10 h-10 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Interactive Unit Converter</h3>
                  <p className="text-purple-100 text-lg">Instantly convert Length, Area, Volume, and Time for your mathematical calculations.</p>
                </div>
              </div>
              <div className="shrink-0 bg-white text-purple-600 px-6 py-3 rounded-xl font-bold group-hover:bg-purple-50 transition-colors shadow-lg">
                Try it now &rarr;
              </div>
            </div>
          </Link>
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
