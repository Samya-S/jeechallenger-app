import ApniKakshaComponent from './ApniKakshaComponent'
import { ogImageMeta } from '@/lib/og-metadata'

const pageOg = ogImageMeta({
  title: 'Apni Kaksha',
  subtitle: 'Free high-quality educational content on YouTube',
  theme: 'platform',
  alt: 'Apni Kaksha - Free Educational YouTube Channel',
})

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
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apni Kaksha - Free JEE YouTube Channel | JEE Challenger',
    description: 'Apni Kaksha is a YouTube channel that provides high-quality educational content for free. It covers a wide range of subjects and is a great resource for students.',
    images: pageOg.twitterImages,
  },
}

const ApniKakshaPage = () => {
  return (
    <ApniKakshaComponent />
  )
}

export default ApniKakshaPage
