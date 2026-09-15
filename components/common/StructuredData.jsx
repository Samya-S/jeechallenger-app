// Structured Data Component for SEO
// Generates JSON-LD schema for Google Rich Results

import { getSiteUrl } from '@/config/site-url';
import { cleanMathText } from '@/utils/seo-utils';

export default function StructuredData({ type, data }) {
  const siteUrl = getSiteUrl();
  let schema = {};

  switch (type) {
    case 'organization':
      schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "JEE Challenger",
        "url": siteUrl,
        "logo": `${siteUrl}/images/jcicon.jpg`,
        "description": "Free JEE Preparation Platform with comprehensive study materials, an AI-powered tutor, and previous year questions for JEE Main and Advanced",
        "foundingDate": "2020",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Student Support",
          "url": `${siteUrl}/contact-us`
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
        "url": siteUrl,
        "description": "Complete JEE preparation platform with free study materials, AI tutor, and syllabus tracker",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      };
      break;

    case 'breadcrumb':
      schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        ...(data.id ? { "@id": data.id } : {}),
        "itemListElement": data.items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.path.startsWith('http') ? item.path : `${siteUrl}${item.path}`
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

    case 'qaPage': {
      const q = data.question || {};
      const qText = cleanMathText(q.question_text || q.title || "");
      const qTitle = cleanMathText(q.title || "JEE Previous Year Question");

      // Build accepted answer solution text
      let answerText = "";
      if (q.correct_answer && q.correct_answer.length > 0) {
        answerText += `Correct Answer: Option (${q.correct_answer.join(", ")}). `;
      } else if (q.numeric_answer !== null && q.numeric_answer !== undefined) {
        const numVal = typeof q.numeric_answer === "object"
          ? `${q.numeric_answer.min_value} to ${q.numeric_answer.max_value}`
          : q.numeric_answer;
        answerText += `Correct Answer: ${numVal}. `;
      }
      if (q.solution) {
        answerText += `Step-by-step Solution: ${cleanMathText(q.solution)}`;
      }

      // Build suggested answers from other options (for MCQ / MULTI_CORRECT)
      const suggestedAnswers = [];
      if (q.options && typeof q.options === "object") {
        Object.entries(q.options).forEach(([optKey, optVal]) => {
          if (!q.correct_answer || !q.correct_answer.includes(optKey)) {
            const optText = optVal && typeof optVal === "object" ? optVal.text : optVal;
            if (optText) {
              suggestedAnswers.push({
                "@type": "Answer",
                "text": `Option (${optKey}): ${cleanMathText(optText)}`,
              });
            }
          }
        });
      }

      schema = {
        "@context": "https://schema.org",
        "@type": "QAPage",
        "mainEntity": {
          "@type": "Question",
          "name": qTitle,
          "text": qText,
          "answerCount": 1,
          "datePublished": q.approved_at || (q.exam_year ? `${q.exam_year}-01-01` : undefined),
          "author": {
            "@type": "Organization",
            "name": "JEE Challenger",
            "url": siteUrl,
          },
          "about": [
            q.subject ? { "@type": "Thing", "name": q.subject } : null,
            q.chapter ? { "@type": "Thing", "name": q.chapter } : null,
          ].filter(Boolean),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": answerText.trim(),
            "url": `${siteUrl}/question/${q.slug}#solution`,
            "datePublished": q.approved_at || undefined,
            "author": {
              "@type": "Organization",
              "name": "JEE Challenger",
              "url": siteUrl,
            },
          },
          "suggestedAnswer": suggestedAnswers.length > 0 ? suggestedAnswers : undefined,
          "isPartOf": q.original_paper_id ? {
            "@type": "Quiz",
            "name": q.original_paper_id.replace(/_/g, " "),
            "url": `${siteUrl}/paper/${q.original_paper_id.toLowerCase().replace(/_/g, "-")}`,
          } : undefined,
        },
      };
      break;
    }

    case 'educationQuiz': {
      const q = data.question || {};
      const qText = cleanMathText(q.question_text || q.title || "");
      const qTitle = cleanMathText(q.title || "JEE Previous Year Question");

      let answerText = "";
      if (q.correct_answer && q.correct_answer.length > 0) {
        answerText += `Correct Answer: Option (${q.correct_answer.join(", ")}). `;
      } else if (q.numeric_answer !== null && q.numeric_answer !== undefined) {
        const numVal = typeof q.numeric_answer === "object"
          ? `${q.numeric_answer.min_value} to ${q.numeric_answer.max_value}`
          : q.numeric_answer;
        answerText += `Correct Answer: ${numVal}. `;
      }
      if (q.solution) {
        answerText += `Solution: ${cleanMathText(q.solution)}`;
      }

      schema = {
        "@context": "https://schema.org",
        "@type": "Quiz",
        "name": `${qTitle} - ${q.subject || "JEE"} Solution`,
        "description": `Step-by-step verified solution for ${q.subject || "JEE"} - ${q.chapter || ""} on JEE Challenger.`,
        "educationalLevel": "Higher Secondary / IIT JEE Entrance",
        "about": {
          "@type": "Thing",
          "name": q.chapter || q.subject || "JEE Preparation",
        },
        "hasPart": [
          {
            "@type": "Question",
            "name": qTitle,
            "text": qText,
            "eduQuestionType": "Flashcard",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": answerText.trim(),
            },
          },
        ],
      };
      break;
    }

    case 'examPaper': {
      const p = data.paper || {};
      const examLabel = p.exam_type === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main";
      const paperTitle = p.title || `${examLabel} ${p.exam_year || ""} Question Paper`;

      schema = {
        "@context": "https://schema.org",
        "@type": ["Quiz", "LearningResource"],
        "name": `${paperTitle} with Solutions`,
        "description": `Full official ${paperTitle} with section-wise questions, step-by-step solutions, and answer keys on JEE Challenger.`,
        "educationalLevel": "Undergraduate Entrance Examination (IIT JEE)",
        "learningResourceType": ["Previous Year Paper", "Examination Paper", "Practice Problem"],
        "timeRequired": "PT3H",
        "provider": {
          "@type": "Organization",
          "name": "JEE Challenger",
          "url": siteUrl,
          "logo": `${siteUrl}/images/jcicon.jpg`,
        },
        "about": [
          { "@type": "Thing", "name": examLabel },
          { "@type": "Thing", "name": "Physics" },
          { "@type": "Thing", "name": "Chemistry" },
          { "@type": "Thing", "name": "Mathematics" },
        ],
      };
      break;
    }

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

    case 'learningResource':
      schema = {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "name": data.name,
        "description": data.description,
        "learningResourceType": data.learningResourceType || ["Interactive Resource", "Previous Year Questions", "Formula Sheet"],
        "provider": {
          "@type": "Organization",
          "name": "JEE Challenger",
          "url": siteUrl,
        },
        "educationalLevel": "Undergraduate Admissions",
        "about": {
          "@type": "Thing",
          "name": data.subject || "JEE Main & Advanced Preparation"
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
            "url": `${siteUrl}/images/jcicon.jpg`
          }
        }
      };
      break;

    case 'itemList':
    case 'blogList':
      schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": data.items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${siteUrl}/blog/${item.slug}`,
          "name": item.title,
          "description": item.excerpt,
          "datePublished": item.date
        }))
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
