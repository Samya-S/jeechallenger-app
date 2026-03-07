'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, Filter, BookOpen, TrendingUp, Sparkles } from 'lucide-react';
import BlogCard from './BlogCard';
import ScrollToTopButton from '../../components/utils/ScrollToTopButton';

export default function BlogListingComponent({ articles }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories (memoized to avoid recalculation)
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(articles.map(post => post.category))];
    return cats;
  }, [articles]);

  // Filter posts based on search and category (memoized for performance)
  const filteredPosts = useMemo(() => {
    if (!searchQuery && selectedCategory === 'All') {
      return articles; // Skip filtering if no filters applied
    }
    
    const lowerSearchQuery = searchQuery.toLowerCase();
    
    return articles.filter(post => {
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(lowerSearchQuery) ||
        post.excerpt.toLowerCase().includes(lowerSearchQuery) ||
        post.category.toLowerCase().includes(lowerSearchQuery) ||
        (post.keywords && post.keywords.toLowerCase().includes(lowerSearchQuery));
      
      const matchesCategory = 
        selectedCategory === 'All' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  // Get featured post (most recent) - memoized
  const featuredPost = useMemo(() => articles[0], [articles]);
  
  // Memoize callback functions
  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
  }, []);

  // Memoize article count for hero section
  const articleCount = useMemo(() => articles.length, [articles]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 dark:from-blue-900 dark:via-blue-800 dark:to-cyan-900">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl relative">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/20">
              <Sparkles size={16} />
              <span>Your Guide to JEE Success</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              JEE Articles & Tips
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Expert strategies, proven study techniques, and actionable tips to help you crack JEE Main & Advanced with confidence
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-white/90">
              <div className="flex items-center gap-2">
                <BookOpen size={20} />
                <span className="text-sm font-medium">{articleCount} Articles</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={20} />
                <span className="text-sm font-medium">Expert Content</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Search and Filter Section */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search articles by title, topic, category, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Filter size={18} className="text-gray-600 dark:text-gray-400" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results Count */}
          {(searchQuery || selectedCategory !== 'All') && (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Found <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredPosts.length}</span> {filteredPosts.length === 1 ? 'article' : 'articles'}
            </p>
          )}
        </div>

        {/* Featured Post */}
        {!searchQuery && selectedCategory === 'All' && featuredPost && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-yellow-500" size={24} />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Article</h2>
            </div>
            <BlogCard post={featuredPost} featured={true} />
          </div>
        )}

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <>
            {!searchQuery && selectedCategory === 'All' && (
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">All Articles</h2>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => {
                // Skip the first post if it's the featured one and no filters applied
                if (index === 0 && !searchQuery && selectedCategory === 'All') {
                  return null;
                }
                return <BlogCard key={post.slug} post={post} />;
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 p-1">
          <div className="relative bg-white dark:bg-gray-900 rounded-xl p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Need Personalized Guidance?
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Get 24/7 instant doubt solving, customized study plans, and AI-powered feedback to accelerate your JEE preparation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/ai-tutor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 640 512">
                    <path d="M208 352c-2.39 0-4.78.35-7.06 1.09C187.98 357.3 174.35 360 160 360c-14.35 0-27.98-2.7-40.95-6.91-2.28-.74-4.66-1.09-7.05-1.09C49.94 352-.33 402.48 0 464.62.14 490.88 21.73 512 48 512h224c26.27 0 47.86-21.12 48-47.38.33-62.14-49.94-112.62-112-112.62zm-48-32c53.02 0 96-42.98 96-96s-42.98-96-96-96-96 42.98-96 96 42.98 96 96 96zM592 0H208c-26.47 0-48 22.25-48 49.59V96c23.42 0 45.1 6.78 64 17.8V64h352v288h-64v-64H384v64h-76.24c19.1 16.69 33.12 38.73 39.69 64H592c26.47 0 48-22.25 48-49.59V49.59C640 22.25 618.47 0 592 0z"/>
                  </svg>
                  Try AI Tutor Free
                </Link>
                <Link
                  href="/materials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-xl transition-all border border-gray-300 dark:border-gray-700"
                >
                  <BookOpen size={20} />
                  Browse Study Materials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollToTopButton 
        gradientColors="from-blue-600 to-cyan-500" 
        hoverColors="hover:from-blue-700 hover:to-cyan-600" 
      />
    </div>
  );
}
