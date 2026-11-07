import { getToken } from 'next-auth/jwt';
import redis from '@/utils/redis';
import { pyqsService } from '@/server/services/pyqs';

export const dynamic = 'force-dynamic';

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

    // Ownership check: session key must belong to authenticated user
    const expectedPrefix = `cbt:session:${token.id}:`;
    if (!session_id.startsWith(expectedPrefix)) {
      return Response.json({ error: 'FORBIDDEN', message: 'You do not own this exam session.' }, { status: 403 });
    }

    // 1. Fetch full in-flight session from Redis
    const sessionData = await redis.hgetall(session_id);
    if (!sessionData || Object.keys(sessionData).length === 0) {
      return Response.json({ error: 'Session not found or already submitted' }, { status: 404 });
    }

    // Defense-in-depth: verify stored user_id matches authenticated token
    if (sessionData.user_id && sessionData.user_id !== token.id) {
      return Response.json({ error: 'FORBIDDEN', message: 'You do not own this exam session.' }, { status: 403 });
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

    // 3. Delegate evaluation to Go microservice via unified service
    const submission = await pyqsService.submitExam({
      userId: token.id,
      payload: {
        paper_id: paperId,
        started_at: new Date(startedAt).toISOString(),
        submitted_at: new Date(submittedAt).toISOString(),
        time_taken_seconds: timeTakenSeconds,
        status: 'MANUAL_SUBMISSION',
        responses,
      },
    });

    // 4. Mark session completed and delete temporary in-flight Redis cache & expiring set
    await Promise.all([
      redis.del(session_id),
      redis.zrem('cbt:expiring_sessions', session_id),
    ]);

    const paperSlug = submission.paper_slug;
    if (!paperSlug) {
      throw new Error('Microservice response missing required paper_slug field');
    }

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
