import { autoSubmitCbtSession } from '@/utils/cbt-auto-submit';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    // Enforce fail-closed machine-to-machine authentication (Cloudflare Worker cron sweeper)
    const cronSecret = process.env.INTERNAL_CRON_SECRET;
    if (!cronSecret) {
      console.error('[CBT Auto-Submit] CRITICAL: INTERNAL_CRON_SECRET is not configured on the server.');
      return Response.json(
        { success: false, error: 'SERVER_MISCONFIGURED', message: 'Internal cron authorization is not configured.' },
        { status: 500 }
      );
    }

    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return Response.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Invalid cron authorization secret.' },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { session_id } = body;

    if (!session_id) {
      return Response.json({ success: false, error: 'BAD_REQUEST', message: 'session_id is required' }, { status: 400 });
    }

    const result = await autoSubmitCbtSession(session_id);
    return Response.json(result);
  } catch (error) {
    console.error('Failed to auto-submit expired CBT exam:', error);
    return Response.json({ success: false, error: 'INTERNAL_SERVER_ERROR', message: 'Auto-submit failed: ' + error.message }, { status: 500 });
  }
}
