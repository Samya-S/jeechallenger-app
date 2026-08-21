import { getAllArticles } from '@/utils/articles';
import { getSiteUrl } from '@/config/site-url';
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

    // 2. Dynamic Next.js App Traversal
    const getValidRoutes = (dir, currentPath = []) => {
        const fullPath = path.join(/*turbopackIgnore: true*/ process.cwd(), dir);
        if (!fs.existsSync(fullPath)) return [];

        let routes = [];
        const entries = fs.readdirSync(fullPath, { withFileTypes: true });
        
        // Check if this directory has a page file (making it a valid route)
        // We skip the root 'app' folder because the homepage is handled separately
        if (dir !== 'app' && entries.some(e => e.isFile() && (e.name === 'page.js' || e.name === 'page.jsx' || e.name === 'page.tsx'))) {
            // If the folder is a route group, its name isn't part of the URL, so use the last path segment instead
            const isDirRouteGroup = path.basename(dir).startsWith('(');
            const folderNameForTitle = isDirRouteGroup && currentPath.length > 0 
                ? currentPath[currentPath.length - 1] 
                : path.basename(dir);

            routes.push({
                folderName: folderNameForTitle,
                basePath: currentPath.join('/')
            });
        }

        entries.forEach(entry => {
            if (entry.isDirectory()) {
                const name = entry.name;
                
                // --- NEXT.JS EDGE CASES ---
                if (
                    name.startsWith('[') || // 1. Dynamic routes (handled separately, e.g. blog)
                    name.startsWith('_') || // 2. Private folders
                    name.startsWith('@') || // 3. Parallel routes
                    (name.startsWith('(') && name.includes('.')) || // 4. Intercepting routes like (.), (..)
                    name === 'api' || // 5. API routes
                    name === 'image-sitemap.xml' // 6. Avoid infinite loops or self-scanning
                ) {
                    return; // Skip this folder entirely
                }

                // 7. Route Groups (e.g. '(resources)') do NOT add to the URL path
                const isRouteGroup = name.startsWith('(') && name.endsWith(')');
                const newPath = isRouteGroup ? [...currentPath] : [...currentPath, name];
                
                routes = routes.concat(getValidRoutes(path.join(dir, name), newPath));
            }
        });

        return routes;
    };

    // 3. Automatically Scan your App Directories dynamically
    const allDynamicRoutes = getValidRoutes('app');
    
    const dynamicPages = allDynamicRoutes.map(route => {
        // Clean up folder name for a readable title
        const titleName = route.folderName.replace(/[()]/g, '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // Use the parent path segment as subtitle if nested, else default to 'Resources'
        const pathSegments = route.basePath.split('/');
        let subtitle = 'Resources';
        if (pathSegments.length > 1) {
             subtitle = pathSegments[0].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
        
        const pageImages = [{
            url: getOgUrl(titleName, subtitle),
            title: `${titleName} - JEE Challenger`,
            caption: `Explore ${titleName} resources on JEE Challenger`
        }];

        // Smart Matcher: Find matching static images in public/images pool
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
            // Remove claimed image from the unassigned pool
            unassignedImages = unassignedImages.filter(unassigned => unassigned !== img);
        });

        return {
            loc: `${siteUrl}/${route.basePath}`,
            images: pageImages
        };
    });

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
    // 5. Auto-fetch Dynamic Blog Posts
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
    const allPages = [homePage, ...dynamicPages, ...blogPages];

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