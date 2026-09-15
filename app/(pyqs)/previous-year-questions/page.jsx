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
  keywords: [
    "JEE Main PYQs",
    "JEE Advanced PYQs",
    "Previous Year Questions",
    "JEE Chapter wise PYQ",
    "JEE Shift Papers",
    "JEE Question Solutions",
    "Free JEE PYQ",
    "Physics PYQ",
    "Chemistry PYQ",
    "Mathematics PYQ",
  ],
  alternates: {
    canonical: '/previous-year-questions',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
            { name: "Resources", path: "/resources" },
            { name: "Previous Year Questions", path: "/previous-year-questions" }
          ]
        }}
      />
      <StructuredData
        type="learningResource"
        data={{
          name: "JEE Main & Advanced Previous Year Questions (PYQs)",
          description: "Chapter-wise and official shift paper practice with step-by-step verified solutions and KaTeX mathematical formatting.",
          subject: "Physics, Chemistry, and Mathematics for JEE",
          learningResourceType: ["Interactive Resource", "Previous Year Questions", "Exam Papers", "Practice Problems"],
        }}
      />
      <PreviousYearQuestionsComponent />
    </>
  )
}

export default PreviousYearQuestionsPage
