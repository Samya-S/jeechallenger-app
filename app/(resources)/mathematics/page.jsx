import MathematicsComponent from './MathematicsComponent'
import StructuredData from '@/components/common/StructuredData'
import { mathematicsFAQs } from '@/data/faq-data'
import { ogImageMeta } from '@/utils/og-metadata'

const pageOg = ogImageMeta({
  title: 'Mathematics Resources',
  subtitle: 'Books, notes & resources for JEE Main & Advanced',
  theme: 'mathematics',
  alt: 'Mathematics Resources for JEE',
})

export const metadata = {
  title: "JEE Mathematics Resources - Free Books, Notes & PYQs | Download PDFs",
  description: "Download Free JEE Mathematics PDFs: 500+ Solved Problems, Calculus, Algebra, Trigonometry, Coordinate Geometry. Best Books by Cengage, Arihant & RD Sharma. Start Scoring 100/100 in JEE Maths Today!",
  alternates: {
    canonical: '/mathematics',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Mathematics Resources - JEE Challenger",
    description: "Mathematics resources for JEE Main and JEE Advanced, including books, notes, and other resources.",
    url: '/mathematics',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mathematics Resources - JEE Challenger",
    description: "Mathematics resources for JEE Main and JEE Advanced, including books, notes, and other resources.",
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
            { name: "Resources", path: "/resources" },
            { name: "Mathematics", path: "/mathematics" }
          ]
        }} 
      />
      <StructuredData 
        type="educationalOccupationalCredential" 
        data={{
          name: "JEE Mathematics Resources",
          description: "Complete Mathematics resources for JEE Main and Advanced including RD Sharma, Cengage, and NCERT",
          subject: "Mathematics",
          chapters: 29
        }} 
      />
      
      <MathematicsComponent />
    </>
  )
}

export default MathematicsPage
