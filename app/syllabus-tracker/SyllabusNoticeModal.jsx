'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SyllabusNoticeModal({
  isOpen,
  type = 'success', // 'success' | 'error'
  title,
  message,
  onClose,
  actionText = 'Got It',
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-gray-800 ring-1 ring-black/[0.03] dark:ring-white/[0.06] max-w-md w-full p-6 sm:p-7 text-center space-y-5 animate-in zoom-in-95 duration-150">
        {/* Icon Badge */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border ${
            isSuccess
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400'
          }`}
        >
          {isSuccess ? <CheckCircle2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
        </div>

        {/* Title & Message */}
        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {title || (isSuccess ? 'Import Successful' : 'Import Failed')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-2.5 px-4 rounded-xl text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                : 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600'
            }`}
          >
            <span>{actionText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
