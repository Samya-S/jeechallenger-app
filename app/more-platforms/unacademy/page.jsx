import UnacademyComponent from './UnacademyComponent'
import { ogImageMeta } from '@/lib/og-metadata'

const pageOg = ogImageMeta({
  title: 'Unacademy',
  subtitle: 'Online JEE classes & preparation resources',
  theme: 'platform',
  alt: 'Unacademy - Online Learning Platform for JEE',
})

export const metadata = {
  title: 'Unacademy | JEE Challenger',
  description: 'Unacademy is a platform that provides online classes for JEE aspirants. Get the best JEE preparation resources from Unacademy.',
  alternates: {
    canonical: '/more-platforms/unacademy',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Unacademy - Online JEE Classes | JEE Challenger',
    description: 'Unacademy is a platform that provides online classes for JEE aspirants. Get the best JEE preparation resources from Unacademy.',
    url: '/more-platforms/unacademy',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unacademy - Online JEE Classes | JEE Challenger',
    description: 'Unacademy is a platform that provides online classes for JEE aspirants. Get the best JEE preparation resources from Unacademy.',
    images: pageOg.twitterImages,
  },
}

const UnacademyPage = () => {
  return (
    <UnacademyComponent />
  )
}

export default UnacademyPage
