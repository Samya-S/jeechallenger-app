import { getToken } from 'next-auth/jwt';
import redis from '@/utils/redis';

export const dynamic = 'force-dynamic';

// In-memory burst rate limiter: Max 1 transfer attempt per 5 seconds per user
// Completely prevents DevTools script bombardment from consuming Upstash Redis free tier quota
const userTransferCooldown = new Map();

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return Response.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required to transfer exam session.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { session_id, new_instance_id } = body;

    if (!session_id || !new_instance_id) {
      return Response.json({ error: 'session_id and new_instance_id are required' }, { status: 400 });
    }

    // Ownership check: session key must belong to authenticated user
    const expectedPrefix = `cbt:session:${token.id}:`;
    if (!session_id.startsWith(expectedPrefix)) {
      return Response.json({ error: 'FORBIDDEN', message: 'You do not own this exam session.' }, { status: 403 });
    }

    // Fast in-memory burst throttle before touching Redis (protects Upstash daily quota)
    const now = Date.now();
    const lastTransferAt = userTransferCooldown.get(token.id) || 0;
    if (now - lastTransferAt < 5000) {
      return Response.json(
        { error: 'TOO_MANY_REQUESTS', message: 'Please wait a moment before requesting another session transfer.' },
        { status: 429 }
      );
    }
    userTransferCooldown.set(token.id, now);

    // Prune stale entries if map grows
    if (userTransferCooldown.size > 500) {
      for (const [uid, ts] of userTransferCooldown.entries()) {
        if (now - ts > 60000) userTransferCooldown.delete(uid);
      }
    }

    const sessionData = await redis.hgetall(session_id);
    if (!sessionData || Object.keys(sessionData).length === 0) {
      return Response.json({ error: 'Session not found or expired' }, { status: 404 });
    }

    if (sessionData.status && sessionData.status !== 'IN_PROGRESS') {
      return Response.json({ error: 'SESSION_TERMINATED', message: 'Exam has already been finalized.' }, { status: 410 });
    }

    // Atomically transfer active lease to new instance in Redis
    await redis.hset(session_id, {
      active_instance_id: new_instance_id,
      last_heartbeat: Date.now(),
    });

    // Extract all question answers for the new device
    const rehydratedAnswers = {};
    for (const [key, val] of Object.entries(sessionData)) {
      if (key.startsWith('q_')) {
        const qId = key.replace('q_', '');
        try {
          rehydratedAnswers[qId] = typeof val === 'string' ? JSON.parse(val) : val;
        } catch {
          rehydratedAnswers[qId] = val;
        }
      }
    }

    return Response.json({
      success: true,
      active_instance_id: new_instance_id,
      expires_at: Number(sessionData.expires_at),
      duration_minutes: Number(sessionData.duration_minutes || 180),
      rehydrated_answers: rehydratedAnswers,
    });
  } catch (error) {
    console.error('Failed to transfer session lease:', error);
    return Response.json({ error: 'Failed to transfer lease: ' + error.message }, { status: 500 });
  }
}
