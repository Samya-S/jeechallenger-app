import JeeMainComponent from './JeeMainComponent'
import StructuredData from '@/components/common/StructuredData'
import { ogImageMeta } from '@/lib/og-metadata'

const pageOg = ogImageMeta({
  title: 'JEE Main Official Links & PYQs',
  subtitle: 'Official papers, answer keys & notifications from NTA',
  theme: 'jee-main',
  alt: 'JEE Main Official Links and Previous Year Papers',
})

export const metadata = {
  title: 'JEE Main Official Papers - Download Answer Keys & Question Papers',
  description: 'Download Official JEE Main Papers, Answer Keys & Solutions from NTA. Previous year question papers, official notifications, exam pattern, cutoffs. Direct links to JEE Main resources. Prepare with authentic materials!',
  alternates: {
    canonical: '/official-links/jee-main',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'JEE Main Official Links & PYQs - JEE Challenger',
    description: 'Official links for JEE Main and previous year question papers.',
    url: '/official-links/jee-main',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JEE Main Official Links & PYQs - JEE Challenger',
    description: 'Official links for JEE Main and previous year question papers.',
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
            { name: "JEE Main", path: "/official-links/jee-main" }
          ]
        }} 
      />
      
      <JeeMainComponent />
    </>
  )
}

export default JeeMainPage
