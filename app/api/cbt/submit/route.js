import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';
import redis from '@/utils/redis';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

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

    // Merge exact final question time map
    if (final_question_time_map && typeof final_question_time_map === 'object') {
      for (const [qId, sec] of Object.entries(final_question_time_map)) {
        if (!responses[qId]) {
          responses[qId] = {
            selected_options: [],
            numeric_value: null,
            color_state: 2,
            time_spent_seconds: sec,
          };
        } else {
          responses[qId].time_spent_seconds = sec;
        }
      }
    }

    // 3. Delegate evaluation and persistence exclusively to Go microservice
    const signedToken = jwt.sign(
      { id: token.id },
      process.env.NEXTAUTH_SECRET,
      { algorithm: 'HS256' }
    );

    const submitRes = await fetch(`${BACKEND_URL}/cbt/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${signedToken}`,
      },
      body: JSON.stringify({
        paper_id: paperId,
        started_at: new Date(startedAt).toISOString(),
        submitted_at: new Date(submittedAt).toISOString(),
        time_taken_seconds: timeTakenSeconds,
        status: 'MANUAL_SUBMISSION',
        responses,
      }),
    });

    if (!submitRes.ok) {
      const errData = await submitRes.json().catch(() => ({}));
      throw new Error(errData.error || `Microservice evaluation failed with status ${submitRes.status}`);
    }

    const json = await submitRes.json();
    const submission = json?.data;
    if (!submission) {
      throw new Error('Invalid response structure received from evaluation microservice');
    }

    // 4. Mark session completed and delete temporary in-flight Redis cache
    await redis.del(session_id);

    const paperSlug = submission.paper_slug || paperId;

    return Response.json({
      success: true,
      submission_id: String(submission._id),
      total_score: submission.summary?.total_score ?? 0,
      max_marks: submission.summary?.max_marks ?? 300,
      accuracy_percentage: submission.summary?.accuracy_percentage ?? 0,
      redirect_url: `/mock-test/${paperSlug}/results?submission=${String(submission._id)}`,
    });
  } catch (error) {
    console.error('Failed to submit CBT exam:', error);
    return Response.json({ error: 'Failed to process submission: ' + error.message }, { status: 500 });
  }
}
