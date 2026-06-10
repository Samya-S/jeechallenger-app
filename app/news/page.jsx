import NewsComponent from './NewsComponent';
import StructuredData from '@/components/common/StructuredData';
import { newsFAQs } from '@/data/faq-data';
import { fetchNews } from '@/lib/news-actions';
import { ogImageMeta } from '@/lib/og-metadata';

const pageOg = ogImageMeta({
  title: 'Latest JEE News',
  subtitle: 'Exam dates, results & important updates for aspirants',
  theme: 'news',
  alt: 'Latest JEE News and Updates',
});

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
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest JEE News - JEE Challenger',
    description: 'Stay updated with the latest news and information for JEE aspirants',
    images: pageOg.twitterImages,
  },
};

export default async function NewsPage() {
  // Fetch news data on the server
  let articles = [];
  let error = null;

  try {
    const data = await fetchNews();
    articles = data.articles || [];
  } catch (err) {
    console.error('Failed to load news:', err);
    error = err.message || 'Failed to load news. Please try again later.';
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData type="faq" data={newsFAQs} />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "Latest JEE News", path: "/news" }
          ]
        }} 
      />
      
      <NewsComponent articles={articles} error={error} />
    </>
  );
} 