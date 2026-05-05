module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  var API = 'https://wyapi.toubiec.cn';
  var path = req.url.replace(/^\/api\/proxy/, '') || '/';

  if (path === '/') {
    res.status(200).json({ status: 'ok' });
    return;
  }

  var target = API + path;

  try {
    var options = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (req.method === 'POST') {
      if (typeof req.body === 'object') {
        options.body = JSON.stringify(req.body);
      } else if (typeof req.body === 'string') {
        options.body = req.body;
      }
    }

    var response = await fetch(target, options);
    var text = await response.text();

    res.status(response.status);
    res.setHeader('Content-Type', 'application/json');
    res.end(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
