import PhysicsComponent from './PhysicsComponent'
import StructuredData from '@/components/common/StructuredData'
import { physicsFAQs } from '@/data/faq-data'
import { ogImageMeta } from '@/utils/og-metadata'

const pageOg = ogImageMeta({
  title: 'Physics Resources',
  subtitle: 'Books, notes & resources for JEE Main & Advanced',
  theme: 'physics',
  alt: 'Physics Resources for JEE',
})

export const metadata = {
  title: "JEE Physics Resources - Free Books, Notes & Solutions | Download PDFs",
  description: "Free JEE Physics Resources: Mechanics, Electromagnetism, Thermodynamics, Modern Physics. Download HC Verma Solutions, DC Pandey PDFs, 1000+ Solved Problems & Chapter-wise Notes. Master Physics for JEE Main & Advanced!",
  alternates: {
    canonical: '/physics',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Physics Resources - JEE Challenger",
    description: "Physics resources for JEE Main and JEE Advanced, including books, notes, and other resources.",
    url: '/physics',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Physics Resources - JEE Challenger",
    description: "Physics resources for JEE Main and JEE Advanced, including books, notes, and other resources.",
    images: pageOg.twitterImages,
  },
};

const PhysicsPage = () => {
  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData type="faq" data={physicsFAQs} />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: "Physics", path: "/physics" }
          ]
        }} 
      />
      <StructuredData 
        type="educationalOccupationalCredential" 
        data={{
          name: "JEE Physics Resources",
          description: "Complete Physics resources for JEE Main and Advanced preparation including HC Verma, DC Pandey, and NCERT solutions",
          subject: "Physics",
          chapters: 29
        }} 
      />
      
      <PhysicsComponent />
    </>
  )
}

export default PhysicsPage
