# Mistikterra — Awakening Experiences

App diseñada para una agencia de viajes reconocida, con un enfoque en las
experiencias personalizadas y de lujo — turismo espiritual y esotérico premium.

La especificación completa del proyecto (misión, sistema de diseño, alcance por
fases y arquitectura) está en **`context.md - Mistikterra Project.md`**.

## Estado actual

MVP de la **Fase 1 (núcleo logístico)** más piezas ligeras de la Fase 2:

- Acceso sin contraseñas (enlace mágico por correo o código por SMS) con roles de
  viajero y guía.
- **Punto de encuentro activo** con cuenta regresiva, dirección, mapa y confirmación
  de asistencia.
- **Itinerario diario** con modo offline (datos guardados en el dispositivo).
- **Panel de la guía** para emitir alertas prioritarias, actualizar la ubicación y
  publicar comunicados.
- Botón de **asistencia directa** (llamada / WhatsApp).

## Stack

React 19 + Vite + TypeScript · Tailwind CSS v4 · react-router-dom · Vitest.
Arquitectura de datos lista para conectar **Firebase** (Auth + Firestore).

## Desarrollo

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run lint     # oxlint
npm run typecheck# comprobación de tipos (tsc -b)
npm test         # pruebas (Vitest)
npm run build    # build de producción
```
