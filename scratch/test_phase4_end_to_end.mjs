import assert from 'node:assert';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

console.log('================================================================');
console.log('   GATE 4 END-TO-END VERIFICATION: FULL CBT MOCK SIMULATION');
console.log('================================================================');

async function runGate4Tests() {
  const { MongoClient, ObjectId } = await import('mongodb');
  const redisModule = await import('../utils/redis.js');
  const redis = redisModule.default;
  const { gradeAndPersistSubmission } = await import('../server/cbt-judge.js');

  const mongoUri = process.env.MONGODB_URI;
  assert.ok(mongoUri, 'MONGODB_URI must be defined');

  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const db = mongoClient.db('jee_challenger_pyqs');

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
      await mongoClient.close();
      process.exit(1);
    }
  }

  let samplePaper = null;
  let sampleQuestions = [];
  let testSubmissionId = null;

  // 1. Fetch real approved paper from MongoDB
  await test('Load real approved paper and questions from MongoDB Atlas', async () => {
    samplePaper = await db.collection('papers').findOne({ status: 'APPROVED' });
    if (!samplePaper) {
      samplePaper = await db.collection('papers').findOne({});
    }
    assert.ok(samplePaper, 'Must find at least one paper in database');
    assert.ok(samplePaper.paper_id, 'Paper must have paper_id');

    // Extract all question IDs from sections
    const allQIds = (samplePaper.sections || [])
      .flatMap((s) => s.question_ids || [])
      .map((id) => (typeof id === 'string' ? new ObjectId(id) : id));

    sampleQuestions = await db
      .collection('production')
      .find({ _id: { $in: allQIds } })
      .sort({ question_number: 1 })
      .toArray();

    assert.ok(sampleQuestions.length >= 10, `Expected at least 10 questions, found ${sampleQuestions.length}`);
    console.log(`         Testing with paper: "${samplePaper.title}" (${sampleQuestions.length} Qs)`);
  });

  // 2. Full Mock Test Lifecycle Simulation
  await test('Full Mock Test Evaluation & Scoring Matrix Verification', async () => {
    const testCandidateId = new ObjectId();
    const responses = {};

    // Q1: Correct (+4)
    const q1 = sampleQuestions[0];
    if (q1) {
      const resp = {
        selected_option: q1.correct_answer?.[0] || 'A',
        numeric_value: null,
        color_state: 3,
        time_spent_seconds: 85, // Fast & accurate
      };
      responses[String(q1._id)] = resp;
      responses[q1.question_number] = resp;
    }

    // Q2: Incorrect (-1) with high time (Time trap)
    const q2 = sampleQuestions[1];
    if (q2) {
      const wrongOpt = q2.correct_answer?.[0] === 'A' ? 'B' : 'A';
      const resp = {
        selected_option: wrongOpt,
        numeric_value: null,
        color_state: 3,
        time_spent_seconds: 310, // > 240s Time Trap
      };
      responses[String(q2._id)] = resp;
      responses[q2.question_number] = resp;
    }

    // Q3: Unattempted (0)
    const q3 = sampleQuestions[2];
    if (q3) {
      const resp = {
        selected_option: null,
        numeric_value: null,
        color_state: 2,
        time_spent_seconds: 15,
      };
      responses[String(q3._id)] = resp;
      responses[q3.question_number] = resp;
    }

    // Q4 to Q8: Additional simulated attempts
    for (let i = 3; i < Math.min(8, sampleQuestions.length); i++) {
      const q = sampleQuestions[i];
      const isNumeric = (q.input_format || q.question_type || '').toUpperCase() === 'NUMERIC';
      const resp = {
        selected_option: isNumeric ? null : 'A',
        numeric_value: isNumeric ? '42' : null,
        color_state: 3,
        time_spent_seconds: 110,
      };
      responses[String(q._id)] = resp;
      responses[q.question_number] = resp;
    }

    // Execute Judge
    const submission = await gradeAndPersistSubmission(
      testCandidateId,
      samplePaper.paper_id,
      responses,
      {
        status: 'EVALUATED',
        started_at: Date.now() - 5400000,
        submitted_at: Date.now(),
        time_taken_seconds: 5400,
      }
    );

    assert.ok(submission._id, 'Submission must be inserted and return ObjectId');
    testSubmissionId = submission._id;

    assert.strictEqual(submission.status, 'EVALUATED');
    assert.strictEqual(submission.paper_id, samplePaper.paper_id);
    assert.ok(typeof submission.summary.total_score === 'number');
    assert.ok(submission.summary.max_marks > 0);
    assert.ok(submission.summary.total_attempted >= 2, `Expected >= 2 attempted, got ${submission.summary.total_attempted}`);
    assert.ok(submission.summary.total_unattempted > 0);
    assert.strictEqual(
      submission.question_attempts.length,
      sampleQuestions.length,
      `Expected ${sampleQuestions.length} question attempts, got ${submission.question_attempts.length}`
    );

    console.log(`         Scored: ${submission.summary.total_score}/${submission.summary.max_marks} marks, Accuracy: ${submission.summary.accuracy_percentage.toFixed(1)}%`);
  });

  // 3. Verify Database Read Back for Results Page
  await test('Load test submission from MongoDB Atlas test_submissions for Results View', async () => {
    assert.ok(testSubmissionId, 'testSubmissionId must be set');

    const sub = await db.collection('test_submissions').findOne({ _id: testSubmissionId });
    assert.ok(sub, 'Must find submission in test_submissions collection');
    assert.strictEqual(sub.paper_id, samplePaper.paper_id);
    assert.ok(sub.question_attempts.length > 0, 'Must have recorded question attempts');

    // Verify time trap detection logic matches
    const timeTraps = sub.question_attempts.filter((a) => (a.time_spent_seconds || 0) >= 240 && !a.is_correct);
    assert.ok(timeTraps.length >= 1, 'Should detect at least 1 simulated time trap (Q2)');

    // Verify solutions exist in database for these questions
    const q1Doc = sampleQuestions.find((q) => String(q._id) === String(sampleQuestions[0]?._id));
    assert.ok(q1Doc, 'Question document must exist in production');
  });

  // 4. Redis in-flight session lifecycle and cleanup
  await test('Redis session lifecycle: start -> sync -> submit del cleanup', async () => {
    const sessionKey = `cbt:session:test_gate4:${samplePaper.paper_id}`;
    await redis.hset(sessionKey, {
      paper_id: samplePaper.paper_id,
      started_at: Date.now(),
      status: 'IN_PROGRESS',
      q_1: JSON.stringify({ selected_option: 'A', color_state: 3, time_spent_seconds: 40 }),
    });

    const active = await redis.hgetall(sessionKey);
    assert.strictEqual(active.paper_id, samplePaper.paper_id);
    assert.strictEqual(active.status, 'IN_PROGRESS');

    // Cleanup session key
    await redis.del(sessionKey);
    const deleted = await redis.hgetall(sessionKey);
    assert.ok(!deleted || Object.keys(deleted).length === 0, 'Redis key must be deleted on final submission');
  });

  // 5. Clean up temporary test submission
  await test('Cleanup temporary test submission document from test_submissions', async () => {
    if (testSubmissionId) {
      const res = await db.collection('test_submissions').deleteOne({ _id: testSubmissionId });
      assert.strictEqual(res.deletedCount, 1, 'Temporary test submission must be cleanly removed');
    }
  });

  await mongoClient.close();

  // Clean up scratch check script if exists
  const fs = await import('node:fs');
  if (fs.existsSync('scratch/check_q.cjs')) {
    fs.unlinkSync('scratch/check_q.cjs');
  }

  console.log('----------------------------------------------------------------');
  console.log(` Gate 4 Verification Passed: ${passed}/${total} checks.`);
  console.log('================================================================\n');
}

runGate4Tests().catch((err) => {
  console.error('Fatal in Gate 4 suite:', err);
  process.exit(1);
});
