/* Utilidades de interfaz y almacenamiento local. */
(function () {
  'use strict';

  const PREFIX = 'kora.';

  /** Escapa texto para insertarlo en HTML (evita XSS con datos del usuario). */
  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (_) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
      } catch (_) {
        /* Navegación privada o almacenamiento bloqueado: la demo sigue en memoria. */
      }
      return value;
    },
    clearAll() {
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith(PREFIX))
          .forEach((k) => localStorage.removeItem(k));
      } catch (_) { /* sin almacenamiento */ }
    },
  };

  function toast({ title, body, html, timeout = 7000 }) {
    const zone = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.innerHTML = `<strong>${esc(title)}</strong>${html ?? `<span>${esc(body)}</span>`}
      <button type="button" class="btn btn-sm btn-ghost" style="--fg:#fff;border-color:rgba(255,255,255,.5)">Cerrar</button>`;
    el.querySelector('button').addEventListener('click', () => el.remove());
    zone.appendChild(el);
    if (timeout) setTimeout(() => el.remove(), timeout);
    return el;
  }

  async function sha256(text) {
    if (!window.crypto?.subtle) return 'no-disponible-en-este-contexto';
    const bytes = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function fmtDateTime(d) {
    return new Date(d).toLocaleString('es-CO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
  }

  function fmtDate(d) {
    return new Date(d).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function deviceSummary() {
    const ua = navigator.userAgent;
    const browser = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Navegador';
    const version = (ua.match(/(?:Edg|Chrome|Firefox|Version)\/(\d+)/) || [])[1] || '';
    const os = /Windows NT 10/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : 'Otro';
    return `${browser} ${version} / ${os}`.trim();
  }

  /** Marca un campo como inválido con un mensaje en texto (no solo color). */
  function setFieldError(input, message) {
    const errorEl = document.getElementById(input.getAttribute('aria-describedby')?.split(' ').find((id) => id.endsWith('-error')));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) errorEl.textContent = message || '';
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type: type || 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  window.KoraUI = { esc, store, toast, sha256, fmtDateTime, fmtDate, deviceSummary, setFieldError, download };
  window.KoraViews = window.KoraViews || {};
})();
