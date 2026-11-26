"use client";

import React from "react";
import { FaChalkboardTeacher } from "react-icons/fa";
import { 
  Sparkles, 
  Atom, 
  FlaskConical, 
  Calculator, 
  ArrowUpRight 
} from "lucide-react";

const SUBJECT_MODULES = [
  {
    id: "physics",
    name: "Physics",
    topics: "Mechanics • Electrodynamics • Optics • Modern",
    icon: Atom,
    accentColor: "from-blue-500 to-cyan-500",
    borderHover: "hover:border-blue-400 dark:hover:border-blue-600",
    prompts: [
      "Derive the formula for motional EMF in a rotating conducting rod",
      "Explain the work-energy theorem with conservative vs non-conservative forces",
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    topics: "Physical • Organic • Inorganic",
    icon: FlaskConical,
    accentColor: "from-emerald-500 to-teal-500",
    borderHover: "hover:border-emerald-400 dark:hover:border-emerald-600",
    prompts: [
      "Compare SN1 and SN2 reaction mechanisms with stereochemical outcomes",
      "Calculate the pH and buffer capacity of an acetic acid & sodium acetate mixture",
    ],
  },
  {
    id: "mathematics",
    name: "Mathematics",
    topics: "Calculus • Vectors • Algebra • Coordinate Geometry",
    icon: Calculator,
    accentColor: "from-indigo-500 to-purple-500",
    borderHover: "hover:border-indigo-400 dark:hover:border-indigo-600",
    prompts: [
      "Find the integral of 1/(x^4 + 1) dx using partial fractions",
      "Determine the shortest distance and common perpendicular between two skew lines",
    ],
  },
];

export default function WelcomeScreen({ onSelectSuggestion }) {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-3 sm:px-4">
      {/* Brand Hero Banner */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl shadow-blue-500/20 border border-white/20">
          <FaChalkboardTeacher className="text-white text-2xl sm:text-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 mb-4 shadow-sm backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span>JEE Challenger • 24/7 AI Doubt Solver</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
          What concept would you like to{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            master today?
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Ask any JEE Main or Advanced doubt in Physics, Chemistry, or Mathematics. Get complete mathematical derivations, intuitive insights, and problem-solving strategies.
        </p>
      </div>

      {/* Clean Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {SUBJECT_MODULES.map((subject) => {
          const Icon = subject.icon;
          return (
            <div
              key={subject.id}
              className={`flex flex-col justify-between bg-white dark:bg-[#131b2e] rounded-2xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-all duration-200 ${subject.borderHover} hover:shadow-md`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subject.accentColor} flex items-center justify-center text-white shadow-xs shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {subject.name}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {subject.topics}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-400 block">
                  Suggested Prompts
                </span>
                {subject.prompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectSuggestion(prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 transition-all border border-slate-200/60 dark:border-slate-800/60 group flex items-start justify-between gap-2"
                  >
                    <span className="line-clamp-2 leading-relaxed">
                      {prompt}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 shrink-0 mt-0.5 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
