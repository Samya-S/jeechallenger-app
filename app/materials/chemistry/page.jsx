import ChemistryComponent from './ChemistryComponent'
import StructuredData from '@/components/common/StructuredData'
import { chemistryFAQs } from '@/lib/faq-data'

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
    images: [
      {
        url: '/images/chemistry.jpg',
        width: 1200,
        height: 630,
        alt: 'Chemistry Study Materials for JEE',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chemistry Study Materials - JEE Challenger",
    description: "Chemistry study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    images: ['/images/chemistry.jpg'],
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
            { name: "Study Materials", path: "/materials/chemistry" },
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
