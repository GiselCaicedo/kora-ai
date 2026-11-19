/*
 * Lógica pura de Kora IA (sin DOM). Se usa en el navegador (window.KoraLogic)
 * y en Node para las pruebas (module.exports).
 */
(function (root) {
  'use strict';

  const IVA = 0.19;
  const OTP_MINUTES = 5;
  const MAX_OTP_ATTEMPTS = 3;

  // Festivos de Colombia (Ley 51 de 1983, «ley Emiliani»).
  const HOLIDAYS = new Set([
    '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
    '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29',
    '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
    '2026-11-16', '2026-12-08', '2026-12-25',
    '2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25', '2027-03-26',
    '2027-05-01', '2027-05-10', '2027-05-31', '2027-06-07', '2027-07-05',
    '2027-07-20', '2027-08-07', '2027-08-16', '2027-10-18', '2027-11-01',
    '2027-11-15', '2027-12-08', '2027-12-25',
  ]);

  const PLANS = Object.freeze([
    Object.freeze({
      id: 'basico', name: 'Básico', total: 89000, conversations: 1000, channels: 1,
      signature: 'Firma electrónica (casilla + OTP)',
      features: ['1 canal (WhatsApp o web)', '1.000 conversaciones/mes', 'Base de conocimiento de 20 documentos', 'Paso a asesor humano', 'Soporte en horario hábil'],
    }),
    Object.freeze({
      id: 'pro', name: 'Pro', total: 199000, conversations: 5000, channels: 3, featured: true,
      signature: 'Firma electrónica (casilla + OTP)',
      features: ['3 canales (WhatsApp, web e Instagram)', '5.000 conversaciones/mes', 'Base de conocimiento ilimitada', 'Campañas con bloqueo de horario (Ley 2300)', 'Reportes mensuales'],
    }),
    Object.freeze({
      id: 'empresarial', name: 'Empresarial', total: 549000, conversations: 20000, channels: 6,
      signature: 'Firma digital con certificado (ONAC)',
      features: ['Canales ilimitados', '20.000 conversaciones/mes', 'Módulo de datos sensibles (autorización explícita)', 'Anexo de transmisión firmado digitalmente', 'Gestor de cuenta dedicado'],
    }),
  ]);

  /** Separa el precio total (IVA incluido) en base e IVA, en pesos enteros. */
  function priceBreakdown(total) {
    if (!Number.isFinite(total) || total < 0) throw new Error('Precio inválido');
    const base = Math.round(total / (1 + IVA));
    return { base, iva: total - base, total };
  }

  function formatCOP(value) {
    return '$' + Math.round(value).toLocaleString('es-CO').replace(/,/g, '.');
  }

  function isoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function isHoliday(d) {
    return HOLIDAYS.has(isoDate(d));
  }

  function isBusinessDay(d) {
    const dow = d.getDay();
    return dow !== 0 && dow !== 6 && !isHoliday(d);
  }

  /** Suma N días hábiles (sin sábados, domingos ni festivos) a una fecha. */
  function addBusinessDays(start, days) {
    if (!Number.isInteger(days) || days < 0) throw new Error('Días inválidos');
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    let left = days;
    while (left > 0) {
      d.setDate(d.getDate() + 1);
      if (isBusinessDay(d)) left -= 1;
    }
    return d;
  }

  /**
   * Ley 2300 de 2023, art. 3: mensajes comerciales de lunes a viernes de 7 a. m.
   * a 7 p. m., sábados de 8 a. m. a 3 p. m.; nunca domingos ni festivos.
   */
  function checkContactWindow(d) {
    const dow = d.getDay();
    const minutes = d.getHours() * 60 + d.getMinutes();
    if (isHoliday(d)) return { allowed: false, reason: 'Es festivo: no se pueden enviar mensajes comerciales.' };
    if (dow === 0) return { allowed: false, reason: 'Es domingo: no se pueden enviar mensajes comerciales.' };
    if (dow === 6) {
      return minutes >= 8 * 60 && minutes <= 15 * 60
        ? { allowed: true, reason: 'Sábado dentro del horario (8:00 a. m. a 3:00 p. m.).' }
        : { allowed: false, reason: 'Los sábados solo se permite de 8:00 a. m. a 3:00 p. m.' };
    }
    return minutes >= 7 * 60 && minutes <= 19 * 60
      ? { allowed: true, reason: 'Día hábil dentro del horario (7:00 a. m. a 7:00 p. m.).' }
      : { allowed: false, reason: 'De lunes a viernes solo se permite de 7:00 a. m. a 7:00 p. m.' };
  }

  // Filtro de datos de identificación antes de enviar el texto al modelo
  // (Ley 1581 art. 4 y Circular Externa 002 de 2024 de la SIC: minimización).
  const PII_RULES = [
    { type: 'tarjeta', label: '[TARJETA]', re: /\b(?:\d[ -]?){13,19}\b/g },
    { type: 'correo', label: '[CORREO]', re: /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g },
    { type: 'celular', label: '[CELULAR]', re: /(?:\+?57[ -]?)?\b3\d{2}[ -]?\d{3}[ -]?\d{4}\b/g },
    { type: 'documento', label: '[DOCUMENTO]', re: /\b(?:cc|c\.c\.|cédula|cedula|documento|ti|nit)\s*(?:n[oº°.]*\s*)?:?\s*\d[\d.\s]{4,16}\d(?:-\d)?\b/gi },
    { type: 'salud', label: '[DATO DE SALUD]', re: /\b(diabetes|vih|embarazo|embarazada|cáncer|cancer|depresión|depresion|hipertensión|hipertension|epilepsia)\b/gi },
  ];

  function redactPII(text) {
    let out = String(text);
    const found = [];
    for (const rule of PII_RULES) {
      out = out.replace(rule.re, () => {
        found.push(rule.type);
        return rule.label;
      });
    }
    return { text: out, found };
  }

  const INJECTION_PATTERNS = [
    /ignora (todas )?(las|tus) (instrucciones|reglas)/i,
    /ignore (all )?(previous|prior) instructions/i,
    /(muestra|revela|dime) (el|tu) (prompt|instrucciones del sistema)/i,
    /act[uú]a como (administrador|desarrollador|root)/i,
    /(base de datos|lista) de (clientes|usuarios)/i,
    /system prompt/i,
  ];

  function detectInjection(text) {
    return INJECTION_PATTERNS.some((re) => re.test(String(text)));
  }

  function normalize(text) {
    return String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  /**
   * RAG simplificado: solo responde con documentos validados por la pyme.
   * Si no hay coincidencia suficiente, deriva a un asesor en vez de inventar.
   */
  function answerFromKnowledge(question, docs) {
    const words = normalize(question).split(/[^a-z0-9ñ]+/).filter((w) => w.length > 3);
    let best = null;
    let bestScore = 0;
    for (const doc of docs) {
      if (!doc.validated) continue;
      const hay = normalize(doc.keywords.join(' ') + ' ' + doc.title);
      const score = words.filter((w) => hay.includes(w)).length;
      if (score > bestScore) {
        best = doc;
        bestScore = score;
      }
    }
    return bestScore > 0 ? { found: true, doc: best } : { found: false, doc: null };
  }

  function generateOTP(rand) {
    const r = typeof rand === 'function' ? rand : Math.random;
    return String(Math.floor(r() * 1000000)).padStart(6, '0');
  }

  function validateOTP(input, otp, issuedAt, now) {
    if (!/^\d{6}$/.test(String(input))) return { ok: false, reason: 'El código debe tener 6 números.' };
    if (now - issuedAt > OTP_MINUTES * 60 * 1000) return { ok: false, reason: 'El código venció. Pide uno nuevo.' };
    if (String(input) !== String(otp)) return { ok: false, reason: 'El código no coincide. Revisa el correo e inténtalo de nuevo.' };
    return { ok: true, reason: '' };
  }

  /** Dígito de verificación del NIT (algoritmo DIAN, módulo 11). */
  function nitCheckDigit(nit) {
    const digits = String(nit).replace(/\D/g, '');
    const weights = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    let sum = 0;
    for (let i = 0; i < digits.length; i += 1) {
      sum += Number(digits[digits.length - 1 - i]) * weights[i];
    }
    const r = sum % 11;
    return r > 1 ? 11 - r : r;
  }

  function validateNIT(value) {
    const m = String(value).replace(/[.\s]/g, '').match(/^(\d{9})-?(\d)$/);
    if (!m) return { ok: false, reason: 'Escribe el NIT con 9 números y el dígito de verificación, por ejemplo 900123456-8.' };
    if (nitCheckDigit(m[1]) !== Number(m[2])) return { ok: false, reason: 'El dígito de verificación no corresponde a ese NIT.' };
    return { ok: true, reason: '' };
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
  }

  function contractNumber(seq, year) {
    return `KORA-${year}-${String(seq).padStart(6, '0')}`;
  }

  const api = {
    IVA, OTP_MINUTES, MAX_OTP_ATTEMPTS, PLANS,
    priceBreakdown, formatCOP, isoDate, isHoliday, isBusinessDay, addBusinessDays,
    checkContactWindow, redactPII, detectInjection, answerFromKnowledge,
    generateOTP, validateOTP, nitCheckDigit, validateNIT, validateEmail, contractNumber,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KoraLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
