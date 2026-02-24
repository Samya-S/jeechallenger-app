// Structured Data Component for SEO
// Generates JSON-LD schema for Google Rich Results

export default function StructuredData({ type, data }) {
  let schema = {};

  switch (type) {
    case 'organization':
      schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "JEE Challenger",
        "url": "https://jeechallenger.vercel.app",
        "logo": "https://jeechallenger.vercel.app/images/jcicon.jpg",
        "description": "Free JEE Preparation Platform with 5000+ study materials, AI-powered tutor, and previous year questions for JEE Main and Advanced",
        "foundingDate": "2020",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Student Support",
          "url": "https://jeechallenger.vercel.app/contact-us"
        },
        "sameAs": [
          "https://t.me/jeechallenger"
        ]
      };
      break;

    case 'website':
      schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "JEE Challenger",
        "url": "https://jeechallenger.vercel.app",
        "description": "Complete JEE preparation platform with free study materials, AI tutor, and syllabus tracker",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://jeechallenger.vercel.app?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      };
      break;

    case 'breadcrumb':
      schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": data.items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": `https://jeechallenger.vercel.app${item.path}`
        }))
      };
      break;

    case 'faq':
      schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": data.questions.map(q => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
          }
        }))
      };
      break;

    case 'softwareApplication':
      schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": data.name,
        "applicationCategory": "EducationalApplication",
        "offers": {
          "@type": "Offer",
          "price": data.price || "0",
          "priceCurrency": "INR"
        },
        "operatingSystem": "Web Browser",
        "description": data.description,
        "featureList": data.features || [],
        "aggregateRating": data.rating ? {
          "@type": "AggregateRating",
          "ratingValue": data.rating.value,
          "ratingCount": data.rating.count
        } : undefined
      };
      break;

    case 'educationalOccupationalCredential':
      schema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": data.name,
        "description": data.description,
        "provider": {
          "@type": "Organization",
          "name": "JEE Challenger"
        },
        "educationalLevel": "Undergraduate Admissions",
        "about": {
          "@type": "Thing",
          "name": data.subject
        },
        "hasCourseInstance": {
          "@type": "CourseInstance",
          "courseMode": "online",
          "courseWorkload": data.chapters ? `${data.chapters} chapters` : undefined
        }
      };
      break;

    case 'article':
      schema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": data.title,
        "description": data.description,
        "image": data.image,
        "datePublished": data.publishedAt,
        "dateModified": data.publishedAt,
        "author": {
          "@type": "Organization",
          "name": data.source
        },
        "publisher": {
          "@type": "Organization",
          "name": "JEE Challenger",
          "logo": {
            "@type": "ImageObject",
            "url": "https://jeechallenger.vercel.app/images/jcicon.jpg"
          }
        }
      };
      break;

    default:
      return null;
  }

  // Remove undefined fields
  schema = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
