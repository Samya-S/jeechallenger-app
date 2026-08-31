import { getSiteUrl } from "@/config/site-url";
import { getAllArticles } from "@/utils/articles";
import fs from 'fs';
import path from 'path';

export const revalidate = 3600;

/**
 * Recursively crawls the /app directory to find all valid public static routes.
 * Correctly strips Next.js route groups like (resources), (about), (legal) from the URL.
 */
function getValidStaticRoutes(dir, currentPath = []) {
  const fullDirPath = path.join(/*turbopackIgnore: true*/ process.cwd(), dir);
  if (!fs.existsSync(fullDirPath)) return [];

  let routes = [];
  const entries = fs.readdirSync(fullDirPath, { withFileTypes: true });

  const pageFileEntry = entries.find(
    (e) => e.isFile() && (e.name === 'page.js' || e.name === 'page.jsx' || e.name === 'page.tsx')
  );

  if (dir !== 'app' && pageFileEntry && currentPath.length > 0) {
    const isDirRouteGroup = path.basename(dir).startsWith('(');
    const folderNameForTitle = isDirRouteGroup && currentPath.length > 0 
      ? currentPath[currentPath.length - 1] 
      : path.basename(dir);

    routes.push({
      folderName: folderNameForTitle,
      basePath: currentPath.join('/'),
      pagePath: path.join(fullDirPath, pageFileEntry.name)
    });
  }

  entries.forEach((entry) => {
    if (entry.isDirectory()) {
      const name = entry.name;

      if (
        name.startsWith('[') ||
        name.startsWith('_') ||
        name.startsWith('@') ||
        (name.startsWith('(') && name.includes('.')) ||
        name === 'api' ||
        name === 'rss.xml' ||
        name === 'image-sitemap.xml' ||
        name === 'og' ||
        name === 'login' ||
        name === 'profile'
      ) {
        return;
      }

      const isRouteGroup = name.startsWith('(') && name.endsWith(')');
      const newPath = isRouteGroup ? [...currentPath] : [...currentPath, name];

      routes = routes.concat(getValidStaticRoutes(path.join(/*turbopackIgnore: true*/ dir, name), newPath));
    }
  });

  return routes;
}

/**
 * Formats a raw URL route (e.g., "physics/unit-converter") into readable Titles & Categories
 */
function formatRouteDetails(route) {
  const parts = route.basePath.split('/').filter(Boolean);
  const namePart = parts[parts.length - 1] || 'Home';
  const categoryPart = parts.length > 1 ? parts[0] : "General";

  const title = namePart.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const category = categoryPart.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    urlPath: `/${route.basePath}`,
    title: `${title} - JEE Challenger`,
    description: `Explore ${title} resources and study materials on JEE Challenger.`,
    category: category
  };
}

async function getDynamicPapers() {
  try {
    const PYQS_API_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`${PYQS_API_URL}/papers`, {
      signal: controller.signal,
      next: { revalidate: 3600 }
    });
    clearTimeout(timeoutId);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || json.papers || [];
  } catch (e) {
    console.error('Error fetching papers for rss:', e.message);
    return [];
  }
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const currentDate = new Date().toUTCString();
  
  // ---------------------------------------------------------
  // 1. AUTO-DISCOVER STATIC PAGES (with clean URLs)
  // ---------------------------------------------------------
  const staticRoutes = getValidStaticRoutes('app');
  
  const staticItems = staticRoutes.map((route) => {
    const pageDetails = formatRouteDetails(route);
    const pageUrl = `${siteUrl}${pageDetails.urlPath}`;
    
    return `<item>
              <title><![CDATA[${pageDetails.title}]]></title>
              <link>${pageUrl}</link>
              <guid isPermaLink="true">${pageUrl}</guid>
              <description><![CDATA[${pageDetails.description}]]></description>
              <pubDate>${currentDate}</pubDate>
              <category><![CDATA[${pageDetails.category}]]></category>
            </item>`;
  }).join('\n');

  // ---------------------------------------------------------
  // 2. FETCH DYNAMIC BLOG ARTICLES
  // ---------------------------------------------------------
  const articles = await getAllArticles(false);
  const dynamicBlogItems = articles.map((article) => {
    const articleUrl = `${siteUrl}/blog/${article.slug}`;
    return `<item>
              <title><![CDATA[${article.title}]]></title>
              <link>${articleUrl}</link>
              <guid isPermaLink="true">${articleUrl}</guid>
              <description><![CDATA[${article.excerpt}]]></description>
              <pubDate>${new Date(article.date).toUTCString()}</pubDate>
              <category><![CDATA[${article.category || 'Blog'}]]></category>
            </item>`;
  }).join('\n');

  // ---------------------------------------------------------
  // 3. FETCH DYNAMIC QUESTION PAPERS
  // ---------------------------------------------------------
  const papers = await getDynamicPapers();
  const dynamicPaperItems = papers
    .filter((paper) => paper && paper.slug)
    .map((paper) => {
      const examLabel = paper.exam_type === 'JEE_ADVANCED' ? 'JEE Advanced' : 'JEE Main';
      const title = paper.title || `${examLabel} ${paper.exam_year} Question Paper`;
      const pageUrl = `${siteUrl}/papers/${paper.slug}`;
      const pubDate = paper.approved_at ? new Date(paper.approved_at).toUTCString() : currentDate;
      
      return `<item>
                <title><![CDATA[${title} - Full Paper & Solutions]]></title>
                <link>${pageUrl}</link>
                <guid isPermaLink="true">${pageUrl}</guid>
                <description><![CDATA[Access official ${examLabel} ${paper.exam_year} question paper with section-wise questions, verified answer keys, and detailed KaTeX solutions.]]></description>
                <pubDate>${pubDate}</pubDate>
                <category><![CDATA[PYQs]]></category>
              </item>`;
    }).join('\n');

  // ---------------------------------------------------------
  // 4. COMBINE RSS 2.0 XML
  // ---------------------------------------------------------
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>JEE Challenger - Complete JEE Preparation Platform</title>
    <link>${siteUrl}</link>
    <description>Free JEE Preparation Platform: Study Materials, AI Tutor, Previous Year Questions, Syllabus Tracker for Physics, Chemistry &amp; Mathematics</description>
    <language>en-IN</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/images/jcicon.jpg</url>
      <title>JEE Challenger</title>
      <link>${siteUrl}</link>
    </image>

${staticItems}

${dynamicBlogItems}

${dynamicPaperItems}

  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}