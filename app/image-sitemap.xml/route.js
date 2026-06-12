import { getAllArticles } from '@/lib/articles';
import { getSiteUrl } from '@/lib/site-url';
import fs from 'fs';
import path from 'path';

// CRITICAL: Forces Next.js to run this script at build-time. 
// Ensures 'fs' can safely read your directories on Vercel without crashing.
export const dynamic = 'force-static';

export async function GET() {
    const siteUrl = getSiteUrl();

    // Helper to safely encode parameters for the OG Image generator
    const getOgUrl = (title, subtitle) => {
        return `${siteUrl}/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`;
    };

    // 1. Read ALL files in public/images into a pool
    // Added turbopackIgnore comment to prevent Next.js from tracing the whole repository
    const publicImagesPath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'images');
    let allPublicImages = [];
    
    if (fs.existsSync(publicImagesPath)) {
        const files = fs.readdirSync(publicImagesPath);
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
        // Filter out non-images
        allPublicImages = files.filter(file => validExtensions.includes(path.extname(file).toLowerCase()));
    }

    // This array acts as our "pool". As images are assigned to specific routes, they are removed.
    let unassignedImages = [...allPublicImages];

    // 2. The Auto-Scanner Function
    const scanDirectory = (dirPath, basePath, subtitle) => {
        const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), dirPath);
        if (!fs.existsSync(fullPath)) return [];

        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        const pages = [];

        entries.forEach(entry => {
            // Only process valid route folders
            if (entry.isDirectory() && !entry.name.startsWith('[')) {
                const folderName = entry.name;
                const titleName = folderName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                // Always generate the dynamic OG image for the route
                const pageImages = [{
                    url: getOgUrl(titleName, subtitle),
                    title: `${titleName} - JEE Challenger`,
                    caption: `Explore ${titleName} resources on JEE Challenger`
                }];

                // Smart Matcher: Find images in the pool that belong to this route
                // Matches exact names (e.g., 'physics.jpg') OR prefix names (e.g., 'physics_banner.jpg')
                const matchedImages = unassignedImages.filter(img => {
                    const imgName = path.parse(img).name.toLowerCase();
                    const targetFolder = folderName.toLowerCase();
                    return imgName === targetFolder || imgName.startsWith(`${targetFolder}-`) || imgName.startsWith(`${targetFolder}_`);
                });

                // Attach matched static images to this route and remove them from the pool
                matchedImages.forEach(img => {
                    pageImages.push({
                        url: `${siteUrl}/images/${img}`,
                        title: `${titleName} Visual`,
                        caption: `${titleName} Image Resource`
                    });
                    // Remove claimed image from the unassigned pool
                    unassignedImages = unassignedImages.filter(unassigned => unassigned !== img);
                });

                pages.push({
                    loc: `${siteUrl}/${basePath}/${folderName}`,
                    images: pageImages
                });
            }
        });
        return pages;
    };

    // 3. Automatically Scan your App Directories
    const materials = scanDirectory('app/materials', 'materials', 'Study Materials');
    const platforms = scanDirectory('app/more-platforms', 'more-platforms', 'More Platforms');
    const officialLinks = scanDirectory('app/official-links', 'official-links', 'Official Resources');

    // 4. The Homepage (Takes the Dynamic OG + all leftover static images in the pool)
    const homePageImages = [
        { 
            url: getOgUrl('JEE Challenger', 'Complete JEE Preparation Platform'), 
            title: 'JEE Challenger', 
            caption: 'One-stop platform for all your JEE preparation needs' 
        }
    ];

    // Any image that didn't match a specific folder gets attached to the homepage
    unassignedImages.forEach(img => {
        // Create a readable title out of the filename (e.g., 'jcicon' -> 'Jcicon')
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

    // 5. Standalone Tools/Pages (Only OG images since they don't have matching folders in this context)
    const standalonePages = [
        { path: 'syllabus-tracker', title: 'JEE Syllabus Tracker', subtitle: 'Tools' },
        { path: 'news', title: 'JEE News & Updates', subtitle: 'News' },
        { path: 'ai-tutor', title: 'JEE Challenger AI Tutor', subtitle: 'AI Tutor' }
    ].map(page => ({
        loc: `${siteUrl}/${page.path}`,
        images: [{
            url: getOgUrl(page.title, page.subtitle),
            title: page.title,
            caption: `Explore ${page.title} on JEE Challenger`
        }]
    }));

    // 6. Auto-fetch Dynamic Blog Posts
    const articles = await getAllArticles(false);
    const blogPages = articles.map((article) => {
        return {
            loc: `${siteUrl}/blog/${article.slug}`,
            images: [{
                url: getOgUrl(article.title || 'JEE Challenger Article', article.category || 'Blog'),
                title: article.title,
                caption: article.excerpt || `Read about ${article.title} on JEE Challenger`
            }]
        };
    });

    // Combine everything
    const allPages = [homePage, ...materials, ...platforms, ...officialLinks, ...standalonePages, ...blogPages];

    // Generate XML safely
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
					<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
							xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
					${allPages.map(page => `  <url>
						<loc>${page.loc}</loc>
					${page.images.map(img => `    <image:image>
						<image:loc>${img.url.replace(/&/g, '&amp;')}</image:loc>
						<image:title>${img.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:title>
						<image:caption>${img.caption.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</image:caption>
						</image:image>`).join('\n')}
					</url>`).join('\n')}
					</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8'
        },
    });
}