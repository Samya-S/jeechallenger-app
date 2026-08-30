import PhysicsComponent from './PhysicsComponent'
import StructuredData from '@/components/common/StructuredData'
import { physicsFAQs } from '@/data/faq-data'
import { ogImageMeta } from '@/utils/og-metadata'

const pageOg = ogImageMeta({
  title: 'Physics Resources',
  subtitle: 'Interactive tools, formula sheets & PYQs for JEE Main & Advanced',
  theme: 'physics',
  alt: 'Physics Resources for JEE',
})

export const metadata = {
  title: "Physics Resources | JEE Challenger",
  description: "Master JEE Physics with our premium study materials. Access interactive study tools (like Unit Converters), comprehensive formula sheets, previous year questions (PYQs), and more for JEE Main & Advanced.",
  alternates: {
    canonical: '/physics',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Physics Resources | JEE Challenger",
    description: "Master JEE Physics with our premium study materials. Access interactive study tools (like Unit Converters), comprehensive formula sheets, previous year questions (PYQs), and more for JEE Main & Advanced.",
    url: '/physics',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Physics Resources | JEE Challenger",
    description: "Master JEE Physics with our premium study materials. Access interactive study tools (like Unit Converters), comprehensive formula sheets, previous year questions (PYQs), and more for JEE Main & Advanced.",
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
        type="learningResource" 
        data={{
          name: "JEE Physics Resources",
          description: "Comprehensive Physics resources for JEE Main and Advanced including interactive study tools, formula sheets, and PYQs",
          subject: "Physics"
        }} 
      />

      <PhysicsComponent />
    </>
  )
}

export default PhysicsPage
