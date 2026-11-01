"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const BookmarkContext = createContext({
  isSaved: () => false,
  addSavedId: () => {},
  removeSavedId: () => {},
  refreshBookmarks: () => {},
});

export function BookmarkProvider({ children }) {
  const { status } = useSession();
  const [savedIds, setSavedIds] = useState(new Set());

  const fetchBookmarks = useCallback(() => {
    if (status !== "authenticated") {
      setSavedIds(new Set());
      return;
    }
    fetch("/api/playlists/bookmarked-ids")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) {
          setSavedIds(new Set(json.data));
        }
      })
      .catch((err) => console.error("Failed to fetch user bookmarked IDs:", err));
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    let ignore = false;
    fetch("/api/playlists/bookmarked-ids")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json?.data && Array.isArray(json.data)) {
          setSavedIds(new Set(json.data));
        }
      })
      .catch((err) => console.error("Failed to fetch user bookmarked IDs:", err));

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

  return (
    <BookmarkContext.Provider
      value={{
        isSaved,
        addSavedId,
        removeSavedId,
        refreshBookmarks: fetchBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarkContext);
}
