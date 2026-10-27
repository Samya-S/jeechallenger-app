'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useCBTStore } from './store/useCBTStore';
import { Clock, User, Monitor, FileText, HelpCircle, AlertTriangle, Maximize, ShieldCheck } from 'lucide-react';

export default function CBTHeader({
  candidateName = 'Candidate Name',
  systemId = 'C001',
  onOpenQuestionPaper,
  onOpenInstructions,
}) {
  const paperMetadata = useCBTStore((s) => s.paperMetadata);
  const activeSubject = useCBTStore((s) => s.activeSubject);
  const expiresAt = useCBTStore((s) => s.expiresAt);
  const serverTimeOffset = useCBTStore((s) => s.serverTimeOffset);
  const fontScale = useCBTStore((s) => s.fontScale);
  const setFontScale = useCBTStore((s) => s.setFontScale);
  const submitExam = useCBTStore((s) => s.submitExam);
  const isExamSubmitted = useCBTStore((s) => s.isExamSubmitted);

  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (!expiresAt) return 10800; // default 3 hours
    const serverNow = Date.now() + (serverTimeOffset || 0);
    return Math.max(0, Math.floor((expiresAt - serverNow) / 1000));
  });

  // Accurate drift-free countdown timer
  useEffect(() => {
    if (!expiresAt || isExamSubmitted) return;

    const tick = () => {
      const serverNow = Date.now() + (serverTimeOffset || 0);
      const remaining = Math.max(0, Math.floor((expiresAt - serverNow) / 1000));
      setRemainingSeconds(remaining);

      if (remaining <= 0 && !isExamSubmitted) {
        // Auto submit when time reaches zero
        submitExam().catch((err) => {
          console.error('Timer expiry auto-submit error:', err);
        });
      }
    };

    tick();
    const timerInterval = setInterval(tick, 1000);
    return () => clearInterval(timerInterval);
  }, [expiresAt, serverTimeOffset, isExamSubmitted, submitExam]);

  // Format HH:MM:SS
  const formattedTime = useMemo(() => {
    const hours = Math.floor(remainingSeconds / 3600);
    const mins = Math.floor((remainingSeconds % 3600) / 60);
    const secs = remainingSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [remainingSeconds]);

  // Timer urgency style
  const isCritical = remainingSeconds <= 300; // < 5 mins
  const isWarning = remainingSeconds <= 900 && !isCritical; // < 15 mins

  return (
    <header className="cbt-header w-full h-16 bg-[#162942] text-white border-b border-slate-700/80 px-3 sm:px-5 flex items-center justify-between select-none shrink-0 z-30">
      {/* Left: Exam Title & Subject Info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden sm:flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-blue-300 font-semibold truncate">
            {paperMetadata?.exam_type === 'JEE_ADVANCED' ? 'JEE (Advanced)' : 'JEE (Main)'} Mock Test
          </span>
          <h1 className="text-sm md:text-base font-bold text-white truncate max-w-xs md:max-w-md">
            {paperMetadata?.title || 'Joint Entrance Examination'}
          </h1>
        </div>

        <div className="flex sm:hidden flex-col">
          <span className="text-xs font-bold text-white truncate">
            {activeSubject}
          </span>
          <span className="text-[10px] text-blue-300">
            {paperMetadata?.exam_type === 'JEE_ADVANCED' ? 'JEE Adv' : 'JEE Main'}
          </span>
        </div>
      </div>

      {/* Center: Real-time Countdown Timer (Prominent & High Contrast) */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border font-mono font-bold shadow-sm transition-colors ${
          isCritical
            ? 'bg-red-600/90 border-red-400 text-white animate-pulse'
            : isWarning
            ? 'bg-amber-600/90 border-amber-400 text-white'
            : 'bg-[#0f1d30] border-blue-500/40 text-blue-100'
        }`}
        data-testid="cbt-countdown-timer"
      >
        <Clock className={`w-4 h-4 ${isCritical ? 'text-white' : 'text-blue-400'}`} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5 leading-none">
          <span className="hidden sm:inline text-[11px] uppercase tracking-wider text-blue-300 font-sans font-medium">
            Time Left:
          </span>
          <span className="text-base sm:text-lg tracking-widest">{formattedTime}</span>
        </div>
      </div>

      {/* Right: Candidate Info, Font Controls & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Font Size Adjusters */}
        <div className="hidden lg:flex items-center border border-slate-600 rounded-lg overflow-hidden bg-slate-800/80 text-xs">
          <button
            type="button"
            onClick={() => setFontScale('small')}
            className={`px-2 py-1 transition-colors ${fontScale === 'small' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700'}`}
            title="Smaller Font"
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setFontScale('normal')}
            className={`px-2 py-1 transition-colors border-x border-slate-600 ${fontScale === 'normal' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700'}`}
            title="Normal Font"
          >
            A
          </button>
          <button
            type="button"
            onClick={() => setFontScale('large')}
            className={`px-2 py-1 transition-colors ${fontScale === 'large' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-700'}`}
            title="Larger Font"
          >
            A+
          </button>
        </div>

        {/* Question Paper Modal Trigger */}
        {onOpenQuestionPaper && (
          <button
            type="button"
            onClick={onOpenQuestionPaper}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="View Full Question Paper"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Question Paper</span>
          </button>
        )}

        {/* Instructions Modal Trigger */}
        {onOpenInstructions && (
          <button
            type="button"
            onClick={onOpenInstructions}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="View Exam Instructions"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Instructions</span>
          </button>
        )}

        {/* Fullscreen Kiosk Button */}
        <button
          type="button"
          onClick={async () => {
            try {
              if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen?.();
              }
            } catch (e) {
              console.warn('Fullscreen trigger failed:', e);
            }
          }}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold shadow-sm transition-all cursor-pointer"
          title="Fullscreen Kiosk Active"
          data-testid="cbt-header-fullscreen-btn"
        >
          <Maximize className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden xl:inline">Fullscreen</span>
        </button>

        {/* Candidate & System Terminal Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-white shadow-inner font-bold text-xs uppercase">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-white truncate max-w-[120px]">
              {candidateName}
            </span>
            <span className="text-[10px] text-blue-300 flex items-center gap-1">
              <Monitor className="w-3 h-3" />
              <span>{systemId}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
