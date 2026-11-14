"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { getFeatureHubTabs } from "./components/feature-hub/featureHubData";
import AITutorDemoWidget from "./components/feature-hub/AITutorDemoWidget";
import CBTDemoWidget from "./components/feature-hub/CBTDemoWidget";
import SyllabusDemoWidget from "./components/feature-hub/SyllabusDemoWidget";
import PYQDemoWidget from "./components/feature-hub/PYQDemoWidget";
import ResourcesDemoWidget from "./components/feature-hub/ResourcesDemoWidget";
import OfficialUpdatesDemoWidget from "./components/feature-hub/OfficialUpdatesDemoWidget";
import BlogsDemoWidget from "./components/feature-hub/BlogsDemoWidget";

export default function FeatureHub({ latestArticles = [] }) {
  const [activeTab, setActiveTab] = useState("cbt");

  // Dynamic years fetched from backend endpoint
  const [availableYears, setAvailableYears] = useState(["2026", "2025", "2024"]);
  const [yearsLoading, setYearsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pyqs/papers/years")
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || [];
        if (list.length > 0) {
          const sorted = list.map(String).sort((a, b) => Number(b) - Number(a));
          setAvailableYears(sorted);
        }
        setYearsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching available years:", err);
        setYearsLoading(false);
      });
  }, []);

  // Compute year range text for PYQ display
  const minYear = availableYears.length > 0 ? availableYears[availableYears.length - 1] : "2024";
  const maxYear = availableYears.length > 0 ? availableYears[0] : "2026";
  const yearRangeDisplay = minYear === maxYear ? minYear : `${minYear}–${maxYear}`;

  const tabs = getFeatureHubTabs(yearRangeDisplay);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative bg-slate-50/70 dark:bg-transparent border-y border-slate-200/60 dark:border-transparent transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Platform Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Engineered for Serious Aspirants
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-200 leading-relaxed">
            Eliminate chaotic tabs and disorganised study material. Everything required to conquer JEE Main & Advanced is unified right here.
          </p>
        </div>

        {/* Feature Tabs Selector (Responsive wrap - NO horizontal scrolling) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/30"
                    : "bg-white hover:bg-slate-50 dark:bg-gray-800/90 dark:hover:bg-gray-700/90 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-white border border-slate-300/90 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500/50 shadow-sm shadow-slate-200/80 hover:shadow-md hover:shadow-slate-300/50 dark:shadow-none ring-1 ring-black/[0.03] dark:ring-white/[0.05]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300"
                  }`}
                />
                <span className={`whitespace-nowrap ${isActive ? "text-white" : ""}`}>
                  {tab.label}
                </span>
                <span
                  className={`hidden md:inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-slate-200/80 dark:border-transparent group-hover:bg-indigo-50 dark:group-hover:bg-gray-600 group-hover:text-indigo-600 dark:group-hover:text-white"
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Feature Showcase Container */}
        <div className="bg-white dark:bg-gray-900/90 rounded-3xl border border-gray-200/90 dark:border-gray-700/80 p-4 sm:p-7 lg:p-10 shadow-xl shadow-gray-200/40 dark:shadow-black/50 transition-all duration-300">
          {activeTab === "ai-tutor" && <AITutorDemoWidget />}
          {activeTab === "cbt" && <CBTDemoWidget />}
          {activeTab === "syllabus-tracker" && <SyllabusDemoWidget />}
          {activeTab === "pyqs" && <PYQDemoWidget />}
          {activeTab === "resources" && <ResourcesDemoWidget />}
          {activeTab === "official" && <OfficialUpdatesDemoWidget />}
          {activeTab === "blogs" && <BlogsDemoWidget latestArticles={latestArticles} />}
        </div>
      </div>
    </section>
  );
}
