/* Función de Vercel: GET /api/health. Indica si Gemini está configurado (sin revelar la clave). */
'use strict';

const { health } = require('../lib/chat-core.js');

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(health());
};
