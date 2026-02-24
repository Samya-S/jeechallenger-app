// Image Sitemap for JEE Challenger
export async function GET() {
	const siteUrl = 'https://jeechallenger.vercel.app';

	// List all important images used on the site
	const images = [
		{
			loc: `${siteUrl}`,
			images: [
				{
					url: `${siteUrl}/images/jcicon.jpg`,
					title: 'JEE Challenger Logo',
					caption: 'JEE Challenger - Complete JEE Preparation Platform'
				},
				{
					url: `${siteUrl}/images/home.webp`,
					title: 'JEE Challenger Homepage Banner',
					caption: 'One-stop platform for all your JEE preparation needs'
				}
			]
		},
		{
			loc: `${siteUrl}/materials/physics`,
			images: [
				{
					url: `${siteUrl}/images/physics.jpg`,
					title: 'JEE Physics Study Materials',
					caption: 'Complete Physics study materials for JEE preparation'
				}
			]
		},
		{
			loc: `${siteUrl}/materials/chemistry`,
			images: [
				{
					url: `${siteUrl}/images/chemistry.jpg`,
					title: 'JEE Chemistry Study Materials',
					caption: 'Complete Chemistry study materials for JEE preparation'
				}
			]
		},
		{
			loc: `${siteUrl}/materials/mathematics`,
			images: [
				{
					url: `${siteUrl}/images/maths.jpg`,
					title: 'JEE Mathematics Study Materials',
					caption: 'Complete Mathematics study materials for JEE preparation'
				}
			]
		},
		{
			loc: `${siteUrl}/materials/chapterwise-solved-pyqs`,
			images: [
				{
					url: `${siteUrl}/images/pyqs.jpg`,
					title: 'JEE Chapter-wise Solved Previous Year Questions',
					caption: 'Chapter-wise solved PYQs from last 43 years'
				}
			]
		},
		{
			loc: `${siteUrl}`,
			images: [
				{
					url: `${siteUrl}/images/ncertpdfs.jpg`,
					title: 'NCERT Books PDF Download',
					caption: 'Download official NCERT textbooks in PDF format'
				},
				{
					url: `${siteUrl}/images/Unacademy-banner.jpg`,
					title: 'Unacademy Platform',
					caption: 'India\'s largest learning platform for JEE preparation'
				},
				{
					url: `${siteUrl}/images/apnikaksha2.jpg`,
					title: 'Apni Kaksha Platform',
					caption: 'Premium education for all at affordable prices'
				},
				{
					url: `${siteUrl}/images/pwallah.jpg`,
					title: 'Physics Wallah Platform',
					caption: 'Most affordable learning platform for JEE aspirants'
				}
			]
		}
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(page => `  <url>
    <loc>${page.loc}</loc>
${page.images.map(img => `    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:title>${img.title}</image:title>
      <image:caption>${img.caption}</image:caption>
    </image:image>`).join('\n')}
  </url>`).join('\n')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
		},
	});
}
