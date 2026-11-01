"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Share2, Check, Lock, Globe, Trash2, Edit3, Loader2, AlertTriangle, X, Copy } from "lucide-react";

const emptySubscribe = () => () => {};

export default function PlaylistHeader({
  playlist,
  isOwner,
  onPlaylistUpdated,
  onPlaylistDeleted,
  className = "",
}) {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [copied, setCopied] = useState(false);
  const [cloning, setCloning] = useState(false);
  const [cloneSuccess, setCloneSuccess] = useState(false);
  const [cloneError, setCloneError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  // Body scroll lock & Escape key handling
  useEffect(() => {
    if (!showEditModal && !showDeleteModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowEditModal(false);
        setShowDeleteModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showEditModal, showDeleteModal]);

  // Edit form state
  const [editName, setEditName] = useState(playlist?.name || "");
  const [editDescription, setEditDescription] = useState(playlist?.description || "");
  const [editIsPublic, setEditIsPublic] = useState(playlist?.is_public || false);

  if (!playlist) return null;

  const handleOpenEdit = () => {
    setEditName(playlist.name);
    setEditDescription(playlist.description || "");
    setEditIsPublic(playlist.is_public);
    setEditError("");
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!isOwner || savingEdit) return;

    setSavingEdit(true);
    setEditError("");

    const body = {};
    if (!playlist.is_default && editName.trim() !== playlist.name) {
      body.name = editName.trim();
    }
    if (editDescription.trim() !== (playlist.description || "")) {
      body.description = editDescription.trim();
    }
    if (playlist.type !== "MISTAKE_VAULT" && editIsPublic !== playlist.is_public) {
      body.is_public = editIsPublic;
    }

    try {
      const res = await fetch(`/api/playlists/${playlist.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update playlist");
        setSavingEdit(false);
        return;
      }

      setShowEditModal(false);
      if (onPlaylistUpdated) {
        onPlaylistUpdated({
          ...playlist,
          name: body.name || playlist.name,
          description: body.description !== undefined ? body.description : playlist.description,
          is_public: body.is_public !== undefined ? body.is_public : playlist.is_public,
        });
      }
    } catch (err) {
      console.error("Failed to update playlist:", err);
      setEditError("Network error. Please try again.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/lists/${playlist.slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleDelete = async () => {
    if (!isOwner || playlist.is_default || deleting) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/playlists/${playlist.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShowDeleteModal(false);
        if (onPlaylistDeleted) {
          onPlaylistDeleted(playlist.id);
        } else {
          router.push("/lists");
        }
      }
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleClone = async () => {
    if (authStatus === "unauthenticated") {
      router.push(`/login?callbackUrl=/lists/${playlist.slug}`);
      return;
    }
    if (cloning) return;
    setCloning(true);
    setCloneError("");
    try {
      const res = await fetch(`/api/playlists/slug/${playlist.slug}/clone`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setCloneError(data.error || "Failed to clone playlist");
        setCloning(false);
        return;
      }
      setCloneSuccess(true);
      setTimeout(() => {
        router.push(`/lists/${data.data.slug}`);
      }, 500);
    } catch (err) {
      console.error("Failed to clone playlist:", err);
      setCloneError("Network error. Please try again.");
      setCloning(false);
    }
  };

  return (
    <div className={`space-y-4 pb-6 border-b border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Title and metadata */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-gray-950 dark:text-gray-50 tracking-tight">
              {playlist.name}
            </h1>

            {/* Visibility Badge */}
            {playlist.type === "MISTAKE_VAULT" || !playlist.is_public ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700/60">
                <Lock className="w-3 h-3 text-gray-500" />
                <span>Private</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <Globe className="w-3 h-3" />
                <span>Public</span>
              </span>
            )}

            {/* Question count */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
              {playlist.question_count || 0} {playlist.question_count === 1 ? "question" : "questions"}
            </span>

            {/* Non-owner author pill */}
            {!isOwner && (
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                • Community List
              </span>
            )}
          </div>

          {playlist.description && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {playlist.description}
            </p>
          )}

          {cloneError && (
            <p className="text-xs font-semibold text-rose-500">{cloneError}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {/* Clone Button — visible to non-owners viewing a public list */}
          {!isOwner && playlist.is_public && (
            <button
              type="button"
              onClick={handleClone}
              disabled={cloning || cloneSuccess}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer shadow-xs disabled:opacity-75"
              title="Clone this playlist to your personal lists"
            >
              {cloning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Cloning...</span>
                </>
              ) : cloneSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Cloned!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Clone to My Lists</span>
                </>
              )}
            </button>
          )}

          {/* Share Button — ONLY visible when playlist is Public */}
          {playlist.is_public && (
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Link</span>
                </>
              )}
            </button>
          )}

          {/* Edit Button (Available to Owner) */}
          {isOwner && (
            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
              title="Edit Playlist Settings"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}

          {/* Delete Button (COMPLETELY HIDDEN for default lists: Favourites & Mistake Vault) */}
          {isOwner && !playlist.is_default && (
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
              title="Delete Playlist"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Edit Playlist Modal */}
      {mounted && showEditModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-100"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditModal(false);
          }}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Edit Playlist Settings
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-600 dark:text-rose-400">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Playlist Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={50}
                  disabled={playlist.is_default}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {playlist.is_default && (
                  <span className="block text-[11px] text-gray-400 mt-1">
                    System default list name cannot be changed.
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={2}
                  maxLength={200}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add context or notes for this list..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Visibility Switch */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60">
                <div className="space-y-0.5">
                  <span className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                    Visibility
                  </span>
                  <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                    {playlist.type === "MISTAKE_VAULT"
                      ? "Mistake Vault is strictly private and cannot be made public."
                      : editIsPublic
                      ? "Public: Anyone with the link can view these questions."
                      : "Private: Only you can view this list."}
                  </span>
                </div>
                {playlist.type === "MISTAKE_VAULT" ? (
                  <span className="text-xs font-bold text-gray-400 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    Locked
                  </span>
                ) : (
                  <input
                    type="checkbox"
                    checked={editIsPublic}
                    onChange={(e) => setEditIsPublic(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={savingEdit}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {savingEdit && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {mounted && showDeleteModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-100"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteModal(false);
          }}
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Delete Playlist?
              </h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-gray-200">&quot;{playlist.name}&quot;</span>? This action cannot be undone. Questions in the list will not be deleted from the question bank.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
