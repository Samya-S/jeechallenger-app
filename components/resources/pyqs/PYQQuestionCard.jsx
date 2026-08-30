"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowUpRight, Maximize2, X, Eye } from "lucide-react";
import MarkdownMathRenderer from "@/components/common/MarkdownMathRenderer";

export default function PYQQuestionCard({ question, practiceIndex }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedMultiOptions, setSelectedMultiOptions] = useState([]);
  const [numericValue, setNumericValue] = useState("");
  const [checkedState, setCheckedState] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  if (!question) return null;

  const isMCQ = question.question_type === "MCQ" || !question.question_type;
  const isMulti = question.question_type === "MULTI_CORRECT";
  const isNumeric = question.question_type === "NUMERIC";

  const handleCheckAnswer = () => {
    if (isMCQ) {
      if (!selectedOption) return;
      const correctArr = question.correct_answer || [];
      const isCorrect = correctArr.includes(selectedOption);
      setCheckedState({
        isCorrect,
        correctAnswers: correctArr,
        message: isCorrect
          ? "Correct! +4 Marks"
          : `Incorrect (-1 Mark) • Correct Answer is Option (${correctArr.join(", ")})`,
      });
    } else if (isMulti) {
      if (selectedMultiOptions.length === 0) return;
      const correctArr = question.correct_answer || [];
      const isExactMatch =
        selectedMultiOptions.length === correctArr.length &&
        selectedMultiOptions.every((opt) => correctArr.includes(opt));
      setCheckedState({
        isCorrect: isExactMatch,
        correctAnswers: correctArr,
        message: isExactMatch
          ? "Perfect! All Correct Options Selected (+4 Marks)"
          : `Correct Options: (${correctArr.join(", ")})`,
      });
    } else if (isNumeric) {
      if (!numericValue.trim()) return;
      const val = parseFloat(numericValue);
      let isCorrect = false;
      const numAns = question.numeric_answer;
      if (numAns) {
        if (numAns.is_range && numAns.min_value !== null && numAns.max_value !== null) {
          isCorrect = val >= numAns.min_value && val <= numAns.max_value;
        } else if (numAns.exact_value !== null) {
          isCorrect = Math.abs(val - numAns.exact_value) < 0.01;
        }
      }
      setCheckedState({
        isCorrect,
        message: isCorrect
          ? "Correct! +4 Marks"
          : `Incorrect • Official Answer: ${numAns?.exact_value ?? `${numAns?.min_value} to ${numAns?.max_value}`}`,
      });
    }
  };

  const handleToggleMulti = (key) => {
    if (checkedState) return;
    setSelectedMultiOptions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
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
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden transition-all hover:shadow-xl">
        {/* Question Header */}
        <div className="p-4 md:p-6 bg-gray-50/70 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-lg shadow-sm">
              #{practiceIndex}
            </span>
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${subjectColors[question.subject] || "text-gray-600 bg-gray-100 border-gray-200"}`}>
              {question.subject}
            </span>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {question.chapter}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {question.difficulty && (
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${difficultyColors[question.difficulty] || ""}`}>
                {question.difficulty}
              </span>
            )}
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:inline-block">
              {examOrigin}
            </span>
          </div>
        </div>

        {/* Question Body */}
        <div className="p-5 md:p-7 space-y-6">
          {/* Question Text */}
          <div className="text-gray-900 dark:text-gray-100 text-base md:text-lg leading-relaxed">
            <MarkdownMathRenderer content={question.question_text} />
          </div>

          {/* Question Diagrams with click-to-zoom */}
          {question.question_diagram_urls && question.question_diagram_urls.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-2">
              {question.question_diagram_urls.map((imgUrl, i) => (
                <div
                  key={i}
                  onClick={() => setZoomedImage(imgUrl)}
                  className="relative group rounded-xl border border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 shadow-sm max-w-md cursor-zoom-in hover:border-orange-500 transition-all"
                >
                  <img
                    src={imgUrl}
                    alt={`Question Diagram ${i + 1}`}
                    className="max-h-72 w-auto object-contain rounded-lg mx-auto"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Options Section */}
          {isMCQ && question.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {["A", "B", "C", "D"].map((key) => {
                const opt = question.options[key];
                if (!opt || (!opt.text && !opt.diagram_url)) return null;

                const isSelected = selectedOption === key;
                const isCorrectAnswer = checkedState?.correctAnswers?.includes(key);

                let optionStyle = "border-gray-200 dark:border-gray-700 hover:border-orange-500/50 hover:bg-orange-50/30 dark:hover:bg-orange-950/20";
                if (isSelected && !checkedState) {
                  optionStyle = "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-2 ring-orange-500/50";
                } else if (checkedState) {
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
                    onClick={() => !checkedState && setSelectedOption(key)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${optionStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                      isSelected ? "bg-orange-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}>
                      {key}
                    </span>
                    <div className="flex-1 text-sm pt-0.5 leading-relaxed text-gray-900 dark:text-gray-100">
                      {opt.text && <MarkdownMathRenderer content={opt.text} />}
                      {opt.diagram_url && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomedImage(opt.diagram_url);
                          }}
                          className="relative group mt-3 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-w-full inline-block cursor-zoom-in hover:border-orange-500 transition-all"
                        >
                          <img
                            src={opt.diagram_url}
                            alt={`Option ${key}`}
                            className="max-h-60 sm:max-h-72 w-auto object-contain rounded-lg mx-auto"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Maximize2 className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {isMulti && question.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {["A", "B", "C", "D"].map((key) => {
                const opt = question.options[key];
                if (!opt || (!opt.text && !opt.diagram_url)) return null;

                const isSelected = selectedMultiOptions.includes(key);
                const isCorrectAnswer = checkedState?.correctAnswers?.includes(key);

                let optionStyle = "border-gray-200 dark:border-gray-700 hover:border-orange-500/50";
                if (isSelected && !checkedState) {
                  optionStyle = "border-orange-500 bg-orange-50/60 dark:bg-orange-950/30 ring-2 ring-orange-500/50";
                } else if (checkedState) {
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
                    onClick={() => handleToggleMulti(key)}
                    className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${optionStyle}`}
                  >
                    <span className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs ${
                      isSelected ? "bg-orange-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}>
                      {key}
                    </span>
                    <div className="flex-1 text-sm pt-0.5 leading-relaxed text-gray-900 dark:text-gray-100">
                      {opt.text && <MarkdownMathRenderer content={opt.text} />}
                      {opt.diagram_url && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setZoomedImage(opt.diagram_url);
                          }}
                          className="relative group mt-3 p-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-w-full inline-block cursor-zoom-in hover:border-orange-500 transition-all"
                        >
                          <img
                            src={opt.diagram_url}
                            alt={`Option ${key}`}
                            className="max-h-60 sm:max-h-72 w-auto object-contain rounded-lg mx-auto"
                          />
                          <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Maximize2 className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {isNumeric && (
            <div className="pt-2 max-w-xs">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">
                Enter Numeric Value
              </label>
              <input
                type="number"
                step="any"
                disabled={!!checkedState}
                value={numericValue}
                onChange={(e) => setNumericValue(e.target.value)}
                placeholder="e.g. 4.5"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          {/* Feedback Alert */}
          {checkedState && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 border ${
                checkedState.isCorrect
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
              }`}
            >
              {checkedState.isCorrect ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 shrink-0 text-rose-500" />
              )}
              <span className="text-sm font-bold">{checkedState.message}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {!checkedState ? (
                <button
                  type="button"
                  onClick={handleCheckAnswer}
                  disabled={isMCQ ? !selectedOption : isMulti ? selectedMultiOptions.length === 0 : !numericValue.trim()}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md hover:from-orange-700 hover:to-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCheckedState(null);
                    setSelectedOption(null);
                    setSelectedMultiOptions([]);
                    setNumericValue("");
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
                >
                  Reset & Try Again
                </button>
              )}
            </div>

            {/* View Full Solution Button (opens in new tab) */}
            <Link
              href={`/questions/${question.slug}`}
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

      {/* High-Resolution Diagram Zoom Lightbox Modal */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
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
    </>
  );
}