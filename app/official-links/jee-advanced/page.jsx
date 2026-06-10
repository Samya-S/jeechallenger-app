import JeeAdvancedComponent from './JeeAdvancedComponent'
import StructuredData from '@/components/common/StructuredData'
import { ogImageMeta } from '@/lib/og-metadata'

const pageOg = ogImageMeta({
  title: 'JEE Advanced Official Links & PYQs',
  subtitle: 'Official papers, solutions & resources from IITs',
  theme: 'jee-advanced',
  alt: 'JEE Advanced Official Links and Previous Year Papers',
})

export const metadata = {
  title: 'JEE Advanced Official Papers - Download Solutions & Question Papers',
  description: 'Download Official JEE Advanced Papers, Detailed Solutions & Answer Keys from IITs. Previous year papers, cutoff analysis, admission information. Direct links to authentic JEE Advanced resources. Your IIT dream starts here!',
  alternates: {
    canonical: '/official-links/jee-advanced',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'JEE Advanced Official Links & PYQs - JEE Challenger',
    description: 'Official links for JEE Advanced and previous year question papers.',
    url: '/official-links/jee-advanced',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JEE Advanced Official Links & PYQs - JEE Challenger',
    description: 'Official links for JEE Advanced and previous year question papers.',
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
            { name: "JEE Advanced", path: "/official-links/jee-advanced" }
          ]
        }} 
      />
      
      <JeeAdvancedComponent />
    </>
  )
}

export default JeeAdvancedPage
