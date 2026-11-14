"use client";

import React, { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { BookOpen, Loader2 } from "lucide-react";

import PYQImageLightbox from "@/components/resources/pyqs/PYQImageLightbox";
import ReportQuestionModal from "@/components/modals/ReportQuestionModal";
import CBTMockTestModal from "@/components/modals/CBTMockTestModal";
import PaperHeader from "@/components/resources/pyqs/paper-detail/PaperHeader";
import PaperNavigation from "@/components/resources/pyqs/paper-detail/PaperNavigation";
import PaperQuestionCard from "@/components/resources/pyqs/paper-detail/PaperQuestionCard";

function PaperDetailContent({ paperData }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Instant launch transition state
  const [isLaunchingExam, setIsLaunchingExam] = useState(false);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);

  const handleStartMockTest = (e, slug) => {
    e?.preventDefault?.();
    setIsLaunchingExam(true);
    try {
      if (typeof document !== 'undefined' && !document.fullscreenElement) {
        const docEl = document.documentElement;
        if (docEl.requestFullscreen) {
          docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen().catch(() => {});
        }
      }
    } catch (err) {
      console.warn('Native fullscreen trigger failed:', err);
    }
    router.push(`/mock-test/${slug}`);
  };

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
  const initialSectionParam = searchParams.get("section");

  const initialSectionIdx = useMemo(() => {
    if (!sections || sections.length === 0) return 0;

    // 1. Determine active subject (case-insensitive, fallback to first section's subject or "Physics")
    const matchedSubject = initialSubject
      ? subjects.find((s) => s.toLowerCase() === initialSubject.toLowerCase())
      : null;
    const targetSubject = matchedSubject || sections[0]?.subject || subjects[0] || "Physics";

    // Sections belonging to this subject
    const subSections = sections.filter((s) => s.subject === targetSubject);
    if (subSections.length === 0) return 0;

    if (initialSectionParam) {
      const trimmedParam = initialSectionParam.trim();
      const num = parseInt(trimmedParam, 10);

      // A. If section is a 1-based number (e.g. "1", "2", "3")
      if (!isNaN(num) && num >= 1 && num <= subSections.length) {
        return sections.indexOf(subSections[num - 1]);
      }

      // B. If section is a single letter (e.g. "A" -> 1, "B" -> 2, "C" -> 3)
      if (/^[a-zA-Z]$/.test(trimmedParam)) {
        const letterIdx = trimmedParam.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2
        if (letterIdx >= 0 && letterIdx < subSections.length) {
          return sections.indexOf(subSections[letterIdx]);
        }
      }

      // C. Backward compatibility: match by section_type (e.g. "MCQ", "NUMERIC", "MULTI_CORRECT")
      const byType = subSections.find(
        (s) => s.section_type?.toLowerCase() === trimmedParam.toLowerCase()
      );
      if (byType) {
        return sections.indexOf(byType);
      }

      // D. Backward compatibility: match by section name (e.g. "Section A", "Section 1")
      const byName = subSections.find(
        (s) => s.name?.toLowerCase().includes(trimmedParam.toLowerCase())
      );
      if (byName) {
        return sections.indexOf(byName);
      }
    }

    // Default to first section of target subject
    return sections.indexOf(subSections[0]);
  }, [sections, subjects, initialSubject, initialSectionParam]);

  const [selectedSectionIdx, setSelectedSectionIdx] = useState(initialSectionIdx);
  const [activeSubject, setActiveSubject] = useState(
    sections[initialSectionIdx]?.subject || subjects[0] || "Physics"
  );
  const [zoomedImage, setZoomedImage] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [reportingQuestion, setReportingQuestion] = useState(null); // question object for the bug modal

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

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const examLabel = paperData?.exam_type === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main";
    const shareTitle = paperData?.title || `${examLabel} ${paperData?.exam_year || ""} Paper`;
    const shareText = `Check out this ${shareTitle} with solutions on JEE Challenger`;

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

  // Synchronize active subject and section with URL search parameters
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const currentSec = sections[selectedSectionIdx];
    if (!currentSec) return;

    // Find 1-based index of currentSec within its subject's sections
    const subSections = sections.filter((s) => s.subject === currentSec.subject);
    const secNumber = Math.max(1, subSections.indexOf(currentSec) + 1);

    const params = new URLSearchParams();
    if (currentSec.subject) params.set("subject", currentSec.subject);
    params.set("section", String(secNumber));

    const query = params.toString();
    const targetUrl = query ? `${pathname}?${query}` : pathname;
    window.history.replaceState(null, "", targetUrl);
  }, [selectedSectionIdx, sections, pathname]);

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

  const handleSelectOption = (qId, optionKey, isMulti = false) => {
    const current = userAnswers[qId];
    if (current?.checkedState) return;

    if (isMulti) {
      const existing = current?.selectedMultiOptions || [];
      const updated = existing.includes(optionKey)
        ? existing.filter((k) => k !== optionKey)
        : [...existing, optionKey];
      setUserAnswers((prev) => ({
        ...prev,
        [qId]: { ...prev[qId], selectedMultiOptions: updated },
      }));
    } else {
      setUserAnswers((prev) => ({
        ...prev,
        [qId]: { ...prev[qId], selectedOption: optionKey },
      }));
    }
  };

  const handleCheckAnswer = (q) => {
    const qId = q._id;
    const ans = userAnswers[qId] || {};
    const inputFormat = q.input_format || q.question_type || "MCQ";
    const isMCQ = inputFormat === "MCQ";
    const isMulti = inputFormat === "MULTI_CORRECT";
    const isNumeric = inputFormat === "NUMERIC";

    const isMarksToAll =
      q.source_of_answer === "MARKS_TO_ALL" ||
      ((!q.correct_answer || (Array.isArray(q.correct_answer) && q.correct_answer.length === 0)) &&
        (!q.numeric_answer ||
          (q.numeric_answer.exact_value === null &&
            q.numeric_answer.min_value === null &&
            q.numeric_answer.max_value === null)));

    if (isMarksToAll) {
      if (isMCQ && !ans.selectedOption) return;
      if (isMulti && (!ans.selectedMultiOptions || ans.selectedMultiOptions.length === 0)) return;
      if (isNumeric && !ans.numericVal?.trim()) return;

      setUserAnswers((prev) => ({
        ...prev,
        [qId]: {
          ...prev[qId],
          checkedState: {
            status: "bonus",
            isCorrect: true,
            isMarksToAll: true,
            message: "✨ Marks Awarded to All • Full marks are awarded for this question (Bonus/Dropped in official exam key).",
          },
        },
      }));
      return;
    }

    if (isMCQ) {
      if (!ans.selectedOption) return;
      const correctArr = q.correct_answer || [];
      const isCorrect = correctArr.includes(ans.selectedOption);
      setUserAnswers((prev) => ({
        ...prev,
        [qId]: {
          ...prev[qId],
          checkedState: {
            status: isCorrect ? "correct" : "incorrect",
            isCorrect,
            correctAnswers: correctArr,
            message: isCorrect
              ? "Correct!"
              : `Incorrect • Correct Answer is Option (${correctArr.join(", ")})`,
          },
        },
      }));
    } else if (isMulti) {
      const selected = ans.selectedMultiOptions || [];
      if (selected.length === 0) return;
      const correctArr = q.correct_answer || [];
      const isExactMatch =
        selected.length === correctArr.length &&
        selected.every((opt) => correctArr.includes(opt));
      const hasAnyWrong = selected.some((opt) => !correctArr.includes(opt));
      const isPartial = !hasAnyWrong && !isExactMatch;
      const status = isExactMatch ? "correct" : isPartial ? "partial" : "incorrect";

      let msg = "";
      if (isExactMatch) {
        msg = "Correct! All correct options selected.";
      } else if (isPartial) {
        const missing = correctArr.filter((opt) => !selected.includes(opt)).sort();
        msg = `Partially Correct • You selected (${selected.sort().join(", ")}), correct options also include (${missing.join(", ")})`;
      } else {
        msg = `Incorrect • Correct Options are (${correctArr.sort().join(", ")})`;
      }

      setUserAnswers((prev) => ({
        ...prev,
        [qId]: {
          ...prev[qId],
          checkedState: {
            status,
            isCorrect: isExactMatch,
            correctAnswers: correctArr,
            message: msg,
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
            status: isCorrect ? "correct" : "incorrect",
            isCorrect,
            message: isCorrect
              ? "Correct!"
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
    <div className="min-h-screen text-gray-900 dark:text-gray-100 pt-4 sm:pt-6 pb-12 text-left">
      {/* Instant Exam Launch Curtain (prevents website UI from ever being seen stretched in fullscreen) */}
      {isLaunchingExam && (
        <div className="fixed inset-0 z-[9999] bg-[#162942] flex flex-col items-center justify-center text-white select-none">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            <h2 className="text-xl font-bold tracking-wide">
              Connecting to Assessment Terminal...
            </h2>
            <p className="text-sm text-blue-200">
              Initializing secure full-screen examination kiosk (Terminal C001)...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4">
        {/* Paper Hero & Breadcrumbs Header */}
        <PaperHeader
          paperData={paperData}
          totalQuestionsCount={allQuestions.length}
          session={session}
          copied={copied}
          onShare={handleShare}
          onOpenMockModal={() => setIsMockModalOpen(true)}
        />

        <div className="space-y-6 sm:space-y-8 mt-6">
          {/* Responsive Two-Tier Subject & Section Switcher */}
          <PaperNavigation
            subjects={subjects}
            activeSubject={activeSubject}
            onSelectSubject={(sub) => {
              setActiveSubject(sub);
              const firstSubSec = sections.find((s) => s.subject === sub);
              if (firstSubSec) {
                const idx = sections.indexOf(firstSubSec);
                setSelectedSectionIdx(idx);
              }
            }}
            sections={sections}
            subjectSections={subjectSections}
            selectedSectionIdx={selectedSectionIdx}
            onSelectSection={setSelectedSectionIdx}
          />

          {/* Questions Feed in Active Section */}
          <div className="space-y-6">
            {sectionQuestions.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 p-8 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">No Questions Found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Questions for this section have not been indexed yet.
                </p>
              </div>
            ) : (
              sectionQuestions.map((q) => (
                <PaperQuestionCard
                  key={q._id || q.slug}
                  q={q}
                  ansState={userAnswers[q._id] || {}}
                  onSelectOption={handleSelectOption}
                  onNumericChange={(val) =>
                    setUserAnswers((prev) => ({
                      ...prev,
                      [q._id]: { ...prev[q._id], numericVal: val },
                    }))
                  }
                  onCheckAnswer={handleCheckAnswer}
                  onResetAnswer={handleResetAnswer}
                  onZoomImage={setZoomedImage}
                  onReportQuestion={setReportingQuestion}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* High-Resolution Diagram Zoom Lightbox Modal */}
      {zoomedImage && (
        <PYQImageLightbox
          src={zoomedImage}
          alt={paperData?.title || "Paper Diagram"}
          onClose={() => setZoomedImage(null)}
        />
      )}

      {/* Bug Report Modal */}
      <ReportQuestionModal
        isOpen={!!reportingQuestion}
        onClose={() => setReportingQuestion(null)}
        question={reportingQuestion}
      />

      {/* Mock Test Launch Confirmation Modal */}
      <CBTMockTestModal
        isOpen={isMockModalOpen}
        onClose={() => setIsMockModalOpen(false)}
        onConfirm={(slug) => handleStartMockTest(null, slug || paperData.slug || paperData.paper_id)}
        paper={paperData}
      />
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
