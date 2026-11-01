"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Bookmark, Plus, Loader2, Lock, Globe, AlertCircle, Check } from "lucide-react";
import { useBookmarks } from "@/components/playlists/BookmarkContext";

export default function QuestionBookmarkButton({ questionId, className = "" }) {
  const { data: session, status } = useSession();
  const {
    isSaved,
    addSavedId,
    removeSavedId,
    playlists: contextPlaylists,
    loadingPlaylists,
    refreshPlaylists,
    addPlaylist,
    getMemberships,
    setMemberships,
  } = useBookmarks();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [membershipSet, setMembershipSet] = useState(new Set());
  const [newListName, setNewListName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const popoverRef = useRef(null);

  const playlists = contextPlaylists || [];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
        setErrorMsg("");
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Load playlists and specific question membership when popover opens
  const loadData = async () => {
    if (!session?.user?.id || !questionId) return;
    setErrorMsg("");

    // If prefetched playlists are empty for any reason, trigger refresh
    if (playlists.length === 0) {
      refreshPlaylists();
    }

    // Fast Path 1: If question is not saved anywhere globally, it belongs to 0 playlists
    if (!isSaved(questionId)) {
      setMembershipSet(new Set());
      setMemberships(questionId, new Set());
      return;
    }

    // Fast Path 2: If question memberships are already cached in memory
    const cached = getMemberships(questionId);
    if (cached) {
      setMembershipSet(cached);
      return;
    }

    // Otherwise, fetch memberships for this bookmarked question
    setLoading(true);
    try {
      const mRes = await fetch(`/api/playlists/question/${questionId}`);
      if (mRes.ok) {
        const mData = await mRes.json();
        const ids = mData.data?.playlist_ids || [];
        const nextSet = new Set(ids);
        setMembershipSet(nextSet);
        setMemberships(questionId, nextSet);
        if (ids.length > 0) {
          addSavedId(questionId);
        } else {
          removeSavedId(questionId);
        }
      }
    } catch (err) {
      console.error("Failed to load playlist memberships:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOpen = () => {
    if (!isOpen && status === "authenticated") {
      loadData();
    }
    setIsOpen(!isOpen);
    setErrorMsg("");
  };

  // Toggle question membership in a playlist
  const handleToggleMembership = async (playlistId, isCurrentlyMember) => {
    setErrorMsg("");
    const newSet = new Set(membershipSet);
    if (isCurrentlyMember) {
      newSet.delete(playlistId);
    } else {
      newSet.add(playlistId);
    }
    setMembershipSet(newSet);
    setMemberships(questionId, newSet);

    // Sync global filled state
    if (newSet.size > 0) {
      addSavedId(questionId);
    } else {
      removeSavedId(questionId);
    }

    try {
      const url = isCurrentlyMember
        ? `/api/playlists/${playlistId}/questions/${questionId}`
        : `/api/playlists/${playlistId}/questions`;
      const method = isCurrentlyMember ? "DELETE" : "POST";
      const body = isCurrentlyMember ? undefined : JSON.stringify({ question_id: questionId });

      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : {},
        body,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        // Revert on failure
        const revertSet = new Set(membershipSet);
        setMembershipSet(revertSet);
        setMemberships(questionId, revertSet);
        if (revertSet.size > 0) {
          addSavedId(questionId);
        } else {
          removeSavedId(questionId);
        }
        setErrorMsg(data.error || "Failed to update playlist");
      }
    } catch (err) {
      console.error("Failed to toggle question in playlist:", err);
      const revertSet = new Set(membershipSet);
      setMembershipSet(revertSet);
      setMemberships(questionId, revertSet);
      setErrorMsg("Network error updating playlist");
    }
  };

  // Create new list and immediately add this question
  const handleCreateList = async (e) => {
    e.preventDefault();
    const trimmed = newListName.trim();
    if (!trimmed) return;

    setIsCreating(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, is_public: false }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create playlist");
        setIsCreating(false);
        return;
      }

      const created = data.data;
      addPlaylist(created);
      setNewListName("");

      // Immediately add question to newly created list
      await handleToggleMembership(created.id, false);
    } catch (err) {
      console.error("Failed to create playlist:", err);
      setErrorMsg("Network error creating playlist");
    } finally {
      setIsCreating(false);
    }
  };

  // Filled state is instant from global context OR local set
  const isBookmarked = isSaved(questionId) || membershipSet.size > 0;

  return (
    <div className={`relative inline-block ${className}`} ref={popoverRef}>
      <button
        type="button"
        onClick={handleToggleOpen}
        title={isBookmarked ? "Saved to playlists" : "Save to playlist"}
        aria-label="Save to playlist"
        className={`p-1.5 rounded-lg transition-all cursor-pointer ${
          isBookmarked
            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/50"
            : "text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-xl z-50 p-3 text-left animate-in fade-in zoom-in-95 duration-100">
          {/* Unauthenticated State */}
          {status !== "authenticated" ? (
            <div className="p-3 text-center space-y-2">
              <Bookmark className="w-6 h-6 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                Sign in to save questions to your lists
              </p>
            </div>
          ) : (
            /* Authenticated State */
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                  Save to Playlist
                </span>
                {loading && <Loader2 className="w-3 h-3 animate-spin text-blue-600" />}
              </div>

              {/* Error banner if limit reached or name duplicate */}
              {errorMsg && (
                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-600 dark:text-rose-400 flex items-start gap-1.5 leading-tight">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Playlists Checkbox List */}
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {loadingPlaylists && playlists.length === 0 ? (
                  <div className="py-4 text-center text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                    <span>Loading lists...</span>
                  </div>
                ) : playlists.length === 0 ? (
                  <div className="py-3 text-center text-xs text-gray-400 dark:text-gray-500">
                    No lists found. Create one below!
                  </div>
                ) : (
                  playlists.map((pl) => {
                  const checked = membershipSet.has(pl.id);
                  return (
                    <label
                      key={pl.id}
                      className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer group text-xs transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Custom Styled Checkbox */}
                        <div className="relative flex items-center justify-center shrink-0">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleMembership(pl.id, checked)}
                            className="sr-only peer"
                          />
                          <div
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-1 ${
                              checked
                                ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500 text-white shadow-xs"
                                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/30"
                            }`}
                          >
                            <Check
                              className={`w-2.5 h-2.5 stroke-[3] text-white transition-all duration-150 ${
                                checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
                              }`}
                            />
                          </div>
                        </div>
                        <span
                          title={pl.name}
                          className="truncate text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium"
                        >
                          {pl.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                        {pl.is_public ? (
                          <Globe className="w-3 h-3 text-gray-400" title="Public list" />
                        ) : (
                          <Lock className="w-3 h-3 text-gray-400" title="Private list" />
                        )}
                      </span>
                    </label>
                  );
                }))}
              </div>

              {/* Inline Create Playlist Form */}
              <form onSubmit={handleCreateList} className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="New list name..."
                    maxLength={50}
                    disabled={isCreating}
                    className="flex-1 px-2.5 py-1 text-xs bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newListName.trim() || isCreating}
                    className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                    <span>Add</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
