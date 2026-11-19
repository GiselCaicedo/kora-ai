/* Declaración y lista de verificación de accesibilidad WCAG 2.2 AA (Fase 7). */
(function () {
  'use strict';

  const { esc } = window.KoraUI;
  const { ACCESSIBILITY_CHECKLIST } = window.KoraData;

  const PROFILES = [
    ['Baja visión o daltonismo', 'Contraste de 4,5:1 o más, texto ampliable hasta 200 % y modo de alto contraste. El estado nunca depende solo del color.'],
    ['Personas ciegas', 'HTML semántico, encabezados en orden y mensajes del chat anunciados por el lector de pantalla (NVDA, JAWS, VoiceOver).'],
    ['Movilidad reducida', 'Todo se usa con teclado, foco visible y botones grandes. Sin gestos complejos ni arrastrar.'],
    ['Discapacidad cognitiva', 'Lenguaje sencillo, pasos numerados, errores explicados en texto y sin límites de tiempo estrictos.'],
    ['Conexión lenta o equipo básico', 'Sin frameworks pesados: la página carga en redes 3G y se adapta a pantallas pequeñas.'],
  ];

  window.KoraViews.accessibility = function (main) {
    main.innerHTML = `<div class="wrap">
      <header class="page-head">
        <p class="eyebrow">Accesibilidad electrónica e inclusión digital</p>
        <h1>Hecha para que todos la puedan usar.</h1>
        <p>Kora tiene dos interfaces: el panel donde la pyme configura su asistente y el chat que usan sus clientes. Ambas siguen las pautas WCAG 2.2 nivel AA (Ley 1618 de 2013). Prueba la barra de arriba: tamaño de texto y alto contraste.</p>
      </header>

      <section aria-labelledby="who" class="section-tight">
        <h2 id="who">Para quién lo pensamos</h2>
        <div class="profiles">${PROFILES.map(([t, b]) => `<article class="card"><h3>${esc(t)}</h3><p class="mt-0">${esc(b)}</p></article>`).join('')}</div>
      </section>

      <section aria-labelledby="check" class="section-tight">
        <h2 id="check">Lista de verificación WCAG 2.2</h2>
        <div class="table-wrap"><table>
          <caption class="sr-only">Criterios de WCAG 2.2 aplicados en el prototipo</caption>
          <thead><tr><th scope="col">Criterio</th><th scope="col">Nombre</th><th scope="col">Nivel</th><th scope="col">Cómo se cumple en el prototipo</th><th scope="col">Estado</th></tr></thead>
          <tbody>${ACCESSIBILITY_CHECKLIST.map(([id, name, lv, how]) => `<tr><td class="mono">${esc(id)}</td><td>${esc(name)}</td><td>${esc(lv)}</td><td>${esc(how)}</td><td><span class="badge badge-ok">✓ Cumple</span></td></tr>`).join('')}</tbody>
        </table></div>
      </section>

      <section aria-labelledby="screens" class="section-tight">
        <h2 id="screens">Pantallas accesibles para revisar</h2>
        <ul class="screens">
          <li><a href="#/contratar?plan=pro"><strong>Registro y aceptación con OTP</strong><span>Etiquetas visibles, errores en texto, código que se puede pegar.</span></a></li>
          <li><a href="#/chat"><strong>Chat del asistente</strong><span>Mensajes anunciados con aria-live y botón permanente para hablar con una persona.</span></a></li>
          <li><a href="#/panel"><strong>Panel de la pyme</strong><span>Pestañas con flechas del teclado, tablas con encabezados.</span></a></li>
        </ul>
      </section>
    </div>`;
  };
})();
