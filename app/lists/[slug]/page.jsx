"use client";

import React, { useState, useEffect, use, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, ArrowLeft, ChevronDown, Star, ShieldAlert, ListOrdered, Plus, X, Loader2 } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import PlaylistSidebar from "@/components/playlists/PlaylistSidebar";
import PlaylistHeader from "@/components/playlists/PlaylistHeader";
import PlaylistTable from "@/components/playlists/PlaylistTable";

const emptySubscribe = () => () => {};

// Shimmering skeleton displayed exclusively in the right content pane while switching playlists
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
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  // Derived loading state avoids synchronous effect setState
  const [detail, setDetail] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [isPrivateError, setIsPrivateError] = useState(false);
  const [notFoundError, setNotFoundError] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [mobileSwitcherOpen, setMobileSwitcherOpen] = useState(false);
  const [showMobileCreateModal, setShowMobileCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [creatingList, setCreatingList] = useState(false);
  const [createListError, setCreateListError] = useState("");

  // Lock body scroll and handle Escape key for mobile create modal
  useEffect(() => {
    if (!showMobileCreateModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowMobileCreateModal(false);
        setCreateListError("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMobileCreateModal]);

  // 1. Fetch playlist detail by slug asynchronously
  useEffect(() => {
    let ignore = false;
    fetch(`/api/playlists/slug/${slug}`)
      .then(async (res) => {
        if (ignore) return;
        if (res.status === 403) {
          setIsPrivateError(true);
          setDetail(null);
          return;
        }
        if (!res.ok) {
          setNotFoundError(true);
          setDetail(null);
          return;
        }
        const data = await res.json();
        if (!ignore) {
          setDetail(data.data);
          setIsPrivateError(false);
          setNotFoundError(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load playlist detail:", err);
        if (!ignore) {
          setNotFoundError(true);
          setDetail(null);
        }
      });

    return () => {
      ignore = true;
    };
  }, [slug, authStatus]);

  // 2. Fetch user's list of playlists if authenticated (for sidebar) asynchronously
  useEffect(() => {
    if (authStatus !== "authenticated") return;
    let ignore = false;
    fetch("/api/playlists")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.data) {
          setUserPlaylists(data.data);
        }
      })
      .catch((err) => console.error("Failed to load user playlists:", err));

    return () => {
      ignore = true;
    };
  }, [authStatus]);

  // Handle local question removal
  const handleQuestionRemoved = (questionId) => {
    if (!detail) return;
    setDetail((prev) => ({
      ...prev,
      playlist: {
        ...prev.playlist,
        question_count: Math.max(0, prev.playlist.question_count - 1),
      },
      questions: prev.questions.filter((q) => (q.id || q._id) !== questionId),
    }));

    // Update count in sidebar
    setUserPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === detail.playlist.id
          ? { ...pl, question_count: Math.max(0, pl.question_count - 1) }
          : pl
      )
    );
  };

  // Handle local playlist metadata edit
  const handlePlaylistUpdated = (updatedPlaylist) => {
    setDetail((prev) => ({
      ...prev,
      playlist: updatedPlaylist,
    }));

    setUserPlaylists((prev) =>
      prev.map((pl) => (pl.id === updatedPlaylist.id ? updatedPlaylist : pl))
    );
  };

  // Handle playlist created from sidebar
  const handlePlaylistCreated = (newPlaylist) => {
    setUserPlaylists((prev) => [...prev, newPlaylist]);
    router.push(`/lists/${newPlaylist.slug}`);
  };

  // Handle playlist deleted
  const handlePlaylistDeleted = () => {
    setUserPlaylists((prev) => prev.filter((pl) => pl.slug !== slug));
    router.push("/lists");
  };

  const handleMobileCreate = async (e) => {
    e.preventDefault();
    const trimmed = newListName.trim();
    if (!trimmed || creatingList) return;
    setCreatingList(true);
    setCreateListError("");
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, is_public: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateListError(data.error || "Failed to create playlist");
        setCreatingList(false);
        return;
      }
      setNewListName("");
      setShowMobileCreateModal(false);
      handlePlaylistCreated(data.data);
    } catch (err) {
      console.error("Mobile create playlist error:", err);
      setCreateListError("Network error. Please try again.");
    } finally {
      setCreatingList(false);
    }
  };

  const loading = !isPrivateError && !notFoundError && (!detail || detail.playlist?.slug !== slug);
  const isOwner = detail?.is_owner || false;
  const showSidebar = isOwner && userPlaylists.length > 0;
  const activePlaylist = userPlaylists.find((pl) => pl.slug === slug) || detail?.playlist;

  // Private Playlist Screen (for guests/non-owners)
  if (isPrivateError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-8 text-center shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">
              This Playlist is Private
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              The creator of this playlist has set it to private. If this is your playlist, please sign in with your account to view and manage it.
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
    );
  }

  // Not Found Screen
  if (notFoundError && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-md w-full p-8 text-center shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-gray-950 dark:text-gray-50">
              Playlist Not Found
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              The playlist link you followed does not exist or may have been deleted.
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
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Clean Breadcrumbs Navigation */}
      <Breadcrumbs
        crumbs={
          isOwner
            ? [{ label: 'My Lists', href: '/lists' }]
            : [
                { label: 'Lists', href: '/lists' },
                { label: detail?.playlist?.name || 'Playlist' },
              ]
        }
        className="pb-1"
      />

      {/* Mobile Playlist Switcher (LeetCode style dropdown menu) */}
      {showSidebar && (
        <div className="lg:hidden relative">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileSwitcherOpen(!mobileSwitcherOpen)}
              className="flex-1 flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-left shadow-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                {activePlaylist?.type === "FAVOURITES" ? (
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />
                ) : activePlaylist?.type === "MISTAKE_VAULT" ? (
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <ListOrdered className="w-4 h-4 text-blue-500 shrink-0" />
                )}
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                  {activePlaylist?.name || "Select Playlist"}
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 shrink-0">
                  {activePlaylist?.question_count || 0}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  mobileSwitcherOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <button
              type="button"
              onClick={() => setShowMobileCreateModal(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0 shadow-xs cursor-pointer"
              title="Create New List"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New List</span>
            </button>
          </div>

          {/* Dropdown Menu */}
          {mobileSwitcherOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-800">
                My Question Lists
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {userPlaylists.map((pl) => {
                  const isActive = pl.slug === slug;
                  return (
                    <Link
                      key={pl.id}
                      href={`/lists/${pl.slug}`}
                      onClick={() => setMobileSwitcherOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {pl.type === "FAVOURITES" ? (
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 shrink-0" />
                        ) : pl.type === "MISTAKE_VAULT" ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : (
                          <ListOrdered className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                        <span className="truncate">{pl.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold ml-2 shrink-0">
                        {pl.question_count}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Layout: Desktop Sidebar remains permanently mounted */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Desktop Left Sidebar (Owner only) */}
        {showSidebar && (
          <PlaylistSidebar
            playlists={userPlaylists}
            currentSlug={slug}
            onPlaylistCreated={handlePlaylistCreated}
            className="hidden lg:block"
          />
        )}

        {/* Right Main Content Pane */}
        <section className="flex-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xs space-y-6 min-h-[580px] lg:min-h-[640px] flex flex-col justify-start">
          {loading || !detail ? (
            <PlaylistContentSkeleton />
          ) : (
            <>
              <PlaylistHeader
                playlist={detail.playlist}
                isOwner={isOwner}
                onPlaylistUpdated={handlePlaylistUpdated}
                onPlaylistDeleted={handlePlaylistDeleted}
              />

              <PlaylistTable
                questions={detail.questions}
                isOwner={isOwner}
                playlistId={detail.playlist.id}
                onQuestionRemoved={handleQuestionRemoved}
              />
            </>
          )}
        </section>
      </div>

      {/* Mobile Create Playlist Modal Portaled to document.body */}
      {mounted && showMobileCreateModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-100"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMobileCreateModal(false);
              setCreateListError("");
            }
          }}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Create New List
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowMobileCreateModal(false);
                  setCreateListError("");
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMobileCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  List Name
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Tough Calculus Problems"
                  maxLength={50}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              {createListError && (
                <p className="text-xs text-rose-500 font-medium">{createListError}</p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileCreateModal(false);
                    setCreateListError("");
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newListName.trim() || creatingList}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {creatingList && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
