import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  return handleRevalidate(req);
}

export async function GET(req) {
  return handleRevalidate(req);
}

async function handleRevalidate(req) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');
    const expectedSecret = process.env.REVALIDATION_SECRET;

    if (!expectedSecret || secret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let paths = [];

    // 1. Support paths via query parameters
    const queryPath = url.searchParams.get('path');
    const queryPaths = url.searchParams.get('paths');
    if (queryPath) paths.push(queryPath);
    if (queryPaths) {
      paths.push(...queryPaths.split(',').map((p) => p.trim()).filter(Boolean));
    }

    // 2. Support paths via JSON body if POST
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        if (body?.path && typeof body.path === 'string') paths.push(body.path);
        if (Array.isArray(body?.paths)) {
          paths.push(...body.paths.filter((p) => typeof p === 'string' && p.trim()));
        }
      } catch {
        // Empty or non-JSON body is acceptable if paths are in query string
      }
    }

    // Deduplicate
    paths = Array.from(new Set(paths));

    if (paths.length === 0) {
      return Response.json({ error: 'Missing path or paths parameter' }, { status: 400 });
    }

    // Purge cache for each path
    for (const path of paths) {
      revalidatePath(path);
    }

    return Response.json({
      revalidated: true,
      paths,
      now: Date.now(),
    });
  } catch (error) {
    console.error('[pyqs-revalidate] Error:', error);
    return Response.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
