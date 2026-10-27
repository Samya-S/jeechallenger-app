'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
import CBTCandidateLogin from './gateway/CBTCandidateLogin';
import CBTGeneralInstructions from './gateway/CBTGeneralInstructions';
import CBTDeclarationGateway from './gateway/CBTDeclarationGateway';
import { Loader2 } from 'lucide-react';

export default function CBTExamRoom({
  paperData,
  questionsData,
  initialSessionData,
  candidateName = 'Candidate',
  candidateRollNo = '260310048291',
  candidateImage = null,
}) {
  const initSession = useCBTStore((s) => s.initSession);
  const triggerHeartbeat = useCBTStore((s) => s.triggerHeartbeat);
  const flushSyncQueue = useCBTStore((s) => s.flushSyncQueue);
  const sessionId = useCBTStore((s) => s.sessionId);
  const isOnline = useCBTStore((s) => s.isOnline);
  const isTerminated = useCBTStore((s) => s.isTerminated);
  const isExamSubmitted = useCBTStore((s) => s.isExamSubmitted);

  // Pre-exam Gateway Stages: 'CHECKING' | 'LOGIN' | 'GENERAL_INSTRUCTIONS' | 'DECLARATION' | 'EXAM'
  const [gatewayStage, setGatewayStage] = useState('CHECKING');
  const [isReady, setIsReady] = useState(false);
  const [isStartingSession, setIsStartingSession] = useState(false);

  const [isPaletteCollapsed, setIsPaletteCollapsed] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isQPModalOpen, setIsQPModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  // Check if session is already active in Redis on mount
  useEffect(() => {
    let isMounted = true;

    async function checkSessionStatus() {
      if (!paperData || !questionsData) return;

      // Check query parameter override (e.g. for quick dev audits)
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('skip_gateway') === '1') {
          await startExamDirectly();
          return;
        }
      }

      // Check if candidate already has an active IN_PROGRESS session in Redis
      try {
        const res = await fetch(`/api/cbt/session/start?paper_id=${paperData.paper_id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.has_active_session) {
            // Test is already in progress - resume directly without re-reading instructions!
            await startExamDirectly();
            return;
          }
        }
      } catch (err) {
        console.warn('Error checking existing CBT session status:', err);
      }

      // Fresh mock test: start at authentic Candidate Login terminal!
      if (isMounted) {
        setGatewayStage('LOGIN');
      }
    }

    async function startExamDirectly() {
      try {
        const instId = useCBTStore.getState().instanceId;
        const res = await fetch('/api/cbt/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paper_id: paperData.paper_id,
            instance_id: instId,
          }),
        });
        const session = await res.json();

        if (isMounted) {
          await initSession({
            paper: paperData,
            questions: questionsData,
            sessionData: session,
          });
          setIsReady(true);
          setGatewayStage('EXAM');
        }
      } catch (err) {
        console.error('Failed to resume CBT session:', err);
        if (isMounted) setGatewayStage('LOGIN');
      }
    }

    checkSessionStatus();

    return () => {
      isMounted = false;
    };
  }, [paperData, questionsData, initSession]);

  // Handler: Candidate clicks "I am ready to begin" on the Declaration screen
  const handleReadyToBegin = useCallback(
    async (defaultLanguage) => {
      if (!paperData || !questionsData) return;
      setIsStartingSession(true);

      try {
        const instId = useCBTStore.getState().instanceId;
        const res = await fetch('/api/cbt/session/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paper_id: paperData.paper_id,
            instance_id: instId,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to start session on server');
        }

        const session = await res.json();

        await initSession({
          paper: paperData,
          questions: questionsData,
          sessionData: session,
        });

        setIsReady(true);
        setGatewayStage('EXAM');
      } catch (err) {
        console.error('Failed to start exam session:', err);
        alert('Could not start examination session. Please try again or contact the invigilator.');
      } finally {
        setIsStartingSession(false);
      }
    },
    [paperData, questionsData, initSession]
  );

  // 10-Second Telemetry & In-Flight Heartbeat (Active only when in Exam stage)
  useEffect(() => {
    if (gatewayStage !== 'EXAM' || !sessionId || isExamSubmitted || isTerminated) return;

    const heartbeatInterval = setInterval(() => {
      triggerHeartbeat();
    }, 10000);

    return () => clearInterval(heartbeatInterval);
  }, [gatewayStage, sessionId, isExamSubmitted, isTerminated, triggerHeartbeat]);

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

  // Stage 0: Initial Server Handshake
  if (gatewayStage === 'CHECKING' || isStartingSession) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#162942] text-white select-none">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
          <h2 className="text-xl font-bold tracking-wide">
            {isStartingSession ? 'Starting Live Examination...' : 'Connecting to Assessment Terminal...'}
          </h2>
          <p className="text-sm text-blue-200">
            {isStartingSession ? 'Synchronizing clock with server and locking secure kiosk...' : 'Checking workstation authorization (Terminal C001)...'}
          </p>
        </div>
      </div>
    );
  }

  // Stage 1: Candidate Terminal Sign-In
  if (gatewayStage === 'LOGIN') {
    return (
      <CBTCandidateLogin
        paperData={paperData}
        candidateName={candidateName}
        candidateRollNo={candidateRollNo}
        candidateImage={candidateImage}
        onSignIn={() => setGatewayStage('GENERAL_INSTRUCTIONS')}
      />
    );
  }

  // Stage 2: General Instructions & Palette Legend
  if (gatewayStage === 'GENERAL_INSTRUCTIONS') {
    return (
      <CBTGeneralInstructions
        paperData={paperData}
        candidateName={candidateName}
        candidateRollNo={candidateRollNo}
        candidateImage={candidateImage}
        onNext={() => setGatewayStage('DECLARATION')}
      />
    );
  }

  // Stage 3: Paper Specific Instructions & Declaration ("I am ready to begin")
  if (gatewayStage === 'DECLARATION') {
    return (
      <CBTDeclarationGateway
        paperData={paperData}
        candidateName={candidateName}
        candidateRollNo={candidateRollNo}
        candidateImage={candidateImage}
        onPrevious={() => setGatewayStage('GENERAL_INSTRUCTIONS')}
        onReadyToBegin={handleReadyToBegin}
      />
    );
  }

  // Stage 4: Live Exam Room
  if (!isReady) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#162942] text-white select-none">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
          <h2 className="text-xl font-bold tracking-wide">Entering Examination Room...</h2>
          <p className="text-sm text-blue-200">Loading Question 1...</p>
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
