import Breadcrumbs from "@/components/common/Breadcrumbs";
import PeriodicTableExplorer from "@/app/materials/chemistry/periodic-table/PeriodicTableExplorer";
import RelatedConverters from "@/components/common/RelatedConverters";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import { ogImageMeta } from '@/lib/og-metadata';

const pageOg = ogImageMeta({
  title: 'Periodic Table Explorer',
  subtitle: 'Interactive properties & high yield facts',
  theme: 'chemistry',
  alt: 'Interactive Periodic Table for JEE',
});

export const metadata = {
  title: 'Interactive Periodic Table Explorer | JEE Challenger',
  description: 'Interactive periodic table explorer for JEE chemistry with properties, electronegativity, ionization energy heatmaps, s/p/d/f blocks, and high-yield study notes.',
  alternates: { canonical: '/materials/chemistry/periodic-table' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Interactive Periodic Table Explorer | JEE Challenger',
    description: 'Interactive periodic table explorer for JEE chemistry with properties, electronegativity, ionization energy heatmaps, s/p/d/f blocks, and high-yield study notes.',
    url: '/materials/chemistry/periodic-table',
    siteName: 'JEE Challenger',
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interactive Periodic Table Explorer | JEE Challenger',
    description: 'Interactive periodic table explorer for JEE chemistry with properties, electronegativity, ionization energy heatmaps, s/p/d/f blocks, and high-yield study notes.',
    images: pageOg.twitterImages,
  },
};

export default function PeriodicTablePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-teal-700 dark:from-green-900 dark:to-teal-900 pb-24 pt-4">
        <Breadcrumbs
          crumbs={[
            { label: 'Study Materials', href: '/materials' },
            { label: 'Chemistry', href: '/materials/chemistry' },
            { label: 'Periodic Table', href: '/materials/chemistry/periodic-table' },
          ]}
          hasBanner={true}
          className="pb-12"
        />
        <div className="flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-fade-in">
              Periodic Table Explorer
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md animate-fade-in-delay text-green-100">
              Interactive block highlighting, trends visualizer heatmaps, and high-yield JEE notes for all 118 elements.
            </p>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-teal-400/20 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-green-500/20 blur-3xl mix-blend-overlay"></div>
      </div>

      {/* Main Content (Negative margin to pull it up into the banner) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <PeriodicTableExplorer />
      </div>

      <ScrollToTopButton
        gradientColors="from-green-600 to-teal-600"
        hoverColors="hover:from-green-700 hover:to-teal-700"
      />
    </div>
  );
}
