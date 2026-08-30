import { getBatchViewCounts } from '@/server/views-actions';
import { getAllArticles } from '@/utils/articles';
import BlogListingComponent from './BlogListingComponent';
import StructuredData from '@/components/common/StructuredData';
import { ogImageMeta } from '@/utils/og-metadata';

const pageOg = ogImageMeta({
  title: 'JEE Preparation Tips & Strategy',
  subtitle: 'Expert advice to crack JEE Main & Advanced',
  theme: 'blog',
  badge: 'JEE Challenger Blog',
  alt: 'JEE Preparation Tips and Strategy Blogs',
});

export const metadata = {
  title: "JEE Preparation Blogs | JEE Challenger",
  description: "Read expert tips, strategies, study plans, and motivation for JEE Main and JEE Advanced preparation.",
  alternates: {
    canonical: '/blogs',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "JEE Preparation Blogs | JEE Challenger",
    description: "Read expert tips, strategies, study plans, and motivation for JEE Main and JEE Advanced preparation.",
    url: '/blogs',
    siteName: 'JEE Challenger',
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "JEE Preparation Blogs | JEE Challenger",
    description: "Read expert tips, strategies, study plans, and motivation for JEE Main and JEE Advanced preparation.",
    images: pageOg.twitterImages,
  },
};

export default async function BlogPage() {
  // Only get metadata, not full content, for better performance
  const articles = await getAllArticles(false);

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

      <BlogListingComponent articles={articles} />
    </>
  );
}
