/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://jeechallenger.vercel.app",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  exclude: [],
  generateIndexSitemap: false, // Prevents creating an index sitemap
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};
