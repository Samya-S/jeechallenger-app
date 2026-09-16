"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Share2, 
  Check, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Layers,
  Sparkles,
  FileText,
  Bug,
  Copy,
  Tag,
} from "lucide-react";

import Breadcrumbs from "@/components/common/Breadcrumbs";
import MarkdownMathRenderer from "@/components/common/MarkdownMathRenderer";
import PYQImageLightbox from "@/components/resources/pyqs/PYQImageLightbox";
import ReportQuestionModal from "@/components/modals/ReportQuestionModal";
import { formatExamOrigin, getPaperSlug, subjectColors, difficultyColors, getExamBadgeColor, MARKS_TO_ALL_COLOR, SUBJECT_SHORT_NAMES, DIFFICULTY_SHORT_NAMES } from "@/utils/pyq-helpers";

export default function QuestionDetailComponent({ question }) {
  const [copied, setCopied] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false); // for NTA ID copy feedback
  const [zoomedImage, setZoomedImage] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  if (!question) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Question Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          The requested question could not be found or has not been published yet.
        </p>
        <Link
          href="/previous-year-questions"
          className="px-6 py-2.5 rounded-xl text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all"
        >
          Back to PYQs Hub
        </Link>
      </div>
    );
  }

  const inputFormat = question.input_format || question.question_type || "MCQ";
  const isMCQ = inputFormat === "MCQ";
  const isMulti = inputFormat === "MULTI_CORRECT";
  const isNumeric = inputFormat === "NUMERIC";
  const isMarksToAll =
    question.source_of_answer === "MARKS_TO_ALL" ||
    ((!question.correct_answer || (Array.isArray(question.correct_answer) && question.correct_answer.length === 0)) &&
      (!question.numeric_answer ||
        (question.numeric_answer.exact_value === null &&
          question.numeric_answer.min_value === null &&
          question.numeric_answer.max_value === null)));
  const correctAnswers = question.correct_answer || [];

  const copyToClipboard = async (url) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const examOriginFull = formatExamOrigin(question, { isShort: false });
  const examOriginShort = formatExamOrigin(question, { isShort: true });

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const shareTitle = question.title || `${examOriginFull ? examOriginFull + " " : ""}${question.subject || ""} - ${question.chapter || ""} PYQ`.trim();
    const shareText = `Check out this ${shareTitle} with solution on JEE Challenger`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          await copyToClipboard(url);
        }
      }
    } else {
      await copyToClipboard(url);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6 sm:space-y-8">
        
        {/* Navigation & Breadcrumbs Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs
            crumbs={[
              { label: "PYQs", href: "/previous-year-questions" },
              { label: question.title || "Question Solution" },
            ]}
            className="min-w-0 max-w-full"
          />

          <Link
            href={`/previous-year-questions?subject=${question.subject || "ALL"}&chapter=${encodeURIComponent(question.chapter || "ALL")}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">More from {question.chapter}</span>
          </Link>
        </div>

        {/* Main Question Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          
          {/* Card Header & Metadata */}
          <div className="p-4 sm:p-6 md:p-8 bg-gray-50/80 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-start justify-between gap-3 mb-3">
              {/* Metadata Badges */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${subjectColors[question.subject] || "bg-gray-100 text-gray-700"}`}>
                  <span className="hidden sm:inline">{question.subject}</span>
                  <span className="sm:hidden">{SUBJECT_SHORT_NAMES[question.subject] || question.subject}</span>
                </span>
                {question.difficulty && (
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${difficultyColors[question.difficulty] || ""}`}>
                    <span className="hidden sm:inline">{question.difficulty}</span>
                    <span className="sm:hidden">{DIFFICULTY_SHORT_NAMES[question.difficulty] || question.difficulty}</span>
                  </span>
                )}
                {isMarksToAll && (
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${MARKS_TO_ALL_COLOR} flex items-center gap-1.5`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Marks to All
                  </span>
                )}
                {getPaperSlug(question) ? (
                  <Link
                    href={`/paper/${getPaperSlug(question)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Open full paper: ${examOriginFull}`}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border hover:opacity-80 transition-opacity inline-block ${getExamBadgeColor(question.exam_type || examOriginFull)}`}
                  >
                    <span className="hidden sm:inline">{examOriginFull}</span>
                    <span className="sm:hidden">{examOriginShort}</span>
                  </Link>
                ) : (
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getExamBadgeColor(question.exam_type || examOriginFull)}`}
                  >
                    <span className="hidden sm:inline">{examOriginFull}</span>
                    <span className="sm:hidden">{examOriginShort}</span>
                  </span>
                )}
              </div>

              {/* Action Buttons (Share & Report Bug) */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleShare}
                  title={copied ? "Link copied!" : "Share question"}
                  aria-label={copied ? "Link copied" : "Share question"}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold bg-orange-50 dark:bg-orange-950/40 border border-solid border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="hidden sm:inline text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Share</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setIsReportOpen(true)}
                  title="Report a bug in this question"
                  aria-label="Report a bug"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-800 border border-solid border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 dark:hover:text-red-500 hover:border-red-200 dark:hover:border-red-800 shadow-sm transition-colors duration-100 cursor-pointer whitespace-nowrap"
                >
                  <Bug className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Report Bug</span>
                </button>
              </div>
            </div>

            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight mt-2">
              {question.title || "Question Details"}
            </h1>
          </div>

          {/* Question Body */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Linked Passage (for COMPREHENSION questions) */}
            {question.linked_passage_text && (
              <div className="p-4 md:p-5 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                  <FileText className="w-4 h-4" />
                  <span>Comprehension Passage</span>
                </div>
                <div className="text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed">
                  <MarkdownMathRenderer content={question.linked_passage_text} />
                </div>
              </div>
            )}

            {/* Question Text */}
            <div className="text-gray-900 dark:text-gray-100 text-lg md:text-xl leading-relaxed">
              <MarkdownMathRenderer content={question.question_text} />
            </div>

            {/* Official Notice for Marks to All / Bonus Question */}
            {isMarksToAll && (
              <div className="p-4 md:p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>Official Notice: Marks Awarded to All</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed">
                  This question was dropped / full marks were awarded to all candidates in the official answer key by the exam conducting body due to an ambiguity or error in the question or options.
                </p>
              </div>
            )}

            {/* Question Diagrams with click-to-zoom */}
            {question.question_diagram_urls && question.question_diagram_urls.length > 0 && (
              <div className="flex flex-wrap items-start gap-4 pt-2">
                {question.question_diagram_urls.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => setZoomedImage(imgUrl)}
                    className="relative rounded-2xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 shadow-md max-w-lg cursor-zoom-in hover:border-orange-500/70 hover:shadow-lg transition-all"
                  >
                    <img
                      src={imgUrl}
                      alt={`Question Diagram ${i + 1}`}
                      className="max-h-80 w-auto object-contain rounded-xl mx-auto"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Options Layout */}
            {(isMCQ || isMulti) && question.options && (
              <div className="pt-4 space-y-3">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["A", "B", "C", "D"].map((key) => {
                    const opt = question.options[key];
                    if (!opt || (!opt.text && !opt.diagram_url)) return null;

                    const isCorrect = !isMarksToAll && correctAnswers.includes(key);

                    return (
                      <div
                        key={key}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCorrect
                            ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/40"
                            : "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                              isCorrect
                                ? "bg-emerald-600 text-white shadow-sm"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {key}
                          </span>
                          <div className="flex-1 text-sm pt-0.5 leading-relaxed text-gray-900 dark:text-gray-100">
                            {opt.text && <MarkdownMathRenderer content={opt.text} />}
                            {opt.diagram_url && (
                              <div
                                onClick={() => setZoomedImage(opt.diagram_url)}
                                className={`relative ${opt.text ? "mt-3" : "mt-0"} p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-w-full inline-block cursor-zoom-in hover:border-orange-500/70 hover:shadow-sm transition-all`}
                              >
                                <img
                                  src={opt.diagram_url}
                                  alt={`Option ${key}`}
                                  className="max-h-64 sm:max-h-72 w-auto object-contain rounded-lg mx-auto"
                                />
                              </div>
                            )}
                          </div>
                          {isCorrect && (
                            <span className="shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Correct
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Numerical Answer Box */}
            {isNumeric && !isMarksToAll && (
              <div className="p-4 rounded-2xl border border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30 flex items-center justify-between gap-4 max-w-md">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block mb-1">
                    Official Numerical Answer
                  </span>
                  <span className="text-2xl font-black font-mono text-emerald-800 dark:text-emerald-200">
                    {question.numeric_answer?.exact_value !== null && question.numeric_answer?.exact_value !== undefined
                      ? question.numeric_answer.exact_value
                      : `${question.numeric_answer?.min_value} to ${question.numeric_answer?.max_value}`}
                  </span>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
              </div>
            )}

            {/* Topics & Concepts Badges */}
            {question.badges && question.badges.length > 0 && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-3">
                <h3 className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5" />
                  Topics &amp; Concepts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {question.badges.map((badge, i) => {
                    if (badge.action === "navigate") {
                      return (
                        <Link
                          key={i}
                          href={badge.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:shadow-sm ${
                            badge.type === "chapter"
                              ? "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-950/50"
                              : "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-950/50"
                          }`}
                        >
                          {badge.label}
                        </Link>
                      );
                    }

                    if (badge.action === "copy") {
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={async () => {
                            try {
                              if (navigator?.clipboard?.writeText) {
                                await navigator.clipboard.writeText(badge.value);
                              } else {
                                const ta = document.createElement("textarea");
                                ta.value = badge.value;
                                ta.style.position = "fixed";
                                ta.style.opacity = "0";
                                document.body.appendChild(ta);
                                ta.select();
                                document.execCommand("copy");
                                document.body.removeChild(ta);
                              }
                              setCopiedBadge(true);
                              setTimeout(() => setCopiedBadge(false), 2000);
                            } catch (err) {
                              console.error("Failed to copy NTA ID:", err);
                            }
                          }}
                          title="Copy NTA ID to clipboard"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          <span>{badge.label}</span>
                          {copiedBadge ? (
                            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          ) : (
                            <Copy className="w-3 h-3 shrink-0 opacity-50" />
                          )}
                        </button>
                      );
                    }

                    // action === "none" — static display
                    return (
                      <span
                        key={i}
                        className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold border bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                      >
                        {badge.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step-by-Step KaTeX Solution Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Solution Banner Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 to-red-600 text-white flex items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-bold tracking-tight">
              Step-by-Step Solution
            </h2>
          </div>

          {/* Solution Body */}
          <div className="p-6 md:p-8 space-y-6">
            <div className="text-gray-900 dark:text-gray-100 text-base md:text-lg leading-relaxed space-y-4">
              <MarkdownMathRenderer content={question.solution || question.solution_text || "Solution will be uploaded soon."} />
            </div>

            {/* Solution Diagrams */}
            {question.solution_diagram_urls && question.solution_diagram_urls.length > 0 && (
              <div className="pt-4 space-y-3">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Solution Diagrams & Graphs
                </h4>
                <div className="flex flex-wrap items-start gap-4">
                  {question.solution_diagram_urls.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => setZoomedImage(imgUrl)}
                      className="relative rounded-2xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 shadow-md max-w-lg cursor-zoom-in hover:border-orange-500/70 hover:shadow-lg transition-all"
                    >
                      <img
                        src={imgUrl}
                        alt={`Solution Diagram ${i + 1}`}
                        className="max-h-80 w-auto object-contain rounded-xl mx-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* High-Resolution Diagram Zoom Lightbox Modal */}
      {zoomedImage && (
        <PYQImageLightbox
          src={zoomedImage}
          alt={question?.title || "Question Diagram"}
          onClose={() => setZoomedImage(null)}
        />
      )}

      {/* Bug Report Modal */}
      <ReportQuestionModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        question={question}
      />
    </div>
  );
}