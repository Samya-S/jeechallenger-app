import ChemistryComponent from './ChemistryComponent'
import StructuredData from '@/components/common/StructuredData'
import { chemistryFAQs } from '@/data/faq-data'
import { ogImageMeta } from '@/lib/og-metadata'

const pageOg = ogImageMeta({
  title: 'Chemistry Study Materials',
  subtitle: 'Books, notes & resources for JEE Main & Advanced',
  theme: 'chemistry',
  alt: 'Chemistry Study Materials for JEE',
})

export const metadata = {
  title: "JEE Chemistry Study Materials - Free Books, Notes & Tricks | Download PDFs",
  description: "Complete JEE Chemistry Study Materials: Organic, Inorganic & Physical Chemistry. Download Free NCERT Solutions, OP Tandon PDFs, Reaction Mechanisms, Named Reactions & 500+ Solved Examples. Ace JEE Chemistry!",
  alternates: {
    canonical: '/materials/chemistry',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Chemistry Study Materials - JEE Challenger",
    description: "Chemistry study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    url: '/materials/chemistry',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chemistry Study Materials - JEE Challenger",
    description: "Chemistry study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
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
            { name: "Study Materials", path: "/materials" },
            { name: "Chemistry", path: "/materials/chemistry" }
          ]
        }} 
      />
      <StructuredData 
        type="educationalOccupationalCredential" 
        data={{
          name: "JEE Chemistry Study Materials",
          description: "Complete Chemistry study materials for JEE Main and Advanced including NCERT, OP Tandon, and MS Chouhan",
          subject: "Chemistry",
          chapters: 30
        }} 
      />
      
      <ChemistryComponent />
    </>
  )
}

export default ChemistryPage
