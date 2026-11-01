'use client';

import React, { useMemo } from 'react';
import { useCBTStore } from './store/useCBTStore';
import MarkdownMathRenderer from '@/components/common/MarkdownMathRenderer';
import CBTVirtualKeypad from './CBTVirtualKeypad';
import { normalizeOptions } from '@/utils/cbt-helpers';
import { Check } from 'lucide-react';

export default function CBTQuestionPane({ className = '' }) {
  const questions = useCBTStore((s) => s.questions);
  const activeQuestionIndex = useCBTStore((s) => s.activeQuestionIndex);
  const uncommittedAnswer = useCBTStore((s) => s.uncommittedAnswer);
  const selectOption = useCBTStore((s) => s.selectOption);
  const toggleMultiOption = useCBTStore((s) => s.toggleMultiOption);
  const fontScale = useCBTStore((s) => s.fontScale);
  const paperMetadata = useCBTStore((s) => s.paperMetadata);

  const currentQ = questions[activeQuestionIndex];

  // Resolve font scale class
  const textSizeClass = useMemo(() => {
    switch (fontScale) {
      case 'small':
        return 'text-sm leading-normal';
      case 'large':
        return 'text-lg leading-relaxed';
      case 'normal':
      default:
        return 'text-base leading-relaxed';
    }
  }, [fontScale]);

  // Determine section and marking scheme strictly by question ID membership
  const markingInfo = useMemo(() => {
    if (!currentQ || !paperMetadata?.sections) {
      return { correct: 4, incorrect: -1, type: 'Single Correct' };
    }
    const currentQId = String(currentQ._id);
    const sec = paperMetadata.sections.find((s) =>
      s.question_ids?.some((id) => String(id) === currentQId)
    );

    const inputFormat = String(currentQ.input_format || 'MCQ').toUpperCase();
    const correct = sec?.marking_scheme?.correct ?? 4;
    const incorrect = sec?.marking_scheme?.incorrect ?? (inputFormat === 'NUMERIC' ? 0 : -1);

    let typeLabel = 'Single Correct Type';
    if (inputFormat === 'NUMERIC') typeLabel = 'Numerical Value Type';
    else if (inputFormat === 'MULTI_CORRECT') typeLabel = 'Multiple Correct Type';

    if (String(currentQ.question_type || '').toUpperCase() === 'COMPREHENSION') {
      typeLabel = `${typeLabel} (Comprehension)`;
    }

    return { correct, incorrect, type: typeLabel };
  }, [currentQ, paperMetadata]);

  if (!currentQ) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-gray-500 bg-white">
        No active question selected.
      </div>
    );
  }

  // Use input_format strictly to decide the user control
  const inputFormatUpper = String(currentQ.input_format || 'MCQ').toUpperCase();
  const isNumeric = inputFormatUpper === 'NUMERIC';
  const isMulti = inputFormatUpper === 'MULTI_CORRECT';

  // Normalize options across arrays and objects (JEE Main and JEE Advanced)
  const optionsList = normalizeOptions(currentQ.options);

  // Extract inline shortcodes for passage diagrams
  const embeddedPassageDiagrams = [
    ...(currentQ.linked_passage_text?.matchAll(/\{\{passage_diagram[:_](\d+)\}\}/gi) || [])
  ].map((m) => parseInt(m[1], 10));

  const remainingPassageDiagrams = (currentQ.linked_passage_diagram_urls || [])
    .map((url, i) => ({ imgUrl: url, i }))
    .filter(({ i }) => !embeddedPassageDiagrams.includes(i));

  // Extract inline shortcodes for question diagrams
  const embeddedQuestionDiagrams = [
    ...(currentQ.question_text?.matchAll(/\{\{diagram[:_](\d+)\}\}/gi) || [])
  ].map((m) => parseInt(m[1], 10));

  const remainingQuestionDiagrams = (currentQ.question_diagram_urls || [])
    .map((url, i) => ({ imgUrl: url, i }))
    .filter(({ i }) => !embeddedQuestionDiagrams.includes(i));

  return (
    <div
      className={`cbt-question-pane flex-1 h-full overflow-y-auto bg-white text-gray-900 p-4 sm:p-6 lg:p-8 flex flex-col justify-between ${className}`}
      data-testid="cbt-question-pane"
    >
      <div className="max-w-4xl w-full mx-auto space-y-6">
        {/* Top Question Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-gray-200 gap-2">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg sm:text-xl text-[#1b365d]">
              Question {currentQ.question_number}:
            </span>
            <span className="text-xs sm:text-sm font-semibold px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-300">
              {markingInfo.type}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-300">
              <span>+{markingInfo.correct}</span>
            </div>
            <div className="flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded border border-red-300">
              <span>{markingInfo.incorrect}</span>
            </div>
          </div>
        </div>

        {/* Optional Comprehension Passage */}
        {(currentQ.linked_passage_text || remainingPassageDiagrams.length > 0) && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Passage / Context
            </h4>
            {currentQ.linked_passage_text && (
              <MarkdownMathRenderer
                content={currentQ.linked_passage_text}
                passageDiagramUrls={currentQ.linked_passage_diagram_urls}
              />
            )}
            {remainingPassageDiagrams.length > 0 && (
              <div className="flex flex-wrap gap-4 my-2">
                {remainingPassageDiagrams.map(({ imgUrl, i }) => (
                  <div
                    key={i}
                    className="rounded-xl border border-gray-200 p-2 bg-white shadow-sm"
                  >
                    <img
                      src={imgUrl}
                      alt={`Passage Diagram ${i + 1}`}
                      className="max-h-64 max-w-full object-contain rounded"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Question Text Body */}
        <div className={`cbt-question-body font-sans text-gray-900 ${textSizeClass}`}>
          <MarkdownMathRenderer
            content={currentQ.question_text || ''}
            diagramUrls={currentQ.question_diagram_urls}
            passageDiagramUrls={currentQ.linked_passage_diagram_urls}
          />
        </div>

        {/* External Diagrams (if not embedded directly in question text) */}
        {remainingQuestionDiagrams.length > 0 && (
          <div className="flex flex-wrap gap-4 my-4">
            {remainingQuestionDiagrams.map(({ imgUrl, i }) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 p-2 bg-white shadow-sm"
              >
                <img
                  src={imgUrl}
                  alt={`Diagram ${i + 1}`}
                  className="max-h-64 max-w-full object-contain rounded"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        {/* Answer Input Area */}
        <div className="pt-4 border-t border-gray-200">
          {isNumeric ? (
            /* Numeric Input Mode with Keypad */
            <div className="my-2">
              <CBTVirtualKeypad />
            </div>
          ) : isMulti ? (
            /* Multi-Correct Checkboxes */
            <div className="space-y-3" role="group" aria-label="Multiple Correct Options">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Options (One or more options may be correct):
                </div>
                <div className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300">
                  Multi-Correct Checkbox
                </div>
              </div>
              {optionsList.map((opt) => {
                const optKey = opt.key;
                const isSelected = (uncommittedAnswer?.selected_options || []).includes(optKey);

                return (
                  <label
                    key={optKey}
                    onClick={() => toggleMultiOption(optKey)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    data-testid={`cbt-option-${optKey}`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-gray-400 bg-white hover:border-blue-500'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex items-start gap-2">
                      <span className="font-bold text-sm text-gray-800 shrink-0">
                        ({optKey})
                      </span>
                      <div className={`flex-1 min-w-0 ${textSizeClass}`}>
                        {opt.text ? (
                          <MarkdownMathRenderer content={opt.text} />
                        ) : (
                          <span className="text-gray-400 italic">Option {optKey}</span>
                        )}
                        {opt.diagram_urls && opt.diagram_urls.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {opt.diagram_urls.map((u, dIdx) => (
                              <img
                                key={dIdx}
                                src={u}
                                alt={`Option ${optKey} Diagram ${dIdx + 1}`}
                                className="max-h-40 object-contain rounded border border-gray-200"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          ) : (
            /* MCQ Radio Options */
            <div className="space-y-3" role="radiogroup" aria-label="Question Options">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Options:
              </div>
              {optionsList.map((opt) => {
                const optKey = opt.key;
                const isSelected = (uncommittedAnswer?.selected_options || []).includes(optKey);

                return (
                  <label
                    key={optKey}
                    onClick={() => selectOption(optKey)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-gray-200 bg-gray-50/60 hover:bg-gray-100 hover:border-gray-300'
                    }`}
                    data-testid={`cbt-option-${optKey}`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-400 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex items-start gap-2">
                      <span className="font-bold text-sm text-gray-800 shrink-0">
                        ({optKey})
                      </span>
                      <div className={`flex-1 min-w-0 ${textSizeClass}`}>
                        {opt.text ? (
                          <MarkdownMathRenderer content={opt.text} />
                        ) : (
                          <span className="text-gray-400 italic">Option {optKey}</span>
                        )}
                        {opt.diagram_urls && opt.diagram_urls.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {opt.diagram_urls.map((u, dIdx) => (
                              <img
                                key={dIdx}
                                src={u}
                                alt={`Option ${optKey} Diagram ${dIdx + 1}`}
                                className="max-h-40 object-contain rounded border border-gray-200"
                                loading="lazy"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
