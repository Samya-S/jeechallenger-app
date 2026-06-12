import { getSiteUrl } from "@/lib/site-url";
import { getAllArticles } from "@/lib/articles";
import fs from 'fs';
import path from 'path';

/**
 * Recursively crawls the /app directory to find all static pages
 * It ignores dynamic routes (like [slug]), api routes, and hidden/component folders.
 */
function getStaticPages(dir, routePrefix = '') {
  let pages = [];
  
  // Read all files and folders in the current directory
  const files = fs.readdirSync(dir);

  for (const file of files) {
    // Skip hidden files, system folders, components, API routes, and dynamic route brackets [slug]
    if (file.startsWith('.') || file.startsWith('_') || file.includes('[') || file === 'api') {
      continue;
    }

    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // If it's a folder, search inside it recursively
      pages = pages.concat(getStaticPages(fullPath, `${routePrefix}/${file}`));
    } else if (file === 'page.js' || file === 'page.jsx') {
      // If it's a page file, register the route (ignore the root homepage '/')
      if (routePrefix !== '') {
         pages.push(routePrefix);
      }
    }
  }
  return pages;
}

/**
 * Formats a raw URL route (e.g., "/materials/physics") into readable Titles & Categories
 */
function formatRouteDetails(route) {
  const parts = route.split('/').filter(Boolean);
  const namePart = parts[parts.length - 1]; // e.g., "physics"
  const categoryPart = parts.length > 1 ? parts[0] : "General"; // e.g., "materials"

  // Format strings: "jee-main" -> "Jee Main"
  const title = namePart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const category = categoryPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    slug: route,
    title: `${title} - JEE Challenger`,
    description: `Explore resources for ${title} on JEE Challenger.`,
    category: category
  };
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const currentDate = new Date().toUTCString();
  
  // ---------------------------------------------------------
  // 1. AUTO-DISCOVER STATIC PAGES FROM THE FILESYSTEM
  // ---------------------------------------------------------
  const appDirectory = path.join(process.cwd(), 'app');
  const staticRoutes = getStaticPages(appDirectory);
  
  const staticItems = staticRoutes.map((route) => {
    const pageDetails = formatRouteDetails(route);
    const pageUrl = `${siteUrl}${pageDetails.slug}`;
    
    return `<item>
              <title><![CDATA[${pageDetails.title}]]></title>
              <link>${pageUrl}</link>
              <guid isPermaLink="true">${pageUrl}</guid>
              <description><![CDATA[${pageDetails.description}]]></description>
              <pubDate>${currentDate}</pubDate>
              <category><![CDATA[${pageDetails.category}]]></category>
            </item>`;
  }).join('');

  // ---------------------------------------------------------
  // 2. FETCH DYNAMIC BLOG ARTICLES
  // ---------------------------------------------------------
  const articles = getAllArticles(false);
  const dynamicItems = articles.map((article) => {
    const articleUrl = `${siteUrl}/blog/${article.slug}`;
    return `<item>
              <title><![CDATA[${article.title}]]></title>
              <link>${articleUrl}</link>
              <guid isPermaLink="true">${articleUrl}</guid>
              <description><![CDATA[${article.excerpt}]]></description>
              <pubDate>${new Date(article.date).toUTCString()}</pubDate>
              <category><![CDATA[${article.category}]]></category>
            </item>`;
  }).join('');

  // ---------------------------------------------------------
  // 3. COMBINE XML
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

                  ${dynamicItems}
                  
                </channel>
              </rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}