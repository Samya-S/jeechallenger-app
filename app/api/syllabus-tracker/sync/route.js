import { getSession } from "@/lib/auth";
import { syllabusTrackerService } from "@/server/services/syllabus-tracker";

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ success: false, error: "UNAUTHORIZED", message: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const progress = await syllabusTrackerService.getProgress(session.user.id);

    return new Response(JSON.stringify({ progress }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching syllabus progress:", error);
    return new Response(JSON.stringify({ success: false, error: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ success: false, error: "UNAUTHORIZED", message: "Unauthorized" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { progress } = body;

    if (!progress) {
      return new Response(JSON.stringify({ success: false, error: "BAD_REQUEST", message: "Progress data is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await syllabusTrackerService.updateProgress(session.user.id, progress);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error updating syllabus progress:", error);
    return new Response(JSON.stringify({ success: false, error: "INTERNAL_SERVER_ERROR", message: "Internal Server Error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
