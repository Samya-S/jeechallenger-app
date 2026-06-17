const r2ProxyWorker = {
  async fetch(request, env) {
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

    // ==========================================
    // 1. List Papers
    // ==========================================

    if (url.pathname === '/api/jee-main') {
      try {
        const listed = await env.PYQS.list({ prefix: 'jee-main/data/' });
        const papers = listed.objects.map(obj => obj.key);
        return new Response(JSON.stringify({ papers }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/jee-advanced') {
      try {
        const listed = await env.PYQS.list({ prefix: 'jee-advanced/data/' });
        const papers = listed.objects.map(obj => obj.key);
        return new Response(JSON.stringify({ papers }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    // ==========================================
    // 2. Fetch Files & Images
    // ==========================================

    const key = url.pathname.slice(1); // Removes the leading '/'

    if (!key) {
      // Changed to 200 so you can verify the worker is alive by just visiting the root URL
      return new Response("JEE Challenger PYQS Proxy Live", { status: 200, headers: corsHeaders });
    }

    try {
      const object = await env.PYQS.get(key);

      if (object === null) {
        return new Response("Object Not Found", { status: 404, headers: corsHeaders });
      }

      // Automatically determine Content-Type (Your original logic perfectly preserved)
      const contentType = object.httpMetadata.contentType ||
        (key.endsWith('.json') ? 'application/json' : 'image/png');

      return new Response(object.body, {
        headers: {
          ...corsHeaders, // Inject CORS into image/json responses too
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (e) {
      return new Response("Error fetching object", { status: 500, headers: corsHeaders });
    }
  },
};

export default r2ProxyWorker;