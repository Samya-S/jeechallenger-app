'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, LogIn, ArrowRight } from 'lucide-react';

export default function CBTNoticeModal({
  isOpen,
  type = 'ERROR', // 'AUTH' | 'ERROR' | 'TRANSFER_ERROR'
  title,
  message,
  onAction,
  onClose,
  actionText,
  cancelText = 'Close',
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

  const isAuth = type === 'AUTH';
  const defaultTitle = isAuth
    ? 'Authentication Required'
    : type === 'TRANSFER_ERROR'
    ? 'Session Transfer Failed'
    : 'Examination Notice';

  const defaultActionText = isAuth
    ? 'Sign In to Continue'
    : 'Try Again';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none animate-in fade-in duration-150"
      data-testid="cbt-notice-modal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-7 text-center space-y-5 animate-in zoom-in-95 duration-150">
        {/* Icon Badge */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border ${
            isAuth
              ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400'
              : 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400'
          }`}
        >
          {isAuth ? <LogIn className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
            {title || defaultTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed break-words">
            {message || 'An unexpected condition occurred while communicating with the examination server.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          {cancelText && (
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
          )}
          {onAction && (
            <button
              type="button"
              onClick={onAction}
              className={`w-full ${
                cancelText ? 'sm:w-1/2' : 'w-full'
              } py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer`}
            >
              <span>{actionText || defaultActionText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
