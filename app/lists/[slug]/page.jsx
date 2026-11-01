import React from "react";
import PlaylistSlugPageClient from "@/components/playlists/PlaylistSlugPageClient";
import StructuredData from "@/components/common/StructuredData";
import { ogImageMeta } from "@/utils/og-metadata";

const BACKEND_URL = process.env.PYQS_API_URL || "https://pyqs-api.jeechallenger.com";

async function fetchPlaylistMetadata(slug) {
  try {
    const res = await fetch(`${BACKEND_URL}/playlists/${slug}`, {
      cache: "no-store",
    });
    if (res.status === 403) {
      return { is_private: true };
    }
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.playlist || json?.data || null;
  } catch (err) {
    console.error(`Error fetching playlist metadata for ${slug}:`, err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const playlist = await fetchPlaylistMetadata(slug);

  if (!playlist) {
    return {
      title: "Question List Not Found | JEE Challenger",
      description: "The requested question list could not be found or may have been deleted on JEE Challenger.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // If list is private, do not index in search engines and hide sensitive title
  if (playlist.is_private || !playlist.is_public) {
    return {
      title: "Private Question List | JEE Challenger",
      description: "This question list is private and accessible only by its creator on JEE Challenger.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${playlist.name} | Question List - JEE Challenger`;
  const description = playlist.description
    ? `${playlist.description} Practice ${playlist.question_count || 0} curated questions with step-by-step solutions on JEE Challenger.`
    : `Practice ${playlist.name} with ${playlist.question_count || 0} curated questions for JEE Main & Advanced with verified solutions on JEE Challenger.`;

  const pageOg = ogImageMeta({
    title: playlist.name,
    subtitle: `JEE Question List • ${playlist.question_count || 0} Questions • Complete Solutions`,
    theme: "pyqs",
    badge: "JEE Challenger",
    alt: `${playlist.name} - JEE Question List`,
  });

  return {
    title,
    description,
    keywords: [
      playlist.name,
      "JEE Question List",
      "JEE Practice List",
      "JEE PYQ Playlist",
      "JEE Main",
      "JEE Advanced",
      "Revision List",
      "Question Bank",
    ],
    alternates: {
      canonical: `/lists/${slug}`,
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
      title,
      description,
      url: `/lists/${slug}`,
      siteName: "JEE Challenger",
      images: pageOg.images,
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: pageOg.twitterImages,
    },
  };
}

export default async function PlaylistSlugPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const playlist = await fetchPlaylistMetadata(slug);

  return (
    <>
      {playlist?.is_public && (
        <StructuredData
          type="breadcrumb"
          data={{
            items: [
              { name: "Home", path: "/" },
              { name: "Lists", path: "/lists" },
              { name: playlist.name, path: `/lists/${slug}` },
            ],
          }}
        />
      )}
      <PlaylistSlugPageClient slug={slug} />
    </>
  );
}
