import redis from '@/utils/redis';
import { gradeAndPersistSubmission } from '@/server/cbt-judge';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { session_id } = body;

    if (!session_id) {
      return Response.json({ error: 'session_id is required' }, { status: 400 });
    }

    // 1. Fetch in-flight session from Redis
    const sessionData = await redis.hgetall(session_id);
    if (!sessionData || Object.keys(sessionData).length === 0 || sessionData.status !== 'IN_PROGRESS') {
      // Idempotent: already submitted or expired
      return Response.json({ success: true, message: 'Session already finalized or does not exist.' });
    }

    const paperId = sessionData.paper_id;
    const startedAt = Number(sessionData.started_at || Date.now());
    const submittedAt = Date.now();
    const timeTakenSeconds = Math.max(1, Math.round((submittedAt - startedAt) / 1000));

    // 2. Unpack in-flight answers from Redis
    const responses = {};
    for (const [key, val] of Object.entries(sessionData)) {
      if (key.startsWith('q_')) {
        const qId = key.replace('q_', '');
        let resp = null;
        try {
          resp = typeof val === 'string' ? JSON.parse(val) : val;
        } catch {
          resp = val;
        }
        if (resp) {
          responses[qId] = resp;
        }
      }
    }

    // Parse user ID
    let userId;
    try {
      if (sessionData.user_id && ObjectId.isValid(sessionData.user_id)) {
        userId = new ObjectId(sessionData.user_id);
      } else {
        userId = new ObjectId();
      }
    } catch {
      userId = new ObjectId();
    }

    // 3. Run the Scoring Judge & write completed document to MongoDB
    const submission = await gradeAndPersistSubmission(userId, paperId, responses, {
      status: 'AUTO_SUBMITTED_TIME_EXPIRED',
      started_at: startedAt,
      submitted_at: submittedAt,
      time_taken_seconds: timeTakenSeconds,
    });

    // 4. Delete temporary Redis hash
    await redis.del(session_id);

    return Response.json({
      success: true,
      submission_id: String(submission._id),
      status: 'AUTO_SUBMITTED_TIME_EXPIRED',
    });
  } catch (error) {
    console.error('Failed to auto-submit expired CBT exam:', error);
    return Response.json({ error: 'Auto-submit failed: ' + error.message }, { status: 500 });
  }
}
