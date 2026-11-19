/* Panel de la pyme: resumen, base de conocimiento, campañas (Ley 2300), contrato y seguridad. */
(function () {
  'use strict';

  const L = window.KoraLogic;
  const { esc, store, toast, fmtDateTime, fmtDate, setFieldError, download } = window.KoraUI;
  const { KNOWLEDGE, TERMS, TERMS_VERSION } = window.KoraData;

  const TABS = [
    ['resumen', 'Resumen'],
    ['conocimiento', 'Base de conocimiento'],
    ['campanas', 'Campañas'],
    ['contrato', 'Contrato y datos'],
    ['seguridad', 'Seguridad'],
  ];

  function tabResumen() {
    const consents = store.get('consents', []);
    return `<div class="kpis">
        <div class="kpi"><span class="kpi-n">1.284</span><span>conversaciones este mes</span></div>
        <div class="kpi"><span class="kpi-n">86 %</span><span>resueltas por el asistente</span></div>
        <div class="kpi"><span class="kpi-n">14 %</span><span>pasadas a un asesor</span></div>
        <div class="kpi"><span class="kpi-n">${consents.length}</span><span>autorizaciones registradas en esta demo</span></div>
      </div>
      <div class="callout"><p>El asistente solo usa los documentos que tú marcas como <strong>validados</strong>. Revisa tu base de conocimiento cuando cambien precios o promociones.</p></div>
      ${consents.length ? `<div class="table-wrap"><table><caption>Últimas autorizaciones del aviso de privacidad</caption>
        <thead><tr><th scope="col">Fecha y hora</th><th scope="col">Titular</th><th scope="col">Respuesta</th></tr></thead>
        <tbody>${consents.slice(0, 5).map((c) => `<tr><td>${esc(c.fecha)}</td><td>${esc(c.titular)}</td><td>${esc(c.respuesta)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="muted">Prueba la <a href="#/chat">demo del asistente</a> para ver aquí las autorizaciones.</p>'}`;
  }

  function tabConocimiento() {
    const docs = store.get('kb', KNOWLEDGE);
    return `<p>Estos documentos son la única fuente del asistente. Un documento sin validar no se usa para responder.</p>
      <ul class="kb-list">${docs.map((d) => `<li class="kb-item">
        <div><h3>${esc(d.title)}</h3><p class="muted mt-0">${esc(d.answer)}</p></div>
        <label class="switch"><input type="checkbox" data-kb="${esc(d.id)}" ${d.validated ? 'checked' : ''}><span>${d.validated ? 'Validado' : 'Borrador'}</span></label>
      </li>`).join('')}</ul>
      <form id="kb-form" class="card" novalidate>
        <h3>Agregar documento</h3>
        <div class="grid-2">
          <div class="field"><label for="kb-title">Título</label><input id="kb-title" required aria-describedby="kb-title-error"><span class="error" id="kb-title-error" role="alert"></span></div>
          <div class="field"><label for="kb-keys">Palabras clave</label><span class="hint" id="kb-keys-hint">Separadas por coma, por ejemplo: café, tinto, precio</span><input id="kb-keys" aria-describedby="kb-keys-hint kb-keys-error"><span class="error" id="kb-keys-error" role="alert"></span></div>
        </div>
        <div class="field"><label for="kb-answer">Respuesta aprobada</label><textarea id="kb-answer" aria-describedby="kb-answer-error"></textarea><span class="error" id="kb-answer-error" role="alert"></span></div>
        <div class="btn-row"><button class="btn btn-teal" type="submit">Guardar como validado</button><button class="btn btn-ghost" type="button" id="kb-reset">Restaurar ejemplo</button></div>
      </form>`;
  }

  function tabCampanas() {
    const list = store.get('campaigns', []);
    return `<p>Los mensajes comerciales solo salen de lunes a viernes de 7:00 a. m. a 7:00 p. m. y los sábados de 8:00 a. m. a 3:00 p. m. Nunca domingos ni festivos <span class="law">Ley 2300 de 2023 art. 3</span>. Solo se envían a contactos con autorización comercial.</p>
      <form id="camp-form" class="card" novalidate>
        <div class="field"><label for="camp-msg">Mensaje</label><textarea id="camp-msg" aria-describedby="camp-msg-error">¡Hoy hay pan de bono recién horneado! Responde «BAJA» si no quieres recibir más mensajes.</textarea><span class="error" id="camp-msg-error" role="alert"></span></div>
        <div class="field"><label for="camp-when">Fecha y hora de envío</label><input type="datetime-local" id="camp-when" aria-describedby="camp-when-error camp-when-ok"><span class="error" id="camp-when-error" role="alert"></span><span id="camp-when-ok" class="ok-msg" role="status"></span></div>
        <div class="btn-row"><button class="btn btn-teal" type="submit">Programar campaña</button></div>
      </form>
      ${list.length ? `<div class="table-wrap"><table><caption>Campañas programadas</caption><thead><tr><th scope="col">Envío</th><th scope="col">Mensaje</th><th scope="col">Estado</th></tr></thead>
        <tbody>${list.map((c) => `<tr><td>${esc(c.when)}</td><td>${esc(c.msg)}</td><td><span class="badge badge-ok">Programada</span></td></tr>`).join('')}</tbody></table></div>` : ''}`;
  }

  function tabContrato() {
    const c = store.get('contract', null);
    if (!c) return '<p>Aún no has contratado un plan en esta demo.</p><a class="btn btn-coral" href="#/planes">Ver planes</a>';
    const cancelled = store.get('cancelled', null);
    return `<div class="table-wrap"><table><caption>Tu contrato ${esc(c.contrato)}</caption><tbody>
        <tr><th scope="row">Plan</th><td>${esc(c.plan)}</td></tr>
        <tr><th scope="row">Aceptado por</th><td>${esc(c.usuario)} · ${esc(c.fecha_hora)}</td></tr>
        <tr><th scope="row">Versión y hash</th><td class="mono">${esc(c.version_terminos)} · ${esc(c.hash_sha256)}</td></tr>
        <tr><th scope="row">Estado</th><td>${cancelled ? `<span class="badge badge-warn">Cancelado · activo hasta ${esc(cancelled)}</span>` : '<span class="badge badge-ok">Activo · renovación mensual</span>'}</td></tr>
      </tbody></table></div>
      <div class="btn-row" style="margin-top:1rem">
        <button class="btn btn-ghost" id="dl-terms">Descargar términos aceptados</button>
        <button class="btn btn-ghost" id="dl-data">Exportar mis datos</button>
        ${cancelled ? '' : '<button class="btn btn-coral" id="cancel">Cancelar suscripción</button>'}
      </div>
      <p class="muted"><small>Cancelar no tiene multa y aplica al final del periodo pagado. Al terminar tienes 30 días para descargar tu información; después se elimina y recibes un certificado de supresión (cláusulas 4 y 13).</small></p>
      <dialog id="cancel-dlg" aria-labelledby="cancel-title"><form method="dialog">
        <h2 id="cancel-title">¿Cancelar la suscripción?</h2>
        <p>Tu asistente seguirá funcionando hasta el final del periodo pagado. No se cobra multa.</p>
        <div class="btn-row"><button class="btn btn-ghost" value="no">No, volver</button><button class="btn btn-coral" value="yes">Sí, cancelar</button></div>
      </form></dialog>`;
  }

  function tabSeguridad() {
    return `<div class="kpis">
        <div class="kpi"><span class="kpi-n">MFA</span><span>activa y obligatoria</span></div>
        <div class="kpi"><span class="kpi-n">5</span><span>intentos antes de bloquear</span></div>
        <div class="kpi"><span class="kpi-n">90 d</span><span>rotación de claves API</span></div>
      </div>
      <div class="table-wrap"><table><caption>Últimos accesos a tu cuenta</caption>
        <thead><tr><th scope="col">Fecha</th><th scope="col">Dispositivo</th><th scope="col">Ubicación</th><th scope="col">Resultado</th></tr></thead>
        <tbody>
          <tr><td>${esc(fmtDateTime(new Date()))}</td><td>Este navegador</td><td>Bogotá, CO</td><td><span class="badge badge-ok">Correcto + MFA</span></td></tr>
          <tr><td>18/11/2026, 08:02:11</td><td>Chrome / Android</td><td>Bogotá, CO</td><td><span class="badge badge-ok">Correcto + MFA</span></td></tr>
          <tr><td>16/11/2026, 23:47:55</td><td>Desconocido</td><td>Fuera del país</td><td><span class="badge badge-bad">Bloqueado · 5 intentos</span></td></tr>
        </tbody></table></div>
      <div class="callout warn"><p>Kora nunca te pedirá tu contraseña ni el código MFA por correo o WhatsApp. Si recibes un mensaje así, repórtalo a soporte@kora-ia.co <span class="law">Ley 1273 art. 269G</span>.</p></div>`;
  }

  const RENDER = { resumen: tabResumen, conocimiento: tabConocimiento, campanas: tabCampanas, contrato: tabContrato, seguridad: tabSeguridad };

  window.KoraViews.panel = function (main, params) {
    let active = TABS.some(([id]) => id === params.get('tab')) ? params.get('tab') : 'resumen';
    const contract = store.get('contract', null);

    main.innerHTML = `<div class="wrap">
      <header class="page-head panel-head">
        <div><p class="eyebrow">Panel de administración</p><h1>${esc(contract?.cliente || 'Panadería Ejemplo S.A.S.')}</h1></div>
        <p class="muted">${contract ? esc(contract.plan) : 'Cuenta de demostración'}</p>
      </header>
      <div class="tabs" role="tablist" aria-label="Secciones del panel">
        ${TABS.map(([id, label]) => `<button role="tab" id="tab-${id}" aria-controls="tp" data-tab="${id}">${label}</button>`).join('')}
      </div>
      <section class="tabpanel card" id="tp" role="tabpanel" tabindex="0"></section>
    </div>`;

    const tabs = [...main.querySelectorAll('[role=tab]')];
    const panel = main.querySelector('#tp');

    function show(id, focus) {
      active = id;
      tabs.forEach((t) => {
        const on = t.dataset.tab === id;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focus) t.focus();
      });
      panel.setAttribute('aria-labelledby', `tab-${id}`);
      panel.innerHTML = RENDER[id]();
      bind(id);
    }

    function bind(id) {
      if (id === 'conocimiento') bindKnowledge();
      if (id === 'campanas') bindCampaigns();
      if (id === 'contrato') bindContract();
    }

    function bindKnowledge() {
      panel.querySelectorAll('[data-kb]').forEach((cb) => cb.addEventListener('change', () => {
        const docs = store.get('kb', KNOWLEDGE).map((d) => (d.id === cb.dataset.kb ? { ...d, validated: cb.checked } : d));
        store.set('kb', docs);
        cb.nextElementSibling.textContent = cb.checked ? 'Validado' : 'Borrador';
      }));
      panel.querySelector('#kb-reset').addEventListener('click', () => { store.set('kb', KNOWLEDGE); show('conocimiento'); });
      panel.querySelector('#kb-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const f = e.currentTarget;
        const title = f.querySelector('#kb-title');
        const keys = f.querySelector('#kb-keys');
        const answer = f.querySelector('#kb-answer');
        setFieldError(title, title.value.trim().length >= 3 ? '' : 'Escribe un título.');
        setFieldError(keys, keys.value.trim() ? '' : 'Escribe al menos una palabra clave.');
        setFieldError(answer, answer.value.trim().length >= 10 ? '' : 'Escribe la respuesta que el asistente puede dar.');
        const bad = [title, keys, answer].find((el) => el.getAttribute('aria-invalid') === 'true');
        if (bad) return bad.focus();
        const doc = { id: 'kb' + Date.now(), title: title.value.trim(), validated: true, answer: answer.value.trim(),
          keywords: keys.value.split(',').map((k) => k.trim().toLowerCase()).filter(Boolean) };
        store.set('kb', [...store.get('kb', KNOWLEDGE), doc]);
        toast({ title: 'Documento guardado', body: `«${doc.title}» ya lo puede usar el asistente.` });
        show('conocimiento');
      });
    }

    function bindCampaigns() {
      const when = panel.querySelector('#camp-when');
      const okMsg = panel.querySelector('#camp-when-ok');
      const check = () => {
        if (!when.value) return null;
        const r = L.checkContactWindow(new Date(when.value));
        setFieldError(when, r.allowed ? '' : r.reason);
        okMsg.textContent = r.allowed ? `✓ ${r.reason}` : '';
        return r;
      };
      when.addEventListener('change', check);
      panel.querySelector('#camp-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = panel.querySelector('#camp-msg');
        setFieldError(msg, msg.value.trim().length >= 10 ? '' : 'Escribe el mensaje de la campaña.');
        if (!when.value) setFieldError(when, 'Elige la fecha y la hora de envío.');
        const r = check();
        if (!msg.value.trim() || msg.getAttribute('aria-invalid') === 'true') return msg.focus();
        if (!r || !r.allowed) return when.focus();
        const d = new Date(when.value);
        store.set('campaigns', [{ when: `${fmtDate(d)}, ${d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`, msg: msg.value.trim() }, ...store.get('campaigns', [])]);
        toast({ title: 'Campaña programada', body: 'Se enviará solo a contactos con autorización comercial.' });
        show('campanas');
      });
    }

    function bindContract() {
      const c = store.get('contract', null);
      if (!c) return;
      panel.querySelector('#dl-terms').addEventListener('click', () => {
        const text = `TÉRMINOS Y CONDICIONES KORA ${TERMS_VERSION}\nContrato ${c.contrato} · aceptado ${c.fecha_hora}\nSHA-256: ${c.hash_sha256}\n\n` + TERMS.map(([t, b], i) => `${i + 1}. ${t}. ${b}`).join('\n\n');
        download(`${c.contrato}-terminos.txt`, text, 'text/plain;charset=utf-8');
      });
      panel.querySelector('#dl-data').addEventListener('click', () => {
        const data = { contrato: c, base_conocimiento: store.get('kb', KNOWLEDGE), campanas: store.get('campaigns', []), autorizaciones: store.get('consents', []) };
        download('kora-mis-datos.json', JSON.stringify(data, null, 2));
      });
      const dlg = panel.querySelector('#cancel-dlg');
      panel.querySelector('#cancel')?.addEventListener('click', () => dlg.showModal());
      dlg?.addEventListener('close', () => {
        if (dlg.returnValue !== 'yes') return panel.querySelector('#cancel').focus();
        const end = new Date(c.fecha_iso);
        end.setMonth(end.getMonth() + 1);
        store.set('cancelled', end.toLocaleDateString('es-CO'));
        toast({ title: 'Suscripción cancelada', body: 'Sin multa. Te enviamos la confirmación por correo.' });
        show('contrato');
      });
    }

    tabs.forEach((t, i) => {
      t.addEventListener('click', () => show(t.dataset.tab));
      t.addEventListener('keydown', (e) => {
        const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
        if (!(e.key in map)) return;
        e.preventDefault();
        const next = tabs[(map[e.key] + tabs.length) % tabs.length];
        show(next.dataset.tab, true);
      });
    });

    show(active);
  };
})();
