// RSS Feed for JEE Challenger
export async function GET() {
  const siteUrl = 'https://jeechallenger.vercel.app';
  const currentDate = new Date().toUTCString();
  
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
    
    <item>
      <title>JEE Main Official Papers and Resources</title>
      <link>${siteUrl}/official-links/jee-main</link>
      <guid isPermaLink="true">${siteUrl}/official-links/jee-main</guid>
      <description>Access official JEE Main papers, answer keys, and important updates from NTA</description>
      <pubDate>${currentDate}</pubDate>
      <category>JEE Main</category>
    </item>
    
    <item>
      <title>JEE Advanced Official Papers and Resources</title>
      <link>${siteUrl}/official-links/jee-advanced</link>
      <guid isPermaLink="true">${siteUrl}/official-links/jee-advanced</guid>
      <description>Access official JEE Advanced papers and resources from IITs</description>
      <pubDate>${currentDate}</pubDate>
      <category>JEE Advanced</category>
    </item>
    
    <item>
      <title>Physics Study Materials for JEE</title>
      <link>${siteUrl}/materials/physics</link>
      <guid isPermaLink="true">${siteUrl}/materials/physics</guid>
      <description>Complete Physics study materials for JEE Main and Advanced preparation</description>
      <pubDate>${currentDate}</pubDate>
      <category>Physics</category>
    </item>
    
    <item>
      <title>Chemistry Study Materials for JEE</title>
      <link>${siteUrl}/materials/chemistry</link>
      <guid isPermaLink="true">${siteUrl}/materials/chemistry</guid>
      <description>Complete Chemistry study materials for JEE Main and Advanced preparation</description>
      <pubDate>${currentDate}</pubDate>
      <category>Chemistry</category>
    </item>
    
    <item>
      <title>Mathematics Study Materials for JEE</title>
      <link>${siteUrl}/materials/mathematics</link>
      <guid isPermaLink="true">${siteUrl}/materials/mathematics</guid>
      <description>Complete Mathematics study materials for JEE Main and Advanced preparation</description>
      <pubDate>${currentDate}</pubDate>
      <category>Mathematics</category>
    </item>
    
    <item>
      <title>JEE Syllabus Tracker</title>
      <link>${siteUrl}/syllabus-tracker</link>
      <guid isPermaLink="true">${siteUrl}/syllabus-tracker</guid>
      <description>Track your JEE preparation progress across all subjects and chapters</description>
      <pubDate>${currentDate}</pubDate>
      <category>Tools</category>
    </item>
    
    <item>
      <title>AI Tutor for JEE Preparation</title>
      <link>${siteUrl}/ai-tutor</link>
      <guid isPermaLink="true">${siteUrl}/ai-tutor</guid>
      <description>Get personalized JEE preparation help with our AI-powered tutor</description>
      <pubDate>${currentDate}</pubDate>
      <category>AI Tools</category>
    </item>
    
    <item>
      <title>Chapter-wise Solved PYQs</title>
      <link>${siteUrl}/materials/chapterwise-solved-pyqs</link>
      <guid isPermaLink="true">${siteUrl}/materials/chapterwise-solved-pyqs</guid>
      <description>Get chapter-wise solved previous years' JEE papers from last 43 years</description>
      <pubDate>${currentDate}</pubDate>
      <category>Previous Year Questions</category>
    </item>
    
    <item>
      <title>Latest JEE News and Updates</title>
      <link>${siteUrl}/news</link>
      <guid isPermaLink="true">${siteUrl}/news</guid>
      <description>Stay updated with the latest JEE news, exam dates, and important announcements</description>
      <pubDate>${currentDate}</pubDate>
      <category>News</category>
    </item>
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
