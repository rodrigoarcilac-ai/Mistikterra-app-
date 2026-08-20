import type { Trip } from "./types";

function isoInHours(hours: number): string {
  return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
}

function isoAtDayHour(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/**
 * Semilla del viaje activo. En producción esto vendría de Cloud Firestore;
 * aquí se usa como estado inicial local para desarrollo y modo offline.
 */
export function createSeedTrip(): Trip {
  return {
    id: "trip_teotihuacan",
    name: "Despertar en Teotihuacán",
    location: "Teotihuacán, México",
    meetingPoint: {
      title: "Punto de encuentro — Puerta 1",
      address: "Zona Arqueológica de Teotihuacán, Puerta 1, Estado de México",
      mapUrl: "https://maps.google.com/?q=Teotihuacan+Puerta+1",
      datetime: isoInHours(3),
      note: "Llega 15 minutos antes. La anfitriona portará un rebozo dorado.",
    },
    itinerary: [
      {
        id: "day_1",
        date: isoAtDayHour(0, 0),
        label: "Día 1 — Ascenso y apertura",
        items: [
          {
            id: "it_1",
            time: isoAtDayHour(0, 6, 30),
            title: "Ceremonia de bienvenida",
            location: "Puerta 1 — Altar de copal",
            description:
              "Limpia con copal y palabra de intención para abrir la jornada.",
          },
          {
            id: "it_2",
            time: isoAtDayHour(0, 8, 0),
            title: "Ascenso a la Pirámide del Sol",
            location: "Calzada de los Muertos",
            description: "Caminata guiada con paradas de respiración consciente.",
          },
          {
            id: "it_3",
            time: isoAtDayHour(0, 13, 0),
            title: "Comida consciente",
            location: "La Gruta",
            description: "Menú prehispánico en cueva. Opciones vegetarianas.",
          },
        ],
      },
      {
        id: "day_2",
        date: isoAtDayHour(1, 0),
        label: "Día 2 — Luna y cierre",
        items: [
          {
            id: "it_4",
            time: isoAtDayHour(1, 7, 0),
            title: "Meditación al amanecer",
            location: "Pirámide de la Luna",
            description: "Práctica de silencio y agradecimiento.",
          },
          {
            id: "it_5",
            time: isoAtDayHour(1, 11, 0),
            title: "Círculo de cierre",
            location: "Palacio de Quetzalpapálotl",
            description: "Integración de la experiencia y entrega de obsequio.",
          },
        ],
      },
    ],
    alerts: [],
    announcements: [
      {
        id: "ann_1",
        title: "Bienvenida a Mistikterra",
        body: "Tu experiencia comienza pronto. Mantén la app a la mano para novedades del itinerario.",
        createdAt: isoInHours(-2),
      },
    ],
    assistance: {
      contactName: "Soporte Mistikterra",
      phone: "+525555550123",
      whatsapp: "525555550123",
    },
    confirmations: {},
  };
}
