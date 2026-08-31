import React from "react";
import { notFound } from "next/navigation";
import QuestionDetailComponent from "@/components/resources/pyqs/QuestionDetailComponent";
import StructuredData from "@/components/common/StructuredData";
import { ogImageMeta } from "@/utils/og-metadata";

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
  const description = `Detailed step-by-step solution for ${question.subject} - ${question.chapter} ${examOrigin} Previous Year Question with KaTeX formulas and answer key.`;

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
      canonical: `/questions/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} - JEE Challenger`,
      description,
      url: `/questions/${slug}`,
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

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "PYQs", path: "/previous-year-questions" },
    { name: question.title || "Question", path: `/questions/${slug}` },
  ];

  return (
    <>
      <StructuredData
        type="breadcrumb"
        data={{ items: breadcrumbItems }}
      />
      <QuestionDetailComponent question={question} />
    </>
  );
}