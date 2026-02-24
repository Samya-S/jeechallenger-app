import JeeMainComponent from './JeeMainComponent'
import StructuredData from '@/components/common/StructuredData'

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
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'JEE Main Official Links and Previous Year Papers',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JEE Main Official Links & PYQs - JEE Challenger',
    description: 'Official links for JEE Main and previous year question papers.',
    images: ['/images/jcicon.jpg'],
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
            { name: "Official Links", path: "/official-links/jee-main" },
            { name: "JEE Main", path: "/official-links/jee-main" }
          ]
        }} 
      />
      
      <JeeMainComponent />
    </>
  )
}

export default JeeMainPage
