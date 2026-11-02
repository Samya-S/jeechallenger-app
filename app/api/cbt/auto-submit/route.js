import { autoSubmitCbtSession } from '@/utils/cbt-auto-submit';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    // Optional secret verification to protect against unauthenticated trigger spam
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.INTERNAL_CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return Response.json({ error: 'UNAUTHORIZED', message: 'Invalid cron authorization secret.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { session_id } = body;

    if (!session_id) {
      return Response.json({ error: 'session_id is required' }, { status: 400 });
    }

    const result = await autoSubmitCbtSession(session_id);
    return Response.json(result);
  } catch (error) {
    console.error('Failed to auto-submit expired CBT exam:', error);
    return Response.json({ error: 'Auto-submit failed: ' + error.message }, { status: 500 });
  }
}
