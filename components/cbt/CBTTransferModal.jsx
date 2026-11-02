'use client';

import React from 'react';
import { Smartphone, Monitor, ArrowRight, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

export default function CBTTransferModal({
  isOpen,
  isTransferring,
  onConfirmTransfer,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none"
      data-testid="cbt-transfer-modal"
    >
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-7 text-center space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Active Exam on Another Device
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
            You currently have an active test session running on another device or browser tab.
          </p>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl text-left text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Single-Device Exam Security</span>
          </div>
          <p className="text-gray-500 dark:text-slate-400 text-[11px] leading-relaxed">
            Transferring will immediately disconnect the other device and resume your active timer, answers, and palette states on this screen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={isTransferring}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            data-testid="cbt-transfer-cancel-btn"
          >
            Cancel &amp; Exit
          </button>
          <button
            type="button"
            onClick={onConfirmTransfer}
            disabled={isTransferring}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            data-testid="cbt-transfer-confirm-btn"
          >
            {isTransferring ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Transferring...</span>
              </>
            ) : (
              <>
                <span>Transfer Here</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
