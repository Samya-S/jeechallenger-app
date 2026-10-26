import redis from '@/utils/redis';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const { session_id, new_instance_id } = body;

    if (!session_id || !new_instance_id) {
      return Response.json({ error: 'session_id and new_instance_id are required' }, { status: 400 });
    }

    const sessionData = await redis.hgetall(session_id);
    if (!sessionData || Object.keys(sessionData).length === 0) {
      return Response.json({ error: 'Session not found or expired' }, { status: 404 });
    }

    // Update active lease to new instance
    await redis.hset(session_id, {
      active_instance_id: new_instance_id,
      last_heartbeat: Date.now(),
    });

    // Extract all question answers for the new device
    const rehydratedAnswers = {};
    for (const [key, val] of Object.entries(sessionData)) {
      if (key.startsWith('q_')) {
        const qNum = parseInt(key.replace('q_', ''), 10);
        try {
          rehydratedAnswers[qNum] = typeof val === 'string' ? JSON.parse(val) : val;
        } catch {
          rehydratedAnswers[qNum] = val;
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
