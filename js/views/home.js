/* Inicio: propuesta de valor y modelo de negocio (Fase 1 y 2). */
(function () {
  'use strict';

  window.KoraViews.home = function (main) {
    main.innerHTML = `
      <section class="hero">
        <div class="wrap hero-grid">
          <div class="hero-copy reveal">
            <p class="eyebrow">Atención al cliente con IA para pymes en Colombia</p>
            <h1>Responde a cada cliente, <em>a cualquier hora</em>, sin dejar de cumplir la ley.</h1>
            <p class="lede">Kora conecta un asistente virtual a tu WhatsApp, tu página web y tus redes. Responde con la información que tú validas, se presenta siempre como IA y te pasa la conversación cuando hace falta una persona.</p>
            <div class="btn-row">
              <a class="btn btn-coral" href="#/planes">Ver planes y precios</a>
              <a class="btn btn-ghost" href="#/chat">Probar el asistente</a>
            </div>
            <ul class="hero-facts" aria-label="Datos clave">
              <li><strong>24/7</strong><span>atención automática</span></li>
              <li><strong>99,5 %</strong><span>disponibilidad por contrato</span></li>
              <li><strong>48 h</strong><span>aviso máximo ante un incidente</span></li>
            </ul>
          </div>

          <figure class="hero-phone reveal" aria-label="Ejemplo de conversación del asistente de una panadería">
            <div class="phone">
              <div class="phone-head"><span class="dot" aria-hidden="true"></span> Panadería Ejemplo · <span class="badge badge-teal">Asistente con IA</span></div>
              <div class="phone-body">
                <p class="bubble bot">Hola, soy el asistente virtual de Panadería Ejemplo. Funciono con inteligencia artificial y me puedo equivocar. ¿Quieres hablar con una persona? Escríbeme «asesor».</p>
                <p class="bubble user">¿Cuánto vale la torta de chocolate?</p>
                <p class="bubble bot">La torta de 10 porciones cuesta $68.000 con IVA incluido. Se pide con 24 horas de anticipación.<span class="src">Fuente: Precios validados por la panadería</span></p>
                <p class="bubble user">¿Y tienen descuento?</p>
                <p class="bubble bot">No tengo información confirmada sobre descuentos. Te comunico con un asesor para que no te dé un dato equivocado.</p>
              </div>
            </div>
            <figcaption>El asistente no inventa precios ni promociones: si no está validado, lo pasa a una persona.</figcaption>
          </figure>
        </div>
      </section>

      <section class="section band" aria-labelledby="problema">
        <div class="wrap split">
          <div>
            <p class="eyebrow">El problema</p>
            <h2 id="problema">Los mensajes que nadie contesta se convierten en ventas que se van.</h2>
          </div>
          <div class="stack">
            <p>Las pymes atienden por WhatsApp, Instagram y su página web, pero casi nunca tienen personal para responder rápido. Kora automatiza las preguntas frecuentes, el catálogo y la captura de pedidos, y deja a tu equipo los casos que de verdad necesitan a una persona.</p>
            <p class="muted">Modelo de negocio: SaaS B2B con suscripción mensual, sin permanencia y sin inversión en infraestructura propia.</p>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="como">
        <div class="wrap">
          <p class="eyebrow">Cómo se contrata</p>
          <h2 id="como">De la oferta al servicio, todo queda registrado.</h2>
          <ol class="flow">
            <li><span class="n">01</span><h3>Oferta</h3><p>Precio total con IVA, qué incluye y enlace a los términos antes de pagar.</p><span class="law">Ley 1480 art. 50</span></li>
            <li><span class="n">02</span><h3>Registro</h3><p>Correo verificado, NIT de la empresa y autorización de datos.</p><span class="law">Ley 1581 art. 9</span></li>
            <li><span class="n">03</span><h3>Aceptación</h3><p>Casilla sin marcar + código OTP: firma electrónica con prueba.</p><span class="law">Ley 527 art. 7</span></li>
            <li><span class="n">04</span><h3>Pago</h3><p>Pasarela certificada PCI DSS. Kora nunca ve tu tarjeta.</p><span class="law">PCI DSS</span></li>
            <li><span class="n">05</span><h3>Acuse</h3><p>Correo con número de contrato, PDF de términos y factura electrónica.</p><span class="law">Ley 527 arts. 20-22</span></li>
          </ol>
        </div>
      </section>

      <section class="section band-dark" aria-labelledby="principios">
        <div class="wrap">
          <p class="eyebrow">Cómo trabaja la IA</p>
          <h2 id="principios">Cuatro reglas que el asistente no puede saltarse.</h2>
          <div class="rules">
            <article><h3>Se presenta como IA</h3><p>Siempre dice que es un asistente automático y ofrece pasar a una persona en cualquier momento.</p></article>
            <article><h3>Solo responde con lo validado</h3><p>Usa los documentos que la pyme aprobó. Si no sabe, no inventa: deriva a un asesor.</p></article>
            <article><h3>Oculta tus datos al modelo</h3><p>Tarjetas, documentos, celulares y datos de salud se ocultan antes de enviar el texto al proveedor de IA.</p></article>
            <article><h3>No decide por ti</h3><p>Nunca aprueba créditos, cancela contratos ni da conceptos médicos. Eso lo decide una persona.</p></article>
          </div>
          <p class="rules-foot">Basado en la Circular Externa 002 de 2024 de la SIC y en el código de ética de Kora (Ley 842 de 2003).</p>
        </div>
      </section>
    `;
  };
})();
