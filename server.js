/*
 * Servidor local del prototipo: sirve el sitio estático y expone /api/chat con Gemini.
 * En Vercel no se usa: allá /api/chat es la función api/chat.js. Ambos usan lib/chat-core.js.
 * La clave vive solo en el servidor (variable de entorno o archivo .env), nunca en el navegador.
 * Uso: node server.js   (Node 20 o superior, sin dependencias)
 */
'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const MAX_BODY = 32 * 1024;

function loadEnv() {
  const file = path.join(ROOT, '.env');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

const { handleChat, health } = require('./lib/chat-core.js');
const PORT = Number(process.env.PORT) || 5190;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
};
// Solo se publican index.html, css/ y js/ (nunca .env, lib/ ni el servidor).
const PUBLIC = new Set(['index.html', 'css', 'js']);

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
  });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function serveStatic(req, res) {
  let urlPath;
  try { urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch (_) { return send(res, 400, 'Solicitud inválida', 'text/plain; charset=utf-8'); }
  const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(ROOT + path.sep) || !PUBLIC.has(rel.split('/')[0])) return send(res, 404, 'No encontrado', 'text/plain; charset=utf-8');
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, 'No encontrado', 'text/plain; charset=utf-8');
    send(res, 200, data, TYPES[path.extname(file)] || 'application/octet-stream');
  });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('too_large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch (e) { reject(new Error('bad_json')); }
    });
    req.on('error', reject);
  });
}

async function chat(req, res) {
  let body;
  try { body = await readJson(req); } catch (e) {
    return send(res, e.message === 'too_large' ? 413 : 400, { ok: false, error: 'Solicitud inválida.' });
  }
  const { status, json } = await handleChat(body, req.socket.remoteAddress);
  return send(res, status, json);
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/api/health') return send(res, 200, health());
  if (req.method === 'POST' && req.url === '/api/chat') return chat(req, res);
  if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res);
  return send(res, 405, { ok: false, error: 'Método no permitido.' });
});

server.listen(PORT, '0.0.0.0', () => {
  const h = health();
  process.stdout.write(`Kora IA en http://localhost:${PORT} · Gemini ${h.gemini ? `activo (${h.model})` : 'NO configurado: el chat usará respuestas locales'}\n`);
});
