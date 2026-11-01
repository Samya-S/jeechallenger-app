"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePlaylistContext } from "@/components/playlists/PlaylistContext";

export default function ListsIndexClient() {
  const { status } = useSession();
  const router = useRouter();
  const { userPlaylists, loadingPlaylists } = usePlaylistContext();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/lists");
      return;
    }

    if (status === "authenticated" && !loadingPlaylists) {
      if (userPlaylists.length > 0) {
        // Automatically select Favourites or the first available list
        const fav = userPlaylists.find((l) => l.type === "FAVOURITES") || userPlaylists[0];
        router.replace(`/lists/${fav.slug}`);
      }
    }
  }, [status, loadingPlaylists, userPlaylists, router]);

  const hasNoLists = status === "authenticated" && !loadingPlaylists && userPlaylists.length === 0;

  return (
    <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 min-h-[580px] lg:min-h-[640px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        {hasNoLists ? (
          <span className="text-xs text-rose-500 font-medium">No question lists found.</span>
        ) : (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Loading your lists...</span>
          </>
        )}
      </div>
    </div>
  );
}
