'use client';

import React, { useMemo } from 'react';
import { useCBTStore } from './store/useCBTStore';
import { BookOpen } from 'lucide-react';

export default function CBTSectionBar() {
  const paperMetadata = useCBTStore((s) => s.paperMetadata);
  const questions = useCBTStore((s) => s.questions);
  const activeQuestionIndex = useCBTStore((s) => s.activeQuestionIndex);
  const jumpToQuestion = useCBTStore((s) => s.jumpToQuestion);
  const paletteStates = useCBTStore((s) => s.paletteStates);

  const sections = paperMetadata?.sections || [];
  const currentQ = questions[activeQuestionIndex];

  // Derive subjects list
  const subjects = useMemo(() => {
    const list = [];
    const seen = new Set();
    sections.forEach((sec) => {
      if (sec.subject && !seen.has(sec.subject)) {
        seen.add(sec.subject);
        list.push(sec.subject);
      }
    });
    return list.length > 0 ? list : ['Physics', 'Chemistry', 'Mathematics'];
  }, [sections]);

  // Determine active section index based on current question
  const currentSection = useMemo(() => {
    if (!currentQ) return sections[0];
    const qNum = currentQ.question_number;
    const match = sections.find((sec) => {
      if (sec.start_question_number && sec.end_question_number) {
        return qNum >= sec.start_question_number && qNum <= sec.end_question_number;
      }
      if (sec.question_ids && sec.question_ids.length > 0) {
        return sec.question_ids.includes(String(currentQ._id)) || sec.question_ids.includes(currentQ._id);
      }
      return sec.subject === currentQ.subject;
    });
    return match || sections[0];
  }, [sections, currentQ]);

  // Switch to section: jump to its first question
  const handleSelectSection = (sec) => {
    let targetIndex = -1;

    if (sec.start_question_number) {
      targetIndex = questions.findIndex((q) => q.question_number === sec.start_question_number);
    }
    if (targetIndex === -1 && sec.question_ids && sec.question_ids.length > 0) {
      const firstId = String(sec.question_ids[0]);
      targetIndex = questions.findIndex((q) => String(q._id) === firstId);
    }
    if (targetIndex === -1) {
      targetIndex = questions.findIndex((q) => q.subject === sec.subject);
    }

    if (targetIndex !== -1) {
      jumpToQuestion(targetIndex);
    }
  };

  // Switch to subject: jump to first section of that subject
  const handleSelectSubject = (sub) => {
    const targetSec = sections.find((s) => s.subject === sub);
    if (targetSec) {
      handleSelectSection(targetSec);
    } else {
      const targetIndex = questions.findIndex((q) => q.subject === sub);
      if (targetIndex !== -1) {
        jumpToQuestion(targetIndex);
      }
    }
  };

  const currentSubject = currentQ?.subject || currentSection?.subject || subjects[0];

  // Calculate answered count for a section
  const getSectionAnsweredCount = (sec) => {
    let count = 0;
    const start = sec.start_question_number || 1;
    const end = sec.end_question_number || 100;
    for (let qn = start; qn <= end; qn++) {
      const state = paletteStates[qn];
      if (state === 3 || state === 5) {
        count++;
      }
    }
    return count;
  };

  return (
    <div className="cbt-section-bar w-full bg-[#f1f3f6] dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-3 sm:px-5 py-2 select-none shrink-0 z-20">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Tier 1: Subject Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Sections:
          </span>
          {subjects.map((sub) => {
            const isSubActive = currentSubject === sub;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => handleSelectSubject(sub)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  isSubActive
                    ? 'bg-[#1b365d] text-white shadow-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                }`}
                data-testid={`cbt-subject-tab-${sub.toLowerCase()}`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Tier 2: Sub-sections of current subject */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {sections
            .filter((sec) => !sec.subject || sec.subject === currentSubject)
            .map((sec, idx) => {
              const isSecActive = currentSection === sec;
              const answered = getSectionAnsweredCount(sec);
              const total = sec.total_questions || (sec.end_question_number ? sec.end_question_number - sec.start_question_number + 1 : 0);

              // Form clean display label
              let secLabel = sec.name || `Section ${idx + 1}`;
              if (sec.section_type) {
                secLabel += ` (${sec.section_type})`;
              }

              return (
                <button
                  key={sec.name || idx}
                  type="button"
                  onClick={() => handleSelectSection(sec)}
                  className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isSecActive
                      ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100'
                  }`}
                  data-testid={`cbt-section-tab-${idx}`}
                >
                  <span>{secLabel}</span>
                  <span className={`text-[10px] px-1 rounded ${isSecActive ? 'bg-blue-800 text-blue-100' : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                    {answered}/{total}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}
