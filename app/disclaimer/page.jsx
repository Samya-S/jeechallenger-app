import DisclaimerComponent from './DisclaimerComponent'

export const metadata = {
  title: "Disclaimer | JEE Challenger",
  description: "Legal disclaimer for JEE Challenger - Important information about affiliations, content usage, and monetization policies.",
  openGraph: {
    title: "Disclaimer - JEE Challenger",
    description: "Legal disclaimer for JEE Challenger - Important information about affiliations, content usage, and monetization policies.",
    url: '/disclaimer',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'JEE Challenger Disclaimer',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Disclaimer - JEE Challenger",
    description: "Legal disclaimer for JEE Challenger - Important information about affiliations, content usage, and monetization policies.",
    images: ['/images/jcicon.jpg'],
  },
  alternates: {
    canonical: '/disclaimer',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function DisclaimerPage() {
  return <DisclaimerComponent />
}
