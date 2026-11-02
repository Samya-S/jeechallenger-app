import { getToken } from 'next-auth/jwt';
import redis from '@/utils/redis';
import { autoSubmitCbtSession } from '@/utils/cbt-auto-submit';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return Response.json(
        { error: 'UNAUTHORIZED', message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const paper_id = searchParams.get('paper_id');
    if (!paper_id) {
      return Response.json({ error: 'paper_id is required' }, { status: 400 });
    }

    const userId = token.id;
    const sessionKey = `cbt:session:${userId}:${paper_id}`;
    const existing = await redis.hgetall(sessionKey);
    const now = Date.now();

    if (existing && Object.keys(existing).length > 0 && existing.status === 'IN_PROGRESS') {
      const expiresAt = Number(existing.expires_at);
      if (now < expiresAt) {
        return Response.json({
          has_active_session: true,
          session_id: sessionKey,
          paper_id,
          expires_at: expiresAt,
          duration_minutes: Number(existing.duration_minutes || 180),
          started_at: Number(existing.started_at),
        });
      } else {
        // Defensive Lazy Auto-Submit Guard: Exam expired while candidate was away
        try {
          await autoSubmitCbtSession(sessionKey, existing);
        } catch (e) {
          console.warn('Lazy auto-submit in GET session/start failed:', e);
          await redis.del(sessionKey);
          await redis.zrem('cbt:expiring_sessions', sessionKey);
        }
      }
    }

    return Response.json({ has_active_session: false });
  } catch (error) {
    console.error('Failed to check CBT session status:', error);
    return Response.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return Response.json(
        {
          error: 'UNAUTHORIZED',
          message: 'Authentication required. Please sign in to take a CBT mock test.',
          redirect_url: '/login',
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { paper_id, paper_slug, instance_id } = body;

    if (!paper_id) {
      return Response.json({ error: 'paper_id is required' }, { status: 400 });
    }
    if (!instance_id) {
      return Response.json({ error: 'instance_id is required' }, { status: 400 });
    }

    const userId = token.id;
    const sessionKey = `cbt:session:${userId}:${paper_id}`;

    // 1. Check if an active session already exists in Redis
    const existing = await redis.hgetall(sessionKey);
    const now = Date.now();

    if (existing && Object.keys(existing).length > 0 && existing.status === 'IN_PROGRESS') {
      const expiresAt = Number(existing.expires_at);

      // Check if session has already expired
      if (now < expiresAt) {
        // Active session exists!
        // Unpack existing question answers strictly by Question ID
        const rehydratedAnswers = {};
        for (const [key, val] of Object.entries(existing)) {
          if (key.startsWith('q_')) {
            const qId = key.replace('q_', '');
            try {
              rehydratedAnswers[qId] = typeof val === 'string' ? JSON.parse(val) : val;
            } catch {
              rehydratedAnswers[qId] = val;
            }
          }
        }

        const isSameInstance = existing.active_instance_id === instance_id;

        return Response.json({
          session_id: sessionKey,
          paper_id,
          server_now: now,
          expires_at: expiresAt,
          duration_minutes: Number(existing.duration_minutes || 180),
          is_resumed: true,
          active_instance_id: existing.active_instance_id,
          is_same_instance: isSameInstance,
          rehydrated_answers: rehydratedAnswers,
        });
      } else {
        // Defensive Lazy Auto-Submit Guard: Exam expired while candidate was away
        try {
          await autoSubmitCbtSession(sessionKey, existing);
        } catch (err) {
          console.error('Lazy auto-submit failed during session start POST:', err);
          await redis.del(sessionKey);
          await redis.zrem('cbt:expiring_sessions', sessionKey);
        }
      }
    }

    // 2. Fetch paper duration from Go microservice
    const BACKEND_URL = process.env.PYQS_API_URL || 'https://pyqs-api.jeechallenger.com';
    let durationMinutes = 180;
    try {
      const pRes = await fetch(`${BACKEND_URL}/papers/${paper_slug}`, { cache: 'no-store' });
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData?.data?.duration_minutes) {
          durationMinutes = pData.data.duration_minutes;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch paper duration from microservice:', err);
    }

    const expiresAt = now + durationMinutes * 60 * 1000;

    // 3. Initialize fresh session hash in Redis with 5-hour TTL
    // Explicitly delete any prior hash to ensure zero question answer leakage
    await redis.del(sessionKey);

    const initData = {
      started_at: now,
      expires_at: expiresAt,
      duration_minutes: durationMinutes,
      active_instance_id: instance_id,
      last_heartbeat: now,
      status: 'IN_PROGRESS',
      user_id: userId,
      paper_id,
    };

    await Promise.all([
      redis.hset(sessionKey, initData),
      redis.expire(sessionKey, 18000), // 5 hours TTL
      redis.zadd('cbt:expiring_sessions', { score: expiresAt, member: sessionKey }),
    ]);

    return Response.json({
      session_id: sessionKey,
      paper_id,
      server_now: now,
      expires_at: expiresAt,
      duration_minutes: durationMinutes,
      is_resumed: false,
      active_instance_id: instance_id,
      is_same_instance: true,
      rehydrated_answers: {},
    });
  } catch (error) {
    console.error('Failed to start/resume CBT session:', error);
    return Response.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}
