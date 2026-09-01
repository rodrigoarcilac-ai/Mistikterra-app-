# Entrega profesional — Mistikterra

Lista para terminar el producto **sin App Store**: web en el celular
(PWA), un solo viaje activo, ~30 viajeros y Gabriela como anfitriona.

Hoy la UI ya está. Falta que **todos los teléfonos vean lo mismo** y que
tú puedas cambiar de destino sin reescribir la app.

**Hecho de verdad** = un viajero en iPhone y Gabriela en Android ven el
mismo punto de encuentro, la misma alerta y el mismo itinerario, en
`https://app.mistikterra.com` (o el dominio que elijan), con un icono
en la pantalla de inicio.

---

## 0. Congelar el alcance del primer entregable

Incluye:

- Login sin contraseña (correo; SMS solo si el grupo no usa email)
- Un viaje publicado (Turquía y Grecia ya está en `src/lib/tripData.ts`)
- Inicio, itinerario, Cerca, SOS WhatsApp, panel de guía
- Alertas / lobby / comunicados **sincronizados**
- Lista de invitados (no abierta al mundo)
- Añadir a pantalla de inicio (PWA ligera)

Deja fuera (para un contrato después):

- App Store / Play Store
- Saldos y pagos
- Varios viajes en paralelo con un CMS grande
- Notificaciones push (WhatsApp + alerta in-app bastan para 30 personas)

---

## 1. Cuenta y proyecto Firebase (producción)

1. Crea un proyecto Firebase solo para producción (otro de prueba, si puedes).
2. Activa **Authentication** (enlace mágico por correo).
3. Activa **Cloud Firestore**.
4. Activa **Storage** para fotos de hero e itinerario.
5. Anota las claves en `.env` (nunca las subas a Git; usa `.env.example`).

Sin este paso, `localStorage` sigue siendo “una copia por teléfono”.

---

## 2. Autenticación real

Sustituye la simulación de `src/lib/AuthProvider.tsx`:

1. Correo → Firebase Email Link (el viajero abre el enlace de verdad).
2. Rol **guía** solo para Gabriela (`mistikterra01@gmail.com` /
   `+52 984 106 2003`) vía custom claim o documento `guides/{uid}` —
   no solo una lista en el cliente.
3. El resto entra como viajero.
4. Quita de la pantalla el texto “simulación local” y el botón falso
   “Abrir enlace mágico”.
5. Allowlist: solo correos/teléfonos del grupo del viaje (o un código
   `MAR2026` que Gabriela mande por WhatsApp).

---

## 3. Un viaje en la nube (no en el código)

Modelo mínimo:

| Dónde | Qué guarda |
| --- | --- |
| `config/active` | `tripId` que ve todo el mundo |
| `trips/{tripId}` | Nombre, lema, hotel, cóctel, WhatsApp, zona horaria |
| `…/days` | Itinerario y enseñanzas |
| `…/places` | Cerca |
| `…/alerts` | Alertas en vivo |
| `…/announcements` | Comunicados |
| `…/confirmations` | Asistencia por usuario |

Pasos:

1. Importa **una vez** `createSeedTrip()` de `src/lib/tripData.ts` a Firestore.
2. Cambia `TripProvider` para leer/escribir Firestore y guardar copia en
   `localStorage` (offline).
3. El panel de guía deja de decir “solo este dispositivo”.
4. Sube `TRIP_KEY` o abandona el seed local para que nadie se quede con
   un Turquía viejo en el teléfono.

`tripData.ts` pasa a ser **plantilla / importación**, no la fuente de verdad.

---

## 4. Reglas de seguridad (el día que conectas Firebase)

1. Sin login → no lee el viaje.
2. Viajero → lee el viaje activo; escribe **solo su** confirmación.
3. Guía → escribe alertas, meeting point, comunicados, itinerario.
4. Prueba con las reglas en el emulador o con dos cuentas reales.

Sin reglas, cualquiera con la URL de Firebase lee el itinerario del grupo.

---

## 5. Publicar la web

1. Dominio: `app.mistikterra.com` (o el que definan).
2. Hosting: Firebase Hosting o Vercel, deploy al hacer merge a `main`.
3. HTTPS (lo da el host).
4. Favicon, `theme-color`, título y descripción ya van en `index.html`.
5. Comprueba `npm run build` en CI (GitHub Actions: lint, typecheck, test, build).

---

## 6. PWA ligera (sin tiendas)

1. `manifest.webmanifest`: nombre, iconos 192/512, fondo `#121212`,
   `display: standalone`.
2. Icono oficial (`public/img/logo-mistikterra.png`) en tamaños de home screen.
3. Service worker mínimo: cachear itinerario/CSS/JS para leer **Hoy** sin señal.
4. En login o Inicio, un texto: “En iPhone: Compartir → Añadir a pantalla de inicio”.
5. Prueba en un iPhone y un Android reales.

No es una app de tienda. Es la misma web, con icono.

---

## 7. Cómo se cambia de destino (cada temporada)

No edites `tripData.ts` en producción y pidas “borren el caché”.

Ritual:

1. Duplica el viaje anterior en Firestore (o importa un JSON nuevo).
2. Cambia nombre, fechas, zona horaria, hotel, cóctel, WhatsApp.
3. Carga itinerario y Cerca.
4. Sube fotos hero a Storage.
5. Ábrelo en un teléfono de prueba (cuenta que no sea la de Gabriela).
6. **Publicar** → `config/active` apunta al nuevo `tripId`.
7. Avisa al grupo por WhatsApp: “ya está el próximo viaje en la app”.

A medio plazo: una pantalla “Nuevo viaje” en el panel (solo guía).
Al inicio, puedes hacerlo tú a mano en Firebase Console con una checklist.

Archiva el viaje que ya ocurrió; no lo borres.

---

## 8. Ensayo de entrega (obligatorio)

Con 2–3 personas (tú, Gabriela, un viajero):

1. Login en iPhone y en Android.
2. Gabriela manda “nos vemos en 10 min” → llega al otro teléfono en segundos.
3. Cambia el lobby → el mapa del viajero cambia.
4. Modo avión: se lee el día de hoy.
5. SOS abre WhatsApp `wa.me/529841062003`.
6. Emergencia local 112 visible.
7. Un dato mal en el itinerario y cómo lo corrige la guía.
8. Un viajero que no está en la allowlist **no entra**.

Si esto falla, no entregues. Sigue siendo demo.

---

## 9. Paquete que le das al cliente

1. URL de producción y cómo añadir a inicio.
2. Cuentas: Gabriela (guía) + un viajero de prueba.
3. Este archivo (`ENTREGA.md`) y cómo publicar el siguiente destino.
4. Quién paga Firebase/dominio y con qué correo.
5. Privacidad en una página corta (qué datos guardan: correo/teléfono,
   confirmación de asistencia; no hay pagos todavía).
6. Video de 2 minutos: login → Inicio → alerta de Gabriela.
7. Repositorio + acceso Hosting/Firebase (o tú operas y ellos solo usan).

---

## 10. Orden de trabajo (no lo revuelvas)

1. Alcance congelado (paso 0)  
2. Firebase + Auth real (1–2)  
3. Firestore + importar Turquía/Grecia (3–4)  
4. Dominio + deploy (5)  
5. PWA (6)  
6. Allowlist  
7. Ensayo (8)  
8. Entrega (9)  
9. Ritual del próximo destino (7), ya en operación  

Lo último, si el primer viaje sale bien: SMS, push, saldos, más guías.

---

## Qué no hacer para que quede “excelente”

- Reescribir en Next.js o React Native “para que se vea pro”.
- Subir a App Store en este contrato.
- Pedir a los viajeros que borren datos del sitio al cambiar el itinerario.
- Dejar el login de simulación en producción.
- Abrir Firestore sin reglas porque “somos pocos”.
- Construir un CMS de 200 viajes antes del primer grupo real.
