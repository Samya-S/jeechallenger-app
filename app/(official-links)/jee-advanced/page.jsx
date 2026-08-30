import JeeAdvancedComponent from './JeeAdvancedComponent'
import StructuredData from '@/components/common/StructuredData'
import { ogImageMeta } from '@/utils/og-metadata'

const pageOg = ogImageMeta({
  title: 'JEE Advanced Official Links & PYQs',
  subtitle: 'Official papers, solutions & resources from IITs',
  theme: 'jee-advanced',
  alt: 'JEE Advanced Official Links and Previous Year Papers',
})

export const metadata = {
  title: 'JEE Advanced Official Links & PYQs | JEE Challenger',
  description: 'Download official JEE Advanced previous year question papers, solutions, and answer keys. Direct links to the official resources.',
  alternates: {
    canonical: '/jee-advanced',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'JEE Advanced Official Links & PYQs | JEE Challenger',
    description: 'Download official JEE Advanced previous year question papers, solutions, and answer keys. Direct links to the official resources.',
    url: '/jee-advanced',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JEE Advanced Official Links & PYQs | JEE Challenger',
    description: 'Download official JEE Advanced previous year question papers, solutions, and answer keys. Direct links to the official resources.',
    images: pageOg.twitterImages,
  },
}

const JeeAdvancedPage = () => {
  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "JEE Advanced", path: "/jee-advanced" }
          ]
        }} 
      />
      
      <JeeAdvancedComponent />
    </>
  )
}

export default JeeAdvancedPage
