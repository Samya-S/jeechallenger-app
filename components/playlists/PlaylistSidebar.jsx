"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Star, ShieldAlert, ListOrdered, Plus, Lock, Globe, Loader2, Trash2 } from "lucide-react";

const emptySubscribe = () => () => {};

export default function PlaylistSidebar({
  playlists,
  currentSlug,
  onPlaylistCreated,
  className = "",
}) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Body scroll lock & Escape key handling
  useEffect(() => {
    if (!showCreateModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowCreateModal(false);
        setCreateError("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showCreateModal]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = newListName.trim();
    if (!trimmed) return;

    setCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed, is_public: isPublic }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error || "Failed to create playlist");
        setCreating(false);
        return;
      }

      setNewListName("");
      setIsPublic(false);
      setShowCreateModal(false);
      if (onPlaylistCreated) {
        onPlaylistCreated(data.data);
      }
    } catch (err) {
      console.error("Create playlist error:", err);
      setCreateError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const getIcon = (type) => {
    if (type === "FAVOURITES") {
      return <Star className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />;
    }
    if (type === "MISTAKE_VAULT") {
      return <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />;
    }
    return <ListOrdered className="w-4 h-4 text-blue-500 shrink-0" />;
  };

  return (
    <aside className={`w-full md:w-64 lg:w-72 shrink-0 ${className}`}>
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            My Question Lists
          </span>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New List</span>
          </button>
        </div>

        {/* Playlists Navigation List */}
        <nav className="space-y-1">
          {playlists.map((pl) => {
            const isActive = pl.slug === currentSlug;
            return (
              <Link
                key={pl.id}
                href={`/lists/${pl.slug}`}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={isActive ? "text-white" : ""}>{getIcon(pl.type)}</div>
                  <span className="truncate">{pl.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {pl.question_count}
                  </span>
                  {pl.is_public ? (
                    <Globe
                      className={`w-3 h-3 ${isActive ? "text-white/80" : "text-gray-400"}`}
                      title="Public List"
                    />
                  ) : (
                    <Lock
                      className={`w-3 h-3 ${isActive ? "text-white/80" : "text-gray-400"}`}
                      title="Private List"
                    />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Create Modal Portaled to document.body */}
      {mounted && showCreateModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-100"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
              setCreateError("");
            }
          }}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Create New Playlist
            </h3>

            {createError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Playlist Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Must-Do Calculus Traps"
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60">
                <div className="space-y-0.5">
                  <span className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                    Public Visibility
                  </span>
                  <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                    Anyone with the link can view questions
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError("");
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newListName.trim() || creating}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create List</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </aside>
  );
}
