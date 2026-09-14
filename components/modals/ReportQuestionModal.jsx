"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Bug, X, Send, CheckCircle, AlertTriangle, ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { submitQuestionBugReport } from "@/server/contact-actions";
import { formatExamOrigin } from "@/utils/pyq-helpers";

const ISSUE_TYPES = [
  "LaTeX / Math Formula Error",
  "Incorrect Answer Key / Solution",
  "Missing or Low-Quality Diagram",
  "Typo in Question Text or Options",
  "Other Issue",
];

export default function ReportQuestionModal({ isOpen, onClose, question }) {
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
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

  // Auto-fill email from session
  useEffect(() => {
    if (session?.user?.email) {
      setReporterEmail(session.user.email);
    }
  }, [session]);

  // Reset state when modal is re-opened
  useEffect(() => {
    if (isOpen) {
      setIssueType("");
      setIsDropdownOpen(false);
      setDescription("");
      setIsLoading(false);
      setIsSubmitted(false);
      setIsError(false);
      if (!session?.user?.email) {
        setReporterEmail("");
      }
    }
  }, [isOpen, session]);

  if (!isOpen || !question || !mounted) return null;

  const examOrigin = formatExamOrigin(question);

  const isFormValid = Boolean(issueType) && description.trim().length >= 10;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setIsError(false);

    const result = await submitQuestionBugReport({
      issueType,
      description: description.trim(),
      reporterEmail: reporterEmail.trim() || null,
      questionMeta: {
        _id: question._id,
        slug: question.slug,
        title: question.title,
        subject: question.subject,
        chapter: question.chapter,
        exam_type: question.exam_type,
        exam_year: question.exam_year,
        original_paper_id: question.original_paper_id,
        question_number: question.question_number,
        official_nta_id: question.official_nta_id ?? null,
      },
    });

    setIsLoading(false);
    if (result?.success) {
      setIsSubmitted(true);
    } else {
      setIsError(true);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[85vh] text-left">

        {/* ── Fixed Header ── */}
        <div className="px-6 pt-6 pb-5 border-b border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">
              <Bug className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Report a Question Bug
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Help us keep the question bank accurate and error-free.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5 custom-scrollbar">

          {/* Question metadata card */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/60 divide-y divide-gray-100 dark:divide-gray-700/60">
            {[
              { label: "Subject", value: question.subject },
              { label: "Chapter", value: question.chapter },
              { label: "Paper", value: examOrigin },
              { label: "Question", value: question.title || `Q${question.question_number ?? ""}` },
            ]
              .filter((row) => row.value)
              .map((row) => (
                <div key={row.label} className="flex gap-3 px-4 py-2.5">
                  <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 w-20 shrink-0 pt-px">
                    {row.label}
                  </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                    {row.value}
                  </span>
                </div>
              ))}
          </div>

          {/* Success State */}
          {isSubmitted ? (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  Report submitted!
                </p>
              </div>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Thank you for helping us improve the question quality. We&apos;ll look into it soon.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full px-5 py-2.5 rounded-xl text-base font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Banner */}
              {isError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-base">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>Something went wrong. Please try again.</span>
                </div>
              )}

              {/* Issue Type — custom dropdown */}
              <div>
                <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <div
                  className="relative"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setIsDropdownOpen(false);
                    }
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((o) => !o)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent transition cursor-pointer ${
                      isDropdownOpen
                        ? "ring-1 ring-red-400 border-transparent"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <span className={issueType ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-400"}>
                      {issueType || "Select Issue Type"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute z-10 mt-1.5 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1.5 space-y-1">
                      {ISSUE_TYPES.map((type) => (
                        <li key={type}>
                          <button
                            type="button"
                            tabIndex={0}
                            onClick={() => {
                              setIssueType(type);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-base transition-colors cursor-pointer ${
                              type === issueType
                                ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold"
                                : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            {type}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail. E.g., 'Option B should be −4, not +4' or 'The diagram in the question is missing.'"
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition resize-none"
                />
                {description.trim().length > 0 && description.trim().length < 10 && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    Please provide at least 10 characters.
                  </p>
                )}
              </div>

              {/* Reporter Email (optional) */}
              <div>
                <label
                  htmlFor="reporterEmail"
                  className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Email{" "}
                  <span className="text-gray-400 dark:text-gray-500 font-normal text-sm">
                    (optional — so we can follow up with you)
                  </span>
                </label>
                <input
                  id="reporterEmail"
                  type="email"
                  value={reporterEmail}
                  onChange={(e) => setReporterEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !isFormValid}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-base font-bold bg-red-500 hover:bg-red-600 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending Report...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Report
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
