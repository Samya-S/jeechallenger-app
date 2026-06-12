import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getBatchViewCounts } from '@/server/views-actions';

const articlesDirectory = path.join(process.cwd(), 'data/blog/articles');

/**
 * Get all article slugs
 */
export function getAllArticleSlugs() {
  const fileNames = fs.readdirSync(articlesDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => fileName.replace(/\.mdx$/, ''));
}

/**
 * Get article data by slug
 */
export function getArticleBySlug(slug) {
  const fullPath = path.join(articlesDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    title: data.title || '',
    excerpt: data.excerpt || '',
    date: data.date || '',
    author: data.author || '',
    category: data.category || '',
    readTime: data.readTime || '',
    keywords: data.keywords || '',
    hasMath: data.hasMath || false, // Optional: explicitly set in frontmatter
    content: content.trim(),
  };
}

/**
 * Get all articles sorted by date (newest first)
 * @param {boolean} includeContent - Whether to include full content (default: true for backwards compatibility)
 */
export async function getAllArticles(includeContent = true) {
  const slugs = getAllArticleSlugs();
  const viewsMap = await getBatchViewCounts(slugs);

  const articles = slugs
    .map(slug => {
      const article = getArticleBySlug(slug);
      if (!article) return null;

      // Attach the views, default to 0 if not found
      const articleWithViews = { 
        ...article, 
        views: viewsMap[slug] || 0 
      };

      // Exclude content for listing pages to reduce memory usage
      if (!includeContent) {
        const { content, ...metadata } = articleWithViews;
        return metadata;
      }

      return articleWithViews;
    })
    .filter(article => article !== null)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return articles;
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category) {
  const allArticles = getAllArticles();
  return allArticles.filter(article => article.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories() {
  const allArticles = getAllArticles();
  const categories = allArticles.map(article => article.category);
  return [...new Set(categories)];
}
