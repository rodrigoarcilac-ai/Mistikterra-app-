import type { ItineraryDay, Recommendation, Trip } from "./types";

/** Hora local de Turquía/Grecia en esas fechas (EEST, UTC+3). */
function at(stamp: string): string {
  return stamp;
}

function day(
  id: string,
  date: string,
  label: string,
  items: ItineraryDay["items"],
  extra?: Pick<ItineraryDay, "teaching">,
): ItineraryDay {
  return { id, date, label, items, ...extra };
}

function rec(
  partial: Omit<Recommendation, "mapUrl"> & { query: string },
): Recommendation {
  const { query, ...rest } = partial;
  return {
    ...rest,
    mapUrl: `https://maps.google.com/?q=${encodeURIComponent(query)}`,
  };
}

/**
 * Semilla del viaje activo. En producción vendría de Cloud Firestore;
 * aquí es el estado inicial local (desarrollo y modo offline).
 */
export function createSeedTrip(): Trip {
  return {
    id: "trip_mar_de_imperios",
    name: "Turquía y Grecia",
    location: "Estambul · Capadocia · Atenas · Meteora · Salónica",
    tagline: "Mar de Imperios",
    heroImage: "",
    meetingPoint: {
      title: "Cóctel de bienvenida — Lobby Hotel Sura Design",
      address: "Hotel Sura Design, Sultanahmet, Estambul, Turquía",
      mapUrl: "https://maps.google.com/?q=Hotel+Sura+Design+Istanbul",
      datetime: at("2026-09-20T19:00:00+03:00"),
      note: "Puntualidad en todas las partidas. Gabriela Calderón atiende por WhatsApp de 08:00 a 21:00 hrs (24 hrs solo emergencias).",
      lat: 41.0065,
      lng: 28.9784,
    },
    itinerary: [
      day(
        "day_1",
        at("2026-09-20T00:00:00+03:00"),
        "Domingo 20 de septiembre — Llegada a Estambul",
        [
          {
            id: "it_1_1",
            time: at("2026-09-20T14:00:00+03:00"),
            title: "Llegada y traslado",
            location: "Aeropuerto de Estambul → Hotel Sura Design",
            description: "Arribo al aeropuerto y traslado al alojamiento.",
          },
          {
            id: "it_1_2",
            time: at("2026-09-20T16:00:00+03:00"),
            title: "Check-in",
            location: "Hotel Sura Design",
            description: "Alojamiento en Estambul.",
          },
          {
            id: "it_1_3",
            time: at("2026-09-20T19:00:00+03:00"),
            title: "Cóctel de bienvenida",
            location: "Lobby del hotel",
            description: "Reunión de grupo. Punto de encuentro activo del viaje.",
          },
          {
            id: "it_1_4",
            time: at("2026-09-20T20:00:00+03:00"),
            title: "Cena libre",
            location: "Estambul",
            description: "Consulte las recomendaciones del equipo.",
          },
        ],
      ),
      day(
        "day_2",
        at("2026-09-21T00:00:00+03:00"),
        "Lunes 21 de septiembre — Historia subterránea y conferencia",
        [
          {
            id: "it_2_1",
            time: at("2026-09-21T09:00:00+03:00"),
            title: "Desayuno incluido",
            location: "Hotel",
            description: "09:00 – 10:00 hrs.",
          },
          {
            id: "it_2_2",
            time: at("2026-09-21T11:00:00+03:00"),
            title: "Conferencia con el Maestro Luis Carlos Barragán",
            location: "Reunión en el lobby → salón",
            description: "Nos dirigimos juntos al salón desde el lobby.",
          },
          {
            id: "it_2_3",
            time: at("2026-09-21T13:00:00+03:00"),
            title: "Tiempo libre para comida",
            location: "Hotel o alrededores",
            description: "Se sugiere comer en el hotel o cerca.",
          },
          {
            id: "it_2_4",
            time: at("2026-09-21T15:00:00+03:00"),
            title: "Cisterna Binbirdirek",
            location: "Estambul",
            description:
              "Primera visita. Ropa y calzado cómodo, protector solar y sombrero.",
          },
          {
            id: "it_2_5",
            time: at("2026-09-21T16:00:00+03:00"),
            title: "Cisterna Basílica (Yerebatan)",
            location: "Estambul",
            description: "Segunda visita, a pocos minutos de Binbirdirek.",
          },
          {
            id: "it_2_6",
            time: at("2026-09-21T17:30:00+03:00"),
            title: "Regreso al hotel",
            location: "Hotel Sura Design",
            description:
              "Tiempo libre: opción de paseo en barco por el Bósforo o hammam tradicional.",
          },
          {
            id: "it_2_7",
            time: at("2026-09-21T20:00:00+03:00"),
            title: "Cena libre",
            location: "Estambul",
            description: "Por su cuenta.",
          },
        ],
        {
          teaching: {
            title: "Conferencia",
            body: "Encuentro con el Maestro Luis Carlos Barragán. Reunión en el lobby para ir juntos al salón.",
            author: "Luis Carlos Barragán",
          },
        },
      ),
      day(
        "day_3",
        at("2026-09-22T00:00:00+03:00"),
        "Martes 22 de septiembre — Joyas bizantinas y arqueología",
        [
          {
            id: "it_3_1",
            time: at("2026-09-22T08:00:00+03:00"),
            title: "Desayuno incluido",
            location: "Hotel",
            description: "08:00 – 09:00 hrs.",
          },
          {
            id: "it_3_2",
            time: at("2026-09-22T10:00:00+03:00"),
            title: "Museo Arqueológico de Estambul",
            location: "Salida desde el lobby",
            description: "Salida puntual. Ropa y calzado cómodo, bloqueador solar.",
          },
          {
            id: "it_3_3",
            time: at("2026-09-22T14:00:00+03:00"),
            title: "Tiempo libre para comida",
            location: "Estambul",
            description: "Por su cuenta.",
          },
          {
            id: "it_3_4",
            time: at("2026-09-22T16:30:00+03:00"),
            title: "Hagia Sophia e Iglesia de San Sergio y San Baco",
            location: "Estambul",
            description: "Visita a ambos templos.",
          },
          {
            id: "it_3_5",
            time: at("2026-09-22T18:00:00+03:00"),
            title: "Regreso al hotel",
            location: "Hotel Sura Design",
            description: "Opción de visitar fábrica de alfombras o hammam.",
          },
          {
            id: "it_3_6",
            time: at("2026-09-22T20:00:00+03:00"),
            title: "Cena libre",
            location: "Estambul",
            description: "Por su cuenta.",
          },
        ],
      ),
      day(
        "day_4",
        at("2026-09-23T00:00:00+03:00"),
        "Miércoles 23 de septiembre — Esplendor otomano",
        [
          {
            id: "it_4_1",
            time: at("2026-09-23T08:00:00+03:00"),
            title: "Desayuno incluido",
            location: "Hotel",
            description: "08:00 – 09:00 hrs.",
          },
          {
            id: "it_4_2",
            time: at("2026-09-23T10:00:00+03:00"),
            title: "Palacio de Topkapi",
            location: "Estambul",
            description: "Salida puntual. Ropa y calzado cómodo, bloqueador.",
          },
          {
            id: "it_4_3",
            time: at("2026-09-23T14:00:00+03:00"),
            title: "Comida incluida",
            location: "Estambul",
            description: "Comida de grupo.",
          },
          {
            id: "it_4_4",
            time: at("2026-09-23T16:30:00+03:00"),
            title: "Mezquita Azul",
            location: "Sultanahmet",
            description: "Visita a la Mezquita del Sultán Ahmed.",
          },
          {
            id: "it_4_5",
            time: at("2026-09-23T18:00:00+03:00"),
            title: "Regreso al hotel",
            location: "Hotel Sura Design",
            description: "Opción de visitar el Gran Bazar o hammam.",
          },
          {
            id: "it_4_6",
            time: at("2026-09-23T20:00:00+03:00"),
            title: "Cena libre",
            location: "Estambul",
            description: "Por su cuenta.",
          },
        ],
      ),
      day(
        "day_5",
        at("2026-09-24T00:00:00+03:00"),
        "Jueves 24 de septiembre — Palacios, mezquitas y Bazar de las Especias",
        [
          {
            id: "it_5_1",
            time: at("2026-09-24T08:00:00+03:00"),
            title: "Desayuno incluido",
            location: "Hotel",
            description: "Hasta las 09:00 hrs.",
          },
          {
            id: "it_5_2",
            time: at("2026-09-24T09:00:00+03:00"),
            title: "Palacio de Dolmabahçe",
            location: "Estambul",
            description: "Salida puntual. Ropa y calzado cómodo, bloqueador.",
          },
          {
            id: "it_5_3",
            time: at("2026-09-24T13:30:00+03:00"),
            title: "Comida incluida",
            location: "Estambul",
            description: "Comida de grupo.",
          },
          {
            id: "it_5_4",
            time: at("2026-09-24T15:30:00+03:00"),
            title: "Mezquita de Süleymaniye y Bazar de las Especias",
            location: "Estambul",
            description: "Visita y recorrido por el bazar.",
          },
          {
            id: "it_5_5",
            time: at("2026-09-24T17:30:00+03:00"),
            title: "Regreso al hotel",
            location: "Hotel Sura Design",
            description: "Opción de Gran Bazar o hammam.",
          },
          {
            id: "it_5_6",
            time: at("2026-09-24T20:00:00+03:00"),
            title: "Cena libre",
            location: "Estambul",
            description: "Por su cuenta.",
          },
          {
            id: "it_5_7",
            time: at("2026-09-24T21:00:00+03:00"),
            title: "Nota logística",
            location: "Hotel",
            description:
              "Realizar el check-out para la salida del día siguiente. Equipaje: 23 kg documentada + 8 kg de mano y bolso personal.",
          },
        ],
      ),
      day(
        "day_6",
        at("2026-09-25T00:00:00+03:00"),
        "Viernes 25 de septiembre — Rumbo al corazón de Capadocia",
        [
          {
            id: "it_6_1",
            time: at("2026-09-25T07:00:00+03:00"),
            title: "Desayuno y maletas",
            location: "Hotel Sura Design",
            description:
              "Desayuno 07:00 – 07:30. A las 07:00 dejar maletas en el lobby para el autobús.",
          },
          {
            id: "it_6_2",
            time: at("2026-09-25T07:45:00+03:00"),
            title: "Salida al aeropuerto",
            location: "Estambul",
            description: "Salida puntual.",
          },
          {
            id: "it_6_3",
            time: at("2026-09-25T11:00:00+03:00"),
            title: "Vuelo a Kayseri",
            location: "Estambul → Kayseri",
            description: "Llegada programada a las 12:30 hrs.",
          },
          {
            id: "it_6_4",
            time: at("2026-09-25T13:30:00+03:00"),
            title: "Museo de la Civilización Selyúcida",
            location: "Kayseri / Capadocia",
            description: "Visita guiada.",
          },
          {
            id: "it_6_5",
            time: at("2026-09-25T15:00:00+03:00"),
            title: "Comida incluida",
            location: "Capadocia",
            description: "Comida de grupo.",
          },
          {
            id: "it_6_6",
            time: at("2026-09-25T17:30:00+03:00"),
            title: "Check-in",
            location: "Hotel Seraphim Cave Suites & Spa",
            description: "Alojamiento en Capadocia.",
          },
          {
            id: "it_6_7",
            time: at("2026-09-25T20:00:00+03:00"),
            title: "Cena libre",
            location: "Capadocia",
            description: "Por su cuenta.",
          },
        ],
      ),
      day(
        "day_7",
        at("2026-09-26T00:00:00+03:00"),
        "Sábado 26 de septiembre — Paisajes lunares y misticismo derviche",
        [
          {
            id: "it_7_1",
            time: at("2026-09-26T08:00:00+03:00"),
            title: "Desayuno incluido",
            location: "Hotel",
            description: "08:00 – 09:00 hrs.",
          },
          {
            id: "it_7_2",
            time: at("2026-09-26T11:00:00+03:00"),
            title: "Museo al Aire Libre de Göreme",
            location: "Göreme",
            description: "Salida puntual. Ropa y calzado cómodo, bloqueador solar.",
          },
          {
            id: "it_7_3",
            time: at("2026-09-26T14:00:00+03:00"),
            title: "Comida incluida",
            location: "Capadocia",
            description: "Comida de grupo.",
          },
          {
            id: "it_7_4",
            time: at("2026-09-26T18:00:00+03:00"),
            title: "Danza de los Derviches",
            location: "Capadocia",
            description: "Espectáculo místico.",
          },
          {
            id: "it_7_5",
            time: at("2026-09-26T20:00:00+03:00"),
            title: "Cena libre",
            location: "Capadocia",
            description: "Por su cuenta.",
          },
        ],
        {
          teaching: {
            title: "Danza de los Derviches",
            body: "Espectáculo incluido en el programa de Capadocia.",
          },
        },
      ),
      day(
        "day_8",
        at("2026-09-27T00:00:00+03:00"),
        "Domingo 27 de septiembre — Valles, monasterios y ciudades subterráneas",
        [
          {
            id: "it_8_1",
            time: at("2026-09-27T08:00:00+03:00"),
            title: "Desayuno incluido",
            location: "Hotel",
            description: "08:00 – 09:00 hrs.",
          },
          {
            id: "it_8_2",
            time: at("2026-09-27T09:30:00+03:00"),
            title: "Salida al Valle Verde (Ihlara)",
            location: "Capadocia",
            description: "Ropa y calzado cómodo, bloqueador.",
          },
          {
            id: "it_8_3",
            time: at("2026-09-27T11:00:00+03:00"),
            title: "Caminata panorámica por el Valle Verde",
            location: "Valle de Ihlara",
            description: "Recorrido a pie.",
          },
          {
            id: "it_8_4",
            time: at("2026-09-27T13:00:00+03:00"),
            title: "Monasterio de Selime",
            location: "Capadocia",
            description: "Visita al monasterio.",
          },
          {
            id: "it_8_5",
            time: at("2026-09-27T14:00:00+03:00"),
            title: "Snack a bordo",
            location: "Autobús",
            description: "Refrigerio en ruta.",
          },
          {
            id: "it_8_6",
            time: at("2026-09-27T15:00:00+03:00"),
            title: "Ciudad subterránea de Derinkuyu",
            location: "Derinkuyu",
            description: "Exploración del complejo subterráneo.",
          },
          {
            id: "it_8_7",
            time: at("2026-09-27T17:00:00+03:00"),
            title: "Regreso al hotel",
            location: "Hotel Seraphim Cave Suites & Spa",
            description:
              "Check-out al día siguiente. Equipaje aéreo: 23 kg documentado / 8 kg de mano.",
          },
          {
            id: "it_8_8",
            time: at("2026-09-27T20:00:00+03:00"),
            title: "Cena libre",
            location: "Capadocia",
            description: "Por su cuenta.",
          },
        ],
      ),
      day(
        "day_9",
        at("2026-09-28T00:00:00+03:00"),
        "Lunes 28 de septiembre — Conexión a la cuna de Occidente",
        [
          {
            id: "it_9_1",
            time: at("2026-09-28T07:00:00+03:00"),
            title: "Desayuno incluido",
            location: "Hotel",
            description: "07:00 – 07:30 hrs.",
          },
          {
            id: "it_9_2",
            time: at("2026-09-28T07:45:00+03:00"),
            title: "Salida al aeropuerto",
            location: "Capadocia",
            description: "Rumbo al aeropuerto.",
          },
          {
            id: "it_9_3",
            time: at("2026-09-28T10:30:00+03:00"),
            title: "Vuelo a Atenas (vía Estambul)",
            location: "Kayseri → Estambul → Atenas",
            description: "Comida libre durante los traslados.",
          },
          {
            id: "it_9_4",
            time: at("2026-09-28T14:55:00+03:00"),
            title: "Llegada a Atenas",
            location: "Aeropuerto de Atenas",
            description: "Llegada estimada.",
          },
          {
            id: "it_9_5",
            time: at("2026-09-28T17:00:00+03:00"),
            title: "Check-in",
            location: "Hotel Electra",
            description: "Alojamiento en Atenas.",
          },
          {
            id: "it_9_6",
            time: at("2026-09-28T20:00:00+03:00"),
            title: "Cena libre",
            location: "Atenas",
            description: "Por su cuenta.",
          },
        ],
      ),
      day(
        "day_10",
        at("2026-09-29T00:00:00+03:00"),
        "Martes 29 de septiembre — Acrópolis y el encanto de Plaka",
        [
          {
            id: "it_10_1",
            time: at("2026-09-29T07:00:00+03:00"),
            title: "Equipaje de día",
            location: "Hotel Electra",
            description:
              "Opcional: dejar en el lobby lo que no lleven al recorrido. El check-out es mañana, rumbo a Metsovo.",
          },
          {
            id: "it_10_2",
            time: at("2026-09-29T08:00:00+03:00"),
            title: "Desayuno incluido",
            location: "Hotel",
            description: "08:00 – 09:00 hrs.",
          },
          {
            id: "it_10_3",
            time: at("2026-09-29T10:00:00+03:00"),
            title: "Partenón y Museo de la Acrópolis",
            location: "Atenas",
            description:
              "Visita guiada. Ropa y calzado cómodo, protector solar.",
          },
          {
            id: "it_10_4",
            time: at("2026-09-29T14:00:00+03:00"),
            title: "Tiempo libre para comer",
            location: "Atenas",
            description: "Por su cuenta.",
          },
          {
            id: "it_10_5",
            time: at("2026-09-29T16:00:00+03:00"),
            title: "Monastiraki y Plaka",
            location: "Atenas",
            description: "Recorrido y tiempo libre por los barrios tradicionales.",
          },
          {
            id: "it_10_6",
            time: at("2026-09-29T20:00:00+03:00"),
            title: "Cena libre",
            location: "Atenas",
            description:
              "Por su cuenta. Preparar check-out para la salida a Meteora al día siguiente.",
          },
        ],
      ),
      day(
        "day_11",
        at("2026-09-30T00:00:00+03:00"),
        "Miércoles 30 de septiembre — Rumbo a las alturas de Meteora",
        [
          {
            id: "it_11_1",
            time: at("2026-09-30T07:00:00+03:00"),
            title: "Desayuno incluido",
            location: "Hotel",
            description: "07:00 – 08:00 hrs.",
          },
          {
            id: "it_11_2",
            time: at("2026-09-30T08:00:00+03:00"),
            title: "Maletas en el lobby",
            location: "Hotel Electra",
            description: "Dejar maletas en el lobby.",
          },
          {
            id: "it_11_3",
            time: at("2026-09-30T08:30:00+03:00"),
            title: "Museo Arqueológico",
            location: "Atenas",
            description: "Salida puntual a la visita.",
          },
          {
            id: "it_11_4",
            time: at("2026-09-30T10:00:00+03:00"),
            title: "Traslado terrestre a Meteora",
            location: "Atenas → Metsovo",
            description: "Inicio del traslado.",
          },
          {
            id: "it_11_5",
            time: at("2026-09-30T14:00:00+03:00"),
            title: "Comida incluida en ruta",
            location: "En ruta",
            description: "Comida de grupo.",
          },
          {
            id: "it_11_6",
            time: at("2026-09-30T17:00:00+03:00"),
            title: "Check-in",
            location: "Hotel Grand Forest Metsovo",
            description: "Alojamiento en Meteora / Metsovo.",
          },
          {
            id: "it_11_7",
            time: at("2026-09-30T20:00:00+03:00"),
            title: "Cena libre",
            location: "Restaurante del hotel",
            description: "Cena en el hotel.",
          },
        ],
      ),
      day(
        "day_12",
        at("2026-10-01T00:00:00+03:00"),
        "Jueves 1 de octubre — Monasterios colgantes de Meteora",
        [
          {
            id: "it_12_1",
            time: at("2026-10-01T08:00:00+03:00"),
            title: "Desayuno incluido",
            location: "Hotel",
            description: "08:00 – 09:00 hrs.",
          },
          {
            id: "it_12_2",
            time: at("2026-10-01T10:00:00+03:00"),
            title: "Acantilados de Meteora",
            location: "Meteora",
            description: "Salida puntual. Calzado cómodo y bloqueador.",
          },
          {
            id: "it_12_3",
            time: at("2026-10-01T11:30:00+03:00"),
            title: "Monasterio del Gran Meteoro",
            location: "Meteora",
            description: "Visita al monasterio.",
          },
          {
            id: "it_12_4",
            time: at("2026-10-01T13:00:00+03:00"),
            title: "Comida libre",
            location: "Meteora",
            description: "Por su cuenta.",
          },
          {
            id: "it_12_5",
            time: at("2026-10-01T15:00:00+03:00"),
            title: "Pueblo de Kalambaka",
            location: "Kalambaka",
            description: "Tiempo libre para explorar.",
          },
          {
            id: "it_12_6",
            time: at("2026-10-01T17:00:00+03:00"),
            title: "Regreso al hotel",
            location: "Hotel Grand Forest Metsovo",
            description: "Descanso antes de la sesión de la tarde.",
          },
          {
            id: "it_12_7",
            time: at("2026-10-01T18:30:00+03:00"),
            title: "Preguntas y respuestas con el Maestro Luis Carlos Barragán",
            location: "Hotel",
            description: "Sesión especial.",
          },
          {
            id: "it_12_8",
            time: at("2026-10-01T20:00:00+03:00"),
            title: "Cena libre",
            location: "Meteora / Metsovo",
            description:
              "Por su cuenta. Check-out para la partida del día siguiente.",
          },
        ],
        {
          teaching: {
            title: "Preguntas y respuestas",
            body: "Sesión especial con el Maestro Luis Carlos Barragán.",
            author: "Luis Carlos Barragán",
          },
        },
      ),
      day(
        "day_13",
        at("2026-10-02T00:00:00+03:00"),
        "Viernes 2 de octubre — Historia en Salónica y clausura",
        [
          {
            id: "it_13_1",
            time: at("2026-10-02T08:00:00+03:00"),
            title: "Maletas, desayuno y salida",
            location: "Hotel Grand Forest Metsovo",
            description:
              "Maletas en el lobby a las 08:00. Desayuno 08:00 – 09:00. Traslado a Salónica a las 09:00.",
          },
          {
            id: "it_13_2",
            time: at("2026-10-02T12:00:00+03:00"),
            title: "Basílica de Hagios Demetrios",
            location: "Salónica",
            description: "Visita a la basílica histórica.",
          },
          {
            id: "it_13_3",
            time: at("2026-10-02T14:00:00+03:00"),
            title: "Comida incluida y clausura",
            location: "Salónica",
            description: "Comida de grupo y clausura oficial del viaje.",
          },
          {
            id: "it_13_4",
            time: at("2026-10-02T20:00:00+03:00"),
            title: "Noche en Salónica",
            location: "Salónica",
            description:
              "Alojamiento por su cuenta. Traslado al aeropuerto el sábado 3 de octubre.",
          },
        ],
      ),
      day(
        "day_14",
        at("2026-10-03T00:00:00+03:00"),
        "Sábado 3 de octubre — Fin del viaje",
        [
          {
            id: "it_14_1",
            time: at("2026-10-03T08:00:00+03:00"),
            title: "Regreso a casa",
            location: "Aeropuerto de Salónica",
            description: "Traslado al aeropuerto y vuelos de retorno.",
          },
        ],
      ),
    ],
    recommendations: [
      rec({
        id: "rec_1",
        name: "Gran Bazar",
        category: "tienda",
        zone: "Estambul",
        area: "Beyazıt",
        summary:
          "Laberinto de puestos. Ideal en un hueco libre; regatea con calma y guarda el ticket.",
        query: "Grand Bazaar Istanbul",
        lat: 41.0106,
        lng: 28.9681,
        nearDayId: "day_4",
      }),
      rec({
        id: "rec_2",
        name: "Paseo por el Bósforo",
        category: "mirador",
        zone: "Estambul",
        area: "Eminönü",
        summary:
          "Ferris cortos desde Eminönü. Encaja en el tiempo libre del lunes por la tarde.",
        query: "Eminonu ferry Istanbul",
        lat: 41.017,
        lng: 28.97,
        nearDayId: "day_2",
      }),
      rec({
        id: "rec_3",
        name: "Hammam Çemberlitaş",
        category: "barrio",
        zone: "Estambul",
        area: "Sultanahmet",
        summary:
          "Baño tradicional cerca del hotel. Reserva con el equipo si sales en grupo.",
        query: "Cemberlitas Hamami Istanbul",
        lat: 41.0084,
        lng: 28.9714,
        nearDayId: "day_2",
      }),
      rec({
        id: "rec_4",
        name: "Cuerno de Oro y Gálata",
        category: "barrio",
        zone: "Estambul",
        area: "Karaköy",
        summary:
          "Puente y torre al atardecer. Camina sin prisa; el tráfico del puente es intenso.",
        query: "Galata Bridge Istanbul",
        lat: 41.0201,
        lng: 28.973,
        nearDayId: "day_3",
      }),
      rec({
        id: "rec_5",
        name: "Atardecer en Göreme",
        category: "mirador",
        zone: "Capadocia",
        area: "Mirador del pueblo",
        summary:
          "Chimeneas de hada al último sol. Cerca del hotel; lleva una chaqueta ligera.",
        query: "Goreme sunset viewpoint",
        lat: 38.6436,
        lng: 34.8289,
        nearDayId: "day_7",
      }),
      rec({
        id: "rec_6",
        name: "Calle del pueblo de Göreme",
        category: "gastronomia",
        zone: "Capadocia",
        area: "Centro de Göreme",
        summary:
          "Cenas simples de tiempo libre: testı kebab y té. Pregunta al equipo por sitios de confianza.",
        query: "Goreme town restaurants",
        lat: 38.6431,
        lng: 34.8283,
        nearDayId: "day_6",
      }),
      rec({
        id: "rec_7",
        name: "Plaka",
        category: "barrio",
        zone: "Atenas",
        area: "Bajo la Acrópolis",
        summary:
          "Calles de piedra y tabernas. Encaja con la tarde libre del 29 de septiembre.",
        query: "Plaka Athens",
        lat: 37.9725,
        lng: 23.7304,
        nearDayId: "day_10",
      }),
      rec({
        id: "rec_8",
        name: "Monastiraki",
        category: "tienda",
        zone: "Atenas",
        area: "Mercado y plaza",
        summary:
          "Pulgas y vista a la Acrópolis. Mejor a primera hora de la tarde, antes del calor residual.",
        query: "Monastiraki Athens",
        lat: 37.9761,
        lng: 23.7256,
        nearDayId: "day_10",
      }),
      rec({
        id: "rec_9",
        name: "Kalambaka",
        category: "barrio",
        zone: "Meteora",
        area: "Pueblo al pie de los pináculos",
        summary:
          "Tiempo libre del 1 de octubre: cafés, vistas y un ritmo más lento que el de los monasterios.",
        query: "Kalambaka Greece",
        lat: 39.7042,
        lng: 21.6267,
        nearDayId: "day_12",
      }),
      rec({
        id: "rec_10",
        name: "Plaza Aristóteles",
        category: "barrio",
        zone: "Salónica",
        area: "Centro frente al golfo",
        summary:
          "Paseo amplio hacia el mar. Útil tras la visita a Hagios Demetrios, si queda un hueco.",
        query: "Aristotelous Square Thessaloniki",
        lat: 40.6322,
        lng: 22.9408,
        nearDayId: "day_13",
      }),
    ],
    alerts: [],
    announcements: [
      {
        id: "ann_1",
        title: "Puntualidad y soporte",
        body: "Los horarios de partida son estrictos para no perder visitas. Gabriela Calderón atiende por WhatsApp de 08:00 a 21:00 hrs; las 24 hrs solo para emergencias. El programa puede ajustarse por clima o tráfico.",
        createdAt: at("2026-09-19T12:00:00+03:00"),
      },
    ],
    assistance: {
      contactName: "Gabriela Calderón",
      phone: "+52 984 106 2003",
      whatsapp: "529841062003",
      email: "mistikterra01@gmail.com",
      whatsappMessage:
        "Hola Gabriela, soy del grupo Mar de Imperios y necesito asistencia.",
    },
    confirmations: {},
  };
}
