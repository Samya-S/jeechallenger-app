import MathematicsComponent from './MathematicsComponent'
import StructuredData from '@/components/common/StructuredData'
import { mathematicsFAQs } from '@/data/faq-data'
import { ogImageMeta } from '@/lib/og-metadata'

const pageOg = ogImageMeta({
  title: 'Mathematics Study Materials',
  subtitle: 'Books, notes & resources for JEE Main & Advanced',
  theme: 'mathematics',
  alt: 'Mathematics Study Materials for JEE',
})

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
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mathematics Study Materials - JEE Challenger",
    description: "Mathematics study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    images: pageOg.twitterImages,
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
            { name: "Study Materials", path: "/materials" },
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
