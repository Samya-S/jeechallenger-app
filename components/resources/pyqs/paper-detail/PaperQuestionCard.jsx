"use client";

import React from "react";
import Link from "next/link";
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Eye, 
  ArrowUpRight, 
  Bug, 
  Check, 
  X 
} from "lucide-react";
import MarkdownMathRenderer from "@/components/common/MarkdownMathRenderer";
import QuestionBookmarkButton from "@/components/playlists/QuestionBookmarkButton";
import { 
  SUBJECT_COLORS, 
  DIFFICULTY_COLORS, 
  MARKS_TO_ALL_COLOR, 
  SUBJECT_SHORT_NAMES, 
  DIFFICULTY_SHORT_NAMES 
} from "@/utils/pyq-helpers";

export default function PaperQuestionCard({
  q,
  ansState,
  onSelectOption,
  onNumericChange,
  onCheckAnswer,
  onResetAnswer,
  onZoomImage,
  onReportQuestion,
}) {
  const qId = q._id;
  const inputFormat = q.input_format || q.question_type || "MCQ";
  const isMCQ = inputFormat === "MCQ";
  const isNumeric = inputFormat === "NUMERIC";
  const isMulti = inputFormat === "MULTI_CORRECT";

  const inlineDiagramIndices = new Set(
    [...(q.question_text?.matchAll(/\{\{diagram[:_](\d+)\}\}/gi) || [])].map((m) => parseInt(m[1], 10))
  );
  const remainingQuestionDiagrams = (q.question_diagram_urls || [])
    .map((imgUrl, i) => ({ imgUrl, i }))
    .filter(({ i }) => !inlineDiagramIndices.has(i));

  const inlinePassageDiagramIndices = new Set(
    [...(q.linked_passage_text?.matchAll(/\{\{passage_diagram[:_](\d+)\}\}/gi) || [])].map((m) => parseInt(m[1], 10))
  );
  const remainingPassageDiagrams = (q.linked_passage_diagram_urls || [])
    .map((imgUrl, i) => ({ imgUrl, i }))
    .filter(({ i }) => !inlinePassageDiagramIndices.has(i));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] overflow-hidden text-left">
      {/* Question Header */}
      <div className="p-4 md:p-6 bg-gray-50/70 dark:bg-[#0d1320] border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-lg shadow-sm">
            Q{q.question_number}
          </span>
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${SUBJECT_COLORS[q.subject] || "text-gray-600 bg-gray-100 border-gray-200"}`}>
            <span className="hidden sm:inline">{q.subject}</span>
            <span className="sm:hidden">{SUBJECT_SHORT_NAMES[q.subject] || q.subject}</span>
          </span>
          <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800">
            {q.chapter}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {(q.source_of_answer === "MARKS_TO_ALL" ||
            ((!q.correct_answer || (Array.isArray(q.correct_answer) && q.correct_answer.length === 0)) &&
              (!q.numeric_answer ||
                (q.numeric_answer.exact_value === null &&
                  q.numeric_answer.min_value === null &&
                  q.numeric_answer.max_value === null)))) && (
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${MARKS_TO_ALL_COLOR} flex items-center gap-1`}>
              <Sparkles className="w-3 h-3" />
              Marks to All
            </span>
          )}
          {q.difficulty && (
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${DIFFICULTY_COLORS[q.difficulty] || "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800"}`}>
              <span className="hidden sm:inline">{q.difficulty}</span>
              <span className="sm:hidden">{DIFFICULTY_SHORT_NAMES[q.difficulty] || q.difficulty}</span>
            </span>
          )}
          <QuestionBookmarkButton questionId={q._id} />
        </div>
      </div>

      {/* Question Body */}
      <div className="p-5 md:p-7 space-y-6">
        {/* Linked Passage (for COMPREHENSION questions) */}
        {(q.linked_passage_text || remainingPassageDiagrams.length > 0) && (
          <div className="p-4 md:p-5 rounded-xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Comprehension Passage</span>
            </div>
            {q.linked_passage_text && (
              <div className="text-gray-800 dark:text-gray-200 text-sm md:text-base leading-relaxed min-w-0">
                <MarkdownMathRenderer
                  content={q.linked_passage_text}
                  passageDiagramUrls={q.linked_passage_diagram_urls}
                  onImageClick={onZoomImage}
                />
              </div>
            )}
            {remainingPassageDiagrams.length > 0 && (
              <div className="flex flex-wrap items-start gap-4 pt-1">
                {remainingPassageDiagrams.map(({ imgUrl, i }) => (
                  <div
                    key={i}
                    onClick={() => onZoomImage(imgUrl)}
                    className="relative rounded-xl border border-orange-200 dark:border-orange-900/40 p-2 bg-white dark:bg-gray-800 shadow-sm max-w-md cursor-zoom-in hover:border-orange-500/70 hover:shadow-md transition-all"
                  >
                    <img
                      src={imgUrl}
                      alt={`Passage Diagram ${i + 1}`}
                      className="max-h-72 w-auto object-contain rounded-lg mr-auto"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-gray-900 dark:text-gray-100 text-base md:text-lg leading-relaxed text-left min-w-0">
          <MarkdownMathRenderer
            content={q.question_text}
            diagramUrls={q.question_diagram_urls}
            passageDiagramUrls={q.linked_passage_diagram_urls}
            onImageClick={onZoomImage}
          />
        </div>

        {/* Question Diagrams (remaining unplaced diagrams) */}
        {remainingQuestionDiagrams.length > 0 && (
          <div className="flex flex-wrap items-start gap-4 pt-2">
            {remainingQuestionDiagrams.map(({ imgUrl, i }) => (
              <div
                key={i}
                onClick={() => onZoomImage(imgUrl)}
                className="relative rounded-xl border border-gray-200 dark:border-gray-800 p-2 bg-white dark:bg-gray-800 shadow-sm max-w-md cursor-zoom-in hover:border-orange-500/70 hover:shadow-md transition-all"
              >
                <img
                  src={imgUrl}
                  alt={`Question Diagram ${i + 1}`}
                  className="max-h-72 w-auto object-contain rounded-lg mr-auto"
                />
              </div>
            ))}
          </div>
        )}

        {/* Options (MCQ / Multi) */}
        {(isMCQ || isMulti) && q.options && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {["A", "B", "C", "D"].map((key) => {
              const opt = q.options[key];
              const optDiagrams = opt?.diagram_urls || (opt?.diagram_url ? [opt.diagram_url] : []);
              if (!opt || (!opt.text && optDiagrams.length === 0)) return null;

              const remainingOptDiagrams = optDiagrams.filter((url, idx) => {
                const regex = new RegExp(`\\{\\{diagram[:_]${idx}\\}\\}`, 'i');
                return !opt.text || !regex.test(opt.text);
              });

              const isSelected = isMulti
                ? (ansState.selectedMultiOptions || []).includes(key)
                : ansState.selectedOption === key;
              const isCorrectAnswer = ansState.checkedState?.correctAnswers?.includes(key);

              let optionStyle = "border-gray-200 dark:border-gray-800 hover:border-orange-500/50 hover:bg-orange-50/30 dark:hover:bg-orange-950/20";
              let badge = null;

              if (isSelected && !ansState.checkedState) {
                optionStyle = "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-2 ring-orange-500/50";
              } else if (ansState.checkedState) {
                if (ansState.checkedState.isMarksToAll) {
                  if (isSelected) {
                    optionStyle = "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/50";
                    badge = (
                      <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                        <Check className="w-3 h-3" />
                        Your Choice (Marks Awarded)
                      </span>
                    );
                  } else {
                    optionStyle = "border-gray-200 dark:border-gray-800 opacity-60";
                  }
                } else if (isSelected && isCorrectAnswer) {
                  optionStyle = "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/50";
                  badge = (
                    <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3" />
                      Your Choice (Correct)
                    </span>
                  );
                } else if (isSelected && !isCorrectAnswer) {
                  optionStyle = "border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/50";
                  badge = (
                    <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                      <X className="w-3 h-3" />
                      Your Choice (Incorrect)
                    </span>
                  );
                } else if (!isSelected && isCorrectAnswer) {
                  optionStyle = isMulti
                    ? "border-dashed border-emerald-500/80 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200"
                    : "border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200";
                  badge = (
                    <span className="shrink-0 flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 px-2 py-0.5 rounded-md">
                      <Check className="w-3 h-3" />
                      {isMulti ? "Missed (Correct)" : "Correct Answer"}
                    </span>
                  );
                } else {
                  optionStyle = "border-gray-200 dark:border-gray-800 opacity-50";
                }
              }

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onSelectOption(qId, key, isMulti)}
                  className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${optionStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                    isSelected ? "bg-orange-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}>
                    {key}
                  </span>
                  <div className="flex-1 text-sm pt-0.5 leading-relaxed text-gray-900 dark:text-gray-100 text-left">
                    {opt.text && (
                      <MarkdownMathRenderer
                        content={opt.text}
                        diagramUrls={optDiagrams}
                        onImageClick={onZoomImage}
                      />
                    )}
                    {remainingOptDiagrams.length > 0 && (
                      <div className={`flex flex-wrap gap-2 ${opt.text ? "mt-2" : "mt-0"}`}>
                        {remainingOptDiagrams.map((url, idx) => (
                          <div
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              onZoomImage(url);
                            }}
                            className="relative p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800 max-w-full inline-block cursor-zoom-in hover:border-orange-500/70 hover:shadow-sm transition-all"
                          >
                            <img
                              src={url}
                              alt={`Option ${key} Diagram ${idx + 1}`}
                              className="max-h-60 sm:max-h-72 w-auto object-contain rounded-lg mr-auto"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {badge}
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
              onChange={(e) => onNumericChange(e.target.value)}
              placeholder="e.g. 12.5"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white font-mono font-bold outline-none focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 ring-offset-transparent transition-colors"
            />
          </div>
        )}

        {/* Feedback Alert */}
        {ansState.checkedState && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 border ${
              ansState.checkedState.status === "correct" || ansState.checkedState.status === "bonus"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                : ansState.checkedState.status === "partial"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
            }`}
          >
            {ansState.checkedState.status === "correct" || ansState.checkedState.status === "bonus" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            ) : ansState.checkedState.status === "partial" ? (
              <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
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
                onClick={() => onCheckAnswer(q)}
                disabled={
                  isMulti
                    ? !ansState.selectedMultiOptions || ansState.selectedMultiOptions.length === 0
                    : isMCQ
                    ? !ansState.selectedOption
                    : !ansState.numericVal?.trim()
                }
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md hover:from-orange-700 hover:to-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Check Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onResetAnswer(qId)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
              >
                Reset & Try Again
              </button>
            )}
          </div>

          {/* View Solution + Report Bug */}
          <div className="flex items-center gap-2">
            <Link
              href={`/question/${q.slug}?view=solution`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40 border border-orange-200 dark:border-orange-800 transition-all"
            >
              <Eye className="w-4 h-4" />
              <span>View Step-by-Step Solution</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => onReportQuestion(q)}
              title="Report a bug in this question"
              aria-label="Report a bug"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-solid border-gray-200 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-500 dark:hover:text-red-500 hover:border-red-200 dark:border-red-800 transition-colors duration-100 cursor-pointer"
            >
              <Bug className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
