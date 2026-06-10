import PhysicsWallahComponent from './PhysicsWallahComponent'
import { ogImageMeta } from '@/lib/og-metadata'

const pageOg = ogImageMeta({
  title: 'Physics Wallah',
  subtitle: 'Free physics lectures for JEE & NEET aspirants',
  theme: 'physics',
  alt: 'Physics Wallah - Free JEE and NEET Preparation',
})

export const metadata = {
  title: "Physics Wallah | JEE Challenger",
  description: "Physics Wallah is a platform that provides free physics lectures for JEE and NEET aspirants.",
  alternates: {
    canonical: '/more-platforms/physicswallah',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Physics Wallah - Free JEE Preparation | JEE Challenger',
    description: "Physics Wallah is a platform that provides free physics lectures for JEE and NEET aspirants.",
    url: '/more-platforms/physicswallah',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Physics Wallah - Free JEE Preparation | JEE Challenger',
    description: "Physics Wallah is a platform that provides free physics lectures for JEE and NEET aspirants.",
    images: pageOg.twitterImages,
  },
}

const PhysicsWallahPage = () => {
  return (
    <PhysicsWallahComponent />
  )
}

export default PhysicsWallahPage
