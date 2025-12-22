const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4173;
const BASE_DIR = path.join(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function safeJoin(base, target) {
  const targetPath = path.join(base, target);
  if (!targetPath.startsWith(base)) {
    return null;
  }
  return targetPath;
}

function send(res, statusCode, content, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(content);
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const relativePath = urlPath === '/' ? '/index.html' : urlPath;
  const filePath = safeJoin(BASE_DIR, relativePath);

  if (!filePath) {
    send(res, 400, 'Bad Request');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      send(res, 404, 'Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        send(res, 500, 'Internal Server Error');
        return;
      }

      send(res, 200, data, { 'Content-Type': mimeType });
    });
  });
});

server.listen(PORT, () => {
  console.log(`Prototype preview running at http://localhost:${PORT}/`);
});
