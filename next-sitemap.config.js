const { getSiteUrl } = require('./lib/site-url');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: getSiteUrl(),
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  exclude: ['/rss.xml', '/image-sitemap.xml', '/api/*'],
  generateIndexSitemap: false, // Prevents creating an index sitemap
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
    additionalSitemaps: [
      `${getSiteUrl()}/image-sitemap.xml`,
    ],
  },
};
