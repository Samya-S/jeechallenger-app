"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

const BookmarkContext = createContext({
  isSaved: () => false,
  addSavedId: () => {},
  removeSavedId: () => {},
  refreshBookmarks: () => {},
  playlists: [],
  loadingPlaylists: false,
  refreshPlaylists: () => {},
  addPlaylist: () => {},
  getMemberships: () => null,
  setMemberships: () => {},
});

export function BookmarkProvider({ children }) {
  const { status } = useSession();
  const [savedIds, setSavedIds] = useState(new Set());
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

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
        loadingPlaylists,
        refreshPlaylists: refreshBookmarksAndPlaylists,
        addPlaylist,
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
