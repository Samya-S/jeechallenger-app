import DisclaimerComponent from './DisclaimerComponent'
import { ogImageMeta } from '@/lib/og-metadata'

const pageOg = ogImageMeta({
  title: 'Disclaimer',
  subtitle: 'Important legal information about JEE Challenger',
  theme: 'legal',
  alt: 'JEE Challenger Disclaimer',
})

export const metadata = {
  title: "Disclaimer | JEE Challenger",
  description: "Legal disclaimer for JEE Challenger - Important information about affiliations, content usage, and monetization policies.",
  alternates: {
    canonical: '/disclaimer',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Disclaimer - JEE Challenger",
    description: "Legal disclaimer for JEE Challenger - Important information about affiliations, content usage, and monetization policies.",
    url: '/disclaimer',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Disclaimer - JEE Challenger",
    description: "Legal disclaimer for JEE Challenger - Important information about affiliations, content usage, and monetization policies.",
    images: pageOg.twitterImages,
  },
}

export default function DisclaimerPage() {
  return <DisclaimerComponent />
}
