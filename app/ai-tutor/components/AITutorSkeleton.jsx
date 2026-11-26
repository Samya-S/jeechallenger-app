"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ChatListSkeleton from "./skeletons/ChatListSkeleton";
import MessageListSkeleton from "./skeletons/MessageListSkeleton";

export default function AITutorSkeleton() {
  const pathname = usePathname();
  const isChatPage = pathname ? pathname.startsWith("/ai-tutor/chat/") : false;

  return (
    <div className="fixed inset-0 h-[100dvh] bg-slate-50 dark:bg-[#0b101b] overflow-hidden flex flex-col animate-pulse select-none">
      {/* 1. Mobile Top Bar Skeleton (Mobile only: lg:hidden) */}
      <div className="lg:hidden flex items-center justify-between px-3.5 py-2.5 bg-slate-50/95 dark:bg-[#090e18]/95 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0 z-40">
        <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800/80" />
        <div className="h-6 w-36 rounded-lg bg-slate-200 dark:bg-slate-800/80" />
        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800/80" />
      </div>

      {/* Main Container: Sidebar + Main Chat Viewport */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* 2. Desktop Sidebar Skeleton (lg:flex) */}
        <aside className="hidden lg:flex w-72 sm:w-80 h-full flex-col shrink-0 bg-slate-50 dark:bg-[#090e18] border-r border-slate-200/90 dark:border-slate-800/90 p-3 justify-between">
          <div className="flex-1 min-h-0 flex flex-col space-y-4">
            {/* Header Brand + Collapse button */}
            <div className="flex items-center justify-between py-1 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-28 rounded-md bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
            </div>

            {/* Search Bar + New Chat Skeleton */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex-1 h-9 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
              <div className="w-16 h-9 rounded-xl bg-blue-200 dark:bg-blue-900/40" />
            </div>

            {/* Chat List Items Skeleton - Single Source of Truth */}
            <div className="flex-1 overflow-hidden pt-1">
              <ChatListSkeleton />
            </div>
          </div>

          {/* Footer User Profile Skeleton */}
          <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 shrink-0">
            <div className="h-12 rounded-xl bg-slate-200/70 dark:bg-slate-800/60" />
          </div>
        </aside>

        {/* 3. Main Chat Canvas Skeleton - 0px padding on <main> to match AITutorComponent */}
        <main className="flex-1 flex flex-col min-w-0 min-h-0 h-full relative bg-slate-50/50 dark:bg-[#0b101b]">
          {isChatPage ? (
            /* Conversational Chat History Skeleton - Exact 1:1 match to ChatMessageList */
            <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="flex-1 px-3 sm:px-6 md:px-8 pt-0 pb-4 sm:pb-6 min-h-0 overflow-hidden">
                <div className="max-w-4xl mx-auto w-full h-full">
                  <MessageListSkeleton />
                </div>
              </div>
            </div>
          ) : (
            /* Welcome / Center Screen Wireframe (For Landing Page /ai-tutor) - Exact match to WelcomeScreen */
            <div className="relative flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
              <div className="flex-1 px-3 sm:px-6 md:px-8 pt-0 pb-4 sm:pb-6 min-h-0 overflow-hidden flex flex-col justify-center">
                <div className="max-w-4xl mx-auto w-full py-8 sm:py-12 px-3 sm:px-4 flex flex-col items-center justify-center space-y-6">
                  {/* Hero Emblem Circle */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 shadow-xs" />
                  
                  {/* Title & Subtitle */}
                  <div className="space-y-2 text-center flex flex-col items-center">
                    <div className="h-6 sm:h-8 w-64 sm:w-80 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3.5 sm:h-4 w-48 sm:w-60 rounded-lg bg-slate-200/60 dark:bg-slate-800/60" />
                  </div>

                  {/* 3 Subject Cards Wireframe */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full pt-4">
                    <div className="h-28 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 p-4 space-y-2 shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60" />
                      <div className="h-3.5 w-20 rounded-md bg-slate-200 dark:bg-slate-700/60" />
                      <div className="h-2.5 w-full rounded-md bg-slate-100 dark:bg-slate-800/60" />
                    </div>
                    <div className="h-28 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 p-4 space-y-2 shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60" />
                      <div className="h-3.5 w-24 rounded-md bg-slate-200 dark:bg-slate-700/60" />
                      <div className="h-2.5 w-full rounded-md bg-slate-100 dark:bg-slate-800/60" />
                    </div>
                    <div className="h-28 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800/80 p-4 space-y-2 shadow-xs">
                      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60" />
                      <div className="h-3.5 w-24 rounded-md bg-slate-200 dark:bg-slate-700/60" />
                      <div className="h-2.5 w-full rounded-md bg-slate-100 dark:bg-slate-800/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Floating Input Skeleton - Exact match to ChatInputArea */}
          <div className="bg-slate-50/80 dark:bg-[#0b101b]/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 px-3 py-2.5 sm:px-6 sm:py-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-xs shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="h-12 sm:h-14 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800/90 p-2 sm:p-2.5 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5 flex-1 pl-1">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800" />
                  <div className="h-4 w-48 sm:w-64 rounded-md bg-slate-200/70 dark:bg-slate-800/60" />
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-200 dark:bg-blue-900/50" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
