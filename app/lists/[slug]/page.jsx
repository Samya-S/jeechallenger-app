"use client";

import React, { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Lock, AlertCircle, ArrowLeft } from "lucide-react";
import PlaylistHeader from "@/components/playlists/PlaylistHeader";
import PlaylistTable from "@/components/playlists/PlaylistTable";
import { usePlaylistContext } from "@/components/playlists/PlaylistContext";

// Shimmering skeleton displayed exclusively in the right content pane while switching lists
function PlaylistContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-4 w-72 bg-gray-100 dark:bg-gray-800/60 rounded"></div>
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        </div>
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex items-center justify-between gap-3">
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
      </div>

      {/* Table Rows Skeleton */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
        <div className="h-10 bg-gray-50 dark:bg-gray-800/50"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-14 px-4 flex items-center justify-between gap-4">
            <div className="h-4 w-8 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded hidden md:block"></div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
            <div className="h-7 w-16 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlaylistSlugPage({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { status: authStatus } = useSession();

  const {
    setActiveDetail,
    handleQuestionRemoved: contextQuestionRemoved,
    handlePlaylistUpdated: contextPlaylistUpdated,
    handlePlaylistDeleted: contextPlaylistDeleted,
  } = usePlaylistContext();

  const [dataState, setDataState] = useState({
    slug: null,
    detail: null,
    isPrivate: false,
    notFound: false,
  });

  // Fetch playlist detail by slug asynchronously without synchronous setState
  useEffect(() => {
    let ignore = false;

    fetch(`/api/playlists/slug/${slug}`)
      .then(async (res) => {
        if (ignore) return;
        if (res.status === 403) {
          setDataState({ slug, detail: null, isPrivate: true, notFound: false });
          setActiveDetail(null);
          return;
        }
        if (!res.ok) {
          setDataState({ slug, detail: null, isPrivate: false, notFound: true });
          setActiveDetail(null);
          return;
        }
        const data = await res.json();
        if (!ignore) {
          setDataState({ slug, detail: data.data, isPrivate: false, notFound: false });
          setActiveDetail(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load playlist detail:", err);
        if (!ignore) {
          setDataState({ slug, detail: null, isPrivate: false, notFound: true });
          setActiveDetail(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, [slug, authStatus, setActiveDetail]);

  const isCurrentSlug = dataState.slug === slug;
  const detail = isCurrentSlug ? dataState.detail : null;
  const isPrivateError = isCurrentSlug ? dataState.isPrivate : false;
  const notFoundError = isCurrentSlug ? dataState.notFound : false;
  const loading = !isPrivateError && !notFoundError && !detail;
  const isOwner = detail?.is_owner || false;

  // Handle local question removal
  const onQuestionRemoved = (questionId) => {
    if (!detail) return;
    setDataState((prev) => {
      if (!prev.detail) return prev;
      return {
        ...prev,
        detail: {
          ...prev.detail,
          playlist: {
            ...prev.detail.playlist,
            question_count: Math.max(0, (prev.detail.playlist.question_count || 0) - 1),
          },
          questions: prev.detail.questions.filter((q) => (q.id || q._id) !== questionId),
        },
      };
    });
    contextQuestionRemoved(detail.playlist.id, questionId);
  };

  // Handle local playlist metadata edit
  const onPlaylistUpdated = (updatedPlaylist) => {
    setDataState((prev) => {
      if (!prev.detail) return prev;
      return {
        ...prev,
        detail: {
          ...prev.detail,
          playlist: updatedPlaylist,
        },
      };
    });
    contextPlaylistUpdated(updatedPlaylist);
  };

  return (
    <section className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xs space-y-6 min-h-[580px] lg:min-h-[640px] flex flex-col justify-start">
      {/* Private Playlist Screen (for guests/non-owners) */}
      {isPrivateError ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">
                This List is Private
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                The creator of this list has set it to private. If this is your list, please sign in with your account to view and manage it.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <Link
                href={`/login?callbackUrl=/lists/${slug}`}
                className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                Sign In to View
              </Link>
              <Link
                href="/previous-year-questions"
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Back to PYQs
              </Link>
            </div>
          </div>
        </div>
      ) : notFoundError && !loading ? (
        /* Not Found Screen */
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">
                List Not Found
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                The list link you followed does not exist or may have been deleted.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/lists"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to My Lists</span>
              </Link>
            </div>
          </div>
        </div>
      ) : loading || !detail ? (
        /* Content Skeleton while questions are fetching */
        <PlaylistContentSkeleton />
      ) : (
        /* Loaded Header & Questions Table */
        <>
          <PlaylistHeader
            playlist={detail.playlist}
            isOwner={isOwner}
            onPlaylistUpdated={onPlaylistUpdated}
            onPlaylistDeleted={() => contextPlaylistDeleted(slug)}
          />

          <PlaylistTable
            questions={detail.questions}
            isOwner={isOwner}
            playlistId={detail.playlist.id}
            onQuestionRemoved={onQuestionRemoved}
          />
        </>
      )}
    </section>
  );
}
