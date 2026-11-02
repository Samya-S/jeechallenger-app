import redis from '@/utils/redis';
import jwt from 'jsonwebtoken';

const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';

/**
 * Auto-submits an in-flight CBT test session to the Go microservice
 * and cleans up its Redis hash and expiring_sessions sorted set.
 *
 * Safe and idempotent: if session does not exist or status !== 'IN_PROGRESS', returns cleanly.
 */
export async function autoSubmitCbtSession(sessionId, existingSessionData = null) {
  if (!sessionId) {
    throw new Error('sessionId is required for auto-submit');
  }

  // 1. Fetch in-flight session data if not provided
  const sessionData = existingSessionData || (await redis.hgetall(sessionId));
  if (!sessionData || Object.keys(sessionData).length === 0 || sessionData.status !== 'IN_PROGRESS') {
    // Idempotent: already finalized, deleted, or does not exist
    await redis.zrem('cbt:expiring_sessions', sessionId);
    return { success: true, message: 'Session already finalized or does not exist.' };
  }

  const paperId = sessionData.paper_id;
  const startedAt = Number(sessionData.started_at || Date.now());
  const submittedAt = Date.now();
  const timeTakenSeconds = Math.max(1, Math.round((submittedAt - startedAt) / 1000));

  // 2. Unpack in-flight answers from Redis strictly by Question ID
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

  const userId = sessionData.user_id;
  if (!userId) {
    throw new Error('Session user_id is missing');
  }

  // 3. Delegate evaluation to Go microservice using internal signed JWT
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

  // 4. Atomically purge Redis in-flight hash and remove from expiring sessions set
  await Promise.all([
    redis.del(sessionId),
    redis.zrem('cbt:expiring_sessions', sessionId),
  ]);

  return {
    success: true,
    submission_id: String(submission._id),
    status: 'AUTO_SUBMITTED_TIME_EXPIRED',
    data: submission,
  };
}
