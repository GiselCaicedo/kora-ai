/* Política de datos, formulario de derechos de los titulares / PQR y términos (Ley 1581, Ley 1480). */
(function () {
  'use strict';

  const L = window.KoraLogic;
  const { esc, store, fmtDate, setFieldError } = window.KoraUI;
  const { POLICY, TERMS, TERMS_VERSION } = window.KoraData;

  // Plazos: Ley 1581 arts. 14 y 15; PQR comercial: cláusula 14 de los T&C.
  const REQUESTS = {
    consulta: { label: 'Consulta: saber qué datos tienen de mí', days: 10, ext: 5, law: 'Ley 1581 art. 14' },
    actualizar: { label: 'Reclamo: actualizar o rectificar mis datos', days: 15, ext: 8, law: 'Ley 1581 art. 15' },
    suprimir: { label: 'Reclamo: suprimir mis datos', days: 15, ext: 8, law: 'Ley 1581 art. 15' },
    revocar: { label: 'Reclamo: revocar la autorización', days: 15, ext: 8, law: 'Ley 1581 art. 15' },
    prueba: { label: 'Pedir prueba de la autorización', days: 10, ext: 5, law: 'Ley 1581 art. 8 lit. b' },
    pqr: { label: 'Queja o reclamo sobre el servicio', days: 15, ext: 0, law: 'Ley 1480 · T&C cláusula 14' },
  };

  const DATA_MATRIX = [
    ['Nombre, cargo, correo y teléfono', 'Usuario administrador', 'Privado', 'Crear la cuenta, facturar y dar soporte', 'Contrato + 10 años'],
    ['Contraseña (hash) y OTP', 'Usuario administrador', 'Privado', 'Autenticación', 'Mientras exista la cuenta'],
    ['IP, dispositivo y registros', 'Usuario administrador', 'Privado', 'Seguridad y prueba de la aceptación', '1 año / 10 años'],
    ['Datos de pago', 'Usuario administrador', 'Privado', 'Cobro del plan', 'No se guardan en Kora'],
    ['Nombre y número de WhatsApp', 'Persona que escribe al chat', 'Semiprivado', 'Responder por encargo de la pyme', 'Máx. 12 meses'],
    ['Contenido de la conversación', 'Persona que escribe al chat', 'Privado', 'Atender la solicitud', 'Máx. 12 meses'],
    ['Datos de salud (clínicas)', 'Persona que escribe al chat', 'Sensible', 'Agendar citas', 'Lo mínimo necesario'],
  ];

  window.KoraViews.privacy = function (main) {
    const history = store.get('requests', []);
    main.innerHTML = `<div class="wrap">
      <header class="page-head">
        <p class="eyebrow">Protección de datos personales · Ley 1581 de 2012</p>
        <h1>Tus datos, tus derechos.</h1>
        <p>Puedes conocer, actualizar, rectificar y suprimir tus datos, revocar la autorización y pedir prueba de ella. Las consultas se responden en 10 días hábiles y los reclamos en 15.</p>
      </header>

      <div class="privacy-grid">
        <section class="card" id="pqr" aria-labelledby="pqr-title">
          <h2 id="pqr-title">Radicar una solicitud</h2>
          <form id="req-form" novalidate>
            <div class="field"><label for="r-type">Tipo de solicitud</label>
              <select id="r-type">${Object.entries(REQUESTS).map(([k, r]) => `<option value="${k}">${esc(r.label)}</option>`).join('')}</select></div>
            <div class="grid-2">
              <div class="field"><label for="r-name">Nombre completo</label><input id="r-name" autocomplete="name" aria-describedby="r-name-error"><span class="error" id="r-name-error" role="alert"></span></div>
              <div class="field"><label for="r-doc">Número de documento</label><input id="r-doc" inputmode="numeric" aria-describedby="r-doc-error"><span class="error" id="r-doc-error" role="alert"></span></div>
            </div>
            <div class="field"><label for="r-email">Correo para la respuesta</label><input id="r-email" type="email" autocomplete="email" aria-describedby="r-email-error"><span class="error" id="r-email-error" role="alert"></span></div>
            <div class="field"><label for="r-desc">Describe tu solicitud</label><textarea id="r-desc" aria-describedby="r-desc-error"></textarea><span class="error" id="r-desc-error" role="alert"></span></div>
            <button class="btn btn-coral" type="submit">Radicar solicitud</button>
          </form>
          <div id="req-result" role="status"></div>
        </section>

        <section aria-labelledby="pol-title">
          <h2 id="pol-title">Política de tratamiento de datos</h2>
          <ol class="policy">${POLICY.map(([t, b]) => `<li><h3>${esc(t)}</h3><p>${esc(b)}</p></li>`).join('')}</ol>
        </section>
      </div>

      ${history.length ? `<section class="section-tight"><div class="table-wrap"><table><caption>Solicitudes radicadas en este navegador</caption>
        <thead><tr><th scope="col">Radicado</th><th scope="col">Tipo</th><th scope="col">Fecha límite</th></tr></thead>
        <tbody>${history.map((h) => `<tr><td class="mono">${esc(h.id)}</td><td>${esc(h.type)}</td><td>${esc(h.due)}</td></tr>`).join('')}</tbody></table></div></section>` : ''}

      <section class="section-tight" aria-labelledby="matrix-title">
        <h2 id="matrix-title">Qué datos tratamos y para qué</h2>
        <div class="table-wrap"><table><caption class="sr-only">Matriz de datos personales</caption>
          <thead><tr><th scope="col">Dato</th><th scope="col">Titular</th><th scope="col">Tipo</th><th scope="col">Finalidad</th><th scope="col">Conservación</th></tr></thead>
          <tbody>${DATA_MATRIX.map((r) => `<tr>${r.map((c, i) => `<td>${i === 2 ? `<span class="badge ${c === 'Sensible' ? 'badge-bad' : c === 'Semiprivado' ? 'badge-warn' : ''}">${esc(c)}</span>` : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>
      </section>
    </div>`;

    main.querySelector('#req-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const f = e.currentTarget;
      const get = (id) => f.querySelector('#' + id);
      const checks = [
        [get('r-name'), get('r-name').value.trim().length >= 5 ? '' : 'Escribe tu nombre completo.'],
        [get('r-doc'), /^\d{5,12}$/.test(get('r-doc').value.replace(/\D/g, '')) ? '' : 'Escribe tu número de documento (solo números).'],
        [get('r-email'), L.validateEmail(get('r-email').value) ? '' : 'Escribe un correo válido para enviarte la respuesta.'],
        [get('r-desc'), get('r-desc').value.trim().length >= 15 ? '' : 'Cuéntanos qué necesitas (mínimo 15 caracteres).'],
      ];
      checks.forEach(([el, msg]) => setFieldError(el, msg));
      const bad = checks.find(([, m]) => m);
      if (bad) return bad[0].focus();

      const type = REQUESTS[get('r-type').value];
      const now = new Date();
      const due = L.addBusinessDays(now, type.days);
      const id = `RAD-${now.getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
      store.set('requests', [{ id, type: type.label, due: fmtDate(due) }, ...store.get('requests', [])].slice(0, 10));
      f.reset();
      main.querySelector('#req-result').innerHTML = `<div class="callout ok"><p><strong>Radicado ${esc(id)}.</strong> ${esc(type.label)}.</p>
        <p>Responderemos a más tardar el <strong>${esc(fmtDate(due))}</strong> (${type.days} días hábiles${type.ext ? `, prorrogables ${type.ext} más explicando el motivo` : ''}) <span class="law">${esc(type.law)}</span>.</p>
        <p>En máximo 2 días hábiles verás la leyenda «reclamo en trámite». Si no estás de acuerdo con la respuesta, puedes acudir a la SIC.</p></div>`;
      main.querySelector('#req-result').scrollIntoView({ block: 'nearest' });
    });
  };

  window.KoraViews.terms = function (main) {
    main.innerHTML = `<div class="wrap narrow">
      <header class="page-head">
        <p class="eyebrow">Contrato de adhesión · ${TERMS_VERSION}</p>
        <h1>Términos y condiciones de uso del servicio Kora</h1>
        <p>Vigentes desde el 1 de diciembre de 2026. Se aceptan con casilla y código OTP (firma electrónica, Ley 527 de 1999). Las cláusulas respetan el Estatuto del Consumidor y no incluyen cláusulas abusivas (Ley 1480 arts. 42 y 43).</p>
      </header>
      <ol class="terms">${TERMS.map(([t, b]) => `<li><h2>${esc(t)}</h2><p>${esc(b)}</p></li>`).join('')}</ol>
      <div class="btn-row"><a class="btn btn-coral" href="#/planes">Ver planes</a><button class="btn btn-ghost" id="print">Imprimir o guardar PDF</button></div>
    </div>`;
    main.querySelector('#print').addEventListener('click', () => window.print());
  };
})();
