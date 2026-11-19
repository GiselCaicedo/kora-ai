/* Función de Vercel: POST /api/chat. La clave viene de la variable de entorno GEMINI_API_KEY. */
'use strict';

const { handleChat } = require('../lib/chat-core.js');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }
  let body;
  try {
    body = req.body;
  } catch (_) {
    return res.status(400).json({ ok: false, error: 'Solicitud inválida.' });
  }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'anon';
  const { status, json } = await handleChat(body, ip);
  return res.status(status).json(json);
};
