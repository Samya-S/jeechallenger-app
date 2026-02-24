import ApniKakshaComponent from './ApniKakshaComponent'

export const metadata = {
  title: 'Apni Kaksha | JEE Challenger',
  description: 'Apni Kaksha is a YouTube channel that provides high-quality educational content for free. It covers a wide range of subjects and is a great resource for students.',
  alternates: {
    canonical: '/more-platforms/apnikaksha',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Apni Kaksha - Free JEE YouTube Channel | JEE Challenger',
    description: 'Apni Kaksha is a YouTube channel that provides high-quality educational content for free. It covers a wide range of subjects and is a great resource for students.',
    url: '/more-platforms/apnikaksha',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/apnikaksha.jpg',
        width: 1200,
        height: 630,
        alt: 'Apni Kaksha - Free Educational YouTube Channel',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apni Kaksha - Free JEE YouTube Channel | JEE Challenger',
    description: 'Apni Kaksha is a YouTube channel that provides high-quality educational content for free. It covers a wide range of subjects and is a great resource for students.',
    images: ['/images/apnikaksha.jpg'],
  },
}

const ApniKakshaPage = () => {
  return (
    <ApniKakshaComponent />
  )
}

export default ApniKakshaPage
