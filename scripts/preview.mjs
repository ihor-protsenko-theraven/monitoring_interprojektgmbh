import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, relative, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// Local verification of the built SPA; Vercel serves these files in production.
const settings = {
  root: fileURLToPath(new URL('../dist/monitoring/browser/', import.meta.url)),
  host: '127.0.0.1',
  port: 4200,
  mime: {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.woff2': 'font/woff2',
  },
};
const portIndex = process.argv.indexOf('--port');
const port = portIndex < 0 ? settings.port : Number(process.argv[portIndex + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid preview port');
await stat(resolve(settings.root, 'index.html'));
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    let file = resolve(settings.root, '.' + pathname);
    const within = relative(settings.root, file);
    if (within === '..' || within.startsWith('..' + sep) || within.includes(':')) {
      response.writeHead(403).end();
      return;
    }
    try {
      if (!(await stat(file)).isFile()) file = resolve(settings.root, 'index.html');
    } catch {
      if (extname(pathname)) {
        response.writeHead(404).end();
        return;
      }
      file = resolve(settings.root, 'index.html');
    }
    const body = await readFile(file);
    response.writeHead(200, {
      'Content-Type': settings.mime[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(400).end();
  }
});
server.listen(port, settings.host, () =>
  console.log(`Production preview: http://${settings.host}:${port}`),
);
