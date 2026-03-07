'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ArrowLeft } from 'lucide-react';

// Components
import ReadingProgressBar from './components/ReadingProgressBar';
import BlogHeader from './components/BlogHeader';
import { MobileTOC, DesktopTOC } from './components/TableOfContents';
import BlogCTA from './components/BlogCTA';
import { getMarkdownComponents } from './components/markdownComponents';

// Hooks
import { useTableOfContents } from './hooks/useTableOfContents';
import { useReadingProgress } from './hooks/useReadingProgress';
import { useActiveHeading } from './hooks/useActiveHeading';

export default function BlogPostComponent({ post }) {
  const [showTOC, setShowTOC] = useState(false);

  // Custom hooks
  const tableOfContents = useTableOfContents(post?.content);
  const readingProgress = useReadingProgress();
  const activeHeading = useActiveHeading(tableOfContents);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';

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
    <>
      <ReadingProgressBar progress={readingProgress} />

      <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex gap-8 relative">
            {/* Main Content */}
            <div className="flex-1 min-w-0 max-w-4xl mx-auto text-left">
              <BlogHeader 
                post={post} 
                shareUrl={shareUrl} 
                shareTitle={shareTitle} 
              />

              {/* Mobile TOC */}
              <MobileTOC 
                tableOfContents={tableOfContents}
                activeHeading={activeHeading}
                showTOC={showTOC}
                setShowTOC={setShowTOC}
              />

              {/* Article Content */}
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
            </div>

            {/* Desktop TOC Sidebar */}
            <DesktopTOC 
              tableOfContents={tableOfContents}
              activeHeading={activeHeading}
            />
          </div>
        </div>
      </article>
    </>
  );
}
