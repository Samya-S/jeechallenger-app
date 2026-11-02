'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useCBTStore } from './store/useCBTStore';
import { Maximize, ShieldAlert, AlertOctagon, ShieldCheck, Lock, RefreshCw, ArrowRight, AlertTriangle, Loader2 } from 'lucide-react';

export default function CBTKioskGuard() {
  const isTerminated = useCBTStore((s) => s.isTerminated);
  const isExamSubmitted = useCBTStore((s) => s.isExamSubmitted);
  const isFullscreen = useCBTStore((s) => s.isFullscreen);
  const setFullscreen = useCBTStore((s) => s.setFullscreen);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReclaiming, setIsReclaiming] = useState(false);
  const [reclaimError, setReclaimError] = useState(null);

  const [hasStartedKiosk, setHasStartedKiosk] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('kiosk') === 'off' || params.get('bypass_fullscreen') === '1';
    }
    return false;
  });
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  // Monitor bypass query parameters (e.g. for developer preview or automated audits)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('kiosk') === 'off' || params.get('bypass_fullscreen') === '1') {
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

  // Handler: Confirm transfer of active lease back to this device
  const handleConfirmTransferBack = useCallback(async () => {
    setIsReclaiming(true);
    setReclaimError(null);
    try {
      const sessionId = useCBTStore.getState().sessionId;
      if (!sessionId) {
        throw new Error('No active test session found.');
      }
      const newInstanceId = 'inst_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('cbt_instance_id', newInstanceId);
      }

      const res = await fetch('/api/cbt/session/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          new_instance_id: newInstanceId,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to claim exam lease');
      }

      const data = await res.json();

      await useCBTStore.getState().reclaimSession({
        newInstanceId: data.active_instance_id,
        rehydratedAnswers: data.rehydrated_answers,
        expiresAt: data.expires_at,
      });

      setIsConfirmModalOpen(false);

      // Restore fullscreen if supported
      try {
        if (typeof document !== 'undefined' && !document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        }
      } catch {}
    } catch (err) {
      console.error('Failed to reclaim session lease:', err);
      setReclaimError(err.message || 'Could not transfer session back. Please try again.');
    } finally {
      setIsReclaiming(false);
    }
  }, []);

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

          {/* Action buttons on lockout screen */}
          <div className="mt-6 w-full space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setReclaimError(null);
                setIsConfirmModalOpen(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              data-testid="cbt-transfer-back-btn"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Transfer Exam Back to This Device</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/mock-test';
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-800 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              data-testid="cbt-lockout-exit-btn"
            >
              Exit to Mock Tests
            </button>
          </div>
        </div>

        {/* Transfer Back Confirmation Modal */}
        {isConfirmModalOpen && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 select-none"
            data-testid="cbt-reclaim-confirm-modal"
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 sm:p-7 text-center space-y-5 animate-in fade-in zoom-in-95 duration-150 text-gray-900 dark:text-white">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-lg sm:text-xl font-bold">
                  Transfer Exam Back to This Device?
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
                  At a time, only one device will be active.
                </p>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl text-left text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Single-Device Exam Security</span>
                </div>
                <p className="text-amber-800/80 dark:text-amber-300/80 text-[11px] leading-relaxed">
                  If you transfer back, your other device will be disconnected and ended immediately. Your remaining exam timer and answers will resume here.
                </p>
              </div>

              {reclaimError && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-400 text-left">
                  {reclaimError}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (!isReclaiming) setIsConfirmModalOpen(false);
                  }}
                  disabled={isReclaiming}
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-xs sm:text-sm font-semibold hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  data-testid="cbt-reclaim-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmTransferBack}
                  disabled={isReclaiming}
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  data-testid="cbt-reclaim-confirm-btn"
                >
                  {isReclaiming ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transferring...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm &amp; Transfer</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
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
