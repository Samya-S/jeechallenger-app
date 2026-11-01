"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsUpDown,
  Star,
  ShieldAlert,
  ListOrdered,
  Plus,
  X,
  Loader2,
  Check,
  Lock,
  Globe,
} from "lucide-react";
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

  // Mobile bottom sheet & create modal state
  const [mobileBottomSheetOpen, setMobileBottomSheetOpen] = useState(false);
  const [showMobileCreateModal, setShowMobileCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [creatingList, setCreatingList] = useState(false);
  const [createListError, setCreateListError] = useState("");

  // Lock body scroll and handle Escape key for bottom sheet & modal
  useEffect(() => {
    if (!mobileBottomSheetOpen && !showMobileCreateModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileBottomSheetOpen(false);
        setShowMobileCreateModal(false);
        setCreateListError("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileBottomSheetOpen, showMobileCreateModal]);

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

      {/* Mobile Playlist Switcher Bar (Visible on mobile/tablet for authenticated users) */}
      {authStatus === "authenticated" && userPlaylists.length > 0 && (
        <div className="lg:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileBottomSheetOpen(true)}
              className="flex-1 flex items-center justify-between gap-2 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-left shadow-xs hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
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
              <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 shrink-0">
                <span>Change</span>
                <ChevronsUpDown className="w-3.5 h-3.5" />
              </div>
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

      {/* Mobile Bottom Sheet Drawer Portaled to document.body */}
      {mounted && mobileBottomSheetOpen && createPortal(
        <div className="fixed inset-0 z-[9990] flex flex-col justify-end">
          {/* Blurred Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileBottomSheetOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <div
            className="relative z-10 w-full max-h-[82vh] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="pt-3 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            </div>

            {/* Sheet Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  My Question Lists
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Select a list to view or create a new one
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileBottomSheetOpen(false);
                    setShowMobileCreateModal(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New List</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileBottomSheetOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Touch-Friendly Items */}
            <div className="p-3 overflow-y-auto max-h-[60vh] space-y-1.5">
              {userPlaylists.map((pl) => {
                const isActive = pl.slug === currentSlug;
                return (
                  <Link
                    key={pl.id}
                    href={`/lists/${pl.slug}`}
                    onClick={() => setMobileBottomSheetOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 shadow-xs"
                        : "bg-gray-50/60 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800/80 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-2xs"
                        }`}
                      >
                        {pl.type === "FAVOURITES" ? (
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />
                        ) : pl.type === "MISTAKE_VAULT" ? (
                          <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                        ) : (
                          <ListOrdered className="w-4 h-4 text-blue-500 shrink-0" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-bold truncate ${
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            {pl.name}
                          </span>
                          {pl.is_public ? (
                            <Globe className="w-3 h-3 text-gray-400 shrink-0" />
                          ) : (
                            <Lock className="w-3 h-3 text-gray-400 shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          {pl.question_count} {pl.question_count === 1 ? "question" : "questions"}
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}

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
