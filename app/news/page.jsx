import NewsComponent from './NewsComponent';

export const metadata = {
  title: 'Latest JEE News - Exam Dates, Results & Important Updates',
  description: 'Latest JEE Main & JEE Advanced News: Exam dates, registration deadlines, admit cards, results, cutoffs, counseling updates. Real-time notifications. Never miss important JEE dates! Check now.',
  alternates: {
    canonical: '/news',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Latest JEE News - JEE Challenger',
    description: 'Stay updated with the latest news and information for JEE aspirants',
    url: '/news',
    siteName: "JEE Challenger",
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'Latest JEE News and Updates',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest JEE News - JEE Challenger',
    description: 'Stay updated with the latest news and information for JEE aspirants',
    images: ['/images/jcicon.jpg'],
  },
};

export default function NewsPage() {
  return <NewsComponent />;
} 