/* Inicio: qué es Kora y qué se puede probar en el prototipo (Fases 1, 2 y 8). */
(function () {
  'use strict';

  const { esc } = window.KoraUI;

  const TOUR = [
    ['#/chat', 'Probar el asistente', 'Escríbele como si fueras cliente de una panadería. Mira cómo oculta tus datos y cuándo te pasa con una persona.', 'Ley 1581 · Circular SIC 002 de 2024'],
    ['#/planes', 'Contratar un plan', 'Precios con IVA y un contrato que se acepta con un código enviado al correo. Al final queda un registro que sirve como prueba.', 'Ley 527 de 1999 · Ley 1480 de 2011'],
    ['#/panel', 'Panel de la pyme', 'Lo que ve el dueño del negocio: qué puede responder el bot, campañas con horario permitido y su contrato.', 'Ley 2300 de 2023'],
    ['#/privacidad', 'Tus datos', 'Política de datos y un formulario para pedir, corregir o borrar tu información, con la fecha límite de respuesta.', 'Ley 1581 de 2012'],
    ['#/incidentes', 'Incidentes', 'Simulacro de un ataque: qué se hace paso a paso y qué pasa si el jefe pide ocultarlo.', 'Ley 1273 de 2009 · Ley 842 de 2003'],
    ['#/accesibilidad', 'Accesibilidad', 'Cómo se puede usar con lector de pantalla, solo teclado o letra grande.', 'WCAG 2.2 AA'],
  ];

  const RULES = [
    ['Dice que es un bot', 'Lo avisa desde el primer mensaje y siempre deja pasar a una persona.'],
    ['No inventa', 'Solo responde con lo que el negocio aprobó. Si no lo sabe, lo dice.'],
    ['Cuida tus datos', 'Cédulas, celulares, tarjetas y datos de salud se ocultan antes de llegar a la IA.'],
    ['No decide por nadie', 'No aprueba créditos, no cancela contratos y no da conceptos médicos.'],
  ];

  window.KoraViews.home = function (main) {
    main.innerHTML = `
      <section class="hero">
        <div class="wrap hero-grid">
          <div class="hero-copy reveal">
            <h1>Un asistente para el WhatsApp de tu negocio que no inventa respuestas.</h1>
            <p class="lede">Kora contesta las preguntas de tus clientes a cualquier hora, solo con la información que tú apruebas. Cuando no sabe algo, te pasa la conversación.</p>
            <div class="btn-row">
              <a class="btn" href="#/chat">Probar el asistente</a>
              <a class="btn btn-quiet" href="#/planes">Ver planes</a>
            </div>
          </div>

          <figure class="hero-phone reveal" aria-label="Ejemplo de conversación del asistente de una panadería">
            <div class="phone">
              <div class="phone-head"><span class="avatar" aria-hidden="true">PE</span><span>Panadería Ejemplo<small>Asistente virtual</small></span></div>
              <div class="phone-body">
                <p class="bubble user">¿Cuánto vale la torta de chocolate?</p>
                <p class="bubble bot">La de 10 porciones vale $68.000 con IVA. Se pide con un día de anticipación.</p>
                <p class="bubble user">¿Y tienen descuento?</p>
                <p class="bubble bot">Eso todavía no lo tengo confirmado. ¿Te paso con alguien de la panadería?</p>
              </div>
            </div>
          </figure>
        </div>
      </section>

      <section class="section-tight" aria-labelledby="tour-title">
        <div class="wrap">
          <div class="section-head">
            <h2 id="tour-title">Qué puedes ver en este prototipo</h2>
            <p class="muted">Kora IA S.A.S. es una empresa ficticia del proyecto final de Aspectos Legales, Comerciales y Éticos. Cada parte muestra cómo cumple una norma colombiana.</p>
          </div>
          <ol class="tour">
            ${TOUR.map(([href, title, body, law], i) => `<li><a href="${href}">
              <span class="tour-n" aria-hidden="true">${i + 1}</span>
              <span class="tour-body"><strong>${esc(title)}</strong><span>${esc(body)}</span><span class="ref">${esc(law)}</span></span>
              <span class="tour-go" aria-hidden="true">→</span>
            </a></li>`).join('')}
          </ol>
        </div>
      </section>

      <section class="section rules-band" aria-labelledby="rules-title">
        <div class="wrap rules-grid">
          <div>
            <h2 id="rules-title">Las reglas del asistente</h2>
            <p class="muted">Salen del código de ética de la empresa y de la guía de la SIC para sistemas con IA.</p>
          </div>
          <dl class="rules">
            ${RULES.map(([t, b]) => `<div><dt>${esc(t)}</dt><dd>${esc(b)}</dd></div>`).join('')}
          </dl>
        </div>
      </section>
    `;
  };
})();
