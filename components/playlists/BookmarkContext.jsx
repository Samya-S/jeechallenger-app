"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const BookmarkContext = createContext({
  isSaved: () => false,
  addSavedId: () => {},
  removeSavedId: () => {},
  refreshBookmarks: () => {},
  playlists: [],
  userPlaylists: [],
  loadingPlaylists: false,
  authStatus: "loading",
  activeDetail: null,
  setActiveDetail: () => {},
  refreshPlaylists: () => {},
  addPlaylist: () => {},
  handleQuestionRemoved: () => {},
  handlePlaylistUpdated: () => {},
  handlePlaylistCreated: () => {},
  handlePlaylistDeleted: () => {},
  getMemberships: () => null,
  setMemberships: () => {},
});

export function BookmarkProvider({ children }) {
  const { status } = useSession();
  const router = useRouter();

  const [savedIds, setSavedIds] = useState(new Set());
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [activeDetail, setActiveDetail] = useState(null);

  // In-memory cache for question membership: questionId -> Set(playlistIds)
  const membershipCacheRef = useRef(new Map());

  // Manual refresh handler for bookmarks and playlists
  const refreshBookmarksAndPlaylists = useCallback(() => {
    if (status !== "authenticated") return;
    setLoadingPlaylists(true);

    Promise.all([
      fetch("/api/playlists/bookmarked-ids").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/playlists").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([savedJson, playlistsJson]) => {
        if (savedJson?.data && Array.isArray(savedJson.data)) {
          setSavedIds(new Set(savedJson.data));
        }
        if (playlistsJson?.data && Array.isArray(playlistsJson.data)) {
          setPlaylists(playlistsJson.data);
        }
      })
      .catch((err) => console.error("Failed to refresh bookmarks or playlists:", err))
      .finally(() => setLoadingPlaylists(false));
  }, [status]);

  // Initial prefetch on mount or auth change
  useEffect(() => {
    if (status !== "authenticated") {
      Promise.resolve().then(() => {
        setSavedIds(new Set());
        setPlaylists([]);
        setLoadingPlaylists(false);
        setActiveDetail(null);
        membershipCacheRef.current.clear();
      });
      return;
    }

    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) setLoadingPlaylists(true);
    });

    Promise.all([
      fetch("/api/playlists/bookmarked-ids").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/playlists").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([savedJson, playlistsJson]) => {
        if (ignore) return;
        if (savedJson?.data && Array.isArray(savedJson.data)) {
          setSavedIds(new Set(savedJson.data));
        }
        if (playlistsJson?.data && Array.isArray(playlistsJson.data)) {
          setPlaylists(playlistsJson.data);
        }
      })
      .catch((err) => console.error("Failed to prefetch bookmarks or playlists:", err))
      .finally(() => {
        if (!ignore) setLoadingPlaylists(false);
      });

    return () => {
      ignore = true;
    };
  }, [status]);

  const isSaved = useCallback(
    (questionId) => {
      if (!questionId) return false;
      return savedIds.has(String(questionId));
    },
    [savedIds]
  );

  const addSavedId = useCallback((questionId) => {
    if (!questionId) return;
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.add(String(questionId));
      return next;
    });
  }, []);

  const removeSavedId = useCallback((questionId) => {
    if (!questionId) return;
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(String(questionId));
      return next;
    });
  }, []);

  const addPlaylist = useCallback((newPlaylist) => {
    if (!newPlaylist?.id) return;
    setPlaylists((prev) => {
      if (prev.some((p) => p.id === newPlaylist.id)) return prev;
      return [...prev, newPlaylist];
    });
  }, []);

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

    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? { ...pl, question_count: Math.max(0, (pl.question_count || 0) - 1) }
          : pl
      )
    );

    // Update in-memory membership cache
    const qStr = String(questionId);
    if (membershipCacheRef.current.has(qStr)) {
      const set = membershipCacheRef.current.get(qStr);
      set.delete(playlistId);
      if (set.size === 0) {
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(qStr);
          return next;
        });
      }
    }
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

    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === updatedPlaylist.id ? { ...pl, ...updatedPlaylist } : pl))
    );
  }, []);

  // Handle playlist created from sidebar, modal, or popover
  const handlePlaylistCreated = useCallback((newPlaylist) => {
    setPlaylists((prev) => {
      if (prev.some((p) => p.id === newPlaylist.id)) return prev;
      return [...prev, newPlaylist];
    });
    router.push(`/lists/${newPlaylist.slug}`);
  }, [router]);

  // Handle playlist deleted
  const handlePlaylistDeleted = useCallback((deletedSlugOrId) => {
    setPlaylists((prev) => prev.filter((pl) => pl.slug !== deletedSlugOrId && pl.id !== deletedSlugOrId));
    router.push("/lists");
  }, [router]);

  const getMemberships = useCallback((questionId) => {
    if (!questionId) return null;
    return membershipCacheRef.current.get(String(questionId)) || null;
  }, []);

  const setMemberships = useCallback((questionId, set) => {
    if (!questionId) return;
    membershipCacheRef.current.set(String(questionId), new Set(set));
  }, []);

  return (
    <BookmarkContext.Provider
      value={{
        isSaved,
        addSavedId,
        removeSavedId,
        refreshBookmarks: refreshBookmarksAndPlaylists,
        playlists,
        userPlaylists: playlists,
        loadingPlaylists,
        authStatus: status,
        activeDetail,
        setActiveDetail,
        refreshPlaylists: refreshBookmarksAndPlaylists,
        addPlaylist,
        handleQuestionRemoved,
        handlePlaylistUpdated,
        handlePlaylistCreated,
        handlePlaylistDeleted,
        getMemberships,
        setMemberships,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
}

export const usePlaylistContext = useBookmarks;
