/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://jeechallenger.vercel.app",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  exclude: ['/rss.xml', '/image-sitemap.xml', '/api/*'],
  generateIndexSitemap: false, // Prevents creating an index sitemap
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
    additionalSitemaps: [
      'https://jeechallenger.vercel.app/image-sitemap.xml',
    ],
  },
};
