import assert from 'assert';

// Mock IndexedDB operations for Node CLI environment
const mockIndexedDB = new Map();
const mockIdbKeyval = {
  get: async (key) => mockIndexedDB.get(key) || null,
  set: async (key, val) => { mockIndexedDB.set(key, val); },
  del: async (key) => { mockIndexedDB.delete(key); },
};

// Mock fetch for background sync
let lastSyncPayload = null;
let mockSyncStatus = 200;
global.fetch = async (url, opts) => {
  lastSyncPayload = JSON.parse(opts.body);
  return {
    status: mockSyncStatus,
    ok: mockSyncStatus === 200,
    json: async () => ({ success: mockSyncStatus === 200, redirect_url: '/mock-test/results/123' }),
  };
};

// Import store
import { useCBTStore } from '../components/cbt/store/useCBTStore.js';

async function runGate2Tests() {
  console.log('====================================================');
  console.log('   RUNNING GATE 2: STATE MACHINE & SYNC SUITE       ');
  console.log('====================================================');

  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      passed++;
      console.log(`  [PASS] Test ${total}: ${name}`);
    } catch (err) {
      console.error(`  [FAIL] Test ${total}: ${name}`);
      console.error('         Error:', err.message);
      process.exit(1);
    }
  }

  async function testAsync(name, fn) {
    total++;
    try {
      await fn();
      passed++;
      console.log(`  [PASS] Test ${total}: ${name}`);
    } catch (err) {
      console.error(`  [FAIL] Test ${total}: ${name}`);
      console.error('         Error:', err.message);
      process.exit(1);
    }
  }

  const mockQuestions = [
    { question_number: 1, subject: 'Physics', question_type: 'MCQ', input_format: 'MCQ' },
    { question_number: 2, subject: 'Physics', question_type: 'MCQ', input_format: 'MCQ' },
    { question_number: 3, subject: 'Physics', question_type: 'NUMERIC', input_format: 'NUMERIC' },
  ];

  const mockPaper = {
    paper_id: 'TEST_PAPER',
    exam_type: 'JEE_MAIN',
    duration_minutes: 180,
  };

  // ── 1. Init Session Test ───────────────────────────────────────────────────
  await testAsync('Session Initialization primes Q1 to State 2 (Not Answered)', async () => {
    await useCBTStore.getState().initSession({
      paper: mockPaper,
      questions: mockQuestions,
      sessionData: {
        session_id: 'test_sess_1',
        paper_id: 'TEST_PAPER',
        server_now: Date.now(),
        expires_at: Date.now() + 10800000,
        rehydrated_answers: {},
      },
    });

    const state = useCBTStore.getState();
    assert.strictEqual(state.activeQuestionIndex, 0);
    assert.strictEqual(state.paletteStates[1], 2, 'Q1 must be state 2 (Not Answered upon visiting)');
    assert.strictEqual(state.answers[1], undefined, 'Q1 answers must be uncommitted initially');
  });

  // ── 2. Select Option & 0ms State ───────────────────────────────────────────
  test('Select option updates uncommittedAnswer synchronously in 0ms', () => {
    useCBTStore.getState().selectOption('B');
    const state = useCBTStore.getState();
    assert.strictEqual(state.uncommittedAnswer.selectedOption, 'B');
    assert.strictEqual(state.answers[1], undefined, 'answers[1] must NOT be committed yet');
  });

  // ── 3. Save & Next ─────────────────────────────────────────────────────────
  test('saveAndNext commits answer to state 3, records time, and advances to Q2', () => {
    useCBTStore.getState().saveAndNext();
    const state = useCBTStore.getState();

    // Q1 should now be committed
    assert.strictEqual(state.answers[1]?.selectedOption, 'B');
    assert.strictEqual(state.paletteStates[1], 3, 'Q1 must be State 3 (Answered)');

    // Active question should now be Q2 (index 1)
    assert.strictEqual(state.activeQuestionIndex, 1);
    assert.strictEqual(state.paletteStates[2], 2, 'Q2 must be marked State 2 (Not Answered upon visiting)');
    assert.strictEqual(state.uncommittedAnswer.selectedOption, null, 'Q2 uncommitted option must be clean');
  });

  // ── 4. Save & Mark for Review ──────────────────────────────────────────────
  test('saveAndMarkForReview commits answer to state 5 (Answered & Marked for Review)', () => {
    useCBTStore.getState().selectOption('A');
    useCBTStore.getState().saveAndMarkForReview();
    const state = useCBTStore.getState();

    assert.strictEqual(state.answers[2]?.selectedOption, 'A');
    assert.strictEqual(state.paletteStates[2], 5, 'Q2 must be State 5 (Answered & Marked for Review)');
    assert.strictEqual(state.activeQuestionIndex, 2, 'Should advance to Q3');
  });

  // ── 5. Numeric Input & Clear Response ──────────────────────────────────────
  test('setNumericValue and clearResponse on Q3', () => {
    useCBTStore.getState().setNumericValue('98.6');
    let state = useCBTStore.getState();
    assert.strictEqual(state.uncommittedAnswer.numericValue, '98.6');

    useCBTStore.getState().clearResponse();
    state = useCBTStore.getState();
    assert.strictEqual(state.uncommittedAnswer.numericValue, null);
    assert.strictEqual(state.paletteStates[3], 2, 'Must remain State 2 (Not Answered)');
  });

  // ── 6. The Unsaved Palette Jump Trait (Official NTA Rule) ───────────────────
  test('The Unsaved Palette Jump Trait: selecting option on Q3 and jumping to Q1 DISCARDS uncommitted answer', () => {
    // Student enters "55.5" on Q3
    useCBTStore.getState().setNumericValue('55.5');
    assert.strictEqual(useCBTStore.getState().uncommittedAnswer.numericValue, '55.5');

    // Student directly clicks Question 1 in the palette without clicking "Save & Next"
    useCBTStore.getState().jumpToQuestion(0);

    const state = useCBTStore.getState();
    assert.strictEqual(state.activeQuestionIndex, 0, 'Must jump to Q1');

    // Jump back to Q3 to inspect if the uncommitted "55.5" was discarded
    useCBTStore.getState().jumpToQuestion(2);
    const q3State = useCBTStore.getState();
    assert.ok(!q3State.answers[3]?.numericValue, 'Q3 committed answer must be empty or null');
    assert.strictEqual(q3State.uncommittedAnswer.numericValue, null, 'Uncommitted 55.5 must be discarded!');
    assert.strictEqual(q3State.paletteStates[3], 2, 'Q3 must remain State 2 (Not Answered)');
  });

  // ── 7. Multi-Device Concurrency & 409 Conflict ─────────────────────────────
  await testAsync('Multi-device concurrency: 409 Conflict sets isTerminated = true and stops sync', async () => {
    // Simulate server returning 409 Conflict (session claimed by another device)
    mockSyncStatus = 409;
    useCBTStore.setState({ pendingSyncQueue: new Set([1]), isSyncing: false });

    await useCBTStore.getState().flushSyncQueue();

    const state = useCBTStore.getState();
    assert.strictEqual(state.isTerminated, true, 'isTerminated must be set to true on 409 Conflict');

    // Subsequent heartbeat must immediately abort
    lastSyncPayload = null;
    await useCBTStore.getState().triggerHeartbeat();
    assert.strictEqual(lastSyncPayload, null, 'Heartbeat must not fire when terminated');
  });

  console.log('\n====================================================');
  console.log(`   GATE 2 VERIFICATION COMPLETE: ALL 7 TESTS PASSED!`);
  console.log('====================================================\n');
}

runGate2Tests().catch(err => {
  console.error('GATE 2 FAILED:', err);
  process.exit(1);
});
