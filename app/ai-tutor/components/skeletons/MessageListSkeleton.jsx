"use client";

import React from "react";

export default function MessageListSkeleton() {
  return (
    <div className="space-y-6 py-2 h-full overflow-hidden animate-pulse select-none pointer-events-none [mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_90%,transparent_100%)]">
      {[0, 1, 2].map((cycle) => (
        <React.Fragment key={cycle}>
          {/* Exchange 1: Initial User Doubt (Longer query + Detailed derivation card with math box) */}
          <div className="flex justify-end">
            <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[70%]">
              <div className="bg-blue-100/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 p-4 rounded-2xl rounded-tr-[2px] space-y-2 w-72 sm:w-96 shadow-2xs">
                <div className="h-3.5 bg-blue-200 dark:bg-blue-800/60 rounded-md w-4/5" />
                <div className="h-3.5 bg-blue-200/80 dark:bg-blue-800/40 rounded-md w-3/5" />
              </div>
              <div className="hidden sm:flex w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-900/60 shrink-0" />
            </div>
          </div>

          {/* Exchange 1: AI Tutor Response (Detailed card with equation derivation sub-block) */}
          <div className="flex justify-start">
            <div className="flex items-start gap-3 w-full max-w-full sm:max-w-[85%]">
              <div className="hidden sm:flex w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
              <div className="bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl rounded-tl-[2px] space-y-3 flex-1 shadow-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-3.5 bg-slate-200 dark:bg-slate-700/60 rounded-md w-28" />
                  <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-md" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200/90 dark:bg-slate-700/50 rounded-md w-full" />
                  <div className="h-3 bg-slate-200/80 dark:bg-slate-700/40 rounded-md w-11/12" />
                  <div className="h-3 bg-slate-200/70 dark:bg-slate-700/30 rounded-md w-4/5" />
                </div>
                <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/40 space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md w-3/4 mx-auto" />
                  <div className="h-3 bg-slate-200/70 dark:bg-slate-700/40 rounded-md w-1/2 mx-auto" />
                </div>
              </div>
            </div>
          </div>

          {/* Exchange 2: User Follow-up Query (Compact query) */}
          <div className="flex justify-end pt-1">
            <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[70%]">
              <div className="bg-blue-100/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/30 p-3.5 rounded-2xl rounded-tr-[2px] space-y-2 w-64 sm:w-80 shadow-2xs">
                <div className="h-3 bg-blue-200/80 dark:bg-blue-800/50 rounded-md w-full" />
                <div className="h-3 bg-blue-200/60 dark:bg-blue-800/30 rounded-md w-2/3" />
              </div>
              <div className="hidden sm:flex w-8 h-8 rounded-full bg-blue-200/80 dark:bg-blue-900/50 shrink-0" />
            </div>
          </div>

          {/* Exchange 2: AI Clarification Response (Compact card) */}
          <div className="flex justify-start">
            <div className="flex items-start gap-3 w-full max-w-full sm:max-w-[85%]">
              <div className="hidden sm:flex w-8 h-8 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 shrink-0" />
              <div className="bg-white/80 dark:bg-[#131b2e]/80 border border-slate-200/70 dark:border-slate-800/70 p-4 rounded-2xl rounded-tl-[2px] space-y-2.5 flex-1 shadow-xs">
                <div className="h-3 bg-slate-200/80 dark:bg-slate-700/40 rounded-md w-full" />
                <div className="h-3 bg-slate-200/70 dark:bg-slate-700/30 rounded-md w-5/6" />
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
