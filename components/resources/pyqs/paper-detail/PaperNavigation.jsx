"use client";

import React from "react";

export default function PaperNavigation({
  subjects,
  activeSubject,
  onSelectSubject,
  sections,
  subjectSections,
  selectedSectionIdx,
  onSelectSection,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-lg shadow-slate-200/50 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] space-y-3">
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
              onClick={() => onSelectSubject(sub)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${btnClass}`}
            >
              {sub}
            </button>
          );
        })}
      </div>

      {/* Tier 2: Sections within active subject */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
        {subjectSections.map((sec, secIdx) => {
          const globalIdx = sections.indexOf(sec);
          const isSelected = selectedSectionIdx === globalIdx;
          const sectionNum = secIdx + 1;

          let sectionLabel = `Section ${sectionNum}`;
          if (sec.name) {
            const match = sec.name.match(/section[\s-]*([a-zA-Z0-9]+)/i);
            if (match) {
              sectionLabel = `Section ${match[1].toUpperCase()}`;
            }
          }

          return (
            <button
              key={globalIdx}
              type="button"
              onClick={() => onSelectSection(globalIdx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <span>{sectionLabel}{sec.section_type ? ` • ${sec.section_type}` : ""}</span>
              <span className="text-[11px] opacity-80 font-normal">
                ({sec.total_questions || 0} Qs)
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
