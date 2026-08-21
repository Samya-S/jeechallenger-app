import ChemistryComponent from './ChemistryComponent'
import StructuredData from '@/components/common/StructuredData'
import { chemistryFAQs } from '@/data/faq-data'
import { ogImageMeta } from '@/utils/og-metadata'

const pageOg = ogImageMeta({
  title: 'Chemistry Resources',
  subtitle: 'Books, notes & resources for JEE Main & Advanced',
  theme: 'chemistry',
  alt: 'Chemistry Resources for JEE',
})

export const metadata = {
  title: "JEE Chemistry Resources - Free Books, Notes & Tricks | Download PDFs",
  description: "Complete JEE Chemistry Resources: Organic, Inorganic & Physical Chemistry. Download Free NCERT Solutions, OP Tandon PDFs, Reaction Mechanisms, Named Reactions & 500+ Solved Examples. Ace JEE Chemistry!",
  alternates: {
    canonical: '/chemistry',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Chemistry Resources - JEE Challenger",
    description: "Chemistry resources for JEE Main and JEE Advanced, including books, notes, and other resources.",
    url: '/chemistry',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chemistry Resources - JEE Challenger",
    description: "Chemistry resources for JEE Main and JEE Advanced, including books, notes, and other resources.",
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
        type="educationalOccupationalCredential" 
        data={{
          name: "JEE Chemistry Resources",
          description: "Complete Chemistry resources for JEE Main and Advanced including NCERT, OP Tandon, and MS Chouhan",
          subject: "Chemistry",
          chapters: 30
        }} 
      />
      
      <ChemistryComponent />
    </>
  )
}

export default ChemistryPage
