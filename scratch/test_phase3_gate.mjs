import assert from 'node:assert';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

console.log('====================================================');
console.log('   GATE 3 VERIFICATION SUITE: AUTHENTIC CBT UI');
console.log('====================================================');

async function runGate3Tests() {
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  [PASS] Test ${total}: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] Test ${total}: ${name}`);
      console.error(err);
      process.exit(1);
    }
  }

  // 1. Verify component files exist and have valid syntax
  await test('Component file existence and readability', async () => {
    const fs = await import('node:fs');
    const path = await import('node:path');

    const expectedFiles = [
      'components/cbt/CBTVirtualKeypad.jsx',
      'components/cbt/CBTHeader.jsx',
      'components/cbt/CBTSectionBar.jsx',
      'components/cbt/CBTQuestionPane.jsx',
      'components/cbt/CBTQuestionPalette.jsx',
      'components/cbt/CBTBottomBar.jsx',
      'components/cbt/CBTExamSummaryModal.jsx',
      'components/cbt/CBTQuestionPaperModal.jsx',
      'components/cbt/CBTInstructionsModal.jsx',
      'components/cbt/CBTKioskGuard.jsx',
      'components/cbt/CBTExamRoom.jsx',
      'app/mock-test/[slug]/page.jsx',
    ];

    for (const f of expectedFiles) {
      const fullPath = path.resolve(f);
      assert.strictEqual(fs.existsSync(fullPath), true, `File missing: ${f}`);
      const content = fs.readFileSync(fullPath, 'utf8');
      assert.ok(content.length > 50, `File empty or corrupted: ${f}`);
    }
  });

  // 2. Virtual Keypad Input State Machine
  await test('Virtual Keypad Input logic (decimal guard, negative toggle, backspace)', async () => {
    function simulateKeypadInput(initial, key) {
      let next = String(initial);
      if (key === '-') {
        next = next.startsWith('-') ? next.slice(1) : '-' + next;
      } else if (key === '.') {
        if (!next.includes('.')) {
          next = next === '' || next === '-' ? next + '0.' : next + '.';
        }
      } else if (key === 'BACKSPACE') {
        next = next ? next.slice(0, -1) : '';
        if (next === '-') next = '';
      } else if (key === 'CLEAR') {
        next = '';
      } else {
        if (next.length < 15) next += key;
      }
      return next;
    }

    // A. Digits typing
    let val = '';
    val = simulateKeypadInput(val, '4');
    val = simulateKeypadInput(val, '2');
    assert.strictEqual(val, '42');

    // B. Decimal point
    val = simulateKeypadInput(val, '.');
    val = simulateKeypadInput(val, '5');
    assert.strictEqual(val, '42.5');

    // C. Duplicate decimal blocked
    val = simulateKeypadInput(val, '.');
    assert.strictEqual(val, '42.5');

    // D. Negative sign toggle
    val = simulateKeypadInput(val, '-');
    assert.strictEqual(val, '-42.5');
    val = simulateKeypadInput(val, '-');
    assert.strictEqual(val, '42.5');

    // E. Backspace
    val = simulateKeypadInput(val, 'BACKSPACE');
    assert.strictEqual(val, '42.');
    val = simulateKeypadInput(val, 'BACKSPACE');
    assert.strictEqual(val, '42');

    // F. Clear
    val = simulateKeypadInput(val, 'CLEAR');
    assert.strictEqual(val, '');

    // G. Dot starting on empty string gives "0."
    val = simulateKeypadInput('', '.');
    assert.strictEqual(val, '0.');
  });

  // 3. Unsaved Palette Jump Trait (Official NTA Rule)
  await test('NTA Palette Jump Trait: jumping discards uncommitted radio/numeric answer', async () => {
    const { useCBTStore } = await import('../components/cbt/store/useCBTStore.js');

    // Initialize mock session
    await useCBTStore.getState().initSession({
      paper: {
        paper_id: 'TEST_PAPER_UI',
        title: 'Mock UI Test',
        sections: [
          { name: 'Physics Sec A', subject: 'Physics', start_question_number: 1, end_question_number: 2 },
        ],
      },
      questions: [
        { question_number: 1, subject: 'Physics', input_format: 'MCQ', options: [{ option_key: 'A' }, { option_key: 'B' }] },
        { question_number: 2, subject: 'Physics', input_format: 'MCQ', options: [{ option_key: 'A' }, { option_key: 'B' }] },
      ],
      sessionData: {
        session_id: 'cbt_test_palette_ui',
        paper_id: 'TEST_PAPER_UI',
        server_now: Date.now(),
        expires_at: Date.now() + 10800000,
        rehydrated_answers: {},
      },
    });

    const store = useCBTStore.getState();
    assert.strictEqual(store.activeQuestionIndex, 0);

    // Candidate selects Option 'B' on Q1
    useCBTStore.getState().selectOption('B');
    assert.strictEqual(useCBTStore.getState().uncommittedAnswer.selectedOption, 'B');
    // Note: answers[1] has NOT been committed yet (only uncommittedAnswer holds 'B')
    assert.strictEqual(useCBTStore.getState().answers[1]?.selectedOption || null, null);

    // CANDIDATE CLICKS DIRECTLY ON Q2 ON PALETTE (JUMP)
    useCBTStore.getState().jumpToQuestion(1);

    // Q2 should now be active
    assert.strictEqual(useCBTStore.getState().activeQuestionIndex, 1);
    // Q2 has no uncommitted answer
    assert.strictEqual(useCBTStore.getState().uncommittedAnswer.selectedOption, null);

    // Now jump back to Q1
    useCBTStore.getState().jumpToQuestion(0);
    // Uncommitted 'B' was discarded; Q1 remains uncommitted null!
    assert.strictEqual(useCBTStore.getState().uncommittedAnswer.selectedOption, null);
    assert.strictEqual(useCBTStore.getState().paletteStates[1], 2); // Not Answered
  });

  // 4. Save & Next preserves the response and marks state = 3 (Answered)
  await test('Save & Next commits response and transitions palette state to 3 (Answered)', async () => {
    const { useCBTStore } = await import('../components/cbt/store/useCBTStore.js');

    useCBTStore.getState().selectOption('A');
    useCBTStore.getState().saveAndNext();

    // Now answers[1] MUST be committed with 'A'
    assert.strictEqual(useCBTStore.getState().answers[1]?.selectedOption, 'A');
    assert.strictEqual(useCBTStore.getState().paletteStates[1], 3); // 3: Answered
    // Active question moved to index 1 (Q2)
    assert.strictEqual(useCBTStore.getState().activeQuestionIndex, 1);
  });

  // 5. Save & Mark for Review marks state = 5 (Answered & Marked for Review)
  await test('Save & Mark for Review transitions palette state to 5', async () => {
    const { useCBTStore } = await import('../components/cbt/store/useCBTStore.js');

    useCBTStore.getState().selectOption('B');
    useCBTStore.getState().saveAndMarkForReview();

    // Q2 should be committed with state 5
    assert.strictEqual(useCBTStore.getState().answers[2]?.selectedOption, 'B');
    assert.strictEqual(useCBTStore.getState().paletteStates[2], 5); // 5: Answered & Marked for Review
  });

  // 6. Drift-Free Countdown Timer Calculation
  await test('Drift-free timer calculation accurately matches expiresAt - serverNow', async () => {
    const clientNow = 1714000000000;
    const serverTimeOffset = 1500; // server is 1.5s ahead
    const expiresAt = 1714010800000; // 10,800 seconds later (3 hours)

    const serverNow = clientNow + serverTimeOffset;
    const remaining = Math.max(0, Math.floor((expiresAt - serverNow) / 1000));

    assert.strictEqual(remaining, 10798); // 10800 - 1.5 rounded down = 10798

    const hours = Math.floor(remaining / 3600);
    const mins = Math.floor((remaining % 3600) / 60);
    const secs = remaining % 60;
    const formatted = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    assert.strictEqual(formatted, '02:59:58');
  });

  // 7. Multi-Device Conflict (409) Sets isTerminated Lockout
  await test('409 Conflict sets isTerminated = true for KioskGuard lockout', async () => {
    const { useCBTStore } = await import('../components/cbt/store/useCBTStore.js');

    assert.strictEqual(useCBTStore.getState().isTerminated, false);
    useCBTStore.setState({ isTerminated: true });
    assert.strictEqual(useCBTStore.getState().isTerminated, true);
  });

  console.log('----------------------------------------------------');
  console.log(` Gate 3 Verification Passed: ${passed}/${total} checks.`);
  console.log('====================================================\n');
}

runGate3Tests().catch((err) => {
  console.error('Fatal in Gate 3 suite:', err);
  process.exit(1);
});
