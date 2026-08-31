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

    const res = await fetch(`${PYQS_API_URL}/papers`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[next-sitemap] Warning: Papers API returned HTTP ${res.status}`);
      return [];
    }

    const json = await res.json();
    const papers = json.data || json.papers || [];

    return papers
      .filter((paper) => paper && paper.slug)
      .map((paper) => ({
        loc: `/papers/${paper.slug}`,
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // 1. Fetch first page to determine total_pages
    const firstRes = await fetch(`${PYQS_API_URL}/questions?limit=100&page=1`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!firstRes.ok) {
      console.warn(`[next-sitemap] Warning: Questions API returned HTTP ${firstRes.status}`);
      return [];
    }

    const firstJson = await firstRes.json();
    const firstData = firstJson.data || [];
    const totalPages = firstJson.meta?.total_pages || 1;

    let allQuestions = [...firstData];

    // 2. Fetch remaining pages if any
    if (totalPages > 1) {
      const pagePromises = [];
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(
          (async () => {
            try {
              const pageController = new AbortController();
              const pageTimeout = setTimeout(() => pageController.abort(), 10000);
              const res = await fetch(`${PYQS_API_URL}/questions?limit=100&page=${page}`, {
                signal: pageController.signal,
                headers: { Accept: 'application/json' },
              });
              clearTimeout(pageTimeout);
              if (res.ok) {
                const json = await res.json();
                return json.data || [];
              }
            } catch (err) {
              console.warn(`[next-sitemap] Warning: Failed to fetch questions page ${page}:`, err.message);
            }
            return [];
          })()
        );
      }

      const results = await Promise.all(pagePromises);
      results.forEach((pageItems) => {
        allQuestions.push(...pageItems);
      });
    }

    return allQuestions
      .filter((q) => q && q.slug)
      .map((q) => ({
        loc: `/questions/${q.slug}`,
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
  generateIndexSitemap: false,
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
