import PhysicsComponent from './PhysicsComponent'

export const metadata = {
  title: "Physics | JEE Challenger",
  description: "Physics study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
  alternates: {
    canonical: '/materials/physics',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Physics Study Materials - JEE Challenger",
    description: "Physics study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    url: '/materials/physics',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/physics.jpg',
        width: 1200,
        height: 630,
        alt: 'Physics Study Materials for JEE',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Physics Study Materials - JEE Challenger",
    description: "Physics study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    images: ['/images/physics.jpg'],
  },
};

const PhysicsPage = () => {
  return (
    <PhysicsComponent />
  )
}

export default PhysicsPage
