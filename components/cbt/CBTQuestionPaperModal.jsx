'use client';

import React from 'react';
import { useCBTStore } from './store/useCBTStore';
import MarkdownMathRenderer from '@/components/common/MarkdownMathRenderer';
import { normalizeOptions } from '@/utils/cbt-helpers';
import { X, FileText } from 'lucide-react';

export default function CBTQuestionPaperModal({ isOpen, onClose }) {
  const paperMetadata = useCBTStore((s) => s.paperMetadata);
  const questions = useCBTStore((s) => s.questions);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 select-none"
      data-testid="cbt-question-paper-modal"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Full Question Paper Preview
              </h2>
              <p className="text-xs text-gray-500">
                {paperMetadata?.title || 'Joint Entrance Examination'} • Total {questions.length} Questions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Questions Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {questions.map((q) => {
            const isNumeric = q.input_format === 'NUMERIC';

            return (
              <div
                key={String(q._id)}
                className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 border-b border-gray-200 pb-2">
                  <span className="text-blue-600 text-sm">
                    Q{q.question_number} • {q.subject}
                  </span>
                  <span>{isNumeric ? 'Numerical Value' : 'Multiple Choice'}</span>
                </div>

                {/* Optional Comprehension Passage */}
                {q.linked_passage_text && (
                  <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">
                      Passage / Context
                    </div>
                    <MarkdownMathRenderer
                      content={q.linked_passage_text}
                      passageDiagramUrls={q.linked_passage_diagram_urls}
                    />
                  </div>
                )}

                <div className="text-sm text-gray-900">
                  <MarkdownMathRenderer
                    content={q.question_text || ''}
                    diagramUrls={q.question_diagram_urls}
                    passageDiagramUrls={q.linked_passage_diagram_urls}
                  />
                </div>

                {q.question_diagram_urls && q.question_diagram_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 my-2">
                    {q.question_diagram_urls.map((url, dIdx) => (
                      <img
                        key={dIdx}
                        src={url}
                        alt={`Diagram ${dIdx + 1}`}
                        className="max-h-40 object-contain rounded border border-gray-200"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}

                {/* Options if MCQ */}
                {!isNumeric && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                    {normalizeOptions(q.options).map((opt) => (
                      <div
                        key={opt.key}
                        className="p-2 rounded-lg bg-white border border-gray-200 flex items-start gap-2"
                      >
                        <span className="font-bold text-gray-700">
                          ({opt.key})
                        </span>
                        <div className="flex-1 min-w-0">
                          <MarkdownMathRenderer content={opt.text || ''} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
