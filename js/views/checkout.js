/*
 * Contratación electrónica (clickwrap) en 5 pasos + acuse de recibo.
 * Ley 527 de 1999 (arts. 7, 9, 10, 14, 20-22), Ley 1480 (art. 50) y Ley 1581 (art. 9).
 */
(function () {
  'use strict';

  const L = window.KoraLogic;
  const { esc, store, toast, sha256, fmtDateTime, deviceSummary, setFieldError, download } = window.KoraUI;
  const { TERMS, TERMS_VERSION, COMPANY } = window.KoraData;

  const STEPS = ['Plan', 'Registro', 'Términos', 'Revisa y acepta', 'Pago'];

  const EMPTY = {
    step: 1, planId: 'pro',
    company: '', nit: '', name: '', role: '', email: '', phone: '',
    consentData: false, consentMarketing: false,
    acceptTerms: false, acceptPolicy: false,
  };

  function termsText() {
    return TERMS.map(([t, body], i) => `${i + 1}. ${t}. ${body}`).join('\n');
  }

  function stepper(current) {
    return `<ol class="stepper" aria-label="Pasos de la contratación">
      ${STEPS.map((s, i) => {
        const n = i + 1;
        const state = n < current ? 'done' : n === current ? 'current' : 'todo';
        return `<li class="is-${state}" ${n === current ? 'aria-current="step"' : ''}><span class="dot">${n < current ? '✓' : n}</span><span>${s}</span></li>`;
      }).join('')}
    </ol>`;
  }

  function field(id, label, value, { type = 'text', hint = '', autocomplete = '', required = true } = {}) {
    const desc = [hint ? `${id}-hint` : '', `${id}-error`].filter(Boolean).join(' ');
    return `<div class="field">
      <label for="${id}">${label}${required ? '' : ' <span class="muted">(opcional)</span>'}</label>
      ${hint ? `<span class="hint" id="${id}-hint">${hint}</span>` : ''}
      <input id="${id}" name="${id}" type="${type}" value="${esc(value)}" ${autocomplete ? `autocomplete="${autocomplete}"` : ''} ${required ? 'required aria-required="true"' : ''} aria-describedby="${desc}">
      <span class="error" id="${id}-error" role="alert"></span>
    </div>`;
  }

  window.KoraViews.checkout = function (main, params) {
    let s = { ...EMPTY, ...store.get('checkout', {}) };
    // El pago solo se alcanza validando el OTP en esta sesión.
    if (s.step > 4) s = { ...s, step: 4 };
    if (params.get('plan') && L.PLANS.some((p) => p.id === params.get('plan'))) {
      s = { ...s, planId: params.get('plan'), step: Math.min(s.step, 2) === 1 ? 2 : s.step };
    }
    let otp = null;
    let otpIssuedAt = 0;
    let otpAttempts = 0;

    const save = (patch) => { s = { ...s, ...patch }; store.set('checkout', s); };
    const plan = () => L.PLANS.find((p) => p.id === s.planId);
    const go = (step) => { save({ step }); draw(); main.querySelector('h2')?.focus(); };

    function stepPlan() {
      return `<h2 tabindex="-1">Elige tu plan</h2>
        <fieldset class="plan-pick"><legend class="sr-only">Plan</legend>
        ${L.PLANS.map((p) => `<label class="check"><input type="radio" name="plan" value="${p.id}" ${p.id === s.planId ? 'checked' : ''}>
          <span><strong>${esc(p.name)}</strong> · ${L.formatCOP(p.total)} mensuales (IVA incluido)<br><span class="muted">${esc(p.features.slice(0, 2).join(' · '))}</span></span></label>`).join('')}
        </fieldset>
        <div class="btn-row"><button class="btn btn-coral" data-next>Continuar</button></div>`;
    }

    function stepRegister() {
      return `<h2 tabindex="-1">Crea tu cuenta</h2>
        <form novalidate id="reg">
          <div class="grid-2">
            ${field('company', 'Razón social', s.company, { autocomplete: 'organization' })}
            ${field('nit', 'NIT con dígito de verificación', s.nit, { hint: 'Ejemplo: 900123456-8' })}
            ${field('name', 'Tu nombre completo', s.name, { autocomplete: 'name' })}
            ${field('role', 'Cargo', s.role, { autocomplete: 'organization-title', required: false })}
            ${field('email', 'Correo corporativo', s.email, { type: 'email', autocomplete: 'email', hint: 'Allí llegará el código de verificación.' })}
            ${field('phone', 'Celular', s.phone, { type: 'tel', autocomplete: 'tel', required: false })}
          </div>
          <div class="consent">
            <p class="consent-text">De acuerdo con la Ley 1581 de 2012, autorizo de manera previa, expresa e informada a Kora IA S.A.S. para tratar mis datos personales (nombre, correo, teléfono, cargo y registros de uso) con el fin de crear mi cuenta, prestar el servicio, facturar, darme soporte y mantener la seguridad de la plataforma. Sé que mis datos pueden ser almacenados por proveedores de nube e IA ubicados en Estados Unidos, que actúan como encargados bajo contrato. Puedo conocer, actualizar, rectificar y suprimir mis datos y revocar esta autorización en <a href="mailto:${COMPANY.dataEmail}">${COMPANY.dataEmail}</a>. <a href="#/privacidad" target="_blank">Política completa<span class="sr-only"> (abre en otra pestaña)</span></a>.</p>
            <label class="check"><input type="checkbox" id="consentData" ${s.consentData ? 'checked' : ''} aria-describedby="consentData-error">
              <span>Acepto el tratamiento de mis datos para las finalidades anteriores. <strong>(obligatoria para usar el servicio)</strong></span></label>

            <span class="error field-error" id="consentData-error" role="alert"></span>
            <label class="check"><input type="checkbox" id="consentMarketing" ${s.consentMarketing ? 'checked' : ''}>
              <span>Acepto recibir información comercial de Kora. <span class="muted">(opcional, puedes darte de baja en cada mensaje)</span></span></label>
          </div>
          <div class="btn-row"><button type="button" class="btn btn-ghost" data-back>Volver</button><button type="submit" class="btn btn-coral">Continuar</button></div>
        </form>`;
    }

    function stepTerms() {
      return `<h2 tabindex="-1">Lee los términos y condiciones</h2>
        <p class="muted">Versión ${TERMS_VERSION}. Puedes leerlos completos aquí o en <a href="#/terminos" target="_blank">otra pestaña<span class="sr-only"> (abre en otra pestaña)</span></a>. Los aceptas en el siguiente paso.</p>
        <div class="terms-box" tabindex="0" role="region" aria-label="Texto de los términos y condiciones">
          ${TERMS.map(([t, b], i) => `<p><strong>${i + 1}. ${esc(t)}.</strong> ${esc(b)}</p>`).join('')}
        </div>
        <div class="btn-row"><button class="btn btn-ghost" data-back>Volver</button><button class="btn btn-coral" data-next>Ya los leí, continuar</button></div>`;
    }

    function stepAccept() {
      const p = plan();
      const b = L.priceBreakdown(p.total);
      return `<h2 tabindex="-1">Revisa y acepta</h2>
        <div class="summary">
          <dl>
            <div><dt>Plan</dt><dd>${esc(p.name)} <button class="link" data-goto="1">Cambiar</button></dd></div>
            <div><dt>Valor mensual</dt><dd><strong>${L.formatCOP(b.total)}</strong> IVA incluido <span class="muted">(base ${L.formatCOP(b.base)} + IVA ${L.formatCOP(b.iva)})</span></dd></div>
            <div><dt>Empresa</dt><dd>${esc(s.company)} · NIT ${esc(s.nit)} <button class="link" data-goto="2">Corregir</button></dd></div>
            <div><dt>Quien acepta</dt><dd>${esc(s.name)} · ${esc(s.email)}</dd></div>
            <div><dt>Condiciones</dt><dd>Renovación automática mensual. Puedes cancelar cuando quieras, sin multa.</dd></div>
          </dl>
        </div>
        <p class="doc-links">Documentos: <a href="#/terminos" target="_blank">Términos y Condiciones ${TERMS_VERSION}<span class="sr-only"> (abre en otra pestaña)</span></a> · <a href="#/privacidad" target="_blank">Política de Tratamiento de Datos<span class="sr-only"> (abre en otra pestaña)</span></a></p>
        <label class="check"><input type="checkbox" id="acceptTerms" ${s.acceptTerms ? 'checked' : ''}>
          <span>He leído y acepto los Términos y Condiciones (${TERMS_VERSION}) y el Anexo de Transmisión de Datos.</span></label>
        <label class="check"><input type="checkbox" id="acceptPolicy" ${s.acceptPolicy ? 'checked' : ''}>
          <span>He leído la Política de Tratamiento de Datos Personales de Kora.</span></label>
        <div class="otp-block">
          <div class="field">
            <label for="otp">Código de 6 dígitos enviado a ${esc(s.email)}</label>
            <span class="hint" id="otp-hint">Vence en ${L.OTP_MINUTES} minutos. Puedes pegarlo.</span>
            <input id="otp" class="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-describedby="otp-hint otp-error" disabled>
            <span class="error" id="otp-error" role="alert"></span>
          </div>
          <button class="btn btn-teal btn-sm" id="send-otp">Enviar código</button>
        </div>
        <div class="btn-row">
          <button class="btn btn-ghost" data-back>Volver</button>
          <button class="btn btn-coral" id="accept" disabled aria-describedby="accept-help">Aceptar y continuar al pago</button>
        </div>
        <p id="accept-help" class="muted"><small>El botón se activa al marcar las dos casillas y escribir el código. Si no las marcas, no hay contrato.</small></p>`;
    }

    function stepPay() {
      const p = plan();
      return `<h2 tabindex="-1">Pago</h2>
        <div class="gateway">
          <p class="gateway-head"><span class="lock" aria-hidden="true">🔒</span> Pasarela de pagos certificada PCI DSS <span class="badge">Simulación</span></p>
          <p>Vas a pagar <strong>${L.formatCOP(p.total)}</strong> (IVA incluido) por el plan ${esc(p.name)}.</p>
          <div class="callout"><p>Kora <strong>no recibe ni guarda</strong> números de tarjeta, CVV ni claves. El pago lo procesa la pasarela; Kora solo recibe la confirmación.</p></div>
          <div class="btn-row"><button class="btn btn-ghost" data-back>Volver</button><button class="btn btn-coral" id="pay">Pagar en la pasarela</button></div>
          <p id="pay-status" role="status" class="muted"></p>
        </div>`;
    }

    async function finish() {
      const seq = store.get('contractSeq', 153) + 1;
      store.set('contractSeq', seq);
      const now = new Date();
      const hash = await sha256(termsText());
      const p = plan();
      const record = {
        contrato: L.contractNumber(seq, now.getFullYear()),
        cliente: s.company, nit: s.nit,
        usuario: `${s.name}, ${s.email}`,
        plan: `${p.name} · ${L.formatCOP(p.total)} mensuales IVA incluido`,
        version_terminos: `T&C ${TERMS_VERSION}`,
        hash_sha256: hash,
        fecha_hora: fmtDateTime(now) + ' (UTC-5)',
        fecha_iso: now.toISOString(),
        ip: '181.xx.xx.24 (simulada en el prototipo)',
        dispositivo: deviceSummary(),
        metodo_firma: `${p.signature}`,
        resultado_otp: otpAttempts <= 1 ? 'Validado en el primer intento' : `Validado en el intento ${otpAttempts}`,
        autorizacion_datos: 'Sí',
        autorizacion_comercial: s.consentMarketing ? 'Sí' : 'No',
        acuse: `Correo a ${s.email} con el PDF de los términos y el resumen del pedido`,
      };
      store.set('contract', record);
      store.set('checkout', { ...EMPTY });
      drawReceipt(record);
    }

    function drawReceipt(r) {
      const rows = [
        ['Número de contrato', r.contrato], ['Cliente / NIT', `${r.cliente} / ${r.nit}`], ['Usuario que acepta', r.usuario],
        ['Plan', r.plan], ['Versión de términos', r.version_terminos], ['Hash SHA-256', r.hash_sha256],
        ['Fecha y hora', r.fecha_hora], ['Dirección IP y dispositivo', `${r.ip} · ${r.dispositivo}`],
        ['Método de firma', r.metodo_firma], ['Resultado OTP', r.resultado_otp],
        ['Autorización de datos / comercial', `${r.autorizacion_datos} / ${r.autorizacion_comercial}`], ['Acuse de recibo', r.acuse],
      ];
      main.querySelector('.checkout-body').innerHTML = `
        <div class="receipt">
          <p class="eyebrow">Acuse de recibo</p>
          <h2 tabindex="-1">¡Listo! Tu contrato ${esc(r.contrato)} quedó registrado.</h2>
          <p>Te enviamos un correo con este resumen, el PDF de los términos y la factura electrónica. Este registro es la prueba de que aceptaste: quién, qué versión, cuándo y por qué medio <span class="law">Ley 527 arts. 7, 9 y 10</span>.</p>
          <div class="table-wrap"><table><caption>Registro de la aceptación (log)</caption>
            <tbody>${rows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td class="${k.startsWith('Hash') ? 'mono' : ''}">${esc(v)}</td></tr>`).join('')}</tbody>
          </table></div>
          <div class="btn-row" style="margin-top:1.2rem">
            <a class="btn btn-coral" href="#/panel">Ir a mi panel</a>
            <button class="btn btn-ghost" id="dl-log">Descargar registro (JSON)</button>
          </div>
        </div>`;
      main.querySelector('#dl-log').addEventListener('click', () => download(`${r.contrato}.json`, JSON.stringify(r, null, 2)));
      main.querySelector('h2').focus();
      main.querySelector('.stepper').outerHTML = '';
    }

    function bindRegister(form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = (id) => form.querySelector('#' + id).value.trim();
        const checks = [
          ['company', v('company').length >= 3 ? '' : 'Escribe la razón social de la empresa.'],
          ['nit', L.validateNIT(v('nit')).reason],
          ['name', v('name').length >= 5 ? '' : 'Escribe tu nombre completo.'],
          ['email', L.validateEmail(v('email')) ? '' : 'Escribe un correo válido, por ejemplo ana@tuempresa.co.'],
        ];
        checks.forEach(([id, msg]) => setFieldError(form.querySelector('#' + id), msg));
        const consent = form.querySelector('#consentData');
        const consentMsg = consent.checked ? '' : 'Debes autorizar el tratamiento de datos para crear la cuenta.';
        setFieldError(consent, consentMsg);
        const firstBad = checks.find(([, m]) => m);
        save({ company: v('company'), nit: v('nit'), name: v('name'), role: v('role'), email: v('email'), phone: v('phone'), consentData: consent.checked, consentMarketing: form.querySelector('#consentMarketing').checked });
        if (firstBad) return form.querySelector('#' + firstBad[0]).focus();
        if (consentMsg) return consent.focus();
        go(3);
      });
    }

    function bindAccept(root) {
      const t = root.querySelector('#acceptTerms');
      const pol = root.querySelector('#acceptPolicy');
      const input = root.querySelector('#otp');
      const btn = root.querySelector('#accept');
      const refresh = () => {
        save({ acceptTerms: t.checked, acceptPolicy: pol.checked });
        btn.disabled = !(t.checked && pol.checked && /^\d{6}$/.test(input.value) && otp);
      };
      [t, pol].forEach((el) => el.addEventListener('change', refresh));
      input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, '').slice(0, 6); setFieldError(input, ''); refresh(); });
      root.querySelector('#send-otp').addEventListener('click', (e) => {
        otp = L.generateOTP();
        otpIssuedAt = Date.now();
        otpAttempts = 0;
        input.disabled = false;
        input.value = '';
        e.currentTarget.textContent = 'Enviar otro código';
        toast({ title: `Bandeja simulada · ${s.email}`, html: `<span>Tu código de Kora es</span><span class="otp-code">${otp}</span><span><small>Vence en ${L.OTP_MINUTES} minutos. No lo compartas.</small></span>`, timeout: 0 });
        input.focus();
        refresh();
      });
      btn.addEventListener('click', () => {
        otpAttempts += 1;
        const r = L.validateOTP(input.value, otp, otpIssuedAt, Date.now());
        if (!r.ok) {
          const left = L.MAX_OTP_ATTEMPTS - otpAttempts;
          if (left <= 0) { otp = null; input.disabled = true; }
          setFieldError(input, left <= 0 ? 'Superaste los intentos. Pide un código nuevo.' : `${r.reason} Te quedan ${left} intentos.`);
          refresh();
          return input.disabled ? root.querySelector('#send-otp').focus() : input.focus();
        }
        document.querySelectorAll('.toast').forEach((el) => el.remove());
        go(5);
      });
    }

    function bindPay(root) {
      root.querySelector('#pay').addEventListener('click', (e) => {
        e.currentTarget.disabled = true;
        root.querySelector('#pay-status').textContent = 'Procesando el pago en la pasarela…';
        setTimeout(finish, 1100);
      });
    }

    function draw() {
      const views = { 1: stepPlan, 2: stepRegister, 3: stepTerms, 4: stepAccept, 5: stepPay };
      main.innerHTML = `<div class="wrap checkout">
        <header class="page-head"><p class="eyebrow">Contratación electrónica · Paso ${s.step} de 5</p><h1>Contratar Kora ${esc(plan().name)}</h1></header>
        ${stepper(s.step)}
        <div class="card checkout-body">${views[s.step]()}</div>
      </div>`;
      const body = main.querySelector('.checkout-body');
      body.querySelector('[data-next]')?.addEventListener('click', () => {
        if (s.step === 1) save({ planId: body.querySelector('input[name=plan]:checked').value });
        go(s.step + 1);
      });
      body.querySelector('[data-back]')?.addEventListener('click', () => go(s.step - 1));
      body.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.goto))));
      if (s.step === 2) bindRegister(body.querySelector('#reg'));
      if (s.step === 4) bindAccept(body);
      if (s.step === 5) bindPay(body);
    }

    draw();
  };
})();
