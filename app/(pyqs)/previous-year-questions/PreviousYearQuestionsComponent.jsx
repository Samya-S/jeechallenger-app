"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { BookOpen, ChevronLeft, ChevronRight, HelpCircle, Sparkles } from "lucide-react";

import Breadcrumbs from "@/components/common/Breadcrumbs";
import PYQFilterBar from "@/components/resources/pyqs/PYQFilterBar";
import PYQQuestionCard from "@/components/resources/pyqs/PYQQuestionCard";
import PYQPapersList from "@/components/resources/pyqs/PYQPapersList";

const ScrollToTopButton = dynamic(() => import("@/components/ui/ScrollToTopButton"), {
  ssr: false,
});

function PreviousYearQuestionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read initial filter values from URL
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "practice"); // "practice" | "papers"
  const [filters, setFilters] = useState({
    subject: searchParams.get("subject") || "ALL",
    chapter: searchParams.get("chapter") || "ALL",
    examType: searchParams.get("exam_type") || "ALL",
    year: searchParams.get("year") || "All",
    difficulty: searchParams.get("difficulty") || "ALL",
    questionType: searchParams.get("question_type") || "ALL",
    search: searchParams.get("search") || "",
  });

  const [availableYears, setAvailableYears] = useState(["All", "2026", "2025", "2024"]);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [limit] = useState(15);
  const [questions, setQuestions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPapersCount, setTotalPapersCount] = useState(0);

  // Fetch available years dynamically from published papers
  useEffect(() => {
    fetch("/api/pyqs/papers")
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || data.papers || [];
        const yearsSet = new Set(list.map((p) => String(p.exam_year)).filter(Boolean));
        if (yearsSet.size > 0) {
          const sorted = Array.from(yearsSet).sort((a, b) => Number(b) - Number(a));
          setAvailableYears(["All", ...sorted]);
        }
      })
      .catch((err) => console.error("Error fetching papers for years:", err));
  }, []);

  // Sync URL query params with active filters in useEffect
  const isInitialMount = React.useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (activeTab && activeTab !== "practice") params.set("tab", activeTab);
    if (filters.subject && filters.subject !== "ALL") params.set("subject", filters.subject);
    if (filters.chapter && filters.chapter !== "ALL") params.set("chapter", filters.chapter);
    if (filters.examType && filters.examType !== "ALL") params.set("exam_type", filters.examType);
    if (filters.year && filters.year !== "All") params.set("year", filters.year);
    if (filters.difficulty && filters.difficulty !== "ALL") params.set("difficulty", filters.difficulty);
    if (filters.questionType && filters.questionType !== "ALL") params.set("question_type", filters.questionType);
    if (filters.search) params.set("search", filters.search);
    if (page > 1) params.set("page", String(page));

    const query = params.toString();
    const targetUrl = query ? `${pathname}?${query}` : pathname;
    window.history.replaceState(null, "", targetUrl);
  }, [filters, page, activeTab, pathname]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "subject") {
        updated.chapter = "ALL"; // reset chapter atomically with subject change
      }
      return updated;
    });
    setPage(1); // reset to page 1 on filter change
  };

  const handleResetFilters = () => {
    setFilters({
      subject: "ALL",
      chapter: "ALL",
      examType: "ALL",
      year: "All",
      difficulty: "ALL",
      questionType: "ALL",
      search: "",
    });
    setPage(1);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  // Fetch questions from backend
  useEffect(() => {
    if (activeTab !== "practice") return;

    setLoading(true);
    const params = new URLSearchParams();
    if (filters.subject !== "ALL") params.set("subject", filters.subject);
    if (filters.chapter !== "ALL") params.set("chapter", filters.chapter);
    if (filters.examType !== "ALL") params.set("exam_type", filters.examType);
    if (filters.year !== "All") params.set("exam_year", filters.year);
    if (filters.difficulty !== "ALL") params.set("difficulty", filters.difficulty);
    if (filters.questionType !== "ALL") params.set("question_type", filters.questionType);
    if (filters.search) params.set("search", filters.search);
    params.set("page", String(page));
    params.set("limit", String(limit));

    fetch(`/api/pyqs/questions?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || [];
        setQuestions(list);
        if (data.meta) {
          setTotalCount(data.meta.total || 0);
          setTotalPages(data.meta.total_pages || 1);
        } else {
          setTotalCount(list.length);
          setTotalPages(1);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching PYQs:", err);
        setQuestions([]);
        setTotalCount(0);
        setTotalPages(1);
        setLoading(false);
      });
  }, [filters, page, limit, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 dark:from-orange-950 dark:via-orange-900 dark:to-red-950 pb-20 pt-4 border-b border-orange-500/20">
        <Breadcrumbs
          crumbs={[{ label: "PYQs", href: "/previous-year-questions" }]}
          hasBanner={true}
          className="pb-8 max-w-7xl mx-auto px-4"
        />
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center text-center">
          <div className="text-white">
            <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tight drop-shadow-md">
              Previous Year Questions
            </h1>
            <p className="text-base sm:text-xl font-medium max-w-3xl mx-auto text-orange-100/90 leading-relaxed">
              Master JEE Main & Advanced with verified chapter-wise practice questions and official shift papers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Continuous Upload Notice Banner */}
        <div className="mb-6 px-4 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-900 dark:text-orange-200 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 text-orange-600 dark:text-orange-400" />
            <span>
              <strong>Note:</strong> We are currently processing and uploading the full archive of verified JEE questions and shift papers. More questions and solutions will be available soon as they finish processing!
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <PYQFilterBar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalCount={activeTab === "practice" ? totalCount : totalPapersCount}
          loading={loading}
          availableYears={availableYears}
        />

        {/* Tab 1: Chapter-Wise Practice Feed */}
        {activeTab === "practice" && (
          <div>
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-gray-800 space-y-4 animate-pulse shadow-md"
                  >
                    <div className="flex gap-2">
                      <div className="w-12 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                      <div className="w-24 h-6 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                      <div className="h-12 bg-gray-100 dark:bg-gray-800/60 rounded-xl"></div>
                      <div className="h-12 bg-gray-100 dark:bg-gray-800/60 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Questions Found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
                  No previous year questions match your selected filters. Try broadening your chapter, year, or difficulty criteria.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <PYQQuestionCard
                    key={q._id || q.slug || idx}
                    question={q}
                    practiceIndex={(page - 1) * limit + idx + 1}
                  />
                ))}

                {/* Pagination Bar */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between gap-4 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => {
                        const newPage = Math.max(1, page - 1);
                        setPage(newPage);
                        updateURL(filters, newPage, activeTab);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>

                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                      Page <strong className="text-gray-900 dark:text-white">{page}</strong> of{" "}
                      <strong className="text-gray-900 dark:text-white">{totalPages}</strong>
                    </span>

                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => {
                        const newPage = Math.min(totalPages, page + 1);
                        setPage(newPage);
                        updateURL(filters, newPage, activeTab);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Full Shift Papers List */}
        {activeTab === "papers" && (
          <PYQPapersList filters={filters} setTotalPapersCount={setTotalPapersCount} />
        )}
      </div>

      {/* Floating Scroll to Top */}
      <ScrollToTopButton
        gradientColors="from-orange-600 to-red-600"
        hoverColors="hover:from-orange-700 hover:to-red-700"
      />
    </div>
  );
}

export default function PreviousYearQuestionsComponent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 text-gray-500">
          Loading Question Bank...
        </div>
      }
    >
      <PreviousYearQuestionsContent />
    </Suspense>
  );
}