import PhysicsWallahComponent from './PhysicsWallahComponent'

export const metadata = {
  title: "Physics Wallah | JEE Challenger",
  description: "Physics Wallah is a platform that provides free physics lectures for JEE and NEET aspirants.",
  openGraph: {
    title: 'Physics Wallah - Free JEE Preparation | JEE Challenger',
    description: "Physics Wallah is a platform that provides free physics lectures for JEE and NEET aspirants.",
    url: '/more-platforms/physicswallah',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/physicswallah.png',
        width: 1200,
        height: 630,
        alt: 'Physics Wallah - Free JEE and NEET Preparation',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Physics Wallah - Free JEE Preparation | JEE Challenger',
    description: "Physics Wallah is a platform that provides free physics lectures for JEE and NEET aspirants.",
    images: ['/images/physicswallah.png'],
  },
}

const PhysicsWallahPage = () => {
  return (
    <PhysicsWallahComponent />
  )
}

export default PhysicsWallahPage
