// Volume and Capacity Worker (Cloudflare Workers + Static Assets)
function json(body, init = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'not_found' }, { status: 404 });
    }
    return env.ASSETS.fetch(request);
  },
};
