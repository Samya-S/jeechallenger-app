'use client';

import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { memo, useCallback } from 'react';

// Memoize date formatting to avoid recalculation
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function BlogCard({ post, featured = false }) {

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-1 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
      >
        <div className="relative h-full rounded-xl bg-white dark:bg-gray-900 p-8 md:p-10 text-left">
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-xs font-bold rounded-full shadow-lg">
              <span className="text-yellow-600">⭐</span> FEATURED
            </span>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium rounded-lg">
                <Tag size={14} />
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {post.title}
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar size={14} />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all">
                Read Article <ArrowRight size={18} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
    >
      <div className="p-6 h-full flex flex-col text-left">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg">
            <Tag size={14} />
            {post.category}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <Clock size={14} />
            {post.readTime}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={14} />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
          <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium group-hover:gap-3 transition-all">
            Read More <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Memo the component to prevent unnecessary re-renders
export default memo(BlogCard);
