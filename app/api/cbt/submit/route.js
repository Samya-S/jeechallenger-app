import { getToken } from 'next-auth/jwt';
import redis from '@/utils/redis';
import { gradeAndPersistSubmission } from '@/server/cbt-judge';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return Response.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required. Please sign in to submit exam.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { session_id, instance_id, final_question_time_map } = body;

    if (!session_id) {
      return Response.json({ error: 'session_id is required' }, { status: 400 });
    }

    // 1. Fetch full in-flight session from Redis
    const sessionData = await redis.hgetall(session_id);
    if (!sessionData || Object.keys(sessionData).length === 0) {
      return Response.json({ error: 'Session not found or already submitted' }, { status: 404 });
    }

    // Concurrency sanity check
    if (instance_id && sessionData.active_instance_id && sessionData.active_instance_id !== instance_id) {
      return Response.json({ error: 'SESSION_REVOKED', message: 'Test was transferred to another device.' }, { status: 409 });
    }

    const paperId = sessionData.paper_id;
    const startedAt = Number(sessionData.started_at || Date.now());
    const submittedAt = Date.now();
    const timeTakenSeconds = Math.max(1, Math.round((submittedAt - startedAt) / 1000));

    // 2. Unpack responses from Redis and apply final time map
    const responses = {};
    for (const [key, val] of Object.entries(sessionData)) {
      if (key.startsWith('q_')) {
        const qNum = parseInt(key.replace('q_', ''), 10);
        let resp = null;
        try {
          resp = typeof val === 'string' ? JSON.parse(val) : val;
        } catch {
          resp = val;
        }
        if (resp) {
          responses[qNum] = resp;
        }
      }
    }

    // Merge exact final question time map
    if (final_question_time_map && typeof final_question_time_map === 'object') {
      for (const [qNumStr, sec] of Object.entries(final_question_time_map)) {
        const qNum = parseInt(qNumStr, 10);
        if (!responses[qNum]) {
          responses[qNum] = {
            selected_option: null,
            numeric_value: null,
            color_state: 2,
            time_spent_seconds: sec,
          };
        } else {
          responses[qNum].time_spent_seconds = sec;
        }
      }
    }

    // Determine user ID: authenticated MongoDB user or guest identifier
    const userId = token?.id ? new ObjectId(token.id) : new ObjectId();

    // 3. Run the Scoring Judge & write atomic scorecard to MongoDB Atlas
    const submission = await gradeAndPersistSubmission(userId, paperId, responses, {
      status: 'EVALUATED',
      started_at: startedAt,
      submitted_at: submittedAt,
      time_taken_seconds: timeTakenSeconds,
    });

    // 4. Mark session completed and delete temporary in-flight Redis cache
    await redis.del(session_id);

    // Resolve clean paper slug for human-readable results URL
    let paperSlug = paperId;
    try {
      const client = await clientPromise;
      const db = client.db('jee_challenger_pyqs');
      const paperDoc = await db.collection('papers').findOne(
        { $or: [{ paper_id: paperId }, { slug: paperId }] },
        { projection: { slug: 1 } }
      );
      if (paperDoc?.slug) {
        paperSlug = paperDoc.slug;
      }
    } catch {}

    return Response.json({
      success: true,
      submission_id: String(submission._id),
      total_score: submission.summary.total_score,
      max_marks: submission.summary.max_marks,
      accuracy_percentage: submission.summary.accuracy_percentage,
      redirect_url: `/mock-test/${paperSlug}/results?submission=${String(submission._id)}`,
    });
  } catch (error) {
    console.error('Failed to submit CBT exam:', error);
    return Response.json({ error: 'Failed to process submission: ' + error.message }, { status: 500 });
  }
}
