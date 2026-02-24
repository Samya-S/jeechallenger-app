import UnacademyComponent from './UnacademyComponent'

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
    images: [
      {
        url: '/images/Unacademy_header.png',
        width: 1200,
        height: 630,
        alt: 'Unacademy - Online Learning Platform for JEE',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unacademy - Online JEE Classes | JEE Challenger',
    description: 'Unacademy is a platform that provides online classes for JEE aspirants. Get the best JEE preparation resources from Unacademy.',
    images: ['/images/Unacademy_header.png'],
  },
}

const UnacademyPage = () => {
  return (
    <UnacademyComponent />
  )
}

export default UnacademyPage
