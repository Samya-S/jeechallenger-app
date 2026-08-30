"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Share2, 
  Check, 
  Maximize2, 
  X, 
  CheckCircle2, 
  BookOpen, 
  Award, 
  Layers,
  Sparkles
} from "lucide-react";

import Breadcrumbs from "@/components/common/Breadcrumbs";
import MarkdownMathRenderer from "@/components/common/MarkdownMathRenderer";

export default function QuestionDetailComponent({ question }) {
  const [copied, setCopied] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

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

  const isMCQ = question.question_type === "MCQ" || !question.question_type;
  const isMulti = question.question_type === "MULTI_CORRECT";
  const isNumeric = question.question_type === "NUMERIC";
  const correctAnswers = question.correct_answer || [];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const difficultyColors = {
    Easy: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    Hard: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  const subjectColors = {
    Physics: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    Chemistry: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    Mathematics: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
  };

  const examOrigin = question.exam_type === "JEE_ADVANCED"
    ? `JEE Advanced ${question.exam_year || ""}`
    : `JEE Main ${question.exam_year || ""} • ${question.original_paper_id?.replace(/_/g, " ") || "Paper"}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-6 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 space-y-6 sm:space-y-8">
        
        {/* Navigation & Breadcrumbs Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumbs
            crumbs={[
              { label: "PYQs", href: "/previous-year-questions" },
              { label: question.title || "Question Solution" },
            ]}
          />

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={`/previous-year-questions?subject=${question.subject || "ALL"}&chapter=${encodeURIComponent(question.chapter || "ALL")}`}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>More {question.chapter} PYQs</span>
            </Link>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50 shadow-sm transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied Link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Question</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Question Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          
          {/* Card Header & Metadata */}
          <div className="p-6 md:p-8 bg-gray-50/80 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${subjectColors[question.subject] || "bg-gray-100 text-gray-700"}`}>
                  {question.subject}
                </span>
                <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                  {question.chapter}
                </span>
                {question.difficulty && (
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${difficultyColors[question.difficulty] || ""}`}>
                    {question.difficulty}
                  </span>
                )}
              </div>

              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                {examOrigin}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {question.title || "Question Details"}
            </h1>
          </div>

          {/* Question Body */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Question Text */}
            <div className="text-gray-900 dark:text-gray-100 text-lg md:text-xl leading-relaxed">
              <MarkdownMathRenderer content={question.question_text} />
            </div>

            {/* Question Diagrams with click-to-zoom */}
            {question.question_diagram_urls && question.question_diagram_urls.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-2">
                {question.question_diagram_urls.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => setZoomedImage(imgUrl)}
                    className="relative group rounded-2xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 shadow-md max-w-lg cursor-zoom-in hover:border-orange-500 transition-all"
                  >
                    <img
                      src={imgUrl}
                      alt={`Question Diagram ${i + 1}`}
                      className="max-h-80 w-auto object-contain rounded-xl mx-auto"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 className="w-6 h-6" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Options Layout with highlighted correct answer */}
            {(isMCQ || isMulti) && question.options && (
              <div className="pt-4 space-y-3">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Options
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["A", "B", "C", "D"].map((key) => {
                    const opt = question.options[key];
                    if (!opt || (!opt.text && !opt.diagram_url)) return null;

                    const isCorrect = correctAnswers.includes(key);

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
                                className="relative group mt-3 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-w-full inline-block cursor-zoom-in hover:border-orange-500 transition-all"
                              >
                                <img
                                  src={opt.diagram_url}
                                  alt={`Option ${key}`}
                                  className="max-h-64 sm:max-h-72 w-auto object-contain rounded-lg mx-auto"
                                />
                                <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                  <Maximize2 className="w-5 h-5" />
                                </div>
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
            {isNumeric && (
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
                <div className="flex flex-wrap gap-4">
                  {question.solution_diagram_urls.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => setZoomedImage(imgUrl)}
                      className="relative group rounded-2xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 shadow-md max-w-lg cursor-zoom-in hover:border-orange-500 transition-all"
                    >
                      <img
                        src={imgUrl}
                        alt={`Solution Diagram ${i + 1}`}
                        className="max-h-80 w-auto object-contain rounded-xl mx-auto"
                      />
                      <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-6 h-6" />
                      </div>
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
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-2xl border border-gray-800">
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg hover:bg-orange-600 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={zoomedImage}
              alt="Zoomed Diagram"
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}