import ChapterWiseSolvedPYQsComponent from './ChapterWiseSolvedPYQsComponent'

export const metadata = {
  title: "Chapter-wise Solved JEE PYQs - Last 43 Years | Free Download PDFs",
  description: "Download Free Chapter-wise Solved Previous Year Questions (PYQs) for JEE Main & Advanced from last 43 years. Published by Arihant & Disha. Physics, Chemistry & Maths - All chapters covered. Master PYQs and crack JEE!",
  alternates: {
    canonical: '/materials/chapterwise-solved-pyqs',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Chapter-wise Solved PYQs - JEE Challenger",
    description: "Chapter-wise solved previous years' questions for JEE Main and JEE Advanced.",
    url: '/materials/chapterwise-solved-pyqs',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/pyqs.jpg',
        width: 1200,
        height: 630,
        alt: 'Chapter-wise Solved Previous Year Questions',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chapter-wise Solved PYQs - JEE Challenger",
    description: "Chapter-wise solved previous years' questions for JEE Main and JEE Advanced.",
    images: ['/images/pyqs.jpg'],
  },
};

const ChapterWiseSolvedPYQsPage = () => {
  return (
    <ChapterWiseSolvedPYQsComponent />
  )
}

export default ChapterWiseSolvedPYQsPage
