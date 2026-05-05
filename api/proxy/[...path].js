module.exports = async function(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || 'null');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  var API = 'https://wyapi.toubiec.cn';

  // 从URL路径提取API路径: /api/proxy/api/music/detail -> /api/music/detail
  var path = req.url.replace(/^\/api\/proxy/, '') || '/';

  if (path === '/') {
    res.status(200).json({ status: 'ok' });
    return;
  }

  var target = API + path;

  try {
    var fetch = (await import('node-fetch')).default;
    var options = { method: req.method, headers: { 'Content-Type': 'application/json' } };

    if (req.method === 'POST') {
      // 读取body
      var body = '';
      if (typeof req.body === 'object') {
        body = JSON.stringify(req.body);
      } else if (typeof req.body === 'string') {
        body = req.body;
      }
      options.body = body;
    }

    var response = await fetch(target, options);
    var text = await response.text();
    res.status(response.status).setHeader('Content-Type', 'application/json').end(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
