/* Planes: oferta con precio total, IVA discriminado e información del proveedor (Ley 1480 arts. 23 y 50). */
(function () {
  'use strict';

  const { PLANS, priceBreakdown, formatCOP } = window.KoraLogic;
  const { esc } = window.KoraUI;
  const { COMPANY } = window.KoraData;

  function planCard(plan) {
    const p = priceBreakdown(plan.total);
    return `
      <article class="plan ${plan.featured ? 'is-featured' : ''}" aria-labelledby="plan-${plan.id}">
        ${plan.featured ? '<span class="plan-flag">El más elegido</span>' : ''}
        <h2 id="plan-${plan.id}">${esc(plan.name)}</h2>
        <p class="plan-price"><span class="amount">${formatCOP(p.total)}</span><span class="per">/mes</span></p>
        <p class="plan-tax">IVA incluido · Base ${formatCOP(p.base)} + IVA 19 % ${formatCOP(p.iva)}</p>
        <ul class="plan-features">
          ${plan.features.map((f) => `<li>${esc(f)}</li>`).join('')}
        </ul>
        <p class="plan-sign"><span class="badge">${esc(plan.signature)}</span></p>
        <a class="btn ${plan.featured ? 'btn-coral' : 'btn-ghost'}" href="#/contratar?plan=${plan.id}">Contratar ${esc(plan.name)}</a>
      </article>`;
  }

  window.KoraViews.plans = function (main) {
    main.innerHTML = `
      <div class="wrap">
        <header class="page-head">
          <p class="eyebrow">Planes · precios en pesos colombianos</p>
          <h1>Un precio claro, sin letra pequeña.</h1>
          <p>Cobro mensual anticipado, renovación automática y cancelación cuando quieras desde tu panel, sin multa. El precio que ves es el que pagas.</p>
        </header>

        <div class="plans">${PLANS.map(planCard).join('')}</div>

        <section class="section-tight" aria-labelledby="info-legal">
          <h2 id="info-legal" class="sr-only">Información para el consumidor</h2>
          <div class="info-grid">
            <div class="card">
              <h3>Quién te vende</h3>
              <p class="mt-0">${esc(COMPANY.name)} · NIT ${esc(COMPANY.nit)} · ${esc(COMPANY.city)}.<br>Contacto legal: <a href="mailto:${esc(COMPANY.legalEmail)}">${esc(COMPANY.legalEmail)}</a></p>
            </div>
            <div class="card">
              <h3>Retracto y reversión</h3>
              <p class="mt-0">Si eres consumidor, tienes 5 días hábiles para retractarte, salvo que el servicio ya haya empezado con tu acuerdo <span class="law">Ley 1480 art. 47</span>. La reversión del pago procede en los casos del <span class="law">art. 51</span>.</p>
            </div>
            <div class="card">
              <h3>Antes de pagar</h3>
              <p class="mt-0">Lee los <a href="#/terminos">Términos y condiciones v1.0</a> y la <a href="#/privacidad">Política de datos</a>. Verás un resumen del pedido para corregir errores antes del pago.</p>
            </div>
          </div>
        </section>
      </div>
    `;
  };
})();
