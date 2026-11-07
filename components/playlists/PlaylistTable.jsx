"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, Trash2, BookOpen, Filter, Sparkles, Loader2 } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";
import { formatExamOrigin, getExamBadgeColor, SUBJECT_COLORS, DIFFICULTY_COLORS } from "@/utils/pyq-helpers";

const BATCH_SIZE = 25;

const DIFFICULTY_OPTIONS = [
  { label: "All Difficulties", value: "ALL" },
  { label: "Easy", value: "Easy" },
  { label: "Medium", value: "Medium" },
  { label: "Hard", value: "Hard" },
];

const SUBJECT_BUTTONS = [
  { label: "All", value: "ALL", activeClass: "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-xs" },
  { label: "Physics", value: "Physics", activeClass: "bg-blue-600 text-white shadow-xs" },
  { label: "Chemistry", value: "Chemistry", activeClass: "bg-emerald-600 text-white shadow-xs" },
  { label: "Math", value: "Mathematics", activeClass: "bg-purple-600 text-white shadow-xs" },
];

export default function PlaylistTable({
  questions = [],
  isOwner = false,
  playlistId,
  onQuestionRemoved,
  className = "",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [removingId, setRemovingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef(null);

  // Filter questions based on search, subject & difficulty
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (subjectFilter !== "ALL" && q.subject !== subjectFilter) {
        return false;
      }
      if (difficultyFilter !== "ALL" && q.difficulty !== difficultyFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (q.title || "").toLowerCase().includes(query);
        const chapterMatch = (q.chapter || "").toLowerCase().includes(query);
        return titleMatch || chapterMatch;
      }
      return true;
    });
  }, [questions, subjectFilter, difficultyFilter, searchQuery]);

  // Progressive infinite scroll slice: only render visibleCount rows in DOM
  const visibleQuestions = useMemo(() => {
    return filteredQuestions.slice(0, visibleCount);
  }, [filteredQuestions, visibleCount]);

  // Reset batch count on filter changes via event handlers
  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setVisibleCount(BATCH_SIZE);
  };

  const handleSubjectChange = (val) => {
    setSubjectFilter(val);
    setVisibleCount(BATCH_SIZE);
  };

  const handleDifficultyChange = (val) => {
    setDifficultyFilter(val);
    setVisibleCount(BATCH_SIZE);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSubjectFilter("ALL");
    setDifficultyFilter("ALL");
    setVisibleCount(BATCH_SIZE);
  };

  // IntersectionObserver sentinel: automatically reveal next 25 rows as user scrolls
  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => {
            if (prev < filteredQuestions.length) {
              return Math.min(prev + BATCH_SIZE, filteredQuestions.length);
            }
            return prev;
          });
        }
      },
      { threshold: 0.1, rootMargin: "150px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredQuestions.length]);

  const handleRemove = async (qId) => {
    if (!isOwner || !playlistId || removingId) return;
    setRemovingId(qId);

    try {
      const res = await fetch(`/api/playlists/${playlistId}/questions/${qId}`, {
        method: "DELETE",
      });

      if (res.ok && onQuestionRemoved) {
        onQuestionRemoved(qId);
      }
    } catch (err) {
      console.error("Failed to remove question:", err);
    } finally {
      setRemovingId(null);
    }
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="py-20 px-4 text-center space-y-4 my-auto">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            This list has no questions yet
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
            {isOwner
              ? "Bookmark questions while practicing PYQs or taking mock tests to build your personalized question list."
              : "The author has not added any questions to this list yet."}
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/previous-year-questions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
          >
            <span>Explore PYQs</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search, Subject & Difficulty Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input & Difficulty Dropdown */}
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search problems or chapters..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Custom Difficulty Dropdown */}
          <CustomSelect
            value={difficultyFilter}
            onChange={handleDifficultyChange}
            options={DIFFICULTY_OPTIONS}
            size="sm"
            color="blue"
            className="w-36 shrink-0"
          />
        </div>

        {/* Subject Filter Pills with Site Standard Colors */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/80 p-1 rounded-xl self-start md:self-auto overflow-x-auto no-scrollbar shrink-0">
          {SUBJECT_BUTTONS.map((sub) => {
            const isSelected = subjectFilter === sub.value;
            return (
              <button
                key={sub.value}
                type="button"
                onClick={() => handleSubjectChange(sub.value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? sub.activeClass
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* LeetCode-style Questions Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3 hidden md:table-cell">Chapter</th>
                <th className="py-3 px-3 hidden lg:table-cell">Exam</th>
                <th className="py-3 px-3">Difficulty</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 font-medium">
              {filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 px-4 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2.5 text-center">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center">
                        <Filter className="w-5 h-5" />
                      </div>
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        No matching questions found
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        None of the questions in this list match your current search, subject, or difficulty criteria.
                      </p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {visibleQuestions.map((q, idx) => {
                    const subColor =
                      SUBJECT_COLORS[q.subject] ||
                      "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20";
                    const diffColor =
                      DIFFICULTY_COLORS[q.difficulty] ||
                      "bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20";
                    const origin = formatExamOrigin(q.original_paper_id, q.exam_year, q.exam_type);

                    return (
                      <tr
                        key={q.id || q._id}
                        className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors group"
                      >
                        {/* Index */}
                        <td className="py-3.5 px-4 text-center font-bold text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                          {idx + 1}
                        </td>

                        {/* Problem Title */}
                        <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-gray-100">
                          <Link
                            href={`/pyq/${q.slug}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 md:line-clamp-1"
                          >
                            {q.title || "Untitled Question"}
                          </Link>
                        </td>

                        {/* Subject */}
                        <td className="py-3.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${subColor}`}>
                            {q.subject}
                          </span>
                        </td>

                        {/* Chapter */}
                        <td className="py-3.5 px-3 text-gray-600 dark:text-gray-400 hidden md:table-cell truncate max-w-[160px]">
                          {q.chapter || "—"}
                        </td>

                        {/* Exam / Year */}
                        <td className="py-3.5 px-3 hidden lg:table-cell whitespace-nowrap">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${getExamBadgeColor(q.exam_type || origin)}`}>
                            {origin}
                          </span>
                        </td>

                        {/* Difficulty */}
                        <td className="py-3.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${diffColor}`}>
                            {q.difficulty || "Medium"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/pyq/${q.slug}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                            >
                              <span>Solve</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>

                            {isOwner && (
                              <button
                                type="button"
                                onClick={() => handleRemove(q.id || q._id)}
                                disabled={removingId === (q.id || q._id)}
                                title="Remove from this playlist"
                                className="p-1 rounded-lg text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Infinite Scroll Sentinel: triggers next batch as user scrolls near bottom */}
                  {visibleCount < filteredQuestions.length && (
                    <tr ref={sentinelRef}>
                      <td colSpan={7} className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                          <span>Loading more questions...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discovery / Growth Section for Short Lists (1-3 questions) */}
      {isOwner && questions.length > 0 && questions.length <= 3 && (
        <div className="py-12 px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Keep building your list
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
              You have added {questions.length} question{questions.length === 1 ? "" : "s"} so far. Bookmark challenging problems while solving PYQs or reviewing mock tests to create a focused revision vault.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/previous-year-questions"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-sm"
            >
              <span>Explore More PYQs</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
