export const config = { runtime: 'edge' };

export default async function(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors(req) });
  }

  var url = new URL(req.url);
  var path = url.pathname.replace(/^\/api\/proxy/, '') || '/';

  if (path === '/') {
    return new Response('{"status":"ok"}', { headers: { ...cors(req), 'Content-Type': 'application/json' } });
  }

  var target = 'https://wyapi.toubiec.cn' + path;

  try {
    var opts = { method: req.method, headers: { 'Content-Type': 'application/json' } };
    if (req.method === 'POST') {
      opts.body = await req.text();
    }

    var resp = await fetch(target, opts);
    var text = await resp.text();

    return new Response(text, {
      status: resp.status,
      headers: { ...cors(req), 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...cors(req), 'Content-Type': 'application/json' }
    });
  }
}

function cors(req) {
  return {
    'Access-Control-Allow-Origin': req.headers.get('Origin') || 'null',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
