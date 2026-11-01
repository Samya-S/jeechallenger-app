import redis from '@/utils/redis';
import jwt from 'jsonwebtoken';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

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

    // 3. Delegate auto-submit evaluation to Go microservice
    const userId = sessionData.user_id;
    if (!userId) {
      return Response.json({ error: 'Session user_id is missing' }, { status: 400 });
    }

    const signedToken = jwt.sign(
      { id: userId },
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
        status: 'AUTO_SUBMITTED_TIME_EXPIRED',
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
