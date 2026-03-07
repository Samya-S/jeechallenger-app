import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ArrowLeft } from 'lucide-react';

// Components
import BlogPostClient from './BlogPostClient';
import BlogHeader from './components/BlogHeader';
import BlogCTA from './components/BlogCTA';
import { getMarkdownComponents } from './components/markdownComponents';

export default function BlogPostComponent({ post }) {
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h1>
          <Link href="/blogs" className="text-blue-600 hover:underline">
            ← Back to All Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <BlogPostClient content={post.content}>
      <BlogHeader 
        post={post} 
        shareTitle={post.title} 
      />

      {/* Article Content - Server-rendered markdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 md:p-12 border border-gray-200 dark:border-gray-700">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={getMarkdownComponents()}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <BlogCTA />

      {/* Back to Blogs */}
      <div className="mt-12 text-center">
        <Link 
          href="/blogs" 
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:gap-3 transition-all font-medium"
        >
          <ArrowLeft size={18} />
          Back to All Articles
        </Link>
      </div>
    </BlogPostClient>
  );
}
