import ChemistryComponent from './ChemistryComponent'

export const metadata = {
  title: "Chemistry | JEE Challenger",
  description: "Chemistry study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
  openGraph: {
    title: "Chemistry Study Materials - JEE Challenger",
    description: "Chemistry study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    url: '/materials/chemistry',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/chemistry.jpg',
        width: 1200,
        height: 630,
        alt: 'Chemistry Study Materials for JEE',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chemistry Study Materials - JEE Challenger",
    description: "Chemistry study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    images: ['/images/chemistry.jpg'],
  },
};

const ChemistryPage = () => {
  return (
    <ChemistryComponent />
  )
}

export default ChemistryPage
