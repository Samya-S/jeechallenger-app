import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
    content: content.trim(),
  };
}

/**
 * Get all articles sorted by date (newest first)
 */
export function getAllArticles() {
  const slugs = getAllArticleSlugs();
  const articles = slugs
    .map(slug => getArticleBySlug(slug))
    .filter(article => article !== null)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
  
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
