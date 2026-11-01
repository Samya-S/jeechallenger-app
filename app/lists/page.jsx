"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ListsIndexPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/lists");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/playlists")
        .then((res) => res.json())
        .then((data) => {
          const lists = data.data || [];
          if (lists.length > 0) {
            // Automatically select Favourites or the first available list
            const fav = lists.find((l) => l.type === "FAVOURITES") || lists[0];
            router.replace(`/lists/${fav.slug}`);
          } else {
            setError("No playlists found.");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch playlists:", err);
          setError("Failed to load playlists.");
        });
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="text-xs text-gray-500 dark:text-gray-400">Loading your playlists...</span>
        {error && <span className="text-xs text-rose-500">{error}</span>}
      </div>
    </div>
  );
}
