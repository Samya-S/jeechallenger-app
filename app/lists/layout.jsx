"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Star, ShieldAlert, ListOrdered, Plus, X, Loader2 } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import PlaylistSidebar from "@/components/playlists/PlaylistSidebar";
import { PlaylistProvider, usePlaylistContext } from "@/components/playlists/PlaylistContext";

const emptySubscribe = () => () => {};

function ListsLayoutContent({ children }) {
  const pathname = usePathname();
  const currentSlug = pathname.replace(/^\/lists\/?/, "").split("/")[0] || "";

  const {
    userPlaylists,
    loadingPlaylists,
    authStatus,
    activeDetail,
    handlePlaylistCreated,
  } = usePlaylistContext();

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Mobile switcher state
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
        setCreateListError(data.error || "Failed to create list");
        setCreatingList(false);
        return;
      }
      setNewListName("");
      setShowMobileCreateModal(false);
      handlePlaylistCreated(data.data);
    } catch (err) {
      console.error("Mobile create list error:", err);
      setCreateListError("Network error. Please try again.");
    } finally {
      setCreatingList(false);
    }
  };

  // Resolve ownership & active list name
  const matchedUserList = userPlaylists.find((pl) => pl.slug === currentSlug);
  const isOwner = Boolean(matchedUserList) || Boolean(activeDetail?.playlist?.slug === currentSlug && activeDetail?.is_owner);
  const activeListName = matchedUserList?.name || (activeDetail?.playlist?.slug === currentSlug ? activeDetail?.playlist?.name : "");

  const activePlaylist = matchedUserList || (activeDetail?.playlist?.slug === currentSlug ? activeDetail?.playlist : null);

  // Breadcrumbs:
  // - When loading or visitor: Home > Lists (no sample playlist placeholder)
  // - When owner: Home > My Lists > [List Name]
  const breadcrumbs = isOwner && activeListName
    ? [
        { label: "My Lists", href: "/lists" },
        { label: activeListName },
      ]
    : [
        { label: "Lists", href: "/lists" },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Persistent Breadcrumbs: Never unmounts across route changes */}
      <Breadcrumbs
        crumbs={breadcrumbs}
        className="pb-1"
      />

      {/* Mobile Playlist Switcher (Visible on small screens for authenticated users) */}
      {authStatus === "authenticated" && userPlaylists.length > 0 && (
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
                  {activePlaylist?.name || "Select List"}
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

          {/* Mobile Dropdown Menu */}
          {mobileSwitcherOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-800">
                My Question Lists
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {userPlaylists.map((pl) => {
                  const isActive = pl.slug === currentSlug;
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

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Desktop Left Sidebar: Always permanently mounted */}
        <PlaylistSidebar
          playlists={userPlaylists}
          loading={loadingPlaylists}
          currentSlug={currentSlug}
          onPlaylistCreated={handlePlaylistCreated}
          authStatus={authStatus}
          className="hidden lg:block"
        />

        {/* Dynamic Content Pane: Only this section updates on navigation */}
        <main className="flex-1 w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile Create List Modal Portaled to document.body */}
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

export default function ListsLayout({ children }) {
  return (
    <PlaylistProvider>
      <ListsLayoutContent>{children}</ListsLayoutContent>
    </PlaylistProvider>
  );
}
