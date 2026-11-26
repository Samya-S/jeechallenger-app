"use client";

import React from "react";
import { UploadCloud, Sparkles } from "lucide-react";

export default function DragDropOverlay({ onDismiss }) {
  return (
    <div
      onClick={onDismiss}
      className="absolute inset-2 sm:inset-4 z-50 flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl border-2 border-dashed border-blue-500/80 dark:border-blue-400/80 bg-slate-900/10 dark:bg-black/40 backdrop-blur-md shadow-2xl transition-all duration-200 select-none cursor-pointer"
      role="region"
      aria-label="File drop zone"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center text-center max-w-md p-6 sm:p-8 rounded-2xl bg-white/95 dark:bg-[#131b2e]/95 border border-blue-200/80 dark:border-blue-800/80 shadow-2xl shadow-blue-500/15 cursor-default"
      >
        {/* Animated Glowing Upload Icon */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="absolute w-20 h-20 rounded-full bg-blue-500/20 dark:bg-blue-400/25 blur-xl animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-white dark:ring-[#131b2e]">
            <UploadCloud className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        {/* Headline */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-2 flex items-center gap-1.5 justify-center">
          <span>Drop your files or notes here</span>
          <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
        </h3>

        {/* Subtitle - Clean & All-encompassing */}
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed max-w-sm">
          Upload question photos, study notes, worksheets, or documents for instant step-by-step AI guidance.
        </p>

        {/* Desktop Pro-Tip */}
        <div className="text-[11px] text-slate-400 dark:text-slate-400 font-medium pt-3 border-t border-slate-100 dark:border-slate-800/80 w-full">
          Pro-tip: You can also paste copied images directly with <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">Ctrl + V</kbd>
        </div>
      </div>
    </div>
  );
}
