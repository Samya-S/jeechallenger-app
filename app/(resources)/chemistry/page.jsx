import ChemistryComponent from './ChemistryComponent'
import StructuredData from '@/components/common/StructuredData'
import { chemistryFAQs } from '@/data/faq-data'
import { ogImageMeta } from '@/utils/og-metadata'

const pageOg = ogImageMeta({
  title: 'Chemistry Resources',
  subtitle: 'Interactive tools, formula sheets & PYQs for JEE Main & Advanced',
  theme: 'chemistry',
  alt: 'Chemistry Resources for JEE',
})

export const metadata = {
  title: "Chemistry Resources | JEE Challenger",
  description: "Master JEE Chemistry with our premium study materials. Access interactive study tools (like the Interactive Periodic Table and Unit Converters), comprehensive formula sheets, previous year questions (PYQs), and more for JEE Main & Advanced.",
  alternates: {
    canonical: '/chemistry',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Chemistry Resources | JEE Challenger",
    description: "Master JEE Chemistry with our premium study materials. Access interactive study tools (like the Interactive Periodic Table and Unit Converters), comprehensive formula sheets, previous year questions (PYQs), and more for JEE Main & Advanced.",
    url: '/chemistry',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chemistry Resources | JEE Challenger",
    description: "Master JEE Chemistry with our premium study materials. Access interactive study tools (like the Interactive Periodic Table and Unit Converters), comprehensive formula sheets, previous year questions (PYQs), and more for JEE Main & Advanced.",
    images: pageOg.twitterImages,
  },
};

const ChemistryPage = () => {
  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData type="faq" data={chemistryFAQs} />
      <StructuredData
        type="breadcrumb"
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: "Chemistry", path: "/chemistry" }
          ]
        }}
      />
      <StructuredData 
        type="learningResource" 
        data={{
          name: "JEE Chemistry Resources",
          description: "Comprehensive Chemistry resources for JEE Main and Advanced including interactive study tools, formula sheets, and PYQs",
          subject: "Chemistry"
        }} 
      />

      <ChemistryComponent />
    </>
  )
}

export default ChemistryPage
