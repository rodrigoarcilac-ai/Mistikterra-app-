# Mistikterra — Awakening Experiences

Aplicación web de turismo espiritual/esotérico premium. El objetivo y la
especificación completa están en `context.md - Mistikterra Project.md` (léelo antes
de trabajar en features: define el alcance por fases, el sistema de diseño y el
stack). Este MVP cubre la **Fase 1 (núcleo logístico)** más piezas ligeras de la
Fase 2.

## Stack

- **React 19 + Vite + TypeScript** (SPA).
- **Tailwind CSS v4** vía `@tailwindcss/vite`; el tema (paleta oro/noche y Plus
  Jakarta Sans) se define con `@theme` en `src/index.css`.
- **react-router-dom** para el ruteo.
- **Vitest + Testing Library** para pruebas.
- Datos y sesión se guardan en `localStorage` (habilita el modo offline). La capa de
  estado (`src/lib/AuthProvider.tsx`, `src/lib/TripProvider.tsx`) está desacoplada de
  la persistencia para poder cambiarla por **Firebase** (Auth + Firestore) sin tocar la UI.

## Estructura

- `src/lib/` — dominio: tipos, datos semilla, contextos de auth y viaje, hooks.
- `src/components/` — UI reutilizable (punto de encuentro, cuenta regresiva, alertas, etc.).
- `src/pages/` — vistas: `LoginPage`, `HomePage` (viajero), `ItineraryPage`, `ExplorePage` (`/cerca`), `GuidePanelPage` (guía).
- `src/App.tsx` — providers + rutas y guards (`RequireAuth`, `RequireGuide`).

## Cursor Cloud specific instructions

Servicio único (frontend). Comandos estándar en los scripts de `package.json`
(`dev`, `build`, `lint`, `typecheck`, `test`). Notas no obvias:

- El servidor de desarrollo (`npm run dev`, Vite) corre en el **puerto 5173** y se
  arranca con `host: true` (definido en `vite.config.ts`) para ser accesible desde fuera del contenedor.
- `lint` usa **oxlint**, no ESLint (config en `.oxlintrc.json`). No existe `next lint` ni ESLint aquí.
- `test` usa Vitest con entorno `jsdom`; la config vive dentro de `vite.config.ts`
  (importa `defineConfig` desde `vitest/config`) y `src/test/setup.ts` carga los
  matchers de jest-dom y limpia `localStorage` entre pruebas.
- **Autenticación en modo demo:** al no haber Firebase configurado, el login sin
  contraseña se simula localmente. El código SMS y el enlace mágico se muestran en
  pantalla (etiquetados como simulación local). El rol **guía** solo se asigna si el
  contacto es el de Gabriela Calderón (`mistikterra01@gmail.com` o `+52 984 106 2003`);
  el resto entra como viajero. En producción vendría de Firebase custom claims.
- El estado del viaje es **local a cada dispositivo** (`localStorage`, claves
  `mt.trip.v8` y `mt.session`). Las acciones de la guía y las del viajero comparten ese
  estado en la misma sesión del navegador; la sincronización entre dispositivos requiere
  Firestore (aún no implementado). Para reiniciar los datos, borra esas claves de
  `localStorage`. La clave del viaje está **versionada**: si cambias la forma de `Trip`
  (en `src/lib/types.ts` / `tripData.ts`), sube el sufijo de versión de `TRIP_KEY` en
  `src/lib/TripProvider.tsx` para forzar el reseed y evitar datos viejos en caché.
- El logotipo vive en `public/img/logo-mistikterra.png`. Las imágenes de hero, si las hay,
  van en `public/img/` por ruta absoluta.
