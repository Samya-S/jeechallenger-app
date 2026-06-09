import { getBatchViewCounts } from '@/server/views-actions';
import { getAllArticles } from '../../lib/articles';
import BlogListingComponent from './BlogListingComponent';
import StructuredData from '@/components/common/StructuredData';

export const metadata = {
  title: 'JEE Preparation Tips & Strategy Blogs | JEE Challenger',
  description: 'Expert tips, strategies, and advice for JEE Main and Advanced preparation. Learn from proven methods to crack JEE with better scores. Get actionable study techniques, time management tips, and preparation roadmaps.',
  alternates: {
    canonical: '/blogs',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'JEE Preparation Tips & Strategy Blogs | JEE Challenger',
    description: 'Expert tips, strategies, and advice for JEE Main and Advanced preparation. Learn from proven methods to crack JEE with better scores.',
    url: '/blogs',
    siteName: 'JEE Challenger',
    images: [
      {
        url: '/images/jcicon.jpg',
        width: 1200,
        height: 630,
        alt: 'JEE Preparation Tips and Strategy Blogs',
      }
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JEE Preparation Tips & Strategy Blogs | JEE Challenger',
    description: 'Expert tips, strategies, and advice for JEE Main and Advanced preparation.',
    images: ['/images/jcicon.jpg'],
  },
};

export default async function BlogPage() {
  // Only get metadata, not full content, for better performance
  const articles = getAllArticles(false);

  // Get all slugs
  const slugs = articles.map(article => article.slug);  
  // Fetch all views in one command
  const viewsMap = await getBatchViewCounts(slugs);  
  // Attach the views to the articles array
  const articlesWithViews = articles.map(article => ({
    ...article,
    views: viewsMap[article.slug] || 0
  }));

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" }
          ]
        }} 
      />
      
      {/* Blog List Structured Data */}
      <StructuredData 
        type="blogList" 
        data={{
          items: articles
        }} 
      />
      
      <BlogListingComponent articles={articlesWithViews} />
    </>
  );
}
