'use client';

import React, { useMemo } from 'react';
import { useCBTStore } from './store/useCBTStore';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

export default function CBTQuestionPalette({
  isCollapsed = false,
  onToggleCollapse,
  className = '',
}) {
  const questions = useCBTStore((s) => s.questions);
  const activeQuestionIndex = useCBTStore((s) => s.activeQuestionIndex);
  const paletteStates = useCBTStore((s) => s.paletteStates);
  const jumpToQuestion = useCBTStore((s) => s.jumpToQuestion);
  const paperMetadata = useCBTStore((s) => s.paperMetadata);

  const currentQ = questions[activeQuestionIndex];
  const currentSubject = currentQ?.subject;

  // Filter questions for the current subject/section or all
  const sectionQuestions = useMemo(() => {
    if (!currentSubject) return questions;
    return questions.filter((q) => q.subject === currentSubject);
  }, [questions, currentSubject]);

  // Aggregate status counts across active section
  const summaryCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    sectionQuestions.forEach((q) => {
      const state = paletteStates[q.question_number] || 1;
      counts[state] = (counts[state] || 0) + 1;
    });
    return counts;
  }, [sectionQuestions, paletteStates]);

  // Helper to get color classes by state
  const getStateBadgeStyle = (state) => {
    switch (state) {
      case 3: // Answered (Green)
        return 'bg-[#28a745] text-white border-[#1e7e34] rounded-t-lg rounded-b-none';
      case 2: // Not Answered (Red)
        return 'bg-[#dc3545] text-white border-[#bd2130] rounded-b-lg rounded-t-none';
      case 4: // Marked for Review (Purple circle)
        return 'bg-[#6f42c1] text-white border-[#59359a] rounded-full';
      case 5: // Answered & Marked for Review (Purple with green mark)
        return 'bg-[#6f42c1] text-white border-[#59359a] rounded-full relative';
      case 1: // Not Visited (Silver/White)
      default:
        return 'bg-white text-gray-800 border-gray-300 rounded-md';
    }
  };

  if (isCollapsed) {
    return (
      <div className="h-full flex items-center bg-[#f1f3f6] border-l border-gray-300 px-1">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm cursor-pointer"
          title="Open Question Palette"
          data-testid="cbt-palette-expand"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside
      className={`cbt-question-palette w-72 sm:w-80 h-full bg-[#f8f9fa] border-l border-gray-300 flex flex-col select-none shrink-0 ${className}`}
      data-testid="cbt-question-palette"
    >
      {/* Top Header */}
      <div className="p-3 bg-[#e9ecef] border-b border-gray-300 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
          Question Palette ({currentSubject || 'All'})
        </h3>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="p-1 rounded text-gray-500 hover:text-gray-800 hover:bg-gray-200 cursor-pointer"
            title="Collapse Palette"
            data-testid="cbt-palette-collapse"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Legend & Status Counter Cards */}
      <div className="p-3 border-b border-gray-300 bg-white text-xs space-y-2">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {/* Answered */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center font-bold text-white bg-[#28a745] rounded-t-md text-[10px] shrink-0">
              {summaryCounts[3]}
            </span>
            <span className="text-gray-700 font-medium">Answered</span>
          </div>

          {/* Not Answered */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center font-bold text-white bg-[#dc3545] rounded-b-md text-[10px] shrink-0">
              {summaryCounts[2]}
            </span>
            <span className="text-gray-700 font-medium">Not Answered</span>
          </div>

          {/* Not Visited */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-800 bg-white border border-gray-300 rounded-md text-[10px] shrink-0">
              {summaryCounts[1]}
            </span>
            <span className="text-gray-700 font-medium">Not Visited</span>
          </div>

          {/* Marked for Review */}
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center font-bold text-white bg-[#6f42c1] rounded-full text-[10px] shrink-0">
              {summaryCounts[4]}
            </span>
            <span className="text-gray-700 font-medium">Marked for Review</span>
          </div>
        </div>

        {/* Answered & Marked for Review Banner */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-200 text-[11px]">
          <div className="w-6 h-6 relative flex items-center justify-center font-bold text-white bg-[#6f42c1] rounded-full text-[10px] shrink-0">
            <span>{summaryCounts[5]}</span>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#28a745] rounded-sm flex items-center justify-center border border-white">
              <Check className="w-2 h-2 text-white stroke-[3]" />
            </span>
          </div>
          <span className="text-gray-700 font-medium leading-tight">
            Answered & Marked for Review (will be evaluated)
          </span>
        </div>
      </div>

      {/* Question Number Badges Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
          Choose a Question:
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-5 gap-2">
          {sectionQuestions.map((q) => {
            const globalIndex = questions.indexOf(q);
            const isActive = globalIndex === activeQuestionIndex;
            const state = paletteStates[q.question_number] || 1;
            const badgeStyle = getStateBadgeStyle(state);

            return (
              <button
                key={q.question_number}
                type="button"
                onClick={() => jumpToQuestion(globalIndex)}
                className={`h-9 w-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer relative shadow-xs ${badgeStyle} ${
                  isActive
                    ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 z-10'
                    : 'hover:opacity-90 active:scale-95'
                }`}
                title={`Question ${q.question_number}`}
                data-testid={`cbt-palette-q-${q.question_number}`}
                data-state={state}
              >
                <span>{q.question_number}</span>
                {state === 5 && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#28a745] rounded-xs flex items-center justify-center border border-white">
                    <Check className="w-2 h-2 text-white stroke-[3]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
