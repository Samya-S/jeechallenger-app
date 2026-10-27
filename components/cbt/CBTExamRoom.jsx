'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useCBTStore } from './store/useCBTStore';
import CBTHeader from './CBTHeader';
import CBTSectionBar from './CBTSectionBar';
import CBTQuestionPane from './CBTQuestionPane';
import CBTQuestionPalette from './CBTQuestionPalette';
import CBTBottomBar from './CBTBottomBar';
import CBTExamSummaryModal from './CBTExamSummaryModal';
import CBTQuestionPaperModal from './CBTQuestionPaperModal';
import CBTInstructionsModal from './CBTInstructionsModal';
import CBTKioskGuard from './CBTKioskGuard';
import { Loader2 } from 'lucide-react';

export default function CBTExamRoom({ paperData, questionsData, initialSessionData, candidateName = 'Candidate' }) {
  const initSession = useCBTStore((s) => s.initSession);
  const triggerHeartbeat = useCBTStore((s) => s.triggerHeartbeat);
  const flushSyncQueue = useCBTStore((s) => s.flushSyncQueue);
  const sessionId = useCBTStore((s) => s.sessionId);
  const isOnline = useCBTStore((s) => s.isOnline);
  const isTerminated = useCBTStore((s) => s.isTerminated);
  const isExamSubmitted = useCBTStore((s) => s.isExamSubmitted);

  const [isReady, setIsReady] = useState(false);
  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isQPModalOpen, setIsQPModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  // Initialize CBT session
  useEffect(() => {
    let isMounted = true;

    async function setup() {
      if (!paperData || !questionsData) return;

      try {
        let session = initialSessionData;

        // If no session provided from server, initialize via client endpoint
        if (!session) {
          const instId = useCBTStore.getState().instanceId;
          const res = await fetch('/api/cbt/session/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paper_id: paperData.paper_id,
              instance_id: instId,
            }),
          });
          session = await res.json();
        }

        if (isMounted) {
          await initSession({
            paper: paperData,
            questions: questionsData,
            sessionData: session,
          });
          setIsReady(true);
        }
      } catch (err) {
        console.error('Failed to initialize CBT session:', err);
      }
    }

    setup();

    return () => {
      isMounted = false;
    };
  }, [paperData, questionsData, initialSessionData, initSession]);

  // 10-Second Telemetry & In-Flight Heartbeat
  useEffect(() => {
    if (!sessionId || isExamSubmitted || isTerminated) return;

    const heartbeatInterval = setInterval(() => {
      triggerHeartbeat();
    }, 10000);

    return () => clearInterval(heartbeatInterval);
  }, [sessionId, isExamSubmitted, isTerminated, triggerHeartbeat]);

  // Network Online/Offline Listeners for Sync Queue
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      useCBTStore.setState({ isOnline: true });
      flushSyncQueue();
    };

    const handleOffline = () => {
      useCBTStore.setState({ isOnline: false });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushSyncQueue]);

  if (!isReady) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#162942] text-white select-none">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
          <h2 className="text-xl font-bold tracking-wide">Loading Examination Portal...</h2>
          <p className="text-sm text-blue-200">Setting up secure testing session and cache...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="cbt-exam-room w-screen h-screen overflow-hidden flex flex-col bg-white text-gray-900 select-none relative"
      data-testid="cbt-exam-room"
    >
      {/* Kiosk Fullscreen Guard & Terminated Mutex Overlay */}
      <CBTKioskGuard />

      {/* Top CBT Header */}
      <CBTHeader
        candidateName={candidateName}
        systemId="C001"
        onOpenQuestionPaper={() => setIsQPModalOpen(true)}
        onOpenInstructions={() => setIsInstructionsOpen(true)}
      />

      {/* Section Switcher Bar */}
      <CBTSectionBar />

      {/* Main Workspace (Questions Left, Palette Right) */}
      <div className="flex-1 flex flex-row overflow-hidden min-h-0 relative">
        <CBTQuestionPane className="flex-1 min-w-0" />

        <CBTQuestionPalette
          isCollapsed={isPaletteCollapsed}
          onToggleCollapse={() => setIsPaletteCollapsed(!isPaletteCollapsed)}
        />
      </div>

      {/* Fixed Sticky Action Bar at Bottom */}
      <CBTBottomBar onOpenSubmitSummary={() => setIsSubmitModalOpen(true)} />

      {/* Pre-Submission Overview Modal */}
      <CBTExamSummaryModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      {/* Full Question Paper Preview Modal */}
      <CBTQuestionPaperModal
        isOpen={isQPModalOpen}
        onClose={() => setIsQPModalOpen(false)}
      />

      {/* Official Instructions Modal */}
      <CBTInstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />
    </div>
  );
}
