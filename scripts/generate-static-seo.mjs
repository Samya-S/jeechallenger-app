import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SITE_URL = 'https://www.jeechallenger.com';
const PYQS_API_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function packOgImageParams({ title, subtitle, theme = 'brand', badge }) {
  const payload = {
    t: (title || 'JEE Challenger').trim().slice(0, 120),
    th: theme || 'brand',
  };
  const cleanSubtitle = subtitle ? subtitle.trim().slice(0, 200) : '';
  if (cleanSubtitle) payload.s = cleanSubtitle;
  const cleanBadge = badge ? badge.trim().slice(0, 60) : '';
  if (cleanBadge) payload.b = cleanBadge;
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
}

function getOgUrl(title, subtitle, theme, badge) {
  const q = packOgImageParams({ title, subtitle, theme, badge });
  return `${SITE_URL}/og?q=${q}`;
}

const getPageMetadata = (pagePath) => {
  try {
    if (!fs.existsSync(pagePath)) return null;
    const content = fs.readFileSync(pagePath, 'utf8');
    const ogMatch = content.match(/ogImageMeta\(\s*\{([\s\S]*?)\}\s*\)/);
    if (ogMatch) {
      const titleMatch = ogMatch[1].match(/title:\s*(['"`])(.*?)\1/);
      const subtitleMatch = ogMatch[1].match(/subtitle:\s*(['"`])(.*?)\1/);
      const themeMatch = ogMatch[1].match(/theme:\s*(['"`])(.*?)\1/);
      const badgeMatch = ogMatch[1].match(/badge:\s*(['"`])(.*?)\1/);
      return {
        title: titleMatch ? titleMatch[2] : null,
        subtitle: subtitleMatch ? subtitleMatch[2] : null,
        theme: themeMatch ? themeMatch[2] : null,
        badge: badgeMatch ? badgeMatch[2] : null,
      };
    }
  } catch (e) {
    console.error(`Error reading metadata from ${pagePath}:`, e.message);
  }
  return null;
};

function getAllBlogArticles() {
  const blogsDir = path.join(process.cwd(), 'data', 'blogs');
  if (!fs.existsSync(blogsDir)) return [];

  const files = fs.readdirSync(blogsDir);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const fullPath = path.join(blogsDir, file);
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(content);
        return {
          slug,
          title: data.title || '',
          excerpt: data.excerpt || '',
          date: data.date || '',
          category: data.category || 'Blog',
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

async function fetchDynamicPapers() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${PYQS_API_URL}/papers`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || json.papers || [];
  } catch (e) {
    console.warn('[static-seo] Warning: Failed to fetch papers:', e.message);
    return [];
  }
}

async function fetchDynamicQuestions() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const firstRes = await fetch(`${PYQS_API_URL}/questions?limit=100&page=1`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);
    if (!firstRes.ok) return [];

    const firstJson = await firstRes.json();
    const totalPages = firstJson.meta?.total_pages || 1;
    let allQuestions = [...(firstJson.data || [])];

    if (totalPages > 1) {
      const promises = [];
      for (let p = 2; p <= totalPages; p++) {
        promises.push(
          (async () => {
            try {
              const pController = new AbortController();
              const pTimeout = setTimeout(() => pController.abort(), 10000);
              const pRes = await fetch(`${PYQS_API_URL}/questions?limit=100&page=${p}`, {
                signal: pController.signal,
                headers: { Accept: 'application/json' },
              });
              clearTimeout(pTimeout);
              if (pRes.ok) {
                const pJson = await pRes.json();
                return pJson.data || [];
              }
            } catch (err) {
              console.warn(`[static-seo] Warning: Failed to fetch questions page ${p}:`, err.message);
            }
            return [];
          })()
        );
      }
      const rest = await Promise.all(promises);
      rest.forEach((items) => allQuestions.push(...items));
    }
    return allQuestions;
  } catch (e) {
    console.warn('[static-seo] Warning: Failed to fetch questions:', e.message);
    return [];
  }
}

function getValidStaticRoutes(dir, currentPath = []) {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) return [];

  let routes = [];
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });

  const pageFileEntry = entries.find(
    (e) => e.isFile() && (e.name === 'page.js' || e.name === 'page.jsx' || e.name === 'page.tsx')
  );
  if (dir !== 'app' && pageFileEntry) {
    const isDirRouteGroup = path.basename(dir).startsWith('(');
    const folderNameForTitle =
      isDirRouteGroup && currentPath.length > 0 ? currentPath[currentPath.length - 1] : path.basename(dir);

    routes.push({
      folderName: folderNameForTitle,
      basePath: currentPath.join('/'),
      pagePath: path.join(fullPath, pageFileEntry.name),
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
        name === 'image-sitemap.xml' ||
        name === 'rss.xml' ||
        name === 'og' ||
        name === 'login' ||
        name === 'profile'
      ) {
        return;
      }

      const isRouteGroup = name.startsWith('(') && name.endsWith(')');
      const newPath = isRouteGroup ? [...currentPath] : [...currentPath, name];
      routes = routes.concat(getValidStaticRoutes(path.join(dir, name), newPath));
    }
  });

  return routes;
}

function formatRouteDetails(route) {
  const parts = route.basePath.split('/').filter(Boolean);
  const namePart = parts[parts.length - 1] || 'Home';
  const categoryPart = parts.length > 1 ? parts[0] : 'General';

  const title = namePart.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const category = categoryPart.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    urlPath: `/${route.basePath}`,
    title: `${title} - JEE Challenger`,
    description: `Explore ${title} resources and study materials on JEE Challenger.`,
    category,
  };
}

async function generateImageSitemap(staticRoutes, blogArticles, papers, questions) {
  const publicImagesPath = path.join(process.cwd(), 'public', 'images');
  let allPublicImages = [];

  if (fs.existsSync(publicImagesPath)) {
    const files = fs.readdirSync(publicImagesPath);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    allPublicImages = files.filter((file) => validExtensions.includes(path.extname(file).toLowerCase()));
  }

  let unassignedImages = [...allPublicImages];

  // Static pages
  const staticRoutePages = staticRoutes.map((route) => {
    let titleName = route.folderName
      .replace(/[()]/g, '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const pathSegments = route.basePath.split('/');
    let subtitle = 'Resources';
    if (pathSegments.length > 1) {
      subtitle = pathSegments[0]
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    let theme = undefined;
    let badge = undefined;

    const extractedMeta = getPageMetadata(route.pagePath);
    if (extractedMeta) {
      if (extractedMeta.title) titleName = extractedMeta.title;
      if (extractedMeta.subtitle) subtitle = extractedMeta.subtitle;
      if (extractedMeta.theme) theme = extractedMeta.theme;
      if (extractedMeta.badge) badge = extractedMeta.badge;
    }

    const pageImages = [
      {
        url: getOgUrl(titleName, subtitle, theme, badge),
        title: titleName,
        caption: subtitle,
      },
    ];

    const matchedImages = unassignedImages.filter((img) => {
      const imgName = path.parse(img).name.toLowerCase();
      const targetFolder = route.folderName.replace(/[()]/g, '').toLowerCase();
      return imgName === targetFolder || imgName.startsWith(`${targetFolder}-`) || imgName.startsWith(`${targetFolder}_`);
    });

    matchedImages.forEach((img) => {
      pageImages.push({
        url: `${SITE_URL}/images/${img}`,
        title: `${titleName} Visual`,
        caption: `${titleName} Image Resource`,
      });
      unassignedImages = unassignedImages.filter((unassigned) => unassigned !== img);
    });

    return {
      loc: `${SITE_URL}/${route.basePath}`,
      images: pageImages,
    };
  });

  // Homepage
  let homeTitle = 'JEE Challenger';
  let homeSubtitle =
    'Free JEE Preparation Platform: Study Materials, AI Tutor, Previous Year Questions, Syllabus Tracker for Physics, Chemistry & Mathematics';
  let homeTheme = 'brand';
  let homeBadge = undefined;

  const layoutMeta = getPageMetadata(path.join(process.cwd(), 'app', 'layout.jsx'));
  if (layoutMeta) {
    if (layoutMeta.title) homeTitle = layoutMeta.title;
    if (layoutMeta.subtitle) homeSubtitle = layoutMeta.subtitle;
    if (layoutMeta.theme) homeTheme = layoutMeta.theme;
    if (layoutMeta.badge) homeBadge = layoutMeta.badge;
  }

  const homePageImages = [
    {
      url: getOgUrl(homeTitle, homeSubtitle, homeTheme, homeBadge),
      title: homeTitle,
      caption: homeSubtitle,
    },
  ];

  unassignedImages.forEach((img) => {
    const titleFromName = path
      .parse(img)
      .name.split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    homePageImages.push({
      url: `${SITE_URL}/images/${img}`,
      title: `JEE Challenger - ${titleFromName}`,
      caption: `JEE Challenger Visual Resource: ${titleFromName}`,
    });
  });

  const homePage = {
    loc: `${SITE_URL}`,
    images: homePageImages,
  };

  // Blog pages
  const blogPages = blogArticles.map((article) => ({
    loc: `${SITE_URL}/blog/${article.slug}`,
    images: [
      {
        url: getOgUrl(article.title, article.excerpt, 'blog', 'JEE Challenger Blog'),
        title: `${article.title} | JEE Challenger`,
        caption: article.excerpt || `Read about ${article.title} on JEE Challenger`,
      },
    ],
  }));

  // Paper pages
  const paperPages = papers
    .filter((paper) => paper && paper.slug)
    .map((paper) => {
      const examLabel = paper.exam_type === 'JEE_ADVANCED' ? 'JEE Advanced' : 'JEE Main';
      const ogTitle = paper.title || `${examLabel} ${paper.exam_year} Question Paper`;
      const ogSubtitle = `${examLabel} • ${paper.exam_year} • Complete Paper & Solutions`;

      return {
        loc: `${SITE_URL}/paper/${paper.slug}`,
        images: [
          {
            url: getOgUrl(ogTitle, ogSubtitle, 'pyqs', 'JEE Challenger'),
            title: `${ogTitle} | Solutions & Answer Key`,
            caption: `Access full ${examLabel} ${paper.exam_year} official question paper with section-wise questions, verified answer keys, and step-by-step KaTeX solutions.`,
          },
        ],
      };
    });

  // Question pages with diagrams
  const questionPages = questions
    .filter((q) => q && q.slug)
    .map((q) => {
      const examLabel = q.exam_type === 'JEE_ADVANCED' ? 'JEE Advanced' : 'JEE Main';
      const examOrigin = `${examLabel} ${q.exam_year || ''}`.trim();
      const ogTitle = q.title || 'JEE Previous Year Question';
      const ogSubtitle = `${q.subject || ''} • ${q.chapter || ''} • ${examOrigin}`;

      const images = [
        {
          url: getOgUrl(ogTitle, ogSubtitle, 'pyqs', 'JEE Challenger'),
          title: `${ogTitle} | ${q.subject || 'JEE'} PYQ Solution`,
          caption: `Detailed step-by-step solution for ${q.subject || ''} - ${q.chapter || ''} ${examOrigin} Previous Year Question with KaTeX formulas and answer key.`,
        },
      ];

      if (Array.isArray(q.question_diagram_urls)) {
        q.question_diagram_urls.forEach((imgUrl, i) => {
          if (imgUrl && typeof imgUrl === 'string') {
            images.push({
              url: imgUrl,
              title: `${ogTitle} - Question Diagram ${i + 1}`,
              caption: `Official Question Diagram for ${q.subject || 'JEE'} - ${q.chapter || ''}`,
            });
          }
        });
      }

      if (Array.isArray(q.linked_passage_diagram_urls)) {
        q.linked_passage_diagram_urls.forEach((imgUrl, i) => {
          if (imgUrl && typeof imgUrl === 'string') {
            images.push({
              url: imgUrl,
              title: `${ogTitle} - Passage Diagram ${i + 1}`,
              caption: `Passage diagram for ${ogTitle}`,
            });
          }
        });
      }

      if (q.options && typeof q.options === 'object') {
        ['A', 'B', 'C', 'D'].forEach((key) => {
          const opt = q.options[key];
          if (opt && opt.diagram_url && typeof opt.diagram_url === 'string') {
            images.push({
              url: opt.diagram_url,
              title: `${ogTitle} - Option ${key} Diagram`,
              caption: `Option ${key} diagram for ${ogTitle}`,
            });
          }
        });
      }

      return {
        loc: `${SITE_URL}/question/${q.slug}`,
        images,
      };
    });

  const allPages = [homePage, ...staticRoutePages, ...blogPages, ...paperPages, ...questionPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(page.loc)}</loc>
${page.images
  .map(
    (img) => `    <image:image>
      <image:loc>${escapeXml(img.url)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>`
  )
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
}

function generateRssXml(staticRoutes, blogArticles, papers) {
  const currentDate = new Date().toUTCString();

  const staticItems = staticRoutes
    .map((route) => {
      const pageDetails = formatRouteDetails(route);
      const pageUrl = `${SITE_URL}${pageDetails.urlPath}`;

      return `<item>
              <title><![CDATA[${pageDetails.title}]]></title>
              <link>${pageUrl}</link>
              <guid isPermaLink="true">${pageUrl}</guid>
              <description><![CDATA[${pageDetails.description}]]></description>
              <pubDate>${currentDate}</pubDate>
              <category><![CDATA[${pageDetails.category}]]></category>
            </item>`;
    })
    .join('\n');

  const dynamicBlogItems = blogArticles
    .map((article) => {
      const articleUrl = `${SITE_URL}/blog/${article.slug}`;
      return `<item>
              <title><![CDATA[${article.title}]]></title>
              <link>${articleUrl}</link>
              <guid isPermaLink="true">${articleUrl}</guid>
              <description><![CDATA[${article.excerpt}]]></description>
              <pubDate>${new Date(article.date).toUTCString()}</pubDate>
              <category><![CDATA[${article.category || 'Blog'}]]></category>
            </item>`;
    })
    .join('\n');

  const dynamicPaperItems = papers
    .filter((paper) => paper && paper.slug)
    .map((paper) => {
      const examLabel = paper.exam_type === 'JEE_ADVANCED' ? 'JEE Advanced' : 'JEE Main';
      const title = paper.title || `${examLabel} ${paper.exam_year} Question Paper`;
      const pageUrl = `${SITE_URL}/paper/${paper.slug}`;
      const pubDate = paper.approved_at ? new Date(paper.approved_at).toUTCString() : currentDate;

      return `<item>
                <title><![CDATA[${title} - Full Paper & Solutions]]></title>
                <link>${pageUrl}</link>
                <guid isPermaLink="true">${pageUrl}</guid>
                <description><![CDATA[Access official ${examLabel} ${paper.exam_year} question paper with section-wise questions, verified answer keys, and detailed KaTeX solutions.]]></description>
                <pubDate>${pubDate}</pubDate>
                <category><![CDATA[PYQs]]></category>
              </item>`;
    })
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
    xmlns:atom="http://www.w3.org/2005/Atom"
    xmlns:content="http://purl.org/rss/1.0/modules/content/"
    xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>JEE Challenger - Complete JEE Preparation Platform</title>
    <link>${SITE_URL}</link>
    <description>Free JEE Preparation Platform: Study Materials, AI Tutor, Previous Year Questions, Syllabus Tracker for Physics, Chemistry &amp; Mathematics</description>
    <language>en-IN</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/images/jcicon.jpg</url>
      <title>JEE Challenger</title>
      <link>${SITE_URL}</link>
    </image>

${staticItems}

${dynamicBlogItems}

${dynamicPaperItems}

  </channel>
</rss>`;

  return rss;
}

async function main() {
  console.log('[static-seo] Generating static image-sitemap.xml and rss.xml at build time...');

  const staticRoutes = getValidStaticRoutes('app');
  const blogArticles = getAllBlogArticles();

  console.log(`[static-seo] Found ${staticRoutes.length} static routes and ${blogArticles.length} blog articles.`);
  console.log('[static-seo] Fetching dynamic papers and questions from PYQs API...');

  const [papers, questions] = await Promise.all([fetchDynamicPapers(), fetchDynamicQuestions()]);

  console.log(`[static-seo] Fetched ${papers.length} papers and ${questions.length} questions.`);

  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Generate image-sitemap.xml
  const imageSitemapXml = await generateImageSitemap(staticRoutes, blogArticles, papers, questions);
  const imageSitemapPath = path.join(publicDir, 'image-sitemap.xml');
  fs.writeFileSync(imageSitemapPath, imageSitemapXml, 'utf8');
  console.log(`[static-seo] Wrote ${imageSitemapPath} (${(Buffer.byteLength(imageSitemapXml) / 1024).toFixed(1)} KB)`);

  // 2. Generate rss.xml
  const rssXml = generateRssXml(staticRoutes, blogArticles, papers);
  const rssPath = path.join(publicDir, 'rss.xml');
  fs.writeFileSync(rssPath, rssXml, 'utf8');
  console.log(`[static-seo] Wrote ${rssPath} (${(Buffer.byteLength(rssXml) / 1024).toFixed(1)} KB)`);

  console.log('[static-seo] Done! Static SEO generation complete.');
}

main().catch((err) => {
  console.error('[static-seo] Error:', err);
  process.exit(1);
});
