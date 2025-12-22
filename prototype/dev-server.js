const http = require('http');
const path = require('path');
const fs = require('fs');
const { promises: fsp } = require('fs');

const PORT = parseInt(process.env.PORT, 10) || 4173;
const rootDir = process.cwd();

async function getMarkdownFiles() {
  const entries = await fsp.readdir(rootDir);
  return entries.filter((name) => name.toLowerCase().endsWith('.md')).sort();
}

async function serveIndex(res) {
  try {
    const markdownFiles = await getMarkdownFiles();
    const links = markdownFiles
      .map(
        (file) =>
          `<li><a href="/${encodeURIComponent(file)}" aria-label="Open ${file}">${file}</a></li>`
      )
      .join('');

    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Guidebook Wiki Planning Docs</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; padding: 2rem; background: #f7f7f7; }
      main { max-width: 720px; margin: 0 auto; background: white; padding: 1.5rem 1.75rem; border-radius: 12px; box-shadow: 0 10px 35px rgba(0,0,0,0.08); }
      h1 { font-size: 1.6rem; margin-top: 0; }
      ul { padding-left: 1.2rem; }
      li { margin: 0.35rem 0; }
      code { background: #f0f0f0; padding: 0.1rem 0.35rem; border-radius: 4px; }
    </style>
  </head>
  <body>
    <main>
      <h1>Guidebook Wiki Planning</h1>
      <p>Select a markdown file to preview. Files are served directly from the repository root.</p>
      <p>Default port: <code>${PORT}</code></p>
      <ul>${links}</ul>
    </main>
  </body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Failed to list documents: ${error.message}`);
  }
}

async function serveMarkdown(res, filePath) {
  try {
    const stats = await fsp.stat(filePath);
    if (!stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/markdown; charset=utf-8' });
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    const status = error.code === 'ENOENT' ? 404 : 500;
    res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(status === 404 ? 'Not found' : `Unexpected error: ${error.message}`);
  }
}

async function handleRequest(req, res) {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);

  if (urlPath === '/' || urlPath === '') {
    await serveIndex(res);
    return;
  }

  const fileName = urlPath.replace(/^\//, '');
  if (!fileName.toLowerCase().endsWith('.md')) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Only markdown files can be served.');
    return;
  }

  const safePath = path.normalize(fileName);
  if (safePath.includes('..')) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Invalid path.');
    return;
  }

  const filePath = path.join(rootDir, safePath);
  await serveMarkdown(res, filePath);
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Server error: ${error.message}`);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Prototype preview server running at http://localhost:${PORT}`);
});

const shutdown = () => {
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('Server stopped.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
