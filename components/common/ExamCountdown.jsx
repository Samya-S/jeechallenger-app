"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { getExamCurrentState } from "@/config/exam-schedule-config";

// Ticker store subscribing to 1-second intervals
function subscribeClock(callback) {
  const interval = setInterval(callback, 1000);
  return () => clearInterval(interval);
}

function getClientTime() {
  return Date.now();
}

function getServerTime() {
  return null;
}

export default function ExamCountdown({
  examKey = "JEE_MAIN",
  className = "",
}) {
  const now = useSyncExternalStore(subscribeClock, getClientTime, getServerTime);
  const mounted = now !== null;

  // Pure derived state from current IST timestamp
  const examState = mounted ? getExamCurrentState(examKey, now) : null;

  // Graceful auto-retirement: once the exam cycle is over, component cleanly unmounts
  if (mounted && examState?.isRetired) {
    return null;
  }

  const diff = examState?.targetTimeMs ? examState.targetTimeMs - now : 0;
  const timeLeft = (!mounted || !examState || diff <= 0)
    ? { days: 0, hours: 0, minutes: 0, seconds: 0 }
    : {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };

  const effectiveTheme = examState?.theme || (examKey === "JEE_ADVANCED" ? "amber" : "emerald");
  const isAmber = effectiveTheme === "amber" || effectiveTheme === "orange";

  const themeTokens = isAmber
    ? {
        badgeBg: "bg-amber-100 dark:bg-amber-950/70",
        badgeBorder: "border-amber-200 dark:border-amber-800/80",
        badgeText: "text-amber-800 dark:text-amber-300",
        badgeDot: "bg-amber-500",
        slotPillBg: "bg-amber-500/[0.08] dark:bg-amber-500/10",
        slotPillBorder: "border-amber-200/80 dark:border-amber-800/60",
        slotPillText: "text-amber-950 dark:text-amber-200",
        slotPillIcon: "text-amber-600 dark:text-amber-400",
        unitLabel: "text-amber-700 dark:text-amber-400",
        tileBg: "bg-amber-500/[0.04] dark:bg-amber-500/[0.06]",
        tileBorder: "border-amber-200/80 dark:border-amber-900/40",
        glowA: "bg-amber-500/10",
        glowB: "bg-orange-500/10",
        ctaBtn: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-amber-600/20",
      }
    : {
        badgeBg: "bg-emerald-100 dark:bg-emerald-950/70",
        badgeBorder: "border-emerald-200 dark:border-emerald-800/80",
        badgeText: "text-emerald-800 dark:text-emerald-300",
        badgeDot: "bg-emerald-500",
        slotPillBg: "bg-emerald-500/[0.08] dark:bg-emerald-500/10",
        slotPillBorder: "border-emerald-200/80 dark:border-emerald-800/60",
        slotPillText: "text-emerald-950 dark:text-emerald-200",
        slotPillIcon: "text-emerald-600 dark:text-emerald-400",
        unitLabel: "text-emerald-700 dark:text-emerald-400",
        tileBg: "bg-emerald-500/[0.04] dark:bg-emerald-500/[0.06]",
        tileBorder: "border-emerald-200/80 dark:border-emerald-900/40",
        glowA: "bg-emerald-500/10",
        glowB: "bg-teal-500/10",
        ctaBtn: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-600/20",
      };

  // Recess tone overrides for interim gap days
  const isRecess = examState?.badgeTone === "recess";
  const badgeClasses = isRecess
    ? "bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300"
    : `${themeTokens.badgeBg} ${themeTokens.badgeBorder} ${themeTokens.badgeText}`;
  const badgeDotClass = isRecess ? "bg-amber-500" : themeTokens.badgeDot;
  const isLiveTone = examState?.badgeTone === "live";

  const displayTitle = examState?.title || (examKey === "JEE_ADVANCED" ? "JEE Advanced 2027" : "JEE Main 2027 Session 1");
  const displayBadge = examState?.badgeText || (examKey === "JEE_ADVANCED" ? "Confirmed Examination Date" : "Official Session 1 Schedule");
  const displayCtaText = examState?.ctaText || "Practice in CBT Mode";
  const displayCtaHref = examState?.ctaHref || (examKey === "JEE_ADVANCED" ? "/mock-test?exam_type=JEE_ADVANCED" : "/mock-test?exam_type=JEE_MAIN");
  const displayCountdownLabel = examState?.countdownLabel || "Time Left Until Session Commences";

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <div className="relative overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 border border-slate-200 dark:border-gray-800 shadow-xl shadow-slate-200/50 dark:shadow-[0_4px_25px_rgba(0,0,0,0.45)] ring-1 ring-black/[0.03] dark:ring-white/[0.06]">
        {/* Subtle Ambient Background Glows */}
        <div className={`absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl pointer-events-none ${themeTokens.glowA}`} />
        <div className={`absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 sm:w-64 sm:h-64 rounded-full blur-3xl pointer-events-none ${themeTokens.glowB}`} />

        <div className="relative z-10">
          {/* Header Tag, Title & Target Slot Pill */}
          <div className="text-center space-y-2 sm:space-y-2.5">
            {/* Top Status Badge */}
            <div className="inline-flex items-center justify-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs sm:text-sm font-semibold tracking-wide shadow-2xs ${badgeClasses}`}>
                <span className="relative flex h-2 w-2">
                  {isLiveTone && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${badgeDotClass}`} />
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${badgeDotClass}`} />
                </span>
                {displayBadge}
              </span>
            </div>

            {/* Main Exam Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {displayTitle}
            </h2>

            {/* Dynamic Target Slot Date & Time Milestone Pill (Responsive: Single-line on mobile, full on desktop) */}
            {examState?.targetSlotFormatted && (
              <div className="flex justify-center pt-0.5">
                <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold shadow-2xs transition-colors duration-200 ${themeTokens.slotPillBg} ${themeTokens.slotPillBorder} ${themeTokens.slotPillText}`}>
                  <Calendar className={`w-3.5 h-3.5 shrink-0 ${themeTokens.slotPillIcon}`} />
                  <span className="font-bold opacity-80">{examState.targetSlotLabel}:</span>
                  <span className="hidden sm:inline font-medium">{examState.targetSlotFormatted}</span>
                  <span className="sm:hidden font-medium">{examState.targetSlotShort || examState.targetSlotFormatted}</span>
                </div>
              </div>
            )}

            {/* Phase Tracker Label (Signifies the exact milestone of the active phase) */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 pt-1">
              <Clock className="w-3 h-3 opacity-70" />
              <span>{displayCountdownLabel}</span>
            </div>
          </div>

          {/* Countdown Units Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3.5 md:gap-5 max-w-2xl mx-auto my-5 sm:my-6">
            {/* Days Tile */}
            <div className={`flex flex-col items-center justify-center py-3 sm:py-4 md:py-5 px-1.5 sm:px-3 rounded-xl sm:rounded-2xl border ${themeTokens.tileBorder} ${themeTokens.tileBg} shadow-2xs transition-all duration-300 hover:scale-[1.02]`}>
              <span className="text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-gray-900 dark:text-white tabular-nums">
                {mounted ? String(timeLeft.days).padStart(2, "0") : "--"}
              </span>
              <span className={`text-[9px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider ${themeTokens.unitLabel} mt-1 sm:mt-1.5`}>
                Days
              </span>
            </div>

            {/* Hours Tile */}
            <div className={`flex flex-col items-center justify-center py-3 sm:py-4 md:py-5 px-1.5 sm:px-3 rounded-xl sm:rounded-2xl border ${themeTokens.tileBorder} ${themeTokens.tileBg} shadow-2xs transition-all duration-300 hover:scale-[1.02]`}>
              <span className="text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-gray-900 dark:text-white tabular-nums">
                {mounted ? String(timeLeft.hours).padStart(2, "0") : "--"}
              </span>
              <span className={`text-[9px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider ${themeTokens.unitLabel} mt-1 sm:mt-1.5`}>
                Hours
              </span>
            </div>

            {/* Minutes Tile */}
            <div className={`flex flex-col items-center justify-center py-3 sm:py-4 md:py-5 px-1.5 sm:px-3 rounded-xl sm:rounded-2xl border ${themeTokens.tileBorder} ${themeTokens.tileBg} shadow-2xs transition-all duration-300 hover:scale-[1.02]`}>
              <span className="text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-gray-900 dark:text-white tabular-nums">
                {mounted ? String(timeLeft.minutes).padStart(2, "0") : "--"}
              </span>
              <span className={`text-[9px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider ${themeTokens.unitLabel} mt-1 sm:mt-1.5`}>
                Mins
              </span>
            </div>

            {/* Seconds Tile */}
            <div className={`flex flex-col items-center justify-center py-3 sm:py-4 md:py-5 px-1.5 sm:px-3 rounded-xl sm:rounded-2xl border ${themeTokens.tileBorder} ${themeTokens.tileBg} shadow-2xs transition-all duration-300 hover:scale-[1.02]`}>
              <span className="text-2xl sm:text-4xl md:text-5xl font-black font-mono tracking-tight text-gray-900 dark:text-white tabular-nums">
                {mounted ? String(timeLeft.seconds).padStart(2, "0") : "--"}
              </span>
              <span className={`text-[9px] sm:text-[11px] md:text-xs font-bold uppercase tracking-wider ${themeTokens.unitLabel} mt-1 sm:mt-1.5`}>
                Secs
              </span>
            </div>
          </div>

          {/* Informational Reference Section (Placed below the timer in clean, distinct lines) */}
          {(examState?.windowText || examState?.shiftsText || examState?.shiftsSummary || examState?.statusMessage) && (
            <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-slate-200/80 dark:border-gray-800/80 text-center space-y-2 max-w-xl mx-auto">
              {examState.statusMessage && (
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                  {examState.statusMessage}
                </p>
              )}

              {/* Line 1: Official Exam Window or Official Exam Date */}
              {examState.windowText && (
                <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span>
                    <strong className="text-gray-800 dark:text-gray-200 font-semibold">
                      {examState.windowLabel || "Official Exam Window"}:
                    </strong>{" "}
                    {examState.windowText}
                  </span>
                </div>
              )}

              {/* Line 2: Shift Schedule (Cleanly stacked on mobile, inline on desktop, with no icon) */}
              {examState.shiftsSummary && examState.shiftsSummary.length > 0 ? (
                <div className="flex items-center justify-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2">
                    {examState.shiftsSummary.map((shift, idx) => (
                      <span key={idx} className="flex items-center">
                        {idx > 0 && <span className="hidden sm:inline opacity-40 mr-2">•</span>}
                        <span>{shift}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ) : examState.shiftsText ? (
                <div className="flex items-center justify-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span>{examState.shiftsText}</span>
                </div>
              ) : null}
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-5">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5 shrink-0 opacity-70" />
              <span>Timezone: Indian Standard Time (IST)</span>
            </div>

            {displayCtaHref && (
              <Link
                href={displayCtaHref}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm ${themeTokens.ctaBtn}`}
              >
                <span>{displayCtaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
