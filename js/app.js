/* Enrutador por hash y controles globales de accesibilidad. */
(function () {
  'use strict';

  const { store } = window.KoraUI;
  const V = window.KoraViews;

  const ROUTES = {
    '/': { view: V.home, title: 'Asistente virtual para pymes' },
    '/planes': { view: V.plans, title: 'Planes y precios' },
    '/contratar': { view: V.checkout, title: 'Contratar' },
    '/chat': { view: V.chat, title: 'Demo del asistente' },
    '/panel': { view: V.panel, title: 'Panel de la pyme' },
    '/privacidad': { view: V.privacy, title: 'Tus datos' },
    '/terminos': { view: V.terms, title: 'Términos y condiciones' },
    '/incidentes': { view: V.incidents, title: 'Centro de incidentes' },
    '/accesibilidad': { view: V.accessibility, title: 'Accesibilidad' },
  };

  const main = document.getElementById('main');
  let cleanup = null;
  let firstLoad = true;

  function parseHash() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [pathWithQuery, anchor] = raw.split('#');
    const [path, query] = pathWithQuery.split('?');
    return { path: path || '/', params: new URLSearchParams(query || ''), anchor };
  }

  function render() {
    const { path, params, anchor } = parseHash();
    const route = ROUTES[path] || ROUTES['/'];
    if (typeof cleanup === 'function') cleanup();
    cleanup = null;
    main.innerHTML = '';
    cleanup = route.view(main, params) || null;
    document.title = `${route.title} · Kora IA`;

    document.querySelectorAll('.nav a').forEach((a) => {
      const href = a.getAttribute('href').replace(/^#/, '');
      if (href === path) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    closeMenu();

    if (anchor) {
      document.getElementById(anchor)?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
    // Mueve el foco al contenido nuevo para lectores de pantalla (no en la primera carga).
    if (!firstLoad) main.focus({ preventScroll: true });
    firstLoad = false;
  }

  // Menú móvil
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // Tamaño del texto y alto contraste (se recuerdan en este navegador).
  const root = document.documentElement;
  function applyPrefs() {
    const prefs = store.get('prefs', { text: 'base', contrast: false });
    root.dataset.text = prefs.text;
    root.dataset.contrast = prefs.contrast ? 'high' : 'normal';
    document.querySelectorAll('[data-text-size]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.textSize === prefs.text)));
    document.getElementById('contrast-toggle').setAttribute('aria-pressed', String(prefs.contrast));
  }
  document.querySelectorAll('[data-text-size]').forEach((btn) => {
    btn.addEventListener('click', () => {
      store.set('prefs', { ...store.get('prefs', { contrast: false }), text: btn.dataset.textSize });
      applyPrefs();
    });
  });
  document.getElementById('contrast-toggle').addEventListener('click', () => {
    const prefs = store.get('prefs', { text: 'base', contrast: false });
    store.set('prefs', { ...prefs, contrast: !prefs.contrast });
    applyPrefs();
  });

  applyPrefs();
  window.addEventListener('hashchange', render);
  render();
})();
