import Breadcrumbs from "@/components/common/Breadcrumbs";
import UnitConverter from "@/components/common/UnitConverter";
import RelatedConverters from "@/components/common/RelatedConverters";
import ScrollToTopButton from "@/components/utils/ScrollToTopButton";
import { ogImageMeta } from '@/lib/og-metadata';

const pageOg = ogImageMeta({
  title: 'Chemistry Unit Converter',
  subtitle: 'High-precision scientific conversions',
  theme: 'chemistry',
  alt: 'Chemistry Unit Converter for JEE',
});

export const metadata = {
  title: 'Chemistry Unit Converter | JEE Challenger',
  description: 'Instantly convert chemistry units for mass, temperature, pressure, volume, and molarity.',
  alternates: { canonical: '/materials/chemistry/unit-converter' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Chemistry Unit Converter | JEE Challenger',
    description: 'Instantly convert chemistry units for mass, temperature, pressure, volume, and molarity.',
    url: '/materials/chemistry/unit-converter',
    siteName: 'JEE Challenger',
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chemistry Unit Converter | JEE Challenger',
    description: 'Instantly convert chemistry units for mass, temperature, pressure, volume, and molarity.',
    images: pageOg.twitterImages,
  },
};

export default function ChemistryUnitConverterPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-teal-700 dark:from-green-900 dark:to-teal-900 pb-24 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'Study Materials', href: '/materials' },
            { label: 'Chemistry', href: '/materials/chemistry' },
            { label: 'Unit Converter', href: '/materials/chemistry/unit-converter' },
          ]} 
          hasBanner={true}
          className="pb-12"
        />
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              Chemistry Unit Converter
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md animate-fade-in-delay text-emerald-100">
              Instantly convert fundamental and derived scientific units for your JEE calculations.
            </p>
          </div>
        </div>
        
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-green-500/20 blur-3xl mix-blend-overlay"></div>
      </div>

      {/* Main Content (Negative margin to pull it up into the banner) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="mb-16">
          <UnitConverter subject="chemistry" />
          <RelatedConverters currentSubject="chemistry" />
        </div>
      </div>

      <ScrollToTopButton 
        gradientColors="from-green-600 to-teal-600"
        hoverColors="hover:from-green-700 hover:to-teal-700"
      />
    </div>
  );
}
