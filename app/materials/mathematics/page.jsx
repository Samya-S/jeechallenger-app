import MathematicsComponent from './MathematicsComponent'
import StructuredData from '@/components/common/StructuredData'
import { mathematicsFAQs } from '@/lib/faq-data'

export const metadata = {
  title: "JEE Mathematics Study Materials - Free Books, Notes & PYQs | Download PDFs",
  description: "Download Free JEE Mathematics PDFs: 500+ Solved Problems, Calculus, Algebra, Trigonometry, Coordinate Geometry. Best Books by Cengage, Arihant & RD Sharma. Start Scoring 100/100 in JEE Maths Today!",
  alternates: {
    canonical: '/materials/mathematics',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Mathematics Study Materials - JEE Challenger",
    description: "Mathematics study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    url: '/materials/mathematics',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/maths.jpg',
        width: 1200,
        height: 630,
        alt: 'Mathematics Study Materials for JEE',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mathematics Study Materials - JEE Challenger",
    description: "Mathematics study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    images: ['/images/maths.jpg'],
  },
};

const MathematicsPage = () => {
  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData type="faq" data={mathematicsFAQs} />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "Study Materials", path: "/materials/mathematics" },
            { name: "Mathematics", path: "/materials/mathematics" }
          ]
        }} 
      />
      <StructuredData 
        type="educationalOccupationalCredential" 
        data={{
          name: "JEE Mathematics Study Materials",
          description: "Complete Mathematics study materials for JEE Main and Advanced including RD Sharma, Cengage, and NCERT",
          subject: "Mathematics",
          chapters: 29
        }} 
      />
      
      <MathematicsComponent />
    </>
  )
}

export default MathematicsPage
