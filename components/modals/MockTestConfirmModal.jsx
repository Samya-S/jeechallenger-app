"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Timer, X, Play, LogIn, ArrowRight, Clock, Award, FileText, AlertTriangle } from "lucide-react";
import { getExamBadgeColor } from "@/utils/pyq-helpers";

export default function MockTestConfirmModal({ isOpen, onClose, paper }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Lock body scroll and handle Escape key while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !paper || !mounted) return null;

  const totalQuestions =
    paper.sections?.reduce((sum, s) => sum + (s.total_questions || 0), 0) ||
    (paper.exam_type === "JEE_ADVANCED" ? 51 : 75);

  const paperTitle = paper.title || paper.paper_id?.replace(/_/g, " ") || "Official JEE Paper";
  const duration = paper.duration_minutes || 180;
  const durationHours = (duration / 60).toFixed(0);

  const handleStartExam = (e) => {
    e.preventDefault();
    onClose();

    try {
      if (typeof document !== "undefined" && !document.fullscreenElement) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        }
      }
    } catch {
      // Ignore fullscreen rejection
    }

    if (session?.user) {
      router.push(`/mock-test/${paper.slug}`);
    } else {
      router.push(`/login?callbackUrl=/mock-test/${paper.slug}`);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-6 sm:p-7 space-y-5 text-left">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
            <Timer className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
              Start {durationHours}-Hour Timed Mock Test?
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Official Computer Based Test (CBT) simulation environment
            </p>
          </div>
        </div>

        {/* Selected Paper Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0d1320] border border-slate-200 dark:border-gray-800 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-lg border ${getExamBadgeColor(paper.exam_type)}`}>
              {paper.exam_type === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main"}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg">
              {paper.exam_year}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-snug text-center">
            {paperTitle}
          </h3>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200/60 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{duration}m</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
              <span>{paper.total_marks || 300} Marks</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              <span>{totalQuestions} Qs</span>
            </div>
          </div>
        </div>

        {/* Context Note */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            You are about to launch an exam simulation with countdown timer, negative marking, and performance analytics. Make sure you have an uninterrupted study block before beginning.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {session?.user ? (
            <button
              type="button"
              onClick={handleStartExam}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Mock Test</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStartExam}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In & Start Test</span>
            </button>
          )}

          <Link
            href="/mock-test"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <span>Browse All Mock Tests</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors py-1 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
