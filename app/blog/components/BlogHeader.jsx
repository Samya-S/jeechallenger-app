import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import ShareButtons from './ShareButtons';

export default function BlogHeader({ post, shareUrl, shareTitle }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Back Button */}
      <Link 
        href="/blogs" 
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:gap-3 transition-all mb-8 font-medium"
      >
        <ArrowLeft size={18} />
        Back to All Articles
      </Link>

      {/* Article Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-lg">
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 text-sm">
            <Clock size={16} />
            {post.readTime}
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {post.title}
        </h1>
        
        <div className="flex items-center justify-between gap-6 text-gray-600 dark:text-gray-400 flex-wrap">
          <div className="flex items-center gap-6 flex-wrap">
            {post.author && post.author.trim() !== "" && (
              <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-medium">{post.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
          </div>

          {/* Mobile Share Button - Inline with date */}
          <ShareButtons shareUrl={shareUrl} shareTitle={shareTitle} inline={true} />
        </div>

        {/* Desktop Share Buttons - Separate section */}
        <ShareButtons shareUrl={shareUrl} shareTitle={shareTitle} inline={false} />
      </header>
    </>
  );
}
