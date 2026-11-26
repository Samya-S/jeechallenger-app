"use client";

import React from "react";

export default function ChatListSkeleton() {
  return (
    <div className="space-y-4 px-1 py-1 h-full overflow-hidden animate-pulse select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)]">
      {/* Group 1: Today */}
      <div>
        <div className="h-2.5 w-14 bg-slate-200 dark:bg-slate-800 rounded-md mb-2.5 ml-2" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/50">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/70 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/70 rounded-md w-3/4" />
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-1/2" />
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/35">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-5/6" />
          </div>
        </div>
      </div>

      {/* Group 2: Yesterday */}
      <div>
        <div className="h-2.5 w-20 bg-slate-200 dark:bg-slate-800 rounded-md mb-2.5 ml-2" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/35">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-2/3" />
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/30">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-4/5" />
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/45 dark:bg-slate-800/25">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-3/5" />
          </div>
        </div>
      </div>

      {/* Group 3: Previous 7 Days */}
      <div>
        <div className="h-2.5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md mb-2.5 ml-2" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/40 dark:bg-slate-800/25">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-3/4" />
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/35 dark:bg-slate-800/20">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-1/2" />
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/30 dark:bg-slate-800/15">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-2/3" />
          </div>
        </div>
      </div>

      {/* Group 4: Older */}
      <div>
        <div className="h-2.5 w-16 bg-slate-200 dark:bg-slate-800 rounded-md mb-2.5 ml-2" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/30 dark:bg-slate-800/15">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-4/5" />
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/25 dark:bg-slate-800/10">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-3/5" />
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-100/20 dark:bg-slate-800/10">
            <div className="w-4 h-4 rounded-md bg-slate-200 dark:bg-slate-700/60 shrink-0" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
