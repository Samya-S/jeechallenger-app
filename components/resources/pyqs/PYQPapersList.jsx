"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Clock, Award, ArrowUpRight, CheckCircle } from "lucide-react";

export default function PYQPapersList({ filters, setTotalPapersCount }) {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.examType && filters.examType !== "ALL") params.set("exam_type", filters.examType);
    if (filters.year && filters.year !== "All") params.set("exam_year", filters.year);

    fetch(`/api/pyqs/papers?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || data.papers || [];
        setPapers(list);
        if (setTotalPapersCount) setTotalPapersCount(data.meta?.total || list.length);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching papers:", err);
        setPapers([]);
        if (setTotalPapersCount) setTotalPapersCount(0);
        setLoading(false);
      });
  }, [filters.examType, filters.year]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4 animate-pulse">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Papers Found</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
          No published question papers match your selected filters. Try choosing a different year or exam type.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {papers.map((paper) => {
        const totalQuestions = paper.sections?.reduce((sum, s) => sum + (s.total_questions || 0), 0) || 90;

        return (
          <div
            key={paper._id || paper.slug}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between hover:shadow-xl transition-all"
          >
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold rounded-lg">
                  {paper.exam_type === "JEE_ADVANCED" ? "JEE Advanced" : "JEE Main"}
                </span>
                <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg">
                  {paper.exam_year}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
                {paper.title || paper.paper_id?.replace(/_/g, " ")}
              </h3>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>{paper.duration_minutes || 180}m</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{paper.total_marks || 300} Marks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>{totalQuestions} Qs</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-6">
              <Link
                href={`/papers/${paper.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md hover:from-orange-700 hover:to-red-700 transition-all"
              >
                <span>View Complete Paper</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}