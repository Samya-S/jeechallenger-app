import Link from 'next/link';
import { BookOpen, ArrowLeft, Home, Sparkles, BookX, Compass } from 'lucide-react';
import { getAllArticles } from '@/utils/articles';
import BlogCard from '@/components/ui/BlogCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { ogImageMeta } from '@/utils/og-metadata';

const pageOg = ogImageMeta({
  title: '404 - Article Not Found',
  subtitle: "The JEE preparation blog post you're looking for doesn't exist.",
  theme: 'blog',
  badge: 'JEE Challenger Blog',
  alt: 'Article Not Found | JEE Challenger',
});

export const metadata = {
  title: "Article Not Found | JEE Challenger",
  description: "The JEE preparation article or blog post you're looking for doesn't exist. Explore our latest JEE Main & Advanced guides, strategies, and tips.",
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Article Not Found | JEE Challenger",
    description: "The JEE preparation article or blog post you're looking for doesn't exist. Explore our latest JEE Main & Advanced guides, strategies, and tips.",
    siteName: "JEE Challenger",
    images: pageOg.images,
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Article Not Found | JEE Challenger",
    description: "The JEE preparation article or blog post you're looking for doesn't exist. Explore our latest JEE Main & Advanced guides, strategies, and tips.",
    images: pageOg.twitterImages,
  },
};

export default async function BlogNotFound() {
  // Fetch latest articles for recommendations
  let recentArticles = [];

  try {
    const articles = await getAllArticles(false);
    recentArticles = articles.slice(0, 3);
  } catch (error) {
    console.error('Error fetching articles for blog 404:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero / Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-900 dark:via-blue-800 dark:to-cyan-900">
        <div
          className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 40' stroke='rgba(255,255,255,0.2)' stroke-width='1' fill='none'/%3E%3Cpath d='M40 40L40 0' stroke='rgba(255,255,255,0.2)' stroke-width='1' fill='none'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />

        <Breadcrumbs
          crumbs={[
            { label: 'Blogs', href: '/blogs' },
            { label: 'Article Not Found' },
          ]}
          hasBanner={true}
          className="pt-4 z-10"
        />

        <div className="container mx-auto px-4 py-14 md:py-20 max-w-4xl relative text-center">
          <div className="space-y-6">
            {/* 404 Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/25 shadow-sm">
              <BookX size={18} className="text-red-200" />
              <span>404 - Article Not Found</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Blog Post Not Found
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              The article you&apos;re looking for might have been moved, renamed, or doesn&apos;t exist. Explore our latest JEE preparation guides and strategies below.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/blogs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft size={18} />
                Browse All Articles
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-blue-700/60 hover:bg-blue-700/80 text-white font-medium px-6 py-3.5 rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-200"
              >
                <Home size={18} />
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Latest Articles */}
        {recentArticles.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-500" size={22} />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Latest Articles
                </h2>
              </div>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all blogs →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                <BlogCard key={article.slug} post={article} />
              ))}
            </div>
          </div>
        )}

        {/* Need Help Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 rounded-2xl p-8 border border-blue-100 dark:border-gray-700 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm">
              <Compass size={18} />
              <span>Need Personalized JEE Guidance?</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Have doubts or need custom study advice?
            </h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
              Try our 24/7 AI Tutor for instant doubt solving, conceptual explanations, and strategic revision roadmaps.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/ai-tutor"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition-all duration-150 hover:scale-105"
            >
              <BookOpen size={16} />
              Try AI Tutor Free
            </Link>
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium border border-gray-200 dark:border-gray-600 transition-colors"
            >
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
