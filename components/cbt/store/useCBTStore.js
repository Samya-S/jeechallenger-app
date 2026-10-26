import { create } from 'zustand';
import { get, set, del } from 'idb-keyval';

/**
 * Unique client instance generator for Leased Mutex Concurrency
 */
function generateInstanceId() {
  if (typeof window === 'undefined') return 'server_inst';
  let inst = sessionStorage.getItem('cbt_instance_id');
  if (!inst) {
    inst = 'inst_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem('cbt_instance_id', inst);
  }
  return inst;
}

export const useCBTStore = create((setState, getState) => ({
  // ── Session & Exam Metadata ─────────────────────────────────────────────────
  sessionId: null,
  paperId: null,
  examType: 'JEE_MAIN', // 'JEE_MAIN' | 'JEE_ADVANCED'
  paperMetadata: null,
  questions: [],
  activeQuestionIndex: 0,
  activeSubject: 'Physics',
  activeSectionIndex: 0,
  expiresAt: 0,
  serverTimeOffset: 0, // server_now - client_now
  instanceId: generateInstanceId(),

  // ── In-Flight Candidate Responses ──────────────────────────────────────────
  answers: {}, // qNum -> { selectedOption: string | null, numericValue: string | null }
  paletteStates: {}, // qNum -> 1 | 2 | 3 | 4 | 5
  questionTimeMap: {}, // qNum -> seconds
  activeQuestionEnteredAt: Date.now(),
  uncommittedAnswer: { selectedOption: null, numericValue: null },

  // ── Kiosk & Sync State ─────────────────────────────────────────────────────
  pendingSyncQueue: new Set(),
  isSyncing: false,
  isOnline: true,
  isTerminated: false, // true when 409 Conflict occurs (revoked by another device)
  isFullscreen: false,
  isKioskLocked: false,
  isExamSubmitted: false,

  // ── 1. Initialize / Rehydrate Session ───────────────────────────────────────
  initSession: async ({ paper, questions, sessionData }) => {
    const {
      session_id,
      paper_id,
      server_now,
      expires_at,
      rehydrated_answers = {},
    } = sessionData;

    const instanceId = getState().instanceId;
    const clientNow = Date.now();
    const serverTimeOffset = (server_now || clientNow) - clientNow;

    // Load local IndexedDB cache first (< 2ms)
    let localCache = null;
    if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined') {
      try {
        localCache = await get(`cbt_local_${session_id}`);
      } catch (e) {
        console.warn('Failed to read IndexedDB local cache:', e);
      }
    }

    const mergedAnswers = { ...(localCache?.answers || {}) };
    const mergedPaletteStates = { ...(localCache?.paletteStates || {}) };
    const mergedTimeMap = { ...(localCache?.questionTimeMap || {}) };

    // Merge server-rehydrated responses (if newer or local was empty)
    for (const [qNumStr, sResp] of Object.entries(rehydrated_answers)) {
      const qNum = parseInt(qNumStr, 10);
      if (!mergedAnswers[qNum] || (sResp.updated_at && sResp.updated_at > (mergedAnswers[qNum]?.updated_at || 0))) {
        mergedAnswers[qNum] = {
          selectedOption: sResp.selected_option || null,
          numericValue: sResp.numeric_value || null,
        };
        mergedPaletteStates[qNum] = sResp.color_state || 1;
        mergedTimeMap[qNum] = sResp.time_spent_seconds || 0;
      }
    }

    // Default first question state
    const firstQNum = questions[0]?.question_number || 1;
    if (!mergedPaletteStates[firstQNum] || mergedPaletteStates[firstQNum] === 1) {
      mergedPaletteStates[firstQNum] = 2; // Not Answered (visited)
    }

    const initialUncommitted = {
      selectedOption: mergedAnswers[firstQNum]?.selectedOption || null,
      numericValue: mergedAnswers[firstQNum]?.numericValue || null,
    };

    setState({
      sessionId: session_id,
      paperId: paper_id,
      examType: paper?.exam_type || 'JEE_MAIN',
      paperMetadata: paper,
      questions: questions || [],
      activeQuestionIndex: 0,
      activeSubject: questions[0]?.subject || 'Physics',
      activeSectionIndex: 0,
      expiresAt: expires_at,
      serverTimeOffset,
      answers: mergedAnswers,
      paletteStates: mergedPaletteStates,
      questionTimeMap: mergedTimeMap,
      uncommittedAnswer: initialUncommitted,
      activeQuestionEnteredAt: Date.now(),
      isOnline: typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true,
    });

    // Save initial state to IndexedDB
    if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined') {
      try {
        await set(`cbt_local_${session_id}`, {
          answers: mergedAnswers,
          paletteStates: mergedPaletteStates,
          questionTimeMap: mergedTimeMap,
        });
      } catch (e) {
        console.warn('Failed to prime IndexedDB cache:', e);
      }
    }
  },

  // ── 2. Input Manipulation (0 ms UI Updates) ────────────────────────────────
  selectOption: (option) => {
    setState((prev) => ({
      uncommittedAnswer: {
        ...prev.uncommittedAnswer,
        selectedOption: prev.uncommittedAnswer.selectedOption === option ? null : option,
      },
    }));
  },

  setNumericValue: (val) => {
    setState((prev) => ({
      uncommittedAnswer: {
        ...prev.uncommittedAnswer,
        numericValue: val,
      },
    }));
  },

  clearResponse: () => {
    const { questions, activeQuestionIndex, answers, paletteStates, pendingSyncQueue } = getState();
    const currentQ = questions[activeQuestionIndex];
    if (!currentQ) return;
    const qNum = currentQ.question_number;

    const nextAnswers = { ...answers, [qNum]: { selectedOption: null, numericValue: null } };
    const nextPalette = { ...paletteStates, [qNum]: 2 }; // Reverts to Not Answered
    const nextQueue = new Set(pendingSyncQueue).add(qNum);

    setState({
      uncommittedAnswer: { selectedOption: null, numericValue: null },
      answers: nextAnswers,
      paletteStates: nextPalette,
      pendingSyncQueue: nextQueue,
    });

    getState().persistToIndexedDB();
    getState().flushSyncQueue();
  },

  // ── 3. Navigation & State Transitions ──────────────────────────────────────
  saveAndNext: () => {
    const {
      questions,
      activeQuestionIndex,
      activeQuestionEnteredAt,
      questionTimeMap,
      answers,
      paletteStates,
      uncommittedAnswer,
      pendingSyncQueue,
    } = getState();

    const currentQ = questions[activeQuestionIndex];
    if (!currentQ) return;
    const qNum = currentQ.question_number;

    // 1. Commit time delta
    const now = Date.now();
    const elapsed = Math.round((now - activeQuestionEnteredAt) / 1000);
    const nextTimeMap = {
      ...questionTimeMap,
      [qNum]: (questionTimeMap[qNum] || 0) + elapsed,
    };

    // 2. Commit answer & palette state
    const hasAnswer =
      (uncommittedAnswer.selectedOption && uncommittedAnswer.selectedOption.trim() !== '') ||
      (uncommittedAnswer.numericValue !== null && uncommittedAnswer.numericValue !== undefined && String(uncommittedAnswer.numericValue).trim() !== '');

    const nextAnswers = {
      ...answers,
      [qNum]: { ...uncommittedAnswer },
    };
    const nextPalette = {
      ...paletteStates,
      [qNum]: hasAnswer ? 3 : 2, // 3: Answered, 2: Not Answered
    };
    const nextQueue = new Set(pendingSyncQueue).add(qNum);

    // 3. Prepare next question transition
    const nextIndex = activeQuestionIndex + 1 < questions.length ? activeQuestionIndex + 1 : activeQuestionIndex;
    const nextQ = questions[nextIndex];
    const nextQNum = nextQ?.question_number;

    if (nextQ && (!nextPalette[nextQNum] || nextPalette[nextQNum] === 1)) {
      nextPalette[nextQNum] = 2; // Mark Not Answered upon visiting
    }

    const nextUncommitted = {
      selectedOption: nextAnswers[nextQNum]?.selectedOption || null,
      numericValue: nextAnswers[nextQNum]?.numericValue || null,
    };

    setState({
      activeQuestionIndex: nextIndex,
      activeSubject: nextQ?.subject || getState().activeSubject,
      activeQuestionEnteredAt: now,
      answers: nextAnswers,
      paletteStates: nextPalette,
      questionTimeMap: nextTimeMap,
      uncommittedAnswer: nextUncommitted,
      pendingSyncQueue: nextQueue,
    });

    getState().persistToIndexedDB();
    getState().flushSyncQueue();
  },

  saveAndMarkForReview: () => {
    const {
      questions,
      activeQuestionIndex,
      activeQuestionEnteredAt,
      questionTimeMap,
      answers,
      paletteStates,
      uncommittedAnswer,
      pendingSyncQueue,
    } = getState();

    const currentQ = questions[activeQuestionIndex];
    if (!currentQ) return;
    const qNum = currentQ.question_number;

    const now = Date.now();
    const elapsed = Math.round((now - activeQuestionEnteredAt) / 1000);
    const nextTimeMap = {
      ...questionTimeMap,
      [qNum]: (questionTimeMap[qNum] || 0) + elapsed,
    };

    const hasAnswer =
      (uncommittedAnswer.selectedOption && uncommittedAnswer.selectedOption.trim() !== '') ||
      (uncommittedAnswer.numericValue !== null && uncommittedAnswer.numericValue !== undefined && String(uncommittedAnswer.numericValue).trim() !== '');

    const nextAnswers = {
      ...answers,
      [qNum]: { ...uncommittedAnswer },
    };
    const nextPalette = {
      ...paletteStates,
      [qNum]: hasAnswer ? 5 : 4, // 5: Answered & Marked for Review, 4: Marked for Review
    };
    const nextQueue = new Set(pendingSyncQueue).add(qNum);

    const nextIndex = activeQuestionIndex + 1 < questions.length ? activeQuestionIndex + 1 : activeQuestionIndex;
    const nextQ = questions[nextIndex];
    const nextQNum = nextQ?.question_number;

    if (nextQ && (!nextPalette[nextQNum] || nextPalette[nextQNum] === 1)) {
      nextPalette[nextQNum] = 2;
    }

    const nextUncommitted = {
      selectedOption: nextAnswers[nextQNum]?.selectedOption || null,
      numericValue: nextAnswers[nextQNum]?.numericValue || null,
    };

    setState({
      activeQuestionIndex: nextIndex,
      activeSubject: nextQ?.subject || getState().activeSubject,
      activeQuestionEnteredAt: now,
      answers: nextAnswers,
      paletteStates: nextPalette,
      questionTimeMap: nextTimeMap,
      uncommittedAnswer: nextUncommitted,
      pendingSyncQueue: nextQueue,
    });

    getState().persistToIndexedDB();
    getState().flushSyncQueue();
  },

  markForReviewAndNext: () => {
    const {
      questions,
      activeQuestionIndex,
      activeQuestionEnteredAt,
      questionTimeMap,
      answers,
      paletteStates,
      pendingSyncQueue,
    } = getState();

    const currentQ = questions[activeQuestionIndex];
    if (!currentQ) return;
    const qNum = currentQ.question_number;

    const now = Date.now();
    const elapsed = Math.round((now - activeQuestionEnteredAt) / 1000);
    const nextTimeMap = {
      ...questionTimeMap,
      [qNum]: (questionTimeMap[qNum] || 0) + elapsed,
    };

    const nextPalette = {
      ...paletteStates,
      [qNum]: 4, // 4: Marked for Review (without answer)
    };
    const nextQueue = new Set(pendingSyncQueue).add(qNum);

    const nextIndex = activeQuestionIndex + 1 < questions.length ? activeQuestionIndex + 1 : activeQuestionIndex;
    const nextQ = questions[nextIndex];
    const nextQNum = nextQ?.question_number;

    if (nextQ && (!nextPalette[nextQNum] || nextPalette[nextQNum] === 1)) {
      nextPalette[nextQNum] = 2;
    }

    const nextUncommitted = {
      selectedOption: answers[nextQNum]?.selectedOption || null,
      numericValue: answers[nextQNum]?.numericValue || null,
    };

    setState({
      activeQuestionIndex: nextIndex,
      activeSubject: nextQ?.subject || getState().activeSubject,
      activeQuestionEnteredAt: now,
      paletteStates: nextPalette,
      questionTimeMap: nextTimeMap,
      uncommittedAnswer: nextUncommitted,
      pendingSyncQueue: nextQueue,
    });

    getState().persistToIndexedDB();
    getState().flushSyncQueue();
  },

  // ── 4. The Unsaved Palette Jump Trait (Official NTA Rule) ───────────────────
  jumpToQuestion: (targetIndex) => {
    const {
      questions,
      activeQuestionIndex,
      activeQuestionEnteredAt,
      questionTimeMap,
      answers,
      paletteStates,
    } = getState();

    if (targetIndex === activeQuestionIndex) return;
    const currentQ = questions[activeQuestionIndex];
    const targetQ = questions[targetIndex];
    if (!currentQ || !targetQ) return;

    const currentQNum = currentQ.question_number;
    const targetQNum = targetQ.question_number;

    // 1. Commit time spent on departing question
    const now = Date.now();
    const elapsed = Math.round((now - activeQuestionEnteredAt) / 1000);
    const nextTimeMap = {
      ...questionTimeMap,
      [currentQNum]: (questionTimeMap[currentQNum] || 0) + elapsed,
    };

    // 2. CRUCIAL NTA RULE: Uncommitted input is DISCARDED on palette jump!
    // We do NOT save uncommittedAnswer. We load whatever was officially committed in answers[targetQNum].
    const nextPalette = { ...paletteStates };
    if (!nextPalette[targetQNum] || nextPalette[targetQNum] === 1) {
      nextPalette[targetQNum] = 2; // Visited -> Not Answered
    }

    const targetUncommitted = {
      selectedOption: answers[targetQNum]?.selectedOption || null,
      numericValue: answers[targetQNum]?.numericValue || null,
    };

    setState({
      activeQuestionIndex: targetIndex,
      activeSubject: targetQ.subject,
      activeQuestionEnteredAt: now,
      questionTimeMap: nextTimeMap,
      paletteStates: nextPalette,
      uncommittedAnswer: targetUncommitted,
    });

    getState().persistToIndexedDB();
  },

  // ── 5. Persistence & Sync Workers ──────────────────────────────────────────
  persistToIndexedDB: async () => {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return;
    const { sessionId, answers, paletteStates, questionTimeMap } = getState();
    if (!sessionId) return;
    try {
      await set(`cbt_local_${sessionId}`, {
        answers,
        paletteStates,
        questionTimeMap,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn('IndexedDB write error:', e);
    }
  },

  flushSyncQueue: async () => {
    const {
      sessionId,
      instanceId,
      pendingSyncQueue,
      answers,
      paletteStates,
      questionTimeMap,
      isSyncing,
      isTerminated,
    } = getState();

    if (!sessionId || isSyncing || isTerminated || pendingSyncQueue.size === 0) {
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return;
    }

    setState({ isSyncing: true });
    const dirtyQNums = Array.from(pendingSyncQueue);

    const delta = {};
    for (const qNum of dirtyQNums) {
      delta[`q_${qNum}`] = {
        selected_option: answers[qNum]?.selectedOption || null,
        numeric_value: answers[qNum]?.numericValue || null,
        color_state: paletteStates[qNum] || 1,
        time_spent_seconds: questionTimeMap[qNum] || 0,
        updated_at: Date.now(),
      };
    }

    try {
      const res = await fetch('/api/cbt/session/sync-delta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          instance_id: instanceId,
          delta,
        }),
      });

      if (res.status === 409) {
        // Concurrency Conflict: Session claimed by another device!
        setState({ isTerminated: true, isSyncing: false });
        return;
      }

      if (res.ok) {
        setState((prev) => {
          const nextQueue = new Set(prev.pendingSyncQueue);
          dirtyQNums.forEach((n) => nextQueue.delete(n));
          return { pendingSyncQueue: nextQueue, isSyncing: false };
        });
      } else {
        setState({ isSyncing: false });
      }
    } catch (err) {
      console.warn('Sync delta network error:', err);
      setState({ isSyncing: false });
    }
  },

  triggerHeartbeat: async () => {
    const {
      sessionId,
      instanceId,
      isTerminated,
      questions,
      activeQuestionIndex,
      activeQuestionEnteredAt,
      questionTimeMap,
      answers,
      paletteStates,
    } = getState();

    if (!sessionId || isTerminated) return;
    const currentQ = questions[activeQuestionIndex];
    if (!currentQ) return;
    const qNum = currentQ.question_number;

    // Calculate live in-flight slice for active question
    const elapsed = Math.round((Date.now() - activeQuestionEnteredAt) / 1000);
    const liveTime = (questionTimeMap[qNum] || 0) + elapsed;

    const delta = {
      [`q_${qNum}`]: {
        selected_option: answers[qNum]?.selectedOption || null,
        numeric_value: answers[qNum]?.numericValue || null,
        color_state: paletteStates[qNum] || 2,
        time_spent_seconds: liveTime,
        updated_at: Date.now(),
      },
    };

    try {
      const res = await fetch('/api/cbt/session/sync-delta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          instance_id: instanceId,
          delta,
        }),
      });

      if (res.status === 409) {
        setState({ isTerminated: true });
      }
    } catch {
      // Non-blocking heartbeat error
    }
  },

  // ── 6. Final Exam Submission ───────────────────────────────────────────────
  submitExam: async () => {
    const {
      sessionId,
      instanceId,
      questions,
      activeQuestionIndex,
      activeQuestionEnteredAt,
      questionTimeMap,
    } = getState();

    // 1. Calculate final exact seconds on active question
    const currentQ = questions[activeQuestionIndex];
    const finalTimeMap = { ...questionTimeMap };
    if (currentQ) {
      const qNum = currentQ.question_number;
      const finalSlice = Math.round((Date.now() - activeQuestionEnteredAt) / 1000);
      finalTimeMap[qNum] = (finalTimeMap[qNum] || 0) + finalSlice;
    }

    setState({ isExamSubmitted: true });

    try {
      const res = await fetch('/api/cbt/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          instance_id: instanceId,
          final_question_time_map: finalTimeMap,
        }),
      });

      const data = await res.json();
      if (res.ok && data.redirect_url) {
        // Clear local storage cache on successful submission
        try {
          await del(`cbt_local_${sessionId}`);
        } catch {}
        if (typeof window !== 'undefined') {
          window.location.href = data.redirect_url;
        }
        return data;
      }
      throw new Error(data.error || 'Failed to submit exam');
    } catch (err) {
      setState({ isExamSubmitted: false });
      throw err;
    }
  },

  // ── 7. Kiosk & Fullscreen Controls ─────────────────────────────────────────
  setFullscreen: (val) => setState({ isFullscreen: val }),
  setKioskLocked: (val) => setState({ isKioskLocked: val }),
}));
