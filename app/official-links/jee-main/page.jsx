import JeeMainComponent from './JeeMainComponent'

export const metadata = {
  title: 'JEE Main | JEE Challenger',
  description: 'Official links for JEE Main and previous year question papers.',
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
    <JeeMainComponent />
  )
}

export default JeeMainPage
