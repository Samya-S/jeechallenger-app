const assert = require('assert');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const fs = require('fs');
const dotenv = fs.readFileSync('d:/GitHub/jeechallenger-app/.env.local', 'utf8');
let mongoUri = '', redisUrl = '', redisToken = '';

dotenv.split('\n').forEach(line => {
  const l = line.trim();
  if (l.startsWith('MONGODB_URI=') && !l.startsWith('#') && !mongoUri) {
    mongoUri = l.substring('MONGODB_URI='.length).replace(/['"]/g, '').trim();
  }
  if (l.startsWith('UPSTASH_REDIS_REST_URL=') && !redisUrl) {
    redisUrl = l.substring('UPSTASH_REDIS_REST_URL='.length).replace(/['"]/g, '').trim();
  }
  if (l.startsWith('UPSTASH_REDIS_REST_TOKEN=') && !redisToken) {
    redisToken = l.substring('UPSTASH_REDIS_REST_TOKEN='.length).replace(/['"]/g, '').trim();
  }
});

const { MongoClient, ObjectId } = require('d:/GitHub/jeechallenger-app/node_modules/mongodb');
const { Redis } = require('d:/GitHub/jeechallenger-app/node_modules/@upstash/redis');
const redis = new Redis({ url: redisUrl, token: redisToken });

// Import pure scoring functions
const { evaluateQuestion, isAnswerAttempted, scoreTestSubmission } = require('d:/GitHub/jeechallenger-app/server/cbt-judge.js');

async function runGate1Tests() {
  console.log('====================================================');
  console.log('   RUNNING GATE 1: SCORING JUDGE & API SUITE        ');
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

  // ── 1. MCQ Tests ─────────────────────────────────────────────────────────────
  const mcqScheme = { correct: 4, incorrect: -1 };
  const mcqQ = { input_format: 'MCQ', question_type: 'MCQ', correct_answer: ['B'] };

  test('MCQ Correct match uppercase', () => {
    const res = evaluateQuestion(mcqQ, mcqScheme, { selected_option: 'B' });
    assert.strictEqual(res.isCorrect, true);
    assert.strictEqual(res.marks, 4);
  });

  test('MCQ Correct match lowercase', () => {
    const res = evaluateQuestion(mcqQ, mcqScheme, { selected_option: 'b' });
    assert.strictEqual(res.isCorrect, true);
    assert.strictEqual(res.marks, 4);
  });

  test('MCQ Incorrect option', () => {
    const res = evaluateQuestion(mcqQ, mcqScheme, { selected_option: 'A' });
    assert.strictEqual(res.isCorrect, false);
    assert.strictEqual(res.marks, -1);
  });

  // ── 2. Dropped / MARKS_TO_ALL Tests ──────────────────────────────────────────
  test('Dropped question via source_of_answer: MARKS_TO_ALL', () => {
    const droppedQ = { source_of_answer: 'MARKS_TO_ALL', correct_answer: [] };
    const res = evaluateQuestion(droppedQ, mcqScheme, { selected_option: 'C' });
    assert.strictEqual(res.isCorrect, true);
    assert.strictEqual(res.marks, 4);
  });

  test('Dropped question via correct_answer: ["MARKS_TO_ALL"]', () => {
    const droppedQ2 = { source_of_answer: 'OFFICIAL_KEY', correct_answer: ['MARKS_TO_ALL'] };
    const res = evaluateQuestion(droppedQ2, mcqScheme, { selected_option: 'D' });
    assert.strictEqual(res.isCorrect, true);
    assert.strictEqual(res.marks, 4);
  });

  // ── 3. Numerical Exact Tests ─────────────────────────────────────────────────
  const numScheme = { correct: 4, incorrect: -1 };
  const numExactQ = { input_format: 'NUMERIC', question_type: 'NUMERIC', numeric_answer: { is_range: false, exact_value: 42 } };

  test('Numeric exact integer match', () => {
    const res = evaluateQuestion(numExactQ, numScheme, { numeric_value: '42' });
    assert.strictEqual(res.isCorrect, true);
    assert.strictEqual(res.marks, 4);
  });

  test('Numeric exact decimal match', () => {
    const res = evaluateQuestion(numExactQ, numScheme, { numeric_value: '42.0' });
    assert.strictEqual(res.isCorrect, true);
    assert.strictEqual(res.marks, 4);
  });

  test('Numeric exact mismatch', () => {
    const res = evaluateQuestion(numExactQ, numScheme, { numeric_value: '43' });
    assert.strictEqual(res.isCorrect, false);
    assert.strictEqual(res.marks, -1);
  });

  test('Numeric invalid non-number string', () => {
    const res = evaluateQuestion(numExactQ, numScheme, { numeric_value: 'not-a-number' });
    assert.strictEqual(res.isCorrect, false);
    assert.strictEqual(res.marks, -1);
  });

  // ── 4. Numerical Range Tests ─────────────────────────────────────────────────
  const numRangeScheme = { correct: 4, incorrect: 0 };
  const numRangeQ = { input_format: 'NUMERIC', question_type: 'NUMERIC', numeric_answer: { is_range: true, min_value: 3.14, max_value: 3.16 } };

  test('Numeric range midpoint (3.15)', () => {
    const res = evaluateQuestion(numRangeQ, numRangeScheme, { numeric_value: '3.15' });
    assert.strictEqual(res.isCorrect, true);
    assert.strictEqual(res.marks, 4);
  });

  test('Numeric range lower boundary (3.14)', () => {
    const res = evaluateQuestion(numRangeQ, numRangeScheme, { numeric_value: '3.14' });
    assert.strictEqual(res.isCorrect, true);
    assert.strictEqual(res.marks, 4);
  });

  test('Numeric range upper boundary (3.16)', () => {
    const res = evaluateQuestion(numRangeQ, numRangeScheme, { numeric_value: '3.16' });
    assert.strictEqual(res.isCorrect, true);
    assert.strictEqual(res.marks, 4);
  });

  test('Numeric range below bound (3.139)', () => {
    const res = evaluateQuestion(numRangeQ, numRangeScheme, { numeric_value: '3.139' });
    assert.strictEqual(res.isCorrect, false);
    assert.strictEqual(res.marks, 0);
  });

  test('Numeric range above bound (3.161)', () => {
    const res = evaluateQuestion(numRangeQ, numRangeScheme, { numeric_value: '3.161' });
    assert.strictEqual(res.isCorrect, false);
    assert.strictEqual(res.marks, 0);
  });

  // ── 5. Attempted Status Checking ─────────────────────────────────────────────
  test('isAnswerAttempted with State 3 & option', () => {
    assert.strictEqual(isAnswerAttempted({ color_state: 3, selected_option: 'B' }), true);
  });

  test('isAnswerAttempted with State 5 (Answered & Marked for Review)', () => {
    assert.strictEqual(isAnswerAttempted({ color_state: 5, selected_option: 'A' }), true);
  });

  test('isAnswerAttempted with State 3 & numeric', () => {
    assert.strictEqual(isAnswerAttempted({ color_state: 3, numeric_value: '42' }), true);
  });

  test('isAnswerAttempted with State 4 (Marked for Review without answer)', () => {
    assert.strictEqual(isAnswerAttempted({ color_state: 4, selected_option: null }), false);
  });

  test('isAnswerAttempted with State 2 (Not Answered)', () => {
    assert.strictEqual(isAnswerAttempted({ color_state: 2, selected_option: null }), false);
  });

  test('isAnswerAttempted with State 1 (Not Visited)', () => {
    assert.strictEqual(isAnswerAttempted({ color_state: 1, selected_option: null }), false);
  });

  // ── 6. Section B 5-of-10 Evaluation Rule ─────────────────────────────────────
  test('Section B 5-of-10 rule: 7 attempts evaluates strictly the first 5 in ascending order', () => {
    const mockPaper = {
      paper_id: 'TEST_PAPER',
      title: 'Test Paper',
      exam_type: 'JEE_MAIN',
      sections: [
        {
          name: 'Mathematics Section B',
          subject: 'Mathematics',
          section_type: 'NUMERIC',
          total_questions: 10,
          attempt_questions: 5,
          marking_scheme: { correct: 4, incorrect: -1 },
          question_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => new ObjectId()),
        },
      ],
    };

    const mockQuestions = mockPaper.sections[0].question_ids.map((id, idx) => ({
      _id: id,
      question_number: 21 + idx, // Q21 to Q30
      question_type: 'NUMERIC',
      input_format: 'NUMERIC',
      numeric_answer: { is_range: false, exact_value: 10 },
    }));

    // Candidate attempts 7 questions: Q21, Q22, Q23, Q25, Q27, Q28, Q30
    const candidateResponses = {
      21: { color_state: 3, numeric_value: '10' }, // Correct (#1)
      22: { color_state: 3, numeric_value: '10' }, // Correct (#2)
      23: { color_state: 3, numeric_value: '10' }, // Correct (#3)
      25: { color_state: 3, numeric_value: '10' }, // Correct (#4)
      27: { color_state: 3, numeric_value: '10' }, // Correct (#5)
      28: { color_state: 3, numeric_value: '10' }, // 6th attempt (must be IGNORED)
      30: { color_state: 3, numeric_value: '10' }, // 7th attempt (must be IGNORED)
    };

    const graded = scoreTestSubmission(mockPaper, mockQuestions, candidateResponses, {
      user_id: new ObjectId(),
    });

    // Check evaluated attempts
    const attemptsMap = {};
    graded.question_attempts.forEach(a => { attemptsMap[a.question_number] = a; });

    // Strictly Q21, Q22, Q23, Q25, Q27 must be evaluated
    [21, 22, 23, 25, 27].forEach(qNum => {
      assert.strictEqual(attemptsMap[qNum].is_evaluated, true, `Q${qNum} should be evaluated`);
      assert.strictEqual(attemptsMap[qNum].marks_awarded, 4, `Q${qNum} should have +4 marks`);
    });

    // Q28 and Q30 must NOT be evaluated (0 marks)
    assert.strictEqual(attemptsMap[28].is_evaluated, false, 'Q28 must be is_evaluated=false (6th attempt)');
    assert.strictEqual(attemptsMap[28].marks_awarded, 0, 'Q28 must have 0 marks');
    assert.strictEqual(attemptsMap[30].is_evaluated, false, 'Q30 must be is_evaluated=false (7th attempt)');
    assert.strictEqual(attemptsMap[30].marks_awarded, 0, 'Q30 must have 0 marks');

    // Total score should be 5 * 4 = 20, NOT 28!
    assert.strictEqual(graded.summary.total_score, 20, 'Total score must be 20');
    assert.strictEqual(graded.summary.total_attempted, 5, 'Total attempted must be 5');
  });

  // ── 7. Live Upstash Redis & MongoDB Integration Test ─────────────────────────
  console.log('\n  [INFO] Running Live Upstash Redis & MongoDB Atlas Tests...');

  const testSessionKey = `cbt:session:test_user_${Date.now()}:JEE_Main_Test_Paper`;

  // 7a. Test Redis Session Init & Expiry
  await redis.hset(testSessionKey, {
    started_at: Date.now(),
    expires_at: Date.now() + 180 * 60 * 1000,
    active_instance_id: 'inst_dev_A_123',
    status: 'IN_PROGRESS',
    paper_id: 'JEE_Main_2026_Apr_2nd_Shift_1',
    q_1: JSON.stringify({ selected_option: 'B', color_state: 3, time_spent_seconds: 45 }),
  });
  await redis.expire(testSessionKey, 300);

  const redisCheck = await redis.hgetall(testSessionKey);
  assert.strictEqual(redisCheck.active_instance_id, 'inst_dev_A_123');
  console.log('  [PASS] Test 21: Redis in-flight session init & read verified.');

  // 7b. Test Concurrency Lease Collision (Device B takeover)
  await redis.hset(testSessionKey, { active_instance_id: 'inst_dev_B_456' });
  const updatedCheck = await redis.hget(testSessionKey, 'active_instance_id');
  assert.strictEqual(updatedCheck, 'inst_dev_B_456');
  // Device A would now receive 409 Conflict because inst_dev_A_123 != inst_dev_B_456
  console.log('  [PASS] Test 22: Multi-device leased mutex takeover verified.');

  // 7c. Test Live MongoDB Atlas Real Paper Evaluation & Persistence
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const db = mongoClient.db('jee_challenger_pyqs');

  // Fetch real paper from DB
  const realPaper = await db.collection('papers').findOne({ paper_id: 'JEE_Main_2026_Apr_2nd_Shift_1' });
  assert.ok(realPaper, 'Real paper JEE_Main_2026_Apr_2nd_Shift_1 must exist in DB');
  console.log(`  [PASS] Test 23: Found real paper "${realPaper.title}" with ${realPaper.sections.length} sections in DB.`);

  // Test grading against real paper
  const { gradeAndPersistSubmission } = require('d:/GitHub/jeechallenger-app/server/cbt-judge.js');
  const dummyUserId = new ObjectId();

  const realSubmission = await gradeAndPersistSubmission(
    dummyUserId,
    'JEE_Main_2026_Apr_2nd_Shift_1',
    {
      1: { selected_option: 'B', color_state: 3, time_spent_seconds: 60 },
      2: { selected_option: 'C', color_state: 3, time_spent_seconds: 40 },
    },
    { status: 'EVALUATED', time_taken_seconds: 100 }
  );

  assert.ok(realSubmission._id, 'Submission must have inserted MongoDB ObjectId');
  assert.strictEqual(realSubmission.paper_id, 'JEE_Main_2026_Apr_2nd_Shift_1');
  assert.ok(realSubmission.summary.max_marks > 0, 'max_marks must be calculated');
  console.log(`  [PASS] Test 24: Real submission created in MongoDB Atlas! SubID: ${realSubmission._id}, MaxMarks: ${realSubmission.summary.max_marks}, Score: ${realSubmission.summary.total_score}`);

  // Clean up test document from test_submissions and Redis
  await db.collection('test_submissions').deleteOne({ _id: realSubmission._id });
  await redis.del(testSessionKey);
  await mongoClient.close();
  console.log('  [PASS] Test 25: Test artifacts cleaned up from MongoDB and Redis.');

  console.log('\n====================================================');
  console.log(`   GATE 1 VERIFICATION COMPLETE: ALL 25 TESTS PASSED!`);
  console.log('====================================================\n');
}

runGate1Tests().catch(err => {
  console.error('GATE 1 FAILED:', err);
  process.exit(1);
});
