const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { getSiteUrl } = require('./config/site-url');

const PYQS_API_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

/**
 * Fetch local MDX blog posts
 */
function getBlogRoutes() {
  try {
    const blogsDir = path.join(process.cwd(), 'data', 'blogs');
    if (!fs.existsSync(blogsDir)) return [];

    const files = fs.readdirSync(blogsDir);
    return files
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => {
        const slug = file.replace(/\.mdx$/, '');
        const fullPath = path.join(blogsDir, file);
        let lastmod = new Date().toISOString();

        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(content);
          if (data.date) {
            lastmod = new Date(data.date).toISOString();
          } else {
            const stat = fs.statSync(fullPath);
            lastmod = stat.mtime.toISOString();
          }
        } catch {
          // fallback to now
        }

        return {
          loc: `/blog/${slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          lastmod,
        };
      });
  } catch (error) {
    console.warn('[next-sitemap] Warning: Failed to read local blog MDX files:', error.message);
    return [];
  }
}

/**
 * Fetch dynamic question papers from PYQs API
 */
async function getPaperRoutes() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${PYQS_API_URL}/papers/sitemap`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[next-sitemap] Warning: Papers sitemap API returned HTTP ${res.status}`);
      return [];
    }

    const json = await res.json();
    const papers = json.data || [];

    return papers
      .filter((paper) => paper && paper.slug)
      .map((paper) => ({
        loc: `/paper/${paper.slug}`,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: paper.approved_at
          ? new Date(paper.approved_at).toISOString()
          : new Date().toISOString(),
      }));
  } catch (error) {
    console.warn('[next-sitemap] Warning: Could not fetch question papers for sitemap:', error.message);
    return [];
  }
}

/**
 * Fetch dynamic questions across all pages from PYQs API
 */
async function getQuestionRoutes() {
  try {
    const allQuestions = [];
    let page = 1;
    let totalPages = 1;

    // Fetch chunked pages sequentially (limit 10,000 per request)
    while (page <= totalPages) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(`${PYQS_API_URL}/questions/sitemap?limit=10000&page=${page}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn(`[next-sitemap] Warning: Questions sitemap API returned HTTP ${res.status} on page ${page}`);
        break;
      }

      const json = await res.json();
      const data = json.data || [];
      allQuestions.push(...data);

      totalPages = json.meta?.total_pages || 1;
      page++;
    }

    return allQuestions
      .filter((q) => q && q.slug)
      .map((q) => ({
        loc: `/question/${q.slug}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: q.approved_at
          ? new Date(q.approved_at).toISOString()
          : new Date().toISOString(),
      }));
  } catch (error) {
    console.warn('[next-sitemap] Warning: Could not fetch questions for sitemap:', error.message);
    return [];
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: getSiteUrl(),
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  exclude: [
    '/rss.xml',
    '/image-sitemap.xml',
    '/api/*',
    '/ai-tutor/chat/*',
    '/ai-tutor/[...not_found]',
    '/login',
    '/profile',
  ],
  generateIndexSitemap: true,
  sitemapSize: 10000,
  additionalPaths: async (config) => {
    const additional = [];

    // 1. Explicit Core Static Routes (in case Next.js build manifest excludes root groups)
    additional.push({
      loc: '/',
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    });
    additional.push({
      loc: '/blogs',
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    });

    // 2. MDX Dynamic Blog Posts
    const blogRoutes = getBlogRoutes();
    additional.push(...blogRoutes);

    // 3. Dynamic PYQ Question Papers
    const paperRoutes = await getPaperRoutes();
    additional.push(...paperRoutes);

    // 4. Dynamic PYQ Questions
    const questionRoutes = await getQuestionRoutes();
    additional.push(...questionRoutes);

    return additional;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/ai-tutor/chat/*',
          '/profile',
        ],
      },
    ],
    additionalSitemaps: [
      `${getSiteUrl()}/image-sitemap.xml`,
    ],
  },
};
