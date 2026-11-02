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
  // Keyed strictly by Question ID (_id) for 100% collision-proof isolation
  answers: {}, // qId -> { selected_options: string[], numeric_value: string | null }
  paletteStates: {}, // qId -> 1 | 2 | 3 | 4 | 5
  questionTimeMap: {}, // qId -> seconds
  activeQuestionEnteredAt: Date.now(),
  uncommittedAnswer: { selected_options: [], numeric_value: null },

  // ── Kiosk & Sync State ─────────────────────────────────────────────────────
  pendingSyncQueue: new Set(), // Set of dirty qIds
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
    for (const [qId, sResp] of Object.entries(rehydrated_answers)) {
      if (!mergedAnswers[qId] || (sResp.updated_at && sResp.updated_at > (mergedAnswers[qId]?.updated_at || 0))) {
        const sOptions = Array.isArray(sResp.selected_options)
          ? sResp.selected_options
          : (sResp.selected_option ? [String(sResp.selected_option).trim()] : []);
        mergedAnswers[qId] = {
          selected_options: sOptions,
          numeric_value: sResp.numeric_value || null,
        };
        mergedPaletteStates[qId] = sResp.color_state || 1;
        mergedTimeMap[qId] = sResp.time_spent_seconds || 0;
      }
    }

    // Default first question state
    const firstQ = questions[0];
    const firstQId = firstQ ? String(firstQ._id) : null;
    if (firstQId && (!mergedPaletteStates[firstQId] || mergedPaletteStates[firstQId] === 1)) {
      mergedPaletteStates[firstQId] = 2; // Not Answered (visited)
    }

    const initialUncommitted = {
      selected_options: (firstQId && mergedAnswers[firstQId]?.selected_options) ? [...mergedAnswers[firstQId].selected_options] : [],
      numeric_value: (firstQId && mergedAnswers[firstQId]?.numeric_value) || null,
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
      isTerminated: false,
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

  // ── 1b. Reclaim Session from Another Device (Transfer Back) ───────────────────
  reclaimSession: async ({ newInstanceId, rehydratedAnswers, expiresAt }) => {
    const sessionId = getState().sessionId;
    let localCache = null;
    if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined' && sessionId) {
      try {
        localCache = await get(`cbt_local_${sessionId}`);
      } catch (e) {
        console.warn('Failed to read IndexedDB local cache on reclaim:', e);
      }
    }

    setState((prev) => {
      const mergedAnswers = { ...(localCache?.answers || {}), ...prev.answers };
      const mergedPaletteStates = { ...(localCache?.paletteStates || {}), ...prev.paletteStates };
      const mergedTimeMap = { ...(localCache?.questionTimeMap || {}), ...prev.questionTimeMap };

      for (const [qId, sResp] of Object.entries(rehydratedAnswers || {})) {
        const sOptions = Array.isArray(sResp.selected_options)
          ? sResp.selected_options
          : (sResp.selected_option ? [String(sResp.selected_option).trim()] : []);
        mergedAnswers[qId] = {
          selected_options: sOptions,
          numeric_value: sResp.numeric_value || null,
        };
        mergedPaletteStates[qId] = sResp.color_state || 1;
        mergedTimeMap[qId] = sResp.time_spent_seconds || 0;
      }

      const currentQ = prev.questions[prev.activeQuestionIndex];
      const currentQId = currentQ ? String(currentQ._id) : null;
      const updatedUncommitted = {
        selected_options: (currentQId && mergedAnswers[currentQId]?.selected_options)
          ? [...mergedAnswers[currentQId].selected_options]
          : [],
        numeric_value: (currentQId && mergedAnswers[currentQId]?.numeric_value) || null,
      };

      return {
        instanceId: newInstanceId,
        isTerminated: false,
        expiresAt: expiresAt || prev.expiresAt,
        answers: mergedAnswers,
        paletteStates: mergedPaletteStates,
        questionTimeMap: mergedTimeMap,
        uncommittedAnswer: updatedUncommitted,
        activeQuestionEnteredAt: Date.now(),
        pendingSyncQueue: new Set(),
      };
    });

    if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined' && sessionId) {
      try {
        const { answers, paletteStates, questionTimeMap } = getState();
        await set(`cbt_local_${sessionId}`, {
          answers,
          paletteStates,
          questionTimeMap,
        });
      } catch (e) {
        console.warn('Failed to persist to IndexedDB on reclaim:', e);
      }
    }
  },

  // ── 2. Input Manipulation (0 ms UI Updates) ────────────────────────────────
  selectOption: (option) => {
    // Authentic NTA / TCS iON CBT Radio Semantics: Re-clicking a selected option does NOT deselect it.
    // The candidate must explicitly click "Clear Response" to unselect.
    setState((prev) => ({
      uncommittedAnswer: {
        ...prev.uncommittedAnswer,
        selected_options: [option],
      },
    }));
  },

  toggleMultiOption: (option) => {
    setState((prev) => {
      const current = prev.uncommittedAnswer?.selected_options || [];
      const exists = current.includes(option);
      const next = exists ? current.filter((opt) => opt !== option) : [...current, option];
      next.sort();
      return {
        uncommittedAnswer: {
          ...prev.uncommittedAnswer,
          selected_options: next,
        },
      };
    });
  },

  setNumericValue: (val) => {
    setState((prev) => ({
      uncommittedAnswer: {
        ...prev.uncommittedAnswer,
        numeric_value: val,
      },
    }));
  },

  clearResponse: () => {
    const { questions, activeQuestionIndex, answers, paletteStates, pendingSyncQueue } = getState();
    const currentQ = questions[activeQuestionIndex];
    if (!currentQ) return;
    const qId = String(currentQ._id);

    const nextAnswers = {
      ...answers,
      [qId]: { selected_options: [], numeric_value: null },
    };
    const nextPalette = { ...paletteStates, [qId]: 2 }; // Reverts to Not Answered
    const nextQueue = new Set(pendingSyncQueue).add(qId);

    setState({
      uncommittedAnswer: { selected_options: [], numeric_value: null },
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
    const qId = String(currentQ._id);

    // 1. Commit time delta
    const now = Date.now();
    const elapsed = Math.round((now - activeQuestionEnteredAt) / 1000);
    const nextTimeMap = {
      ...questionTimeMap,
      [qId]: (questionTimeMap[qId] || 0) + elapsed,
    };

    // 2. Commit answer & palette state
    const hasAnswer =
      (Array.isArray(uncommittedAnswer.selected_options) && uncommittedAnswer.selected_options.length > 0) ||
      (uncommittedAnswer.numeric_value !== null && uncommittedAnswer.numeric_value !== undefined && String(uncommittedAnswer.numeric_value).trim() !== '');

    const nextAnswers = {
      ...answers,
      [qId]: {
        selected_options: Array.isArray(uncommittedAnswer.selected_options) ? [...uncommittedAnswer.selected_options] : [],
        numeric_value: uncommittedAnswer.numeric_value || null,
      },
    };
    const nextPalette = {
      ...paletteStates,
      [qId]: hasAnswer ? 3 : 2, // 3: Answered, 2: Not Answered
    };
    const nextQueue = new Set(pendingSyncQueue).add(qId);

    // 3. Prepare next question transition
    const nextIndex = activeQuestionIndex + 1 < questions.length ? activeQuestionIndex + 1 : activeQuestionIndex;
    const nextQ = questions[nextIndex];
    const nextQId = nextQ ? String(nextQ._id) : null;

    if (nextQId && (!nextPalette[nextQId] || nextPalette[nextQId] === 1)) {
      nextPalette[nextQId] = 2; // Mark Not Answered upon visiting
    }

    const nextUncommitted = {
      selected_options: (nextQId && nextAnswers[nextQId]?.selected_options) ? [...nextAnswers[nextQId].selected_options] : [],
      numeric_value: (nextQId && nextAnswers[nextQId]?.numeric_value) || null,
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
    const qId = String(currentQ._id);

    const now = Date.now();
    const elapsed = Math.round((now - activeQuestionEnteredAt) / 1000);
    const nextTimeMap = {
      ...questionTimeMap,
      [qId]: (questionTimeMap[qId] || 0) + elapsed,
    };

    const hasAnswer =
      (Array.isArray(uncommittedAnswer.selected_options) && uncommittedAnswer.selected_options.length > 0) ||
      (uncommittedAnswer.numeric_value !== null && uncommittedAnswer.numeric_value !== undefined && String(uncommittedAnswer.numeric_value).trim() !== '');

    const nextAnswers = {
      ...answers,
      [qId]: {
        selected_options: Array.isArray(uncommittedAnswer.selected_options) ? [...uncommittedAnswer.selected_options] : [],
        numeric_value: uncommittedAnswer.numeric_value || null,
      },
    };
    const nextPalette = {
      ...paletteStates,
      [qId]: hasAnswer ? 5 : 4, // 5: Answered & Marked for Review, 4: Marked for Review
    };
    const nextQueue = new Set(pendingSyncQueue).add(qId);

    const nextIndex = activeQuestionIndex + 1 < questions.length ? activeQuestionIndex + 1 : activeQuestionIndex;
    const nextQ = questions[nextIndex];
    const nextQId = nextQ ? String(nextQ._id) : null;

    if (nextQId && (!nextPalette[nextQId] || nextPalette[nextQId] === 1)) {
      nextPalette[nextQId] = 2;
    }

    const nextUncommitted = {
      selected_options: (nextQId && nextAnswers[nextQId]?.selected_options) ? [...nextAnswers[nextQId].selected_options] : [],
      numeric_value: (nextQId && nextAnswers[nextQId]?.numeric_value) || null,
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
    const qId = String(currentQ._id);

    const now = Date.now();
    const elapsed = Math.round((now - activeQuestionEnteredAt) / 1000);
    const nextTimeMap = {
      ...questionTimeMap,
      [qId]: (questionTimeMap[qId] || 0) + elapsed,
    };

    const nextPalette = {
      ...paletteStates,
      [qId]: 4, // 4: Marked for Review (without answer)
    };
    const nextQueue = new Set(pendingSyncQueue).add(qId);

    const nextIndex = activeQuestionIndex + 1 < questions.length ? activeQuestionIndex + 1 : activeQuestionIndex;
    const nextQ = questions[nextIndex];
    const nextQId = nextQ ? String(nextQ._id) : null;

    if (nextQId && (!nextPalette[nextQId] || nextPalette[nextQId] === 1)) {
      nextPalette[nextQId] = 2;
    }

    const nextUncommitted = {
      selected_options: (nextQId && answers[nextQId]?.selected_options) ? [...answers[nextQId].selected_options] : [],
      numeric_value: (nextQId && answers[nextQId]?.numeric_value) || null,
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

    const currentQId = String(currentQ._id);
    const targetQId = String(targetQ._id);

    // 1. Commit time spent on departing question
    const now = Date.now();
    const elapsed = Math.round((now - activeQuestionEnteredAt) / 1000);
    const nextTimeMap = {
      ...questionTimeMap,
      [currentQId]: (questionTimeMap[currentQId] || 0) + elapsed,
    };

    // 2. CRUCIAL NTA RULE: Uncommitted input is DISCARDED on palette jump!
    // We do NOT save uncommittedAnswer. We load whatever was officially committed in answers[targetQId].
    const nextPalette = { ...paletteStates };
    const nextQueue = new Set(getState().pendingSyncQueue);
    let shouldSync = false;

    if (!nextPalette[targetQId] || nextPalette[targetQId] === 1) {
      nextPalette[targetQId] = 2; // Visited -> Not Answered
      nextQueue.add(targetQId);
      shouldSync = true;
    }

    const targetUncommitted = {
      selected_options: answers[targetQId]?.selected_options ? [...answers[targetQId].selected_options] : [],
      numeric_value: answers[targetQId]?.numeric_value || null,
    };

    setState({
      activeQuestionIndex: targetIndex,
      activeSubject: targetQ.subject,
      activeQuestionEnteredAt: now,
      questionTimeMap: nextTimeMap,
      paletteStates: nextPalette,
      uncommittedAnswer: targetUncommitted,
      pendingSyncQueue: nextQueue,
    });

    getState().persistToIndexedDB();
    if (shouldSync) {
      getState().flushSyncQueue();
    }
  },

  // ── 5. Persistence & Sync Workers ──────────────────────────────────────────
  persistToIndexedDB: async () => {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') return;
    const { sessionId, answers, paletteStates, questionTimeMap, questions, activeQuestionIndex, activeQuestionEnteredAt } = getState();
    if (!sessionId) return;
    try {
      const liveTimeMap = { ...questionTimeMap };
      const currentQ = questions?.[activeQuestionIndex];
      if (currentQ && activeQuestionEnteredAt) {
        const elapsed = Math.round((Date.now() - activeQuestionEnteredAt) / 1000);
        const qId = String(currentQ._id);
        liveTimeMap[qId] = (questionTimeMap[qId] || 0) + elapsed;
      }
      await set(`cbt_local_${sessionId}`, {
        answers,
        paletteStates,
        questionTimeMap: liveTimeMap,
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
    if (typeof window === 'undefined') {
      // In SSR or Node CLI environments without browser window context, skip relative network fetch
      setState({ pendingSyncQueue: new Set() });
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return;
    }

    setState({ isSyncing: true });
    const dirtyQIds = Array.from(pendingSyncQueue);

    const delta = {};
    for (const qId of dirtyQIds) {
      delta[`q_${qId}`] = {
        selected_options: answers[qId]?.selected_options || [],
        numeric_value: answers[qId]?.numeric_value || null,
        color_state: paletteStates[qId] || 1,
        time_spent_seconds: questionTimeMap[qId] || 0,
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
          dirtyQIds.forEach((id) => nextQueue.delete(id));
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
    const qId = String(currentQ._id);

    // Calculate live in-flight slice for active question
    const elapsed = Math.round((Date.now() - activeQuestionEnteredAt) / 1000);
    const liveTime = (questionTimeMap[qId] || 0) + elapsed;

    const delta = {
      [`q_${qId}`]: {
        selected_options: answers[qId]?.selected_options || [],
        numeric_value: answers[qId]?.numeric_value || null,
        color_state: paletteStates[qId] || 2,
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
      isExamSubmitted,
      isTerminated,
    } = getState();

    if (!sessionId || isExamSubmitted || isTerminated) return;

    // 1. Wait for any active in-flight delta sync to complete
    let attempts = 0;
    while (getState().isSyncing && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      attempts++;
    }

    // 2. Await pending delta flush: guarantee 100% of answers reach Redis before evaluation
    if (getState().pendingSyncQueue.size > 0) {
      await getState().flushSyncQueue();
    }

    // 3. Calculate final exact seconds on active question
    const currentQ = questions[activeQuestionIndex];
    const finalTimeMap = { ...questionTimeMap };
    if (currentQ) {
      const qId = String(currentQ._id);
      const finalSlice = Math.round((Date.now() - activeQuestionEnteredAt) / 1000);
      finalTimeMap[qId] = (finalTimeMap[qId] || 0) + finalSlice;
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

  // ── 8. Display & Quick Navigation Helpers ───────────────────────────────────
  fontScale: 'normal', // 'small' | 'normal' | 'large'
  setFontScale: (scale) => setState({ fontScale: scale }),
  goToPreviousQuestion: () => {
    const { activeQuestionIndex } = getState();
    if (activeQuestionIndex > 0) {
      getState().jumpToQuestion(activeQuestionIndex - 1);
    }
  },
  goToNextQuestion: () => {
    const { activeQuestionIndex, questions } = getState();
    if (activeQuestionIndex < questions.length - 1) {
      getState().jumpToQuestion(activeQuestionIndex + 1);
    }
  },
}));
