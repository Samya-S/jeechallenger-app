import MorePlatformsComponent from './MorePlatformsComponent'
import { ogImageMeta } from '@/utils/og-metadata'

const pageOg = ogImageMeta({
  title: 'More Platforms',
  subtitle: 'Learning platforms for JEE preparation',
  theme: 'materials',
  alt: 'More Learning Platforms for JEE',
})

export const metadata = {
  title: "More Platforms | JEE Challenger",
  description: "Explore top learning platforms like Unacademy, Apni Kaksha, and Physics Wallah for your JEE Main and JEE Advanced preparation.",
  alternates: {
    canonical: '/more-platforms',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "More Platforms | JEE Challenger",
    description: "Explore top learning platforms like Unacademy, Apni Kaksha, and Physics Wallah for your JEE Main and JEE Advanced preparation.",
    url: '/more-platforms',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "More Platforms | JEE Challenger",
    description: "Explore top learning platforms like Unacademy, Apni Kaksha, and Physics Wallah for your JEE Main and JEE Advanced preparation.",
    images: pageOg.twitterImages,
  },
};

const MorePlatformsPage = () => {
  return (
    <MorePlatformsComponent />
  )
}

export default MorePlatformsPage
