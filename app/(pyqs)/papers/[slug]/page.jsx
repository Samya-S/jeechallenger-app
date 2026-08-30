import React from "react";
import { notFound } from "next/navigation";
import PaperDetailComponent from "@/components/resources/pyqs/PaperDetailComponent";
import StructuredData from "@/components/common/StructuredData";
import { ogImageMeta } from "@/utils/og-metadata";

const BACKEND_URL = process.env.PYQS_API_URL || "https://pyqs-api.jeechallenger.com";

async function fetchPaper(slug) {
  try {
    const res = await fetch(`${BACKEND_URL}/papers/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch (error) {
    console.error(`Error fetching paper ${slug}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const paper = await fetchPaper(slug);

  if (!paper) {
    return {
      title: "Question Paper Not Found | JEE Challenger",
      description: "The requested JEE Previous Year Question Paper could not be found.",
    };
  }

  const examLabel = paper.exam_type === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main";
  const title = `${paper.title || `${examLabel} ${paper.exam_year} Question Paper`} | Solutions & Answer Key`;
  const description = `Access full ${examLabel} ${paper.exam_year} official question paper with section-wise questions, verified answer keys, and step-by-step KaTeX solutions.`;

  const pageOg = ogImageMeta({
    title: paper.title || `${examLabel} Question Paper`,
    subtitle: `${examLabel} • ${paper.exam_year} • Complete Paper & Solutions`,
    theme: "pyqs",
    alt: paper.title || "JEE Paper",
  });

  return {
    title: `${title} - JEE Challenger`,
    description,
    alternates: {
      canonical: `/papers/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} - JEE Challenger`,
      description,
      url: `/papers/${slug}`,
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

export default async function SinglePaperPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const paper = await fetchPaper(slug);

  if (!paper) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "PYQs", path: "/previous-year-questions" },
    { name: paper.title || "Paper", path: `/papers/${slug}` },
  ];

  return (
    <>
      <StructuredData
        type="breadcrumb"
        data={{ items: breadcrumbItems }}
      />
      <PaperDetailComponent paperData={paper} />
    </>
  );
}