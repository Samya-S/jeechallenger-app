import JeeAdvancedComponent from './JeeAdvancedComponent'

export const metadata = {
  title: 'JEE Advanced | JEE Challenger',
  description: 'Official links for JEE Advanced and previous year question papers.',
  openGraph: {
    title: 'JEE Advanced Official Links & PYQs - JEE Challenger',
    description: 'Official links for JEE Advanced and previous year question papers.',
    url: '/official-links/jee-advanced',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'JEE Advanced Official Links and Previous Year Papers',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JEE Advanced Official Links & PYQs - JEE Challenger',
    description: 'Official links for JEE Advanced and previous year question papers.',
    images: ['/images/jcicon.jpg'],
  },
}

const JeeAdvancedPage = () => {
  return (
    <JeeAdvancedComponent />
  )
}

export default JeeAdvancedPage
