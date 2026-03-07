import { getArticleBySlug, getAllArticles } from '../../../lib/articles';
import BlogPostComponent from '../BlogPostComponent';
import StructuredData from '@/components/common/StructuredData';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const articles = getAllArticles();
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
      images: [
        {
          url: '/images/og-blog.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ['/images/og-blog.png'],
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
          image: '/images/og-blog.png',
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
