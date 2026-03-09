import { Plugin } from 'vite';
import { readFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';

/**
 * Vite plugin that serves markdown files from anywhere on disk.
 *
 * Endpoints:
 *   GET /__docs?path=<absolute-path>     — returns raw markdown text
 *   GET /__docs/ls?dir=<absolute-path>   — returns JSON array of .md filenames in a directory
 *
 * Only serves .md files. Returns 404 for missing files, 403 for non-md.
 */
export function docsPlugin(): Plugin {
  return {
    name: 'vite-plugin-docs',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__docs')) return next();

        const url = new URL(req.url, 'http://localhost');

        // ── Directory listing endpoint ──
        if (url.pathname === '/__docs/ls') {
          const dir = url.searchParams.get('dir');
          if (!dir) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Missing ?dir= parameter' }));
            return;
          }
          if (!existsSync(dir)) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify([]));
            return;
          }
          try {
            const entries = await readdir(dir);
            const mdFiles = entries.filter((f) => f.endsWith('.md')).sort();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(mdFiles));
          } catch {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify([]));
          }
          return;
        }

        // ── File read endpoint ──
        const filePath = url.searchParams.get('path');

        if (!filePath) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing ?path= parameter' }));
          return;
        }

        // Security: only serve .md, .yaml, and .json files
        const allowed = ['.md', '.yaml', '.json'];
        if (!allowed.some(ext => filePath.endsWith(ext))) {
          res.statusCode = 403;
          res.end(JSON.stringify({ error: 'Only .md, .yaml, and .json files allowed' }));
          return;
        }

        if (!existsSync(filePath)) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: `File not found: ${filePath}` }));
          return;
        }

        try {
          const content = await readFile(filePath, 'utf-8');
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(content);
        } catch (e) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: String(e) }));
        }
      });
    },
  };
}
