import redis from '@/utils/redis';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { session_id, instance_id, delta } = body;

    if (!session_id || !instance_id) {
      return Response.json({ error: 'session_id and instance_id are required' }, { status: 400 });
    }

    // 1. Fetch current active lease from Redis
    const sessionMeta = await redis.hmget(session_id, 'active_instance_id', 'status', 'expires_at');
    const activeInstanceId = sessionMeta?.active_instance_id;
    const status = sessionMeta?.status;

    if (status && status !== 'IN_PROGRESS') {
      return Response.json({ error: 'SESSION_TERMINATED', message: 'Test has already been submitted.' }, { status: 410 });
    }

    // 2. Concurrency Check: If instance ID doesn't match, this device was revoked!
    if (activeInstanceId && activeInstanceId !== instance_id) {
      return Response.json(
        {
          error: 'SESSION_REVOKED',
          message: 'Exam was transferred to another device. You cannot continue this test simultaneously.',
        },
        { status: 409 }
      );
    }

    // 3. Write delta fields to Redis
    const updates = {
      last_heartbeat: Date.now(),
    };

    if (delta && typeof delta === 'object') {
      for (const [key, val] of Object.entries(delta)) {
        // key is typically "q_14"
        updates[key] = typeof val === 'string' ? val : JSON.stringify(val);
      }
    }

    await redis.hset(session_id, updates);

    return Response.json({ success: true, updated_at: Date.now() });
  } catch (error) {
    console.error('Failed to sync CBT delta:', error);
    return Response.json({ error: 'Failed to sync delta: ' + error.message }, { status: 500 });
  }
}
