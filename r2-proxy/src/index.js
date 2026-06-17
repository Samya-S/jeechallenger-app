// Helper to decode hex signature
function hexToBuffer(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

async function verifySignature(request, env) {
  const url = new URL(request.url);
  const signature = url.searchParams.get("sig");
  const expires = url.searchParams.get("exp");
  const secret = env.SECRET_KEY;

  if (!secret) return false; // Fail safe if key isn't set
  if (!signature || !expires) return false;

  // 1. Check Expiry
  if (Date.now() / 1000 > parseInt(expires)) return false;

  // 2. Verify Signature
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
  );
  
  const data = `${url.pathname.slice(1)}:${expires}`;
  return await crypto.subtle.verify("HMAC", key, hexToBuffer(signature), encoder.encode(data));
}

const r2ProxyWorker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Crucial: CORS Headers so Next.js can fetch the API without browser errors
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
      "Access-Control-Max-Age": "86400",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/' || url.pathname === '') {
      return new Response("JEE Challenger PYQS Proxy Live", { status: 200, headers: corsHeaders });
    }

    // ==========================================
    // 1. List Papers API Endpoints (Cached for 1 hour to protect R2)
    // ==========================================
    if (url.pathname.toLowerCase().startsWith('/api/')) {
      
      // Strict Routing: Case-insensitive exact matches (with or without a trailing slash)
      let prefix = "";
      if (url.pathname.toLowerCase() === '/api/jee-main' || url.pathname.toLowerCase() === '/api/jee-main/') {
        prefix = 'jee-main/data/';
      } else if (url.pathname.toLowerCase() === '/api/jee-advanced' || url.pathname.toLowerCase() === '/api/jee-advanced/') {
        prefix = 'jee-advanced/data/';
      } else {
        // Kill any garbage API requests immediately
        return new Response("API Route Not Found", { status: 404, headers: corsHeaders });
      }

      // Try to serve API from cache first!
      // Force the cache key to use the lowercase path to prevent duplicate cache entries
      const cacheUrlForApi = new URL(request.url);
      cacheUrlForApi.pathname = url.pathname.toLowerCase(); 
      const apiCacheKey = new Request(cacheUrlForApi.toString(), request);

      let apiResponse = null;
      try { apiResponse = await cache.match(apiCacheKey); } catch (e) { /* Bypass */ }
      if (apiResponse) return apiResponse;

      try {
        const listed = await env.PYQS.list({ prefix });
        const papers = listed.objects.map(obj => obj.key);
        
        apiResponse = new Response(JSON.stringify({ papers }), {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=3600' // Cache this list for 1 hour
          },
        });
        
        try { ctx.waitUntil(cache.put(apiCacheKey, apiResponse.clone())); } catch (e) { /* Bypass */ }
        return apiResponse;
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // ==========================================
    // 2. Auth Gate for Files (Check before cache)
    // ==========================================
    const isAuthorized = await verifySignature(request, env);
    if (!isAuthorized) {
        return new Response("Unauthorized", { status: 403, headers: corsHeaders });
    }

    // ==========================================
    // 3. Cache Logic for Files
    // ==========================================
    const cacheUrl = new URL(request.url);
    cacheUrl.search = ""; // Sanitize: Ignore query params for cache key
    const fileCacheKey = new Request(cacheUrl.toString(), request);

    let fileResponse = null;
    try { fileResponse = await cache.match(fileCacheKey); } catch (e) { /* Bypass */ }
    if (fileResponse) return fileResponse;

    // ==========================================
    // 4. Fetch from R2 (if Cache Miss)
    // ==========================================
    const key = url.pathname.slice(1); // Removes the leading '/'

    try {
      const object = await env.PYQS.get(key);

      if (object === null) {
        return new Response("Object Not Found", { status: 404, headers: corsHeaders });
      }

      const contentType = object.httpMetadata.contentType ||
        (key.endsWith('.json') ? 'application/json' : 'image/png');

      fileResponse = new Response(object.body, {
        headers: {
          ...corsHeaders, 
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable', // Cache files for 1 year
        },
      });

      // Save to cache in the background
      try { ctx.waitUntil(cache.put(fileCacheKey, fileResponse.clone())); } catch (e) { /* Bypass */ }

      return fileResponse;
    } catch (e) {
      return new Response("Error fetching object", { status: 500, headers: corsHeaders });
    }
  },
};

export default r2ProxyWorker;