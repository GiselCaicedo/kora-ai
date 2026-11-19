/* Contenido legal y datos de ejemplo del prototipo (tomados del documento del proyecto). */
(function () {
  'use strict';

  const COMPANY = Object.freeze({
    name: 'Kora IA S.A.S.',
    nit: '901.234.567-7 (ficticio)',
    city: 'Bogotá D.C.',
    legalEmail: 'legal@kora-ia.co',
    dataEmail: 'datos@kora-ia.co',
    supportEmail: 'soporte@kora-ia.co',
  });

  const TERMS_VERSION = 'v1.0';

  const TERMS = Object.freeze([
    ['Partes', 'Kora IA S.A.S., sociedad con domicilio en Bogotá, NIT 901.234.567-7 (ficticio), correo legal@kora-ia.co (en adelante «Kora»), y la persona jurídica o natural que se registra en la plataforma (en adelante «el Cliente»).'],
    ['Objeto', 'Kora presta al Cliente el servicio de asistente virtual con inteligencia artificial para atender a sus usuarios por los canales que el Cliente conecte, según el plan contratado.'],
    ['Planes, precio y pago', 'Los precios están en pesos colombianos con IVA incluido. El cobro es mensual y anticipado por medio de la pasarela de pagos. Kora expide factura electrónica. Si el precio cambia, se avisa con 30 días de anticipación y el Cliente puede cancelar antes de que aplique.'],
    ['Duración y cancelación', 'El contrato es mensual y se renueva automáticamente. El Cliente puede cancelar cuando quiera desde su panel, sin multa. La cancelación aplica al final del periodo pagado.'],
    ['Derecho de retracto y reversión del pago', 'Cuando el Cliente sea consumidor, puede retractarse dentro de los 5 días hábiles siguientes a la contratación, salvo que el servicio ya haya empezado a prestarse con su acuerdo (Ley 1480, art. 47). La reversión del pago procede en los casos del art. 51 de la misma ley.'],
    ['Obligaciones de Kora', 'Mantener el servicio disponible el 99,5 % del mes; proteger la información según la política de seguridad; avisar al Cliente de cualquier incidente que afecte sus datos en un plazo máximo de 48 horas; dar soporte en horario hábil.'],
    ['Obligaciones del Cliente', 'Obtener la autorización de sus propios usuarios para el tratamiento de datos; no usar el asistente para spam, fraude, suplantación ni contenido ilegal; no cargar datos sensibles salvo que su plan lo permita y tenga autorización; respetar los horarios de la Ley 2300 de 2023 cuando envíe mensajes comerciales; cuidar sus contraseñas.'],
    ['Uso de la inteligencia artificial', 'Las respuestas se generan de forma automática y pueden tener errores. El asistente siempre se presenta como IA y ofrece pasar la conversación a un asesor. Kora no usa las conversaciones del Cliente para entrenar modelos sin su autorización expresa y por separado.'],
    ['Datos personales', 'Kora actúa como encargada del tratamiento de los datos de los usuarios del Cliente y solo los trata según sus instrucciones. Las condiciones están en el Anexo de Transmisión de Datos, que hace parte de este contrato.'],
    ['Propiedad intelectual', 'El software, la marca y la documentación son de Kora. El Cliente recibe una licencia de uso no exclusiva, que no puede transferir y que dura lo mismo que el contrato. La información que carga el Cliente sigue siendo suya.'],
    ['Responsabilidad', 'Kora responde por los daños que cause por su culpa en la prestación del servicio. Esta responsabilidad no se limita en casos de dolo o culpa grave, ni frente a los derechos que la ley le da al consumidor.'],
    ['Suspensión', 'Kora puede suspender la cuenta si se usa para fraude o actividades ilegales, avisando antes al correo registrado, salvo que sea urgente por seguridad.'],
    ['Terminación y devolución de datos', 'Cuando termina el contrato, el Cliente tiene 30 días para descargar su información. Después de ese plazo Kora la elimina y entrega un certificado de supresión.'],
    ['Peticiones, quejas y reclamos', 'Se reciben en soporte@kora-ia.co y en el formulario del panel. La respuesta se da en máximo 15 días hábiles. El Cliente también puede acudir a la Superintendencia de Industria y Comercio (www.sic.gov.co).'],
    ['Modificaciones', 'Los cambios a estos términos se avisan con 30 días de anticipación. Si el Cliente no está de acuerdo, puede terminar el contrato sin costo.'],
    ['Ley aplicable', 'Este contrato se rige por las leyes de Colombia. Las diferencias se intentarán resolver primero por arreglo directo entre las partes.'],
    ['Aceptación', 'El Cliente declara que leyó estos términos y que los acepta por medio de mensaje de datos, conforme a la Ley 527 de 1999.'],
  ]);

  const POLICY = Object.freeze([
    ['Responsable', 'Kora IA S.A.S., NIT 901.234.567-7 (ficticio), domicilio en Bogotá, correo datos@kora-ia.co, teléfono (601) 000 0000.'],
    ['Marco legal', 'Ley Estatutaria 1581 de 2012, Decreto 1074 de 2015 (capítulos 25 y 26) y Circular Externa 002 de 2024 de la SIC sobre inteligencia artificial.'],
    ['Alcance', 'Aplica a las bases de datos de clientes, usuarios administradores, prospectos, empleados y proveedores. En cuanto a los datos de las personas que escriben al asistente, Kora actúa como encargada y sigue las instrucciones de cada cliente.'],
    ['Principios', 'Legalidad, finalidad, libertad, veracidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad.'],
    ['Finalidades', 'Crear y administrar cuentas; prestar el servicio contratado; facturar; dar soporte; enviar información del servicio; enviar información comercial solo con autorización; cumplir obligaciones legales; mantener la seguridad de la plataforma.'],
    ['Datos sensibles y de menores', 'Kora no trata datos sensibles salvo con autorización explícita y en el módulo habilitado para eso. El titular no está obligado a autorizar su tratamiento. Kora no trata datos de menores de edad.'],
    ['Uso de inteligencia artificial', 'Las conversaciones se procesan con un modelo de lenguaje para generar las respuestas. Kora no toma decisiones con efectos jurídicos sobre las personas usando solo la IA. Los datos no se usan para entrenar modelos sin una autorización aparte.'],
    ['Transmisión internacional', 'Kora usa proveedores de nube y de IA en Estados Unidos que actúan como encargados, con contrato de transmisión y medidas de seguridad.'],
    ['Derechos de los titulares', 'Conocer, actualizar, rectificar y suprimir sus datos, revocar la autorización, pedir prueba de ella, ser informado y presentar quejas ante la SIC.'],
    ['Procedimiento', 'Las consultas y reclamos se envían a datos@kora-ia.co o por el formulario de esta página. Las consultas se responden en 10 días hábiles y los reclamos en 15 días hábiles.'],
    ['Área responsable', 'Oficial de Protección de Datos de Kora.'],
    ['Seguridad', 'Kora toma medidas técnicas, humanas y administrativas para evitar la pérdida, consulta, uso o acceso no autorizado a los datos.'],
    ['Vigencia', 'Esta política rige desde el 1 de diciembre de 2026. Los datos se conservan mientras sean necesarios para la finalidad. Los cambios importantes se avisan antes de aplicarse.'],
  ]);

  /** Base de conocimiento de la pyme de ejemplo. Solo se usan los documentos validados. */
  const KNOWLEDGE = [
    { id: 'kb1', title: 'Horario de atención', validated: true, keywords: ['horario', 'abren', 'cierran', 'hora', 'abierto', 'domingo', 'festivo'],
      answer: 'Abrimos de lunes a sábado de 6:00 a. m. a 8:00 p. m. y domingos y festivos de 7:00 a. m. a 1:00 p. m.' },
    { id: 'kb2', title: 'Precios de la torta de chocolate', validated: true, keywords: ['torta', 'chocolate', 'precio', 'cuesta', 'vale', 'valor'],
      answer: 'La torta de chocolate de 10 porciones cuesta $68.000 con IVA incluido. Se pide con 24 horas de anticipación.' },
    { id: 'kb3', title: 'Domicilios', validated: true, keywords: ['domicilio', 'domicilios', 'envio', 'envian', 'entregan', 'llevan'],
      answer: 'Hacemos domicilios en Chapinero y Teusaquillo. El envío cuesta $5.000 y llega en 40 minutos aproximadamente.' },
    { id: 'kb4', title: 'Pan sin gluten', validated: true, keywords: ['gluten', 'celiaco', 'integral', 'sin'],
      answer: 'Tenemos pan sin gluten los martes y viernes. Se prepara en un área separada, pero no podemos garantizar que no haya trazas.' },
    { id: 'kb5', title: 'Promoción de diciembre (borrador)', validated: false, keywords: ['descuento', 'promocion', 'promo', 'oferta', 'diciembre'],
      answer: '2x1 en pan de bono todo diciembre.' },
  ];

  const ACCESSIBILITY_CHECKLIST = Object.freeze([
    ['1.1.1', 'Contenido no textual', 'A', 'Íconos decorativos con aria-hidden; botones con nombre accesible.'],
    ['1.3.1', 'Información y relaciones', 'A', 'HTML semántico: encabezados en orden, tablas con encabezados y caption, formularios con label.'],
    ['1.4.3', 'Contraste mínimo', 'AA', 'Texto principal 14,6:1 y enlaces 7,4:1 sobre el fondo. Modo de alto contraste adicional.'],
    ['1.4.4', 'Cambio de tamaño del texto', 'AA', 'Controles A / A+ / A++ y zoom del navegador hasta 200 % sin perder contenido.'],
    ['1.4.10', 'Reajuste del contenido (reflow)', 'AA', 'Diseño responsivo sin desplazamiento horizontal a 320 px de ancho.'],
    ['1.4.11', 'Contraste de componentes', 'AA', 'Bordes de campos y foco con contraste mayor a 3:1.'],
    ['2.1.1', 'Teclado', 'A', 'Todo el flujo (planes, contratación, OTP, chat y panel) se usa solo con teclado.'],
    ['2.2.1', 'Tiempo ajustable', 'A', 'El OTP vence a los 5 min, pero se puede pedir otro sin perder lo diligenciado.'],
    ['2.4.1', 'Evitar bloques', 'A', 'Enlace «Saltar al contenido» al inicio de la página.'],
    ['2.4.7 / 2.4.11', 'Foco visible y no oculto', 'AA', 'Contorno azul de 3 px; el encabezado fijo no tapa el elemento enfocado.'],
    ['2.5.8', 'Tamaño del objetivo (mínimo)', 'AA', 'Botones y casillas de al menos 24 × 24 px (la mayoría 48 px).'],
    ['3.1.1', 'Idioma de la página', 'A', 'lang="es-CO" en el documento.'],
    ['3.3.1', 'Identificación de errores', 'A', 'Errores de NIT, correo y OTP explicados en texto junto al campo, no solo con color.'],
    ['3.3.2', 'Etiquetas o instrucciones', 'A', 'Etiquetas visibles permanentes y ejemplos de formato.'],
    ['3.3.7', 'Entrada redundante', 'A', 'Los datos del registro no se vuelven a pedir en el resumen ni en el pago.'],
    ['3.3.8', 'Autenticación accesible (mínima)', 'AA', 'El OTP se puede pegar; no hay pruebas cognitivas ni CAPTCHA.'],
    ['4.1.2', 'Nombre, función y valor', 'A', 'Botones con aria-pressed y aria-expanded; pestañas con roles ARIA.'],
    ['4.1.3', 'Mensajes de estado', 'AA', 'Avisos y respuestas del chat anunciados con aria-live.'],
  ]);

  window.KoraData = { COMPANY, TERMS_VERSION, TERMS, POLICY, KNOWLEDGE, ACCESSIBILITY_CHECKLIST };
})();
