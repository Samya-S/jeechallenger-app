import MoreMaterialsComponent from './MoreMaterialsComponent'
import { ogImageMeta } from '@/lib/og-metadata'

const pageOg = ogImageMeta({
  title: 'More Study Materials',
  subtitle: 'NCERT PDFs, books, notes & additional JEE resources',
  theme: 'materials',
  alt: 'More Study Materials for JEE',
})

export const metadata = {
  title: "More Study Materials | JEE Challenger",
  description: "Miscellaneous study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
  alternates: {
    canonical: '/materials/more-study-materials',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'More Study Materials - JEE Challenger',
    description: "Miscellaneous study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    url: '/materials/more-study-materials',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'More Study Materials - JEE Challenger',
    description: "Miscellaneous study materials for JEE Main and JEE Advanced, including books, notes, and other resources.",
    images: pageOg.twitterImages,
  },
};

const MoreMaterialsPage = () => {
  return (
    <MoreMaterialsComponent />
  )
}

export default MoreMaterialsPage
