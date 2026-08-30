import MathematicsComponent from './MathematicsComponent'
import StructuredData from '@/components/common/StructuredData'
import { mathematicsFAQs } from '@/data/faq-data'
import { ogImageMeta } from '@/utils/og-metadata'

const pageOg = ogImageMeta({
  title: 'Mathematics Resources',
  subtitle: 'Interactive tools, formula sheets & PYQs for JEE Main & Advanced',
  theme: 'mathematics',
  alt: 'Mathematics Resources for JEE',
})

export const metadata = {
  title: "Mathematics Resources | JEE Challenger",
  description: "Master JEE Mathematics with our premium study materials. Access interactive study tools (like Unit Converters), comprehensive formula sheets, previous year questions (PYQs), and more for JEE Main & Advanced.",
  alternates: {
    canonical: '/mathematics',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Mathematics Resources | JEE Challenger",
    description: "Master JEE Mathematics with our premium study materials. Access interactive study tools (like Unit Converters), comprehensive formula sheets, previous year questions (PYQs), and more for JEE Main & Advanced.",
    url: '/mathematics',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mathematics Resources | JEE Challenger",
    description: "Master JEE Mathematics with our premium study materials. Access interactive study tools (like Unit Converters), comprehensive formula sheets, previous year questions (PYQs), and more for JEE Main & Advanced.",
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
        type="learningResource" 
        data={{
          name: "JEE Mathematics Resources",
          description: "Comprehensive Mathematics resources for JEE Main and Advanced including interactive study tools, formula sheets, and PYQs",
          subject: "Mathematics"
        }} 
      />

      <MathematicsComponent />
    </>
  )
}

export default MathematicsPage
