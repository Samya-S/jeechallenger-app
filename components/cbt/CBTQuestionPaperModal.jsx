'use client';

import React from 'react';
import { useCBTStore } from './store/useCBTStore';
import MarkdownMathRenderer from '@/components/common/MarkdownMathRenderer';
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-slate-50 dark:bg-gray-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Full Question Paper Preview
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {paperMetadata?.title || 'Joint Entrance Examination'} • Total {questions.length} Questions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Questions Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {questions.map((q, idx) => {
            const isNumeric = (q.input_format || q.question_type || '').toUpperCase() === 'NUMERIC';

            return (
              <div
                key={q.question_number || idx}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="text-blue-600 dark:text-blue-400 text-sm">
                    Q{q.question_number} • {q.subject}
                  </span>
                  <span>{isNumeric ? 'Numerical Value' : 'Multiple Choice'}</span>
                </div>

                <div className="text-sm text-gray-900 dark:text-gray-100">
                  <MarkdownMathRenderer content={q.question_text || ''} />
                </div>

                {q.question_diagram_urls && q.question_diagram_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 my-2">
                    {q.question_diagram_urls.map((url, dIdx) => (
                      <img
                        key={dIdx}
                        src={url}
                        alt={`Diagram ${dIdx + 1}`}
                        className="max-h-40 object-contain rounded border border-gray-200 dark:border-gray-700"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}

                {/* Options if MCQ */}
                {!isNumeric && q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const optKey = opt.option_key || String.fromCharCode(65 + oIdx);
                      return (
                        <div
                          key={optKey}
                          className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-start gap-2"
                        >
                          <span className="font-bold text-gray-700 dark:text-gray-300">
                            ({optKey})
                          </span>
                          <div className="flex-1 min-w-0">
                            <MarkdownMathRenderer content={opt.option_text || ''} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-slate-50 dark:bg-gray-800/80">
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
