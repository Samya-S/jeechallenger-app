import MoreMaterialsComponent from './MoreMaterialsComponent'

export const metadata = {
  title: "More Study Materials | JEE Challenger",
  description: "Miscellaneous study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
  openGraph: {
    title: 'More Study Materials - JEE Challenger',
    description: "Miscellaneous study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    url: '/materials/more-study-materials',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/ncertpdfs.jpg',
        width: 1200,
        height: 630,
        alt: 'More Study Materials for JEE',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'More Study Materials - JEE Challenger',
    description: "Miscellaneous study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    images: ['/images/ncertpdfs.jpg'],
  },
};

const MoreMaterialsPage = () => {
  return (
    <MoreMaterialsComponent />
  )
}

export default MoreMaterialsPage
