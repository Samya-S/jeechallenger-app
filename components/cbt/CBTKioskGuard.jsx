'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useCBTStore } from './store/useCBTStore';
import { Maximize, ShieldAlert, AlertOctagon, ShieldCheck, Lock } from 'lucide-react';

export default function CBTKioskGuard() {
  const isTerminated = useCBTStore((s) => s.isTerminated);
  const isExamSubmitted = useCBTStore((s) => s.isExamSubmitted);
  const isFullscreen = useCBTStore((s) => s.isFullscreen);
  const setFullscreen = useCBTStore((s) => s.setFullscreen);

  const [hasStartedKiosk, setHasStartedKiosk] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  // Monitor bypass query parameters (e.g. for developer preview or automated audits)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('kiosk') === 'off' || params.get('bypass_fullscreen') === '1') {
        setHasStartedKiosk(true);
        setFullscreen(true);
      }
    }
  }, [setFullscreen]);

  // Monitor fullscreen change and window blur/visibility events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFullscreenChange = () => {
      const activeFs = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setFullscreen(activeFs);
      if (activeFs) {
        setHasStartedKiosk(true);
        setIsWindowBlurred(false);
      }
    };

    const handleBlur = () => {
      if (hasStartedKiosk && !isExamSubmitted) {
        setIsWindowBlurred(true);
      }
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (hasStartedKiosk && !isExamSubmitted) {
          setIsWindowBlurred(true);
        }
      } else {
        setIsWindowBlurred(false);
      }
    };

    // Keyboard lockdown: prevent F5, Ctrl+R, Ctrl+W, DevTools
    const handleKeyDown = (e) => {
      if (
        e.key === 'F5' ||
        (e.ctrlKey && e.key === 'r') ||
        (e.ctrlKey && e.key === 'w') ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Right-click context menu lockdown
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Before unload prompt
    const handleBeforeUnload = (e) => {
      if (!isExamSubmitted) {
        e.preventDefault();
        e.returnValue = 'An active exam is in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasStartedKiosk, isExamSubmitted, setFullscreen]);

  // Request fullscreen trigger
  const requestFullscreen = useCallback(async () => {
    try {
      const docEl = document.documentElement;
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        await docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        await docEl.msRequestFullscreen();
      }
      setFullscreen(true);
      setHasStartedKiosk(true);
      setIsWindowBlurred(false);
    } catch (e) {
      console.warn('Failed to enter fullscreen:', e);
      // Do not fake fullscreen state if native request was denied
    }
  }, [setFullscreen]);

  // Case 1: Terminated via 409 Conflict (Leased Mutex Revocation)
  if (isTerminated) {
    return (
      <div
        className="fixed inset-0 z-[100] bg-slate-950/95 text-white flex flex-col items-center justify-center p-6 text-center select-none"
        data-testid="cbt-lockout-overlay"
      >
        <div className="max-w-md w-full bg-slate-900 border-2 border-red-600 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 mb-4 animate-bounce">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-red-500 tracking-wide uppercase">
            Session Transferred
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            This examination was transferred and activated on another browser or device. Simultaneous exam sessions are strictly prohibited.
          </p>
          <div className="mt-4 p-3 bg-red-950/30 border border-red-800/50 rounded-lg text-xs text-red-400 font-mono">
            Error: HTTP 409 Conflict • Lease Revoked
          </div>
          <p className="mt-4 text-xs text-slate-500">
            This window has been locked for integrity. Please continue your exam on your other device.
          </p>
        </div>
      </div>
    );
  }

  // Case 2: Mid-Exam Pause Overlay (Exited Fullscreen or Switched Windows during exam)
  const shouldShowPauseOverlay = hasStartedKiosk && (!isFullscreen || isWindowBlurred) && !isExamSubmitted;

  if (shouldShowPauseOverlay) {
    return (
      <div
        className="fixed inset-0 z-[90] bg-slate-950/95 backdrop-blur-md text-white flex flex-col items-center justify-center p-6 text-center select-none"
        data-testid="cbt-pause-overlay"
      >
        <div className="max-w-lg w-full bg-slate-900 border border-amber-500/60 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-amber-400 tracking-wider uppercase">
            Exam Paused (Timer is Running)
          </h2>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            Fullscreen kiosk mode is mandatory for this examination. Your exam screen is concealed to maintain testing integrity.
          </p>

          <p className="mt-2 text-xs font-semibold text-amber-300/90">
            Note: The official countdown timer continues running without pause.
          </p>

          <button
            type="button"
            onClick={requestFullscreen}
            className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            data-testid="cbt-resume-fullscreen-btn"
          >
            <Maximize className="w-5 h-5" />
            <span>Click to Resume Fullscreen</span>
          </button>
        </div>
      </div>
    );
  }

  // Case 3: Initial Exam Launch - Fullscreen Kiosk Gateway
  if (!hasStartedKiosk && !isFullscreen && !isExamSubmitted) {
    return (
      <div
        className="fixed inset-0 z-[95] bg-[#0f1d30]/95 backdrop-blur-md text-white flex flex-col items-center justify-center p-6 text-center select-none"
        data-testid="cbt-kiosk-start-overlay"
      >
        <div className="max-w-lg w-full bg-slate-900 border border-blue-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
            Official Computer-Based Test
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Mandatory Fullscreen Kiosk
          </h2>

          <p className="mt-3 text-sm text-slate-300 leading-relaxed">
            To replicate authentic NTA / TCS iON examination terminal conditions and enforce test integrity, this exam must be taken in full-screen mode.
          </p>

          <div className="mt-5 p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 text-left text-xs text-slate-300 space-y-2 w-full">
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Exiting full-screen or switching tabs will conceal your exam questions.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>The official 180-minute countdown timer runs continuously without pause.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span>Keyboard shortcuts (F5, Ctrl+R, Ctrl+W), right-click, and text copy are locked.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={requestFullscreen}
            className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            data-testid="cbt-start-fullscreen-btn"
          >
            <Maximize className="w-5 h-5" />
            <span>Enter Fullscreen & Begin Exam</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
