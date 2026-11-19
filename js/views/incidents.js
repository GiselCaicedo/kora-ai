/*
 * Centro de incidentes (uso interno de Kora): matriz de riesgos y simulacro del
 * protocolo de 6 pasos con el dilema del caso integrador (orden de ocultar).
 */
(function () {
  'use strict';

  const L = window.KoraLogic;
  const { esc, fmtDate } = window.KoraUI;

  const RISKS = [
    [1, 'Robo de credenciales', 4, 4, '269A, 269I'], [2, 'Inyección de instrucciones al modelo', 4, 4, '269A, 269F, 269J'],
    [3, 'Fuga de datos al proveedor de IA', 3, 5, '269F'], [4, 'Phishing que suplanta a Kora', 4, 3, '269G'],
    [5, 'Inyección SQL / vulnerabilidad web', 3, 5, '269A, 269D'], [6, 'Claves API expuestas', 3, 4, '269A'],
    [7, 'Ransomware', 2, 5, '269D, 269E'], [8, 'Empleado que saca información', 2, 5, '269A, 269F'],
    [9, 'Denegación de servicio (DDoS)', 3, 3, '269B'], [10, 'Componente de terceros vulnerable o sin licencia', 3, 4, '269D'],
  ];

  const STEPS = [
    { t: 'Detectar y registrar', who: 'Sistema de monitoreo · Líder de seguridad', time: 'Inmediato',
      body: 'Viernes 9:15 p. m.: alerta automática. Una cuenta de soporte descargó 40.000 conversaciones en 10 minutos. Se abre el caso INC-2026-007.' },
    { t: 'Evaluar y clasificar', who: 'Líder de seguridad · Oficial de datos', time: 'Máx. 4 horas',
      body: 'El acceso fue desde una IP de otro país. La contraseña del empleado (de vacaciones) salió en una filtración pública y su cuenta no tenía MFA. Afecta a 12 pymes; hay celulares y direcciones.' },
    { t: 'Contener', who: 'Líder técnico', time: 'Máx. 24 horas',
      body: 'Se bloquea la cuenta, se cierran las sesiones y se cambian las claves API. Los registros se copian con su hash (cadena de custodia).' },
    { t: 'Notificar', who: 'Oficial de datos · Representante legal', time: 'Según cada caso', dilemma: true,
      body: 'Hay que avisar a la gerencia, a las pymes afectadas, a la SIC y, si hay delito, a la Fiscalía.' },
    { t: 'Eliminar la causa y recuperar', who: 'Líder técnico', time: 'Según el caso',
      body: 'MFA obligatorio para todo el personal, límite de descargas por usuario y restauración desde copias limpias.' },
    { t: 'Aprender', who: 'Comité de seguridad', time: 'Máx. 10 días hábiles tras el cierre',
      body: 'Informe con causa, costos y mejoras. Se actualiza la matriz de riesgos: la falta de un solo control (MFA) bastó para el incidente.' },
  ];

  function level(p, i) {
    const n = p * i;
    return n >= 15 ? ['Alto', 'bad'] : n >= 8 ? ['Medio', 'warn'] : ['Bajo', 'ok'];
  }

  function heatmap() {
    const cells = [];
    for (let i = 5; i >= 1; i -= 1) {
      for (let p = 1; p <= 5; p += 1) {
        const ids = RISKS.filter((r) => r[2] === p && r[3] === i).map((r) => r[0]);
        cells.push(`<div class="hm-cell hm-${level(p, i)[1]}" ${ids.length ? `title="Riesgos ${ids.join(', ')}"` : ''}>${ids.map((id) => `<span>${id}</span>`).join('')}</div>`);
      }
    }
    return `<div class="heatmap" role="img" aria-label="Mapa de calor de 10 riesgos según probabilidad e impacto. Altos: 1, 2, 3 y 5. Medios: 4, 6, 7, 8, 9 y 10.">
      <span class="hm-y" aria-hidden="true">Impacto →</span>
      <div class="hm-grid">${cells.join('')}</div>
      <span class="hm-x" aria-hidden="true">Probabilidad →</span>
    </div>`;
  }

  window.KoraViews.incidents = function (main) {
    let current = 0;
    let decision = null;
    const detected = new Date();
    const smsDue = new Date(detected.getTime() + 48 * 3600 * 1000);
    const sicDue = L.addBusinessDays(detected, 15);

    main.innerHTML = `<div class="wrap">
      <header class="page-head">
        <p class="eyebrow">Uso interno · Seguridad, fraude y delitos informáticos</p>
        <h1>Centro de incidentes</h1>
        <p>Matriz de riesgos (Ley 1273 de 2009) y simulacro del protocolo de respuesta con el caso INC-2026-007.</p>
      </header>

      <section class="risk-grid" aria-labelledby="risk-title">
        <div>
          <h2 id="risk-title">Matriz de riesgos</h2>
          <p class="muted">Probabilidad × impacto (1 a 5). Alto 15-25, medio 8-12, bajo 1-6.</p>
          ${heatmap()}
        </div>
        <div class="table-wrap"><table><caption class="sr-only">Amenazas, nivel y artículo de la Ley 1273</caption>
          <thead><tr><th scope="col">N.º</th><th scope="col">Amenaza</th><th scope="col">Nivel</th><th scope="col">Ley 1273</th></tr></thead>
          <tbody>${RISKS.map(([n, t, p, i, art]) => { const [lv, tone] = level(p, i); return `<tr><td>${n}</td><td>${esc(t)}</td><td><span class="badge badge-${tone}">${lv} (${p * i})</span></td><td class="mono">${esc(art)}</td></tr>`; }).join('')}</tbody>
        </table></div>
      </section>

      <section class="section-tight" aria-labelledby="sim-title">
        <h2 id="sim-title">Simulacro · INC-2026-007</h2>
        <div class="deadlines">
          <div class="card"><span class="muted">Aviso a las 12 pymes</span><strong>${esc(fmtDate(smsDue))}</strong><span class="law">48 h · T&C cláusula 6</span></div>
          <div class="card"><span class="muted">Reporte a la SIC</span><strong>${esc(fmtDate(sicDue))}</strong><span class="law">15 días hábiles · Ley 1581 art. 17 lit. n</span></div>
          <div class="card"><span class="muted">Denuncia ante la Fiscalía</span><strong>Lo antes posible</strong><span class="law">Ley 1273 arts. 269A y 269F</span></div>
        </div>
        <div class="incident">
          <ol class="proto" id="proto"></ol>
          <div class="card proto-detail" id="detail" aria-live="polite"></div>
        </div>
      </section>
    </div>`;

    const proto = main.querySelector('#proto');
    const detail = main.querySelector('#detail');

    function drawList() {
      proto.innerHTML = STEPS.map((s, i) => `<li class="${i < current ? 'is-done' : i === current ? 'is-current' : ''}">
        <button ${i > current ? 'disabled' : ''} data-i="${i}" ${i === current ? 'aria-current="step"' : ''}><span class="n">${i < current ? '✓' : i + 1}</span>${esc(s.t)}</button></li>`).join('');
      proto.querySelectorAll('[data-i]').forEach((b) => b.addEventListener('click', () => drawDetail(Number(b.dataset.i))));
    }

    function dilemmaHtml() {
      if (decision === 'report') {
        return `<div class="callout ok"><p><strong>Decisión: reportar.</strong> El ingeniero explica por escrito las obligaciones legales, propone un plan de comunicación responsable y deja constancia. Si la orden se mantiene, escala al representante legal o a la junta y, si es necesario, a la autoridad.</p>
          <p>Notificaciones: gerencia ✓ · 12 pymes ✓ · SIC ✓ · Fiscalía ✓ · titulares con riesgo ✓</p><p><span class="law">Ley 842 de 2003 · Código de ética</span></p></div>`;
      }
      if (decision === 'hide') {
        return `<div class="callout bad"><p><strong>Si se oculta:</strong> se incumple el deber de reportar a la SIC (Ley 1581 arts. 17 y 18), los titulares no pueden protegerse y la empresa se expone a multas de hasta 2.000 SMMLV (art. 23). El ingeniero que lo permite puede ser sancionado por el COPNIA (Ley 842).</p>
          <p>Y cuando se descubra, el daño a la reputación será mayor que el del incidente.</p></div>
          <button class="btn btn-teal btn-sm" data-decide="report">Reconsiderar y reportar</button>`;
      }
      return `<div class="dilemma"><p class="eyebrow">Dilema ético</p>
        <p><strong>La dirección pide no informar lo sucedido para evitar pérdidas económicas.</strong> ¿Qué hace el equipo técnico?</p>
        <div class="btn-row"><button class="btn btn-teal" data-decide="report">Reportar dentro de los plazos</button><button class="btn btn-ghost" data-decide="hide">Seguir la orden y ocultar</button></div></div>`;
    }

    function drawDetail(i) {
      const s = STEPS[i];
      const blocked = s.dilemma && decision !== 'report';
      detail.innerHTML = `<p class="eyebrow">Paso ${i + 1} de 6 · ${esc(s.time)}</p>
        <h3>${esc(s.t)}</h3><p>${esc(s.body)}</p><p class="muted"><small>Responsable: ${esc(s.who)}</small></p>
        ${s.dilemma ? dilemmaHtml() : ''}
        ${i === current && i < STEPS.length - 1 ? `<button class="btn btn-coral" id="next" ${blocked ? 'disabled' : ''}>Completar y seguir</button>` : ''}
        ${i === STEPS.length - 1 && current === i ? '<div class="callout ok"><p><strong>Simulacro completado.</strong> Nuevo control permanente: MFA obligatorio y límite de descargas.</p></div>' : ''}`;
      detail.querySelectorAll('[data-decide]').forEach((b) => b.addEventListener('click', () => { decision = b.dataset.decide; drawDetail(i); detail.querySelector('button')?.focus(); }));
      detail.querySelector('#next')?.addEventListener('click', () => {
        current += 1;
        drawList();
        drawDetail(current);
        detail.querySelector('h3').setAttribute('tabindex', '-1');
        detail.querySelector('h3').focus();
      });
    }

    drawList();
    drawDetail(0);
  };
})();
