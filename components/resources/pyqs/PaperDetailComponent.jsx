"use client";

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Clock, 
  Award, 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  Maximize2, 
  X, 
  Eye,
  BookOpen
} from "lucide-react";

import Breadcrumbs from "@/components/common/Breadcrumbs";
import MarkdownMathRenderer from "@/components/common/MarkdownMathRenderer";

function PaperDetailContent({ paperData }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const sections = paperData?.sections || [];
  const allQuestions = paperData?.questions || [];

  // Extract unique subjects from sections
  const subjects = useMemo(() => {
    const list = [];
    const seen = new Set();
    sections.forEach((sec) => {
      if (sec.subject && !seen.has(sec.subject)) {
        seen.add(sec.subject);
        list.push(sec.subject);
      }
    });
    return list.length > 0 ? list : ["Physics", "Chemistry", "Mathematics"];
  }, [sections]);

  // Read initial subject/section from URL
  const initialSubject = searchParams.get("subject");
  const initialSectionType = searchParams.get("section");

  const initialSectionIdx = useMemo(() => {
    if (!sections || sections.length === 0) return 0;
    if (initialSubject && initialSectionType) {
      const idx = sections.findIndex(
        (s) =>
          s.subject?.toLowerCase() === initialSubject.toLowerCase() &&
          s.section_type?.toLowerCase() === initialSectionType.toLowerCase()
      );
      if (idx !== -1) return idx;
    }
    if (initialSubject) {
      const idx = sections.findIndex(
        (s) => s.subject?.toLowerCase() === initialSubject.toLowerCase()
      );
      if (idx !== -1) return idx;
    }
    return 0;
  }, [sections, initialSubject, initialSectionType]);

  const [selectedSectionIdx, setSelectedSectionIdx] = useState(initialSectionIdx);
  const [activeSubject, setActiveSubject] = useState(
    sections[initialSectionIdx]?.subject || subjects[0] || "Physics"
  );
  const [zoomedImage, setZoomedImage] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});

  // Synchronize active subject and section with URL search parameters
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentSec = sections[selectedSectionIdx];
    if (!currentSec) return;

    const params = new URLSearchParams();
    if (currentSec.subject) params.set("subject", currentSec.subject);
    if (currentSec.section_type) params.set("section", currentSec.section_type);

    const query = params.toString();
    const targetUrl = query ? `${pathname}?${query}` : pathname;
    window.history.replaceState(null, "", targetUrl);
  }, [selectedSectionIdx, sections, pathname]);

  if (!paperData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Paper Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          The requested question paper could not be found or has not been published yet.
        </p>
        <Link
          href="/previous-year-questions?tab=papers"
          className="px-6 py-2.5 rounded-xl text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all"
        >
          Back to Papers List
        </Link>
      </div>
    );
  }

  // Sections for the active subject
  const subjectSections = sections.filter((s) => s.subject === activeSubject);
  const currentSection = sections[selectedSectionIdx] || subjectSections[0] || sections[0];

  const sectionQuestions = useMemo(() => {
    if (!currentSection) return allQuestions;

    if (currentSection.question_ids && currentSection.question_ids.length > 0) {
      const idSet = new Set(currentSection.question_ids.map(String));
      const matched = allQuestions.filter((q) => idSet.has(String(q._id)));
      if (matched.length > 0) return matched;
    }

    // Fallback: match by subject and question_number range
    return allQuestions.filter((q) => {
      const matchSubject = !currentSection.subject || q.subject === currentSection.subject;
      const matchRange =
        currentSection.start_question_number && currentSection.end_question_number
          ? q.question_number >= currentSection.start_question_number &&
            q.question_number <= currentSection.end_question_number
          : true;
      return matchSubject && matchRange;
    });
  }, [currentSection, allQuestions]);

  const handleSelectOption = (qId, optionKey) => {
    const current = userAnswers[qId];
    if (current?.checkedState) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], selectedOption: optionKey },
    }));
  };

  const handleCheckAnswer = (q) => {
    const qId = q._id;
    const ans = userAnswers[qId] || {};
    const isMCQ = q.question_type === "MCQ" || !q.question_type;
    const isNumeric = q.question_type === "NUMERIC";

    if (isMCQ) {
      if (!ans.selectedOption) return;
      const correctArr = q.correct_answer || [];
      const isCorrect = correctArr.includes(ans.selectedOption);
      setUserAnswers((prev) => ({
        ...prev,
        [qId]: {
          ...prev[qId],
          checkedState: {
            isCorrect,
            correctAnswers: correctArr,
            message: isCorrect
              ? "Correct! +4 Marks"
              : `Incorrect (-1 Mark) • Correct Answer is Option (${correctArr.join(", ")})`,
          },
        },
      }));
    } else if (isNumeric) {
      if (!ans.numericVal?.trim()) return;
      const val = parseFloat(ans.numericVal);
      let isCorrect = false;
      const numAns = q.numeric_answer;
      if (numAns) {
        if (numAns.is_range && numAns.min_value !== null && numAns.max_value !== null) {
          isCorrect = val >= numAns.min_value && val <= numAns.max_value;
        } else if (numAns.exact_value !== null) {
          isCorrect = Math.abs(val - numAns.exact_value) < 0.01;
        }
      }
      setUserAnswers((prev) => ({
        ...prev,
        [qId]: {
          ...prev[qId],
          checkedState: {
            isCorrect,
            message: isCorrect
              ? "Correct! +4 Marks"
              : `Incorrect • Official Answer: ${numAns?.exact_value ?? `${numAns?.min_value} to ${numAns?.max_value}`}`,
          },
        },
      }));
    }
  };

  const handleResetAnswer = (qId) => {
    setUserAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-6 sm:py-10 text-left">
      <div className="max-w-5xl mx-auto px-4 space-y-6 sm:space-y-8">
        
        {/* Navigation & Breadcrumbs Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Breadcrumbs
            crumbs={[
              { label: "PYQs", href: "/previous-year-questions" },
              { label: paperData.title || "Question Paper" },
            ]}
          />

          <Link
            href="/previous-year-questions?tab=papers"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Shift Papers</span>
          </Link>
        </div>

        {/* Paper Header Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold rounded-lg">
              {paperData.exam_type === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main"}
            </span>
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg border border-gray-200 dark:border-gray-700">
              {paperData.exam_year}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight">
            {paperData.title || paperData.paper_id?.replace(/_/g, " ")}
          </h1>

          {/* Paper Stats */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Duration: <strong className="text-gray-900 dark:text-white">{paperData.duration_minutes || 180} Mins</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-500" />
              <span>Total Marks: <strong className="text-gray-900 dark:text-white">{paperData.total_marks || 300} Marks</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-500" />
              <span>Total Questions: <strong className="text-gray-900 dark:text-white">{allQuestions.length || 90} Qs</strong></span>
            </div>
          </div>
        </div>

        {/* Responsive Two-Tier Subject & Section Switcher */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-800 space-y-3">
          {/* Tier 1: Subject Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {subjects.map((sub) => {
              const isSelected = activeSubject === sub;
              let btnClass = "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700";
              if (isSelected) {
                if (sub === "Physics") btnClass = "bg-blue-600 text-white shadow-md";
                else if (sub === "Chemistry") btnClass = "bg-emerald-600 text-white shadow-md";
                else if (sub === "Mathematics") btnClass = "bg-purple-600 text-white shadow-md";
                else btnClass = "bg-orange-600 text-white shadow-md";
              }

              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => {
                    setActiveSubject(sub);
                    const firstSubSec = sections.find((s) => s.subject === sub);
                    if (firstSubSec) {
                      const idx = sections.indexOf(firstSubSec);
                      setSelectedSectionIdx(idx);
                    }
                  }}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${btnClass}`}
                >
                  {sub}
                </button>
              );
            })}
          </div>

          {/* Tier 2: Sections within active subject */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            {subjectSections.map((sec) => {
              const globalIdx = sections.indexOf(sec);
              const isSelected = selectedSectionIdx === globalIdx;

              return (
                <button
                  key={globalIdx}
                  type="button"
                  onClick={() => setSelectedSectionIdx(globalIdx)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>Section {sec.section_type || (sec.name ? sec.name.split("Section")[1] : "")}</span>
                  <span className="text-[11px] opacity-80 font-normal">
                    ({sec.total_questions || 0} Qs)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions Feed in Active Section */}
        <div className="space-y-6">
          {sectionQuestions.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">No Questions Found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Questions for this section have not been indexed yet.
              </p>
            </div>
          ) : (
            sectionQuestions.map((q) => {
              const qId = q._id;
              const ansState = userAnswers[qId] || {};
              const isMCQ = q.question_type === "MCQ" || !q.question_type;
              const isNumeric = q.question_type === "NUMERIC";
              const isMulti = q.question_type === "MULTI_CORRECT";

              return (
                <div
                  key={q._id || q.slug}
                  className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden text-left"
                >
                  {/* Question Header */}
                  <div className="p-4 md:p-6 bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-lg shadow-sm">
                        Q{q.question_number}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                        {q.subject}
                      </span>
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                        {q.chapter}
                      </span>
                    </div>

                    {q.difficulty && (
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                        {q.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Question Body */}
                  <div className="p-5 md:p-7 space-y-6">
                    <div className="text-gray-900 dark:text-gray-100 text-base md:text-lg leading-relaxed text-left">
                      <MarkdownMathRenderer content={q.question_text} />
                    </div>

                    {/* Question Diagrams */}
                    {q.question_diagram_urls && q.question_diagram_urls.length > 0 && (
                      <div className="flex flex-wrap gap-4 pt-2">
                        {q.question_diagram_urls.map((imgUrl, i) => (
                          <div
                            key={i}
                            onClick={() => setZoomedImage(imgUrl)}
                            className="relative group rounded-xl border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 shadow-sm max-w-md cursor-zoom-in hover:border-orange-500 transition-all"
                          >
                            <img
                              src={imgUrl}
                              alt={`Question Diagram ${i + 1}`}
                              className="max-h-72 w-auto object-contain rounded-lg mr-auto"
                            />
                            <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <Maximize2 className="w-6 h-6" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Options (MCQ / Multi) */}
                    {(isMCQ || isMulti) && q.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {["A", "B", "C", "D"].map((key) => {
                          const opt = q.options[key];
                          if (!opt || (!opt.text && !opt.diagram_url)) return null;

                          const isSelected = ansState.selectedOption === key;
                          const isCorrectAnswer = ansState.checkedState?.correctAnswers?.includes(key);

                          let optionStyle = "border-gray-200 dark:border-gray-700 hover:border-orange-500/50 hover:bg-orange-50/30 dark:hover:bg-orange-950/20";
                          if (isSelected && !ansState.checkedState) {
                            optionStyle = "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-2 ring-orange-500/50";
                          } else if (ansState.checkedState) {
                            if (isCorrectAnswer) {
                              optionStyle = "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/50";
                            } else if (isSelected && !isCorrectAnswer) {
                              optionStyle = "border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/50";
                            }
                          }

                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleSelectOption(qId, key)}
                              className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${optionStyle}`}
                            >
                              <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                                isSelected ? "bg-orange-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                              }`}>
                                {key}
                              </span>
                              <div className="flex-1 text-sm pt-0.5 leading-relaxed text-gray-900 dark:text-gray-100 text-left">
                                {opt.text && <MarkdownMathRenderer content={opt.text} />}
                                {opt.diagram_url && (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setZoomedImage(opt.diagram_url);
                                    }}
                                    className="relative group mt-2 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-w-full inline-block cursor-zoom-in hover:border-orange-500"
                                  >
                                    <img
                                      src={opt.diagram_url}
                                      alt={`Option ${key}`}
                                      className="max-h-60 sm:max-h-72 w-auto object-contain rounded-lg mr-auto"
                                    />
                                    <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                      <Maximize2 className="w-4 h-4" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Numeric Input */}
                    {isNumeric && (
                      <div className="pt-2 max-w-xs text-left">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                          Enter Numeric Answer
                        </label>
                        <input
                          type="number"
                          step="any"
                          disabled={!!ansState.checkedState}
                          value={ansState.numericVal || ""}
                          onChange={(e) =>
                            setUserAnswers((prev) => ({
                              ...prev,
                              [qId]: { ...prev[qId], numericVal: e.target.value },
                            }))
                          }
                          placeholder="e.g. 12.5"
                          className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    )}

                    {/* Feedback Alert */}
                    {ansState.checkedState && (
                      <div
                        className={`p-4 rounded-xl flex items-center gap-3 border ${
                          ansState.checkedState.isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                            : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
                        }`}
                      >
                        {ansState.checkedState.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                        ) : (
                          <XCircle className="w-5 h-5 shrink-0 text-rose-500" />
                        )}
                        <span className="text-sm font-bold">{ansState.checkedState.message}</span>
                      </div>
                    )}

                    {/* Action Row */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        {!ansState.checkedState ? (
                          <button
                            type="button"
                            onClick={() => handleCheckAnswer(q)}
                            disabled={isMCQ ? !ansState.selectedOption : !ansState.numericVal?.trim()}
                            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md hover:from-orange-700 hover:to-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                          >
                            Check Answer
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleResetAnswer(qId)}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
                          >
                            Reset & Try Again
                          </button>
                        )}
                      </div>

                      <Link
                        href={`/questions/${q.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Step-by-Step Solution</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
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

export default function PaperDetailComponent({ paperData }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 text-gray-500">
          Loading Question Paper...
        </div>
      }
    >
      <PaperDetailContent paperData={paperData} />
    </Suspense>
  );
}