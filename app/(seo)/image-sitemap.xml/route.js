import { getAllArticles } from '@/utils/articles';
import { getSiteUrl } from '@/config/site-url';
import { buildAbsoluteOgImageUrl } from '@/utils/og-metadata';
import fs from 'fs';
import path from 'path';

// Revalidate sitemap every hour for fresh dynamic routes
export const revalidate = 3600;

function escapeXml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
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
                badge: badgeMatch ? badgeMatch[2] : null
            };
        }
    } catch (e) {
        console.error(`Error reading metadata from ${pagePath}:`, e);
    }
    return null;
};

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
        console.error('Error fetching papers for image-sitemap:', e.message);
        return [];
    }
}

async function getDynamicQuestions() {
    try {
        const PYQS_API_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const firstRes = await fetch(`${PYQS_API_URL}/questions?limit=100&page=1`, {
            signal: controller.signal,
            next: { revalidate: 3600 }
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
                            const pTimeout = setTimeout(() => pController.abort(), 8000);
                            const pRes = await fetch(`${PYQS_API_URL}/questions?limit=100&page=${p}`, {
                                signal: pController.signal,
                                next: { revalidate: 3600 }
                            });
                            clearTimeout(pTimeout);
                            if (pRes.ok) {
                                const pJson = await pRes.json();
                                return pJson.data || [];
                            }
                        } catch (err) {
                            console.error(`Error fetching questions page ${p} for image-sitemap:`, err.message);
                        }
                        return [];
                    })()
                );
            }
            const rest = await Promise.all(promises);
            rest.forEach(items => allQuestions.push(...items));
        }
        return allQuestions;
    } catch (e) {
        console.error('Error fetching questions for image-sitemap:', e.message);
        return [];
    }
}

export async function GET() {
    const siteUrl = getSiteUrl();

    // Helper to safely encode parameters for the OG Image generator
    const getOgUrl = (title, subtitle, theme, badge) => {
        const options = { title, subtitle };
        if (theme) options.theme = theme;
        if (badge) options.badge = badge;
        return buildAbsoluteOgImageUrl(options);
    };

    // 1. Read ALL files in public/images into a pool
    const publicImagesPath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'images');
    let allPublicImages = [];
    
    if (fs.existsSync(publicImagesPath)) {
        const files = fs.readdirSync(publicImagesPath);
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        allPublicImages = files.filter(file => validExtensions.includes(path.extname(file).toLowerCase()));
    }

    let unassignedImages = [...allPublicImages];

    // 2. Dynamic Next.js App Traversal for static pages
    const getValidRoutes = (dir, currentPath = []) => {
        const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), dir);
        if (!fs.existsSync(fullPath)) return [];

        let routes = [];
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        
        const pageFileEntry = entries.find(e => e.isFile() && (e.name === 'page.js' || e.name === 'page.jsx' || e.name === 'page.tsx'));
        if (dir !== 'app' && pageFileEntry) {
            const isDirRouteGroup = path.basename(dir).startsWith('(');
            const folderNameForTitle = isDirRouteGroup && currentPath.length > 0 
                ? currentPath[currentPath.length - 1] 
                : path.basename(dir);

            routes.push({
                folderName: folderNameForTitle,
                basePath: currentPath.join('/'),
                pagePath: path.join(fullPath, pageFileEntry.name)
            });
        }

        entries.forEach(entry => {
            if (entry.isDirectory()) {
                const name = entry.name;
                
                if (
                    name.startsWith('[') ||
                    name.startsWith('_') ||
                    name.startsWith('@') ||
                    (name.startsWith('(') && name.includes('.')) ||
                    name === 'api' ||
                    name === 'image-sitemap.xml'
                ) {
                    return;
                }

                const isRouteGroup = name.startsWith('(') && name.endsWith(')');
                const newPath = isRouteGroup ? [...currentPath] : [...currentPath, name];
                
                routes = routes.concat(getValidRoutes(path.join(dir, name), newPath));
            }
        });

        return routes;
    };

    // 3. Automatically Scan App Directories to find static route pages
    const allStaticRoutes = getValidRoutes('app');
    
    const staticRoutePages = allStaticRoutes.map(route => {
        let titleName = route.folderName.replace(/[()]/g, '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        const pathSegments = route.basePath.split('/');
        let subtitle = 'Resources';
        if (pathSegments.length > 1) {
             subtitle = pathSegments[0].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
        
        const pageImages = [{
            url: getOgUrl(titleName, subtitle, theme, badge),
            title: titleName,
            caption: subtitle
        }];

        const matchedImages = unassignedImages.filter(img => {
            const imgName = path.parse(img).name.toLowerCase();
            const targetFolder = route.folderName.replace(/[()]/g, '').toLowerCase();
            return imgName === targetFolder || imgName.startsWith(`${targetFolder}-`) || imgName.startsWith(`${targetFolder}_`);
        });

        matchedImages.forEach(img => {
            pageImages.push({
                url: `${siteUrl}/images/${img}`,
                title: `${titleName} Visual`,
                caption: `${titleName} Image Resource`
            });
            unassignedImages = unassignedImages.filter(unassigned => unassigned !== img);
        });

        return {
            loc: `${siteUrl}/${route.basePath}`,
            images: pageImages
        };
    });

    // 4. The Homepage
    let homeTitle = 'JEE Challenger';
    let homeSubtitle = 'Free JEE Preparation Platform: Study Materials, AI Tutor, Previous Year Questions, Syllabus Tracker for Physics, Chemistry & Mathematics';
    let homeTheme = 'brand';
    let homeBadge = undefined;

    const layoutMeta = getPageMetadata(path.join(/*turbopackIgnore: true*/ process.cwd(), 'app', 'layout.jsx'));
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
            caption: homeSubtitle 
        }
    ];

    unassignedImages.forEach(img => {
        const titleFromName = path.parse(img).name.split(/[-_]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        homePageImages.push({
            url: `${siteUrl}/images/${img}`,
            title: `JEE Challenger - ${titleFromName}`,
            caption: `JEE Challenger Visual Resource: ${titleFromName}`
        });
    });

    const homePage = {
        loc: `${siteUrl}`,
        images: homePageImages
    };

    // 5. Dynamic Blog Posts
    let blogTheme = 'blog';
    let blogBadge = 'JEE Challenger Blog';
    
    const blogTemplateMeta = getPageMetadata(path.join(/*turbopackIgnore: true*/ process.cwd(), 'app', '(read-more)', 'blog', '[slug]', 'page.jsx'));
    if (blogTemplateMeta) {
        if (blogTemplateMeta.theme) blogTheme = blogTemplateMeta.theme;
        if (blogTemplateMeta.badge) blogBadge = blogTemplateMeta.badge;
    }

    const articles = await getAllArticles(false);
    const blogPages = articles.map((article) => {
        return {
            loc: `${siteUrl}/blog/${article.slug}`,
            images: [{
                url: getOgUrl(article.title, article.excerpt, blogTheme, blogBadge),
                title: `${article.title} | JEE Challenger`,
                caption: article.excerpt || `Read about ${article.title} on JEE Challenger`
            }]
        };
    });

    // 6. Dynamic PYQ Question Papers
    const papers = await getDynamicPapers();
    const paperPages = papers
        .filter(paper => paper && paper.slug)
        .map((paper) => {
            const examLabel = paper.exam_type === 'JEE_ADVANCED' ? 'JEE Advanced' : 'JEE Main';
            const ogTitle = paper.title || `${examLabel} ${paper.exam_year} Question Paper`;
            const ogSubtitle = `${examLabel} • ${paper.exam_year} • Complete Paper & Solutions`;
            
            return {
                loc: `${siteUrl}/papers/${paper.slug}`,
                images: [{
                    url: getOgUrl(ogTitle, ogSubtitle, 'pyqs', 'JEE Challenger'),
                    title: `${ogTitle} | Solutions & Answer Key`,
                    caption: `Access full ${examLabel} ${paper.exam_year} official question paper with section-wise questions, verified answer keys, and step-by-step KaTeX solutions.`
                }]
            };
        });

    // 7. Dynamic PYQ Questions with Diagrams
    const questions = await getDynamicQuestions();
    const questionPages = questions
        .filter(q => q && q.slug)
        .map((q) => {
            const examLabel = q.exam_type === 'JEE_ADVANCED' ? 'JEE Advanced' : 'JEE Main';
            const examOrigin = `${examLabel} ${q.exam_year || ''}`.trim();
            const ogTitle = q.title || 'JEE Previous Year Question';
            const ogSubtitle = `${q.subject || ''} • ${q.chapter || ''} • ${examOrigin}`;
            
            const images = [{
                url: getOgUrl(ogTitle, ogSubtitle, 'pyqs', 'JEE Challenger'),
                title: `${ogTitle} | ${q.subject || 'JEE'} PYQ Solution`,
                caption: `Detailed step-by-step solution for ${q.subject || ''} - ${q.chapter || ''} ${examOrigin} Previous Year Question with KaTeX formulas and answer key.`
            }];

            if (Array.isArray(q.question_diagram_urls)) {
                q.question_diagram_urls.forEach((imgUrl, i) => {
                    if (imgUrl && typeof imgUrl === 'string') {
                        images.push({
                            url: imgUrl,
                            title: `${ogTitle} - Question Diagram ${i + 1}`,
                            caption: `Official Question Diagram for ${q.subject || 'JEE'} - ${q.chapter || ''}`
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
                            caption: `Option ${key} diagram for ${ogTitle}`
                        });
                    }
                });
            }

            if (Array.isArray(q.solution_diagram_urls)) {
                q.solution_diagram_urls.forEach((imgUrl, i) => {
                    if (imgUrl && typeof imgUrl === 'string') {
                        images.push({
                            url: imgUrl,
                            title: `${ogTitle} - Solution Diagram ${i + 1}`,
                            caption: `Step-by-step solution derivation figure for ${ogTitle}`
                        });
                    }
                });
            }

            return {
                loc: `${siteUrl}/questions/${q.slug}`,
                images
            };
        });

    // Combine everything
    const allPages = [
        homePage, 
        ...staticRoutePages, 
        ...blogPages, 
        ...paperPages, 
        ...questionPages
    ];

    // Generate XML safely
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => `  <url>
    <loc>${escapeXml(page.loc)}</loc>
${page.images.map(img => `    <image:image>
      <image:loc>${escapeXml(img.url)}</image:loc>
      <image:title>${escapeXml(img.title)}</image:title>
      <image:caption>${escapeXml(img.caption)}</image:caption>
    </image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        },
    });
}