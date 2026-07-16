import Breadcrumbs from "@/components/common/Breadcrumbs";
import UnitConverter from "@/components/common/UnitConverter";
import RelatedConverters from "@/components/common/RelatedConverters";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { ogImageMeta } from '@/lib/og-metadata';

const pageOg = ogImageMeta({
  title: 'Physics Unit Converter',
  subtitle: 'High-precision scientific conversions',
  theme: 'physics',
  alt: 'Physics Unit Converter for JEE',
});

export const metadata = {
  title: 'Physics Unit Converter | JEE Challenger',
  description: 'Instantly convert physics units for length, mass, time, temperature, and more.',
  alternates: { canonical: '/materials/physics/unit-converter' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Physics Unit Converter | JEE Challenger',
    description: 'Instantly convert physics units for length, mass, time, temperature, and more.',
    url: '/materials/physics/unit-converter',
    siteName: 'JEE Challenger',
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Physics Unit Converter | JEE Challenger',
    description: 'Instantly convert physics units for length, mass, time, temperature, and more.',
    images: pageOg.twitterImages,
  },
};

export default function UnitConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-blue-900 dark:to-purple-900 pb-24 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'Study Materials', href: '/materials' },
            { label: 'Physics', href: '/materials/physics' },
            { label: 'Unit Converter', href: '/materials/physics/unit-converter' },
          ]} 
          hasBanner={true}
          className="pb-12"
        />
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              Physics Unit Converter
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md animate-fade-in-delay text-blue-100">
              Instantly convert fundamental and derived scientific units for your JEE calculations.
            </p>
          </div>
        </div>
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl mix-blend-overlay"></div>
      </div>

      {/* Main Content (Negative margin to pull it up into the banner) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <UnitConverter subject="physics" />
        <RelatedConverters currentSubject="physics" />
      </div>

      <ScrollToTopButton 
        gradientColors="from-blue-600 to-purple-600"
        hoverColors="hover:from-blue-700 hover:to-purple-700"
      />
    </div>
  );
}
