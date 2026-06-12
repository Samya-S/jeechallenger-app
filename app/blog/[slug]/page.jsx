import { getArticleBySlug, getAllArticles } from '../../../lib/articles';
import BlogPostComponent from '../BlogPostComponent';
import StructuredData from '@/components/common/StructuredData';
import { notFound } from 'next/navigation';
import { buildAbsoluteOgImageUrl, ogImageMeta } from '@/lib/og-metadata';

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getArticleBySlug(slug);
  
  if (!post) {
    return {
      title: 'Article Not Found | JEE Challenger',
    };
  }

  const pageOg = ogImageMeta({
    title: post.title,
    subtitle: post.excerpt,
    theme: 'blog',
    badge: 'JEE Challenger Blog',
    alt: post.title,
  });

  return {
    title: `${post.title} | JEE Challenger`,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
      siteName: 'JEE Challenger',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'JEE Challenger Team'],
      tags: post.category ? [post.category] : [],
      locale: 'en_IN',
      images: pageOg.images,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: pageOg.twitterImages,
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getArticleBySlug(slug);
  
  if (!post) {
    notFound();
  }

  // ShareUrl will be constructed client-side from window.location
  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData 
        type="article" 
        data={{
          title: post.title,
          description: post.excerpt,
          image: buildAbsoluteOgImageUrl({
            title: post.title,
            subtitle: post.excerpt,
            theme: 'blog',
            badge: 'JEE Challenger Blog',
          }),
          publishedAt: post.date,
          source: post.author || 'JEE Challenger Team'
        }} 
      />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Home", path: "/" },
            { name: "Blogs", path: "/blogs" },
            { name: post.title, path: `/blog/${slug}` }
          ]
        }} 
      />
      
      <BlogPostComponent post={post} />
    </>
  );
}
