import { getToken } from 'next-auth/jwt';
import redis from '@/utils/redis';
import clientPromise from '@/utils/mongodb';

export const dynamic = 'force-dynamic';

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
    const { paper_id, instance_id } = body;

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
        // Unpack existing question answers
        const rehydratedAnswers = {};
        for (const [key, val] of Object.entries(existing)) {
          if (key.startsWith('q_')) {
            const qNum = parseInt(key.replace('q_', ''), 10);
            try {
              rehydratedAnswers[qNum] = typeof val === 'string' ? JSON.parse(val) : val;
            } catch {
              rehydratedAnswers[qNum] = val;
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
      }
    }

    // 2. Fetch paper duration from MongoDB
    const client = await clientPromise;
    const db = client.db('jee_challenger_pyqs');
    const paper = await db.collection('papers').findOne(
      { $or: [{ paper_id }, { slug: paper_id }] },
      { projection: { duration_minutes: 1, title: 1, exam_type: 1 } }
    );

    const durationMinutes = paper?.duration_minutes || 180;
    const expiresAt = now + durationMinutes * 60 * 1000;

    // 3. Initialize fresh session hash in Redis with 5-hour TTL
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

    await redis.hset(sessionKey, initData);
    await redis.expire(sessionKey, 18000); // 5 hours TTL

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
