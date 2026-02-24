import PhysicsComponent from './PhysicsComponent'
import StructuredData from '@/components/common/StructuredData'
import { physicsFAQs } from '@/lib/faq-data'

export const metadata = {
  title: "JEE Physics Study Materials - Free Books, Notes & Solutions | Download PDFs",
  description: "Free JEE Physics Study Materials: Mechanics, Electromagnetism, Thermodynamics, Modern Physics. Download HC Verma Solutions, DC Pandey PDFs, 1000+ Solved Problems & Chapter-wise Notes. Master Physics for JEE Main & Advanced!",
  alternates: {
    canonical: '/materials/physics',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Physics Study Materials - JEE Challenger",
    description: "Physics study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    url: '/materials/physics',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/physics.jpg',
        width: 1200,
        height: 630,
        alt: 'Physics Study Materials for JEE',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Physics Study Materials - JEE Challenger",
    description: "Physics study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    images: ['/images/physics.jpg'],
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
            { name: "Study Materials", path: "/materials/physics" },
            { name: "Physics", path: "/materials/physics" }
          ]
        }} 
      />
      <StructuredData 
        type="educationalOccupationalCredential" 
        data={{
          name: "JEE Physics Study Materials",
          description: "Complete Physics study materials for JEE Main and Advanced preparation including HC Verma, DC Pandey, and NCERT solutions",
          subject: "Physics",
          chapters: 29
        }} 
      />
      
      <PhysicsComponent />
    </>
  )
}

export default PhysicsPage
