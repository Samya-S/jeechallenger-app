import JeeMainComponent from './JeeMainComponent'
import StructuredData from '@/components/common/StructuredData'
import { ogImageMeta } from '@/utils/og-metadata'

const pageOg = ogImageMeta({
  title: 'JEE Main Official Links & PYQs',
  subtitle: 'Official papers, answer keys & notifications from NTA',
  theme: 'jee-main',
  alt: 'JEE Main Official Links and Previous Year Papers',
})

export const metadata = {
  title: 'JEE Main Official Links & PYQs | JEE Challenger',
  description: 'Download official JEE Main previous year question papers and final answer keys from NTA. Direct links for all sessions.',
  alternates: {
    canonical: '/jee-main',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'JEE Main Official Links & PYQs | JEE Challenger',
    description: 'Download official JEE Main previous year question papers and final answer keys from NTA. Direct links for all sessions.',
    url: '/jee-main',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JEE Main Official Links & PYQs | JEE Challenger',
    description: 'Download official JEE Main previous year question papers and final answer keys from NTA. Direct links for all sessions.',
    images: pageOg.twitterImages,
  },
}

const JeeMainPage = () => {
  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "JEE Main", path: "/jee-main" }
          ]
        }} 
      />
      
      <JeeMainComponent />
    </>
  )
}

export default JeeMainPage
