import PreviousYearQuestionsComponent from './PreviousYearQuestionsComponent'
import StructuredData from '@/components/common/StructuredData'
import { pyqFAQs } from '@/data/faq-data'
import { ogImageMeta } from '@/utils/og-metadata'

const pageOg = ogImageMeta({
  title: 'Previous Year Questions',
  subtitle: 'Access Free Previous Year Questions (PYQs) with Solutions for JEE Main & Advanced',
  theme: 'pyqs',
  badge: 'JEE Challenger',
  alt: 'Previous Year Questions',
})

export const metadata = {
  title: 'Previous Year Questions | JEE Challenger',
  description: 'Access chapter-wise and year-wise JEE Main and Advanced Previous Year Questions (PYQs). Practice with detailed solutions to boost your exam preparation.',
  alternates: {
    canonical: '/previous-year-questions',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Previous Year Questions | JEE Challenger',
    description: 'Access chapter-wise and year-wise JEE Main and Advanced Previous Year Questions (PYQs). Practice with detailed solutions to boost your exam preparation.',
    url: '/previous-year-questions',
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Previous Year Questions | JEE Challenger',
    description: 'Access chapter-wise and year-wise JEE Main and Advanced Previous Year Questions (PYQs). Practice with detailed solutions to boost your exam preparation.',
    images: pageOg.twitterImages,
  },
};

const PreviousYearQuestionsPage = () => {
  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData type="faq" data={pyqFAQs} />
      <StructuredData
        type="breadcrumb"
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "PYQs", path: "/previous-year-questions" }
          ]
        }}
      />
      <PreviousYearQuestionsComponent />
    </>
  )
}

export default PreviousYearQuestionsPage
