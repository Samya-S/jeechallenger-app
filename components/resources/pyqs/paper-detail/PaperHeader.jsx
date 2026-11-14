"use client";

import React from "react";
import Link from "next/link";
import { 
  Clock, 
  Award, 
  FileText, 
  ArrowLeft, 
  Check, 
  Share2, 
  Play, 
  LogIn 
} from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { getExamBadgeColor } from "@/utils/pyq-helpers";

export default function PaperHeader({
  paperData,
  totalQuestionsCount,
  session,
  copied,
  onShare,
  onOpenMockModal,
}) {
  return (
    <>
      {/* Navigation & Breadcrumbs Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-5">
        <Breadcrumbs
          crumbs={[
            { label: "PYQs", href: "/previous-year-questions" },
            { label: paperData?.title || "Question Paper" },
          ]}
          className="min-w-0 max-w-full"
        />

        <Link
          href="/previous-year-questions?tab=papers"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="whitespace-nowrap">All Shift Papers</span>
        </Link>
      </div>

      {/* Paper Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${getExamBadgeColor(paperData?.exam_type)}`}>
              {paperData?.exam_type === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main"}
            </span>
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-800">
              {paperData?.exam_year}
            </span>
          </div>

          <button
            type="button"
            onClick={onShare}
            title={copied ? "Link copied!" : "Share paper"}
            aria-label={copied ? "Link copied" : "Share paper"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold bg-orange-50 dark:bg-orange-950/40 border border-solid border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 shadow-sm transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
          {paperData?.title || paperData?.paper_id?.replace(/_/g, " ")}
        </h1>

        {/* Paper Stats */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-500 shrink-0" />
            <span>
              <span className="hidden sm:inline">Duration: </span>
              <strong className="text-gray-900 dark:text-white">{paperData?.duration_minutes || 180} Mins</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <span className="hidden sm:inline">Total Marks: </span>
              <strong className="text-gray-900 dark:text-white">{paperData?.total_marks || 300} Marks</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-500 shrink-0" />
            <span>
              <span className="hidden sm:inline">Total Questions: </span>
              <strong className="text-gray-900 dark:text-white">{totalQuestionsCount || 90} Qs</strong>
            </span>
          </div>
        </div>

        {/* Timed CBT Mock Test Action Banner */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-blue-50/40 dark:bg-gradient-to-r dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-slate-900/40 border border-blue-200/90 dark:border-blue-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 text-[11px] font-bold tracking-wider uppercase text-blue-700 dark:text-blue-300">
                Timed Mock Test
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {paperData?.duration_minutes || 180} Minutes • {paperData?.total_marks || 300} Marks
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              Attempt this full paper under exam conditions
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              Practice with a real-time countdown timer and marking scheme. Receive an instant scorecard, pacing analysis, and detailed step-by-step solutions when finished.
            </p>
          </div>

          {session?.user ? (
            <button
              type="button"
              onClick={onOpenMockModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white font-bold text-sm shadow-sm hover:shadow transition-all shrink-0 cursor-pointer active:scale-95 group"
            >
              <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
              <span>Start Mock Test</span>
            </button>
          ) : (
            <Link
              href={`/login?callbackUrl=/mock-test/${paperData?.slug || paperData?.paper_id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white font-bold text-sm shadow-sm hover:shadow transition-all shrink-0 cursor-pointer active:scale-95 group"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in to Take Mock Test</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
