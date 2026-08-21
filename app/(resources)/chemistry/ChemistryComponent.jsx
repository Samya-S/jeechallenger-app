
import PYQandMoreSection from '@/components/resources/PYQandMoreSection';
import { BookOpen, Target, Sparkles, ChevronRight, Calculator, Table } from "lucide-react";
import FormulaSheets from '@/components/resources/FormulaSheets';
import ChemistryFormulaData from '@/data/resources/chemistry-formula-data';
import TelegramPost from '@/components/ui/TelegramPost';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';

const ChemistryComponent = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-teal-700 dark:from-green-900 dark:to-teal-900 pb-20 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'Resources', href: '/resources' },
            { label: 'Chemistry', href: '/chemistry' },
          ]}
          hasBanner={true}
          className="pb-12"
        />
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
        {/* Formula Sheets */}
        <FormulaSheets formulaData={ChemistryFormulaData} colorTheme="green" />

        {/* Interactive Study Tools */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Study Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Visualize periodic trends, calculate unit conversions, and explore inorganic data with premium interactive widgets designed for JEE prep.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-teal-500 mx-auto mt-6 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unit Converter Banner */}
            <Link
              href="/chemistry/unit-converter"
              className="group block relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-green-700 to-teal-700 dark:from-green-900 dark:to-teal-900 p-8 transition-transform duration-300 hover:scale-[1.02] shadow-xl hover:shadow-2xl"
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-700 ease-out blur-3xl"></div>
              <div className="relative z-10 flex items-center gap-4 h-full">
                <div className="bg-white/20 p-3.5 rounded-2xl backdrop-blur-sm shrink-0 group-hover:bg-white/35 transition-colors duration-300">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1">Interactive Unit Converter</h3>
                  <p className="text-green-100/90 text-sm leading-relaxed">Instantly convert Molarity, Volume, Pressure, and other variables for physical chemistry calculations.</p>
                </div>
              </div>
            </Link>

            {/* Periodic Table Banner */}
            <Link
              href="/chemistry/periodic-table"
              className="group block relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 dark:from-teal-900 dark:to-green-900 p-8 transition-transform duration-300 hover:scale-[1.02] shadow-xl hover:shadow-2xl"
            >
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-700 ease-out blur-3xl"></div>
              <div className="relative z-10 flex items-center gap-4 h-full">
                <div className="bg-white/20 p-3.5 rounded-2xl backdrop-blur-sm shrink-0 group-hover:bg-white/35 transition-colors duration-300">
                  <Table className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-1">Periodic Table Explorer</h3>
                  <p className="text-green-100/90 text-sm leading-relaxed">Explore trend heatmaps, orbital blocks, elements attributes, and custom inorganic chemistry study notes.</p>
                </div>
              </div>
            </Link>
          </div>
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
