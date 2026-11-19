# Kora IA · Prototipo de la plataforma

Prototipo del **Proyecto Final Integrador** de *Aspectos Legales, Comerciales y Éticos de la Profesión* (UAN, 2026).
Kora IA S.A.S. es una empresa ficticia que ofrece un asistente virtual con IA para la atención al cliente de pymes.

Es un sitio en HTML, CSS y JavaScript sin compilación, con un servidor pequeño en Node (`server.js`, sin dependencias)
que sirve las páginas y hace de intermediario con **Gemini** para el chat. No envía correos ni cobra pagos:
el OTP aparece en una «bandeja simulada» y los datos de la demo solo se guardan en el `localStorage` del navegador.

## Configurar Gemini

1. Copia `.env.example` como `.env` y escribe tu clave en `GEMINI_API_KEY`.
2. `.env` **no se sube al repositorio**: la clave solo la lee el servidor y nunca llega al navegador.

El servidor usa `gemini-flash-latest` y, si está saturado, prueba `gemini-flash-lite-latest` y `gemini-2.5-flash`
(se cambian con `GEMINI_MODEL` y `GEMINI_FALLBACK_MODELS`). Si no hay clave o no hay internet, el chat sigue
funcionando con la búsqueda local en la base de conocimiento.

Qué recibe Gemini: solo el mensaje **con los datos personales ya ocultos** (`[CELULAR]`, `[DOCUMENTO]`, `[TARJETA]`…)
y los documentos **validados** por la pyme. Los intentos de inyección se bloquean antes de llamar al modelo,
tanto en el navegador como en el servidor.

## Cómo correrlo

Con Node 20 o superior:

```sh
cd 04_Kora_AI
node server.js        # abrir http://localhost:5190
```

Con Docker (lee el mismo `.env`):

```sh
cd 04_Kora_AI
docker compose up --build   # abrir http://localhost:5190
docker compose down
```

Pruebas de la lógica:

```sh
npm test
```

## Qué muestra cada pantalla y qué evidencia cubre

| Ruta | Pantalla | Fase / norma |
|------|----------|--------------|
| `#/` | Propuesta de valor, modelo de negocio, proceso de contratación y reglas de la IA | Fases 1, 2 y 8 |
| `#/planes` | Precio total con IVA discriminado, NIT del proveedor, retracto y reversión | Ley 1480 arts. 23, 47, 50 y 51 |
| `#/contratar` | Clickwrap en 5 pasos: registro con NIT validado, autorización de datos, lectura de términos, casillas sin marcar + OTP, pasarela PCI DSS simulada y **acuse con registro de aceptación y hash SHA-256 real** | Ley 527 arts. 7, 9, 10, 14 y 20-22; Ley 1581 art. 9 |
| `#/chat` | Asistente de «Panadería Ejemplo»: aviso de privacidad con registro del «SÍ», filtro de datos antes del modelo, respuestas generadas con Gemini solo a partir de fuentes validadas, bloqueo de *prompt injection* y paso a un asesor humano | Ley 1581; Circular SIC 002/2024; dilemas éticos 1 y 2 |
| `#/panel` | Panel de la pyme: base de conocimiento (validado / borrador), campañas con bloqueo de horario, contrato, cancelación sin multa, exportar datos, accesos con MFA | Ley 2300 de 2023; T&C cláusulas 4 y 13; Ley 1273 |
| `#/privacidad` | Política de datos, matriz de datos y formulario de consultas y reclamos con radicado y **fecha límite en días hábiles** (con festivos de Colombia) | Ley 1581 arts. 8, 14 y 15 |
| `#/terminos` | Términos y condiciones v1.0 completos | Ley 527; Ley 1480 arts. 42-43 |
| `#/incidentes` | Matriz de riesgos (mapa de calor) y simulacro del protocolo de 6 pasos del caso INC-2026-007, con el dilema de la orden de ocultar | Ley 1273; Ley 1581 art. 17; Ley 842 |
| `#/accesibilidad` | Perfiles de usuarios, lista de verificación WCAG 2.2 AA y enlaces a las tres pantallas accesibles | Fase 7; Ley 1618 de 2013 |

## Guion corto para la sustentación (≈ 4 min)

1. **Planes** → mostrar el precio con IVA y el NIT. Clic en «Contratar Pro».
2. **Contratar** → enviar el registro vacío (errores en texto), poner un NIT con dígito equivocado, luego `900123456-8`.
   En «Revisa y acepta», marcar casillas, pedir el código, escribir uno errado y luego el correcto. Pagar.
   Mostrar el **registro de aceptación**: versión, hash, fecha, dispositivo y OTP.
3. **Demo del asistente** → responder «SÍ», preguntar la torta (fuente validada), el descuento (no inventa),
   el mensaje con cédula y celular (se ocultan) y la inyección (bloqueada).
4. **Panel → Campañas** → programar un domingo (bloqueado) y un martes 10 a. m. (permitido).
5. **Incidentes** → avanzar el protocolo hasta «Notificar» y elegir «ocultar» para mostrar las consecuencias.
6. **Barra superior** → A++ y alto contraste.

## Estructura

```
server.js           servidor estático + intermediario con Gemini (la clave vive aquí)
index.html          shell, navegación y barra de accesibilidad
css/                base.css (tokens), components.css, views.css
js/logic.js         lógica pura: IVA, días hábiles, Ley 2300, filtro de datos, OTP, NIT
js/data.js          términos, política, base de conocimiento y lista WCAG
js/ui.js            utilidades (escape de HTML, almacenamiento, SHA-256, avisos)
js/views/*.js       una pantalla por archivo
js/app.js           enrutador por hash
tests/              pruebas con node:test
```
