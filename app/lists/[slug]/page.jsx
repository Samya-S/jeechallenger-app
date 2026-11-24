import React, { cache } from "react";
import { getServerSession } from "@/lib/auth";
import { pyqsService } from "@/server/services/pyqs";
import PlaylistSlugPageClient from "@/components/playlists/PlaylistSlugPageClient";
import StructuredData from "@/components/common/StructuredData";
import { ogImageMeta } from "@/utils/og-metadata";

export const dynamic = "force-dynamic";

const fetchPlaylistMetadata = cache(async (slug) => {
  try {
    const session = await getServerSession();
    const userId = session?.user?.id || null;

    // 3. Fetch playlist details via unified service
    const data = await pyqsService.getPlaylistBySlug(slug, { userId });
    if (!data) return null;
    if (data.is_private) {
      return { is_private: true, is_owner: false };
    }

    const playlist = data?.playlist || data;
    if (!playlist) return null;

    return {
      ...playlist,
      is_owner: Boolean(data.is_owner),
    };
  } catch (err) {
    console.error(`Error fetching playlist metadata for ${slug}:`, err);
    return null;
  }
});

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

  // If list is private and current user is NOT the owner
  if (!playlist.is_owner && (playlist.is_private || !playlist.is_public)) {
    return {
      title: "Private Question List | JEE Challenger",
      description: "This question list is private and accessible only by its creator on JEE Challenger.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${playlist.name} - Question List | JEE Challenger`;
  const description = playlist.description
    ? `${playlist.description} Practice ${playlist.question_count || 0} curated questions with step-by-step solutions on JEE Challenger.`
    : `Practice ${playlist.name} with ${playlist.question_count || 0} curated questions for JEE Main & Advanced with verified solutions on JEE Challenger.`;

  // If list is private, but current user IS the owner:
  // Render list title for user's tab, but keep search engine indexing disabled
  if (!playlist.is_public) {
    return {
      title,
      description,
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Public playlist: generate rich OpenGraph and search engine indexing metadata
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
