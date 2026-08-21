import Breadcrumbs from "@/components/common/Breadcrumbs";
import UnitConverter from "@/components/common/UnitConverter";
import RelatedConverters from "@/components/common/RelatedConverters";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { ogImageMeta } from '@/utils/og-metadata';

const pageOg = ogImageMeta({
  title: 'Mathematics Unit Converter',
  subtitle: 'High-precision scientific conversions',
  theme: 'mathematics',
  alt: 'Mathematics Unit Converter for JEE',
});

export const metadata = {
  title: 'Mathematics Unit Converter | JEE Challenger',
  description: 'Instantly convert mathematics units for length, area, volume, and time.',
  alternates: { canonical: '/mathematics/unit-converter' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Mathematics Unit Converter | JEE Challenger',
    description: 'Instantly convert mathematics units for length, area, volume, and time.',
    url: '/mathematics/unit-converter',
    siteName: 'JEE Challenger',
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mathematics Unit Converter | JEE Challenger',
    description: 'Instantly convert mathematics units for length, area, volume, and time.',
    images: pageOg.twitterImages,
  },
};

export default function MathematicsUnitConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-pink-700 dark:from-purple-900 dark:to-pink-900 pb-24 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'Resources', href: '/resources' },
            { label: 'Mathematics', href: '/mathematics' },
            { label: 'Unit Converter', href: '/mathematics/unit-converter' },
          ]} 
          hasBanner={true}
          className="pb-12"
        />
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              Mathematics Unit Converter
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md animate-fade-in-delay text-purple-100">
              Instantly convert fundamental and derived scientific units for your JEE calculations.
            </p>
          </div>
        </div>
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-pink-400/20 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl mix-blend-overlay"></div>
      </div>

      {/* Main Content (Negative margin to pull it up into the banner) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <UnitConverter subject="mathematics" />
        <RelatedConverters currentSubject="mathematics" />
      </div>

      <ScrollToTopButton 
        gradientColors="from-purple-600 to-pink-600"
        hoverColors="hover:from-purple-700 hover:to-pink-700"
      />
    </div>
  );
}
