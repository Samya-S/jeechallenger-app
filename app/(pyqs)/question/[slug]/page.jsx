import React from "react";
import { notFound } from "next/navigation";
import QuestionDetailComponent from "@/components/resources/pyqs/QuestionDetailComponent";
import StructuredData from "@/components/common/StructuredData";
import { ogImageMeta } from "@/utils/og-metadata";
import { createQuestionMetaDescription } from "@/utils/seo-utils";
import { getSiteUrl } from "@/config/site-url";

const BACKEND_URL = process.env.PYQS_API_URL || "https://pyqs-api.jeechallenger.com";

async function fetchQuestion(slug) {
  try {
    const res = await fetch(`${BACKEND_URL}/questions/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error fetching question ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const question = await fetchQuestion(slug);

  if (!question) {
    return {
      title: "Question Not Found | JEE Challenger",
      description: "The requested JEE Previous Year Question could not be found.",
    };
  }

  const examLabel = question.exam_type === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main";
  const examOrigin = `${examLabel} ${question.exam_year || ""}`.trim();
  const title = `${question.title || "JEE Previous Year Question"} | ${question.subject} PYQ Solution`;
  const description = createQuestionMetaDescription({ question, examOrigin });

  const pageOg = ogImageMeta({
    title: question.title || "JEE Previous Year Question",
    subtitle: `${question.subject || ""} • ${question.chapter || ""} • ${examOrigin}`,
    theme: "pyqs",
    badge: "JEE Challenger",
    alt: question.title || "JEE Previous Year Question",
  });

  return {
    title: `${title} - JEE Challenger`,
    description,
    alternates: {
      canonical: `/question/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${title} - JEE Challenger`,
      description,
      url: `/question/${slug}`,
      siteName: "JEE Challenger",
      images: pageOg.images,
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - JEE Challenger`,
      description,
      images: pageOg.twitterImages,
    },
  };
}

export default async function SingleQuestionPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const question = await fetchQuestion(slug);

  if (!question) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const subjectParam = encodeURIComponent(question.subject || "");
  const chapterParam = encodeURIComponent(question.chapter || "");

  // 1. Curricular Taxonomy Breadcrumb (Subject -> Chapter -> Question)
  const curriculumBreadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Previous Year Questions", path: "/previous-year-questions" },
    ...(question.subject ? [{ name: question.subject, path: `/previous-year-questions?subject=${subjectParam}` }] : []),
    ...(question.chapter ? [{ name: question.chapter, path: `/previous-year-questions?subject=${subjectParam}&chapter=${chapterParam}` }] : []),
    { name: question.title || "Question", path: `/question/${slug}` },
  ];

  // 2. Examination Taxonomy Breadcrumb (Exam Paper -> Question)
  const paperId = question.original_paper_id;
  const paperSlug = paperId ? paperId.toLowerCase().replace(/_/g, "-") : null;
  const paperTitle = paperId ? paperId.replace(/_/g, " ") : null;
  const examBreadcrumbs = paperSlug ? [
    { name: "Home", path: "/" },
    { name: "Previous Year Questions", path: "/previous-year-questions" },
    { name: paperTitle, path: `/paper/${paperSlug}` },
    { name: question.title || "Question", path: `/question/${slug}` },
  ] : null;

  return (
    <>
      {/* 1. Curricular Breadcrumb Schema (for Chapter/Subject searches) */}
      <StructuredData
        type="breadcrumb"
        data={{
          id: `${siteUrl}/question/${slug}#breadcrumb-curriculum`,
          items: curriculumBreadcrumbs,
        }}
      />
      {/* 2. Exam Paper Breadcrumb Schema (for Paper/Shift searches) */}
      {examBreadcrumbs && (
        <StructuredData
          type="breadcrumb"
          data={{
            id: `${siteUrl}/question/${slug}#breadcrumb-exam`,
            items: examBreadcrumbs,
          }}
        />
      )}
      {/* 3. Crawler-only Google QAPage Schema with acceptedAnswer & options */}
      <StructuredData
        type="qaPage"
        data={{ question }}
      />
      {/* 4. Crawler-only Google Education Q&A Quiz Schema for Education Carousel & Lens */}
      <StructuredData
        type="educationQuiz"
        data={{ question }}
      />
      <QuestionDetailComponent question={question} />
    </>
  );
}