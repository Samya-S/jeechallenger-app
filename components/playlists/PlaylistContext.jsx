"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const PlaylistContext = createContext(null);

export function PlaylistProvider({ children }) {
  const { status: authStatus } = useSession();
  const router = useRouter();

  const [userPlaylists, setUserPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [activeDetail, setActiveDetail] = useState(null);

  // Fetch user's own playlists once on initial mount if authenticated
  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus !== "authenticated") {
      // Defer state update out of synchronous effect execution
      const timer = setTimeout(() => setLoadingPlaylists(false), 0);
      return () => clearTimeout(timer);
    }

    let ignore = false;
    fetch("/api/playlists")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.data) {
          setUserPlaylists(data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load user playlists:", err);
      })
      .finally(() => {
        if (!ignore) {
          setLoadingPlaylists(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [authStatus]);

  // Handle local question removal in the active view & sidebar count
  const handleQuestionRemoved = useCallback((playlistId, questionId) => {
    setActiveDetail((prev) => {
      if (!prev || prev.playlist?.id !== playlistId) return prev;
      return {
        ...prev,
        playlist: {
          ...prev.playlist,
          question_count: Math.max(0, (prev.playlist.question_count || 0) - 1),
        },
        questions: (prev.questions || []).filter((q) => (q.id || q._id) !== questionId),
      };
    });

    setUserPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? { ...pl, question_count: Math.max(0, (pl.question_count || 0) - 1) }
          : pl
      )
    );
  }, []);

  // Handle playlist metadata edit (name, description, visibility)
  const handlePlaylistUpdated = useCallback((updatedPlaylist) => {
    setActiveDetail((prev) => {
      if (!prev || prev.playlist?.id !== updatedPlaylist.id) return prev;
      return {
        ...prev,
        playlist: updatedPlaylist,
      };
    });

    setUserPlaylists((prev) =>
      prev.map((pl) => (pl.id === updatedPlaylist.id ? { ...pl, ...updatedPlaylist } : pl))
    );
  }, []);

  // Handle playlist created from sidebar or mobile modal
  const handlePlaylistCreated = useCallback((newPlaylist) => {
    setUserPlaylists((prev) => [...prev, newPlaylist]);
    router.push(`/lists/${newPlaylist.slug}`);
  }, [router]);

  // Handle playlist deleted
  const handlePlaylistDeleted = useCallback((deletedSlug) => {
    setUserPlaylists((prev) => prev.filter((pl) => pl.slug !== deletedSlug));
    router.push("/lists");
  }, [router]);

  return (
    <PlaylistContext.Provider
      value={{
        userPlaylists,
        loadingPlaylists,
        authStatus,
        activeDetail,
        setActiveDetail,
        handleQuestionRemoved,
        handlePlaylistUpdated,
        handlePlaylistCreated,
        handlePlaylistDeleted,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylistContext() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylistContext must be used within a PlaylistProvider");
  }
  return context;
}
