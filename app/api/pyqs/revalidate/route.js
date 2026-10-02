import { revalidatePath, revalidateTag } from 'next/cache';

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
    let tags = [];

    // 1. Support paths and tags via query parameters
    const queryPath = url.searchParams.get('path');
    const queryPaths = url.searchParams.get('paths');
    if (queryPath) paths.push(queryPath);
    if (queryPaths) {
      paths.push(...queryPaths.split(',').map((p) => p.trim()).filter(Boolean));
    }

    const queryTag = url.searchParams.get('tag');
    const queryTags = url.searchParams.get('tags');
    if (queryTag) tags.push(queryTag);
    if (queryTags) {
      tags.push(...queryTags.split(',').map((t) => t.trim()).filter(Boolean));
    }

    // 2. Support paths and tags via JSON body if POST
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        if (body?.path && typeof body.path === 'string') paths.push(body.path);
        if (Array.isArray(body?.paths)) {
          paths.push(...body.paths.filter((p) => typeof p === 'string' && p.trim()));
        }
        if (body?.tag && typeof body.tag === 'string') tags.push(body.tag);
        if (Array.isArray(body?.tags)) {
          tags.push(...body.tags.filter((t) => typeof t === 'string' && t.trim()));
        }
      } catch {
        // Empty or non-JSON body is acceptable if paths are in query string
      }
    }

    // Deduplicate
    paths = Array.from(new Set(paths));
    tags = Array.from(new Set(tags));

    if (paths.length === 0 && tags.length === 0) {
      return Response.json({ error: 'Missing path, paths, tag, or tags parameter' }, { status: 400 });
    }

    // Purge cache for each path
    for (const path of paths) {
      // Revalidate both exact path and with explicit 'page' type for dynamic segments
      revalidatePath(path, 'page');
      revalidatePath(path);

      if (path.startsWith('/question/')) {
        revalidatePath('/question/[slug]', 'page');
        const slug = path.replace(/^\/question\//, '').trim();
        if (slug) tags.push(`question-${slug}`);
      } else if (path.startsWith('/paper/')) {
        revalidatePath('/paper/[slug]', 'page');
        const slug = path.replace(/^\/paper\//, '').trim();
        if (slug) tags.push(`paper-${slug}`);
      }
    }

    // Invalidate Data Cache for all resolved tags
    const revalidatedTags = Array.from(new Set(tags));
    for (const tag of revalidatedTags) {
      try {
        revalidateTag(tag);
      } catch (err) {
        console.warn(`[pyqs-revalidate] Warning: Failed to revalidate tag ${tag}:`, err.message);
      }
    }

    return Response.json({
      revalidated: true,
      paths,
      tags: revalidatedTags,
      now: Date.now(),
    });
  } catch (error) {
    console.error('[pyqs-revalidate] Error:', error);
    return Response.json({ error: 'Failed to revalidate' }, { status: 500 });
  }
}
