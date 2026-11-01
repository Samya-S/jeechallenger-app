import React, { cache } from "react";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { decode } from "next-auth/jwt";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import PlaylistSlugPageClient from "@/components/playlists/PlaylistSlugPageClient";
import StructuredData from "@/components/common/StructuredData";
import { ogImageMeta } from "@/utils/og-metadata";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.PYQS_API_URL || "https://pyqs-api.jeechallenger.com";

const fetchPlaylistMetadata = cache(async (slug) => {
  try {
    let userId = null;

    // 1. Try resolving session via NextAuth
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch {
      // Ignore session resolution errors to fall back to session cookie
    }

    // 2. Fall back to decoding session cookie directly for resilience
    if (!userId) {
      try {
        const cookieStore = await cookies();
        const rawToken =
          cookieStore.get("next-auth.session-token")?.value ||
          cookieStore.get("__Secure-next-auth.session-token")?.value;
        if (rawToken) {
          const decoded = await decode({
            token: rawToken,
            secret: process.env.NEXTAUTH_SECRET,
          });
          if (decoded?.id || decoded?.sub) {
            userId = decoded.id || decoded.sub;
          }
        }
      } catch {
        // Ignore cookie decoding errors
      }
    }

    // 3. If authenticated, sign Bearer JWT for the Go microservice
    let headers = {};
    if (userId) {
      const token = jwt.sign(
        { id: userId },
        process.env.NEXTAUTH_SECRET,
        { algorithm: "HS256" }
      );
      headers = { Authorization: `Bearer ${token}` };
    }

    const res = await fetch(`${BACKEND_URL}/playlists/${slug}`, {
      headers,
      cache: "no-store",
    });

    if (res.status === 403) {
      return { is_private: true, is_owner: false };
    }
    if (!res.ok) return null;
    const json = await res.json();
    if (!json?.data?.playlist) return null;
    return {
      ...json.data.playlist,
      is_owner: Boolean(json.data.is_owner),
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
