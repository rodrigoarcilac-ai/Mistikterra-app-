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
    id: "trip_japon",
    name: "Despertar en Japón",
    location: "Kioto · Nara · Monte Koya",
    tagline: "Camino del kami · Templos y silencio",
    heroImage: "/img/hero-japon.jpg",
    meetingPoint: {
      title: "Punto de encuentro — Torii de Fushimi Inari",
      address:
        "Fushimi Inari Taisha, Fukakusa Yabunouchicho, Fushimi-ku, Kioto, Japón",
      mapUrl: "https://maps.google.com/?q=Fushimi+Inari+Taisha+Kyoto",
      datetime: isoInHours(3),
      note: "Llega 15 minutos antes. La anfitriona portará un pañuelo dorado junto al primer torii.",
    },
    itinerary: [
      {
        id: "day_1",
        date: isoAtDayHour(0, 0),
        label: "Día 1 — Apertura en Kioto",
        teaching: {
          title: "El umbral",
          body: "Cada torii es una puerta. No se cruza con prisa: se cruza con intención. Hoy practicamos dejar atrás lo que no viaja con nosotros.",
          author: "Mistikterra · Camino del kami",
        },
        items: [
          {
            id: "it_1",
            time: isoAtDayHour(0, 7, 0),
            title: "Ceremonia de bienvenida",
            location: "Fushimi Inari Taisha — primer torii",
            description:
              "Palabra de intención y apertura del viaje. Nos reconocemos como grupo.",
          },
          {
            id: "it_2",
            time: isoAtDayHour(0, 8, 30),
            title: "Ascenso entre los mil torii",
            location: "Sendero sagrado de Fushimi Inari",
            description:
              "Caminata consciente por el bosque de puertas bermellón, con pausas de respiración.",
          },
          {
            id: "it_3",
            time: isoAtDayHour(0, 13, 0),
            title: "Almuerzo shojin",
            location: "Kioto — cocina de templo",
            description:
              "Menú vegetariano de origen budista. Comer en silencio los primeros diez minutos.",
          },
        ],
      },
      {
        id: "day_2",
        date: isoAtDayHour(1, 0),
        label: "Día 2 — Agua y contemplación",
        teaching: {
          title: "El agua recuerda",
          body: "En Kiyomizu el agua no se toma: se recibe. Elegir un chorro es elegir una cualidad a cultivar el resto del viaje.",
          author: "Mistikterra · Camino del kami",
        },
        items: [
          {
            id: "it_4",
            time: isoAtDayHour(1, 6, 30),
            title: "Meditación al amanecer",
            location: "Kiyomizu-dera",
            description:
              "Práctica breve frente al valle. Llegamos antes de la afluencia turística.",
          },
          {
            id: "it_5",
            time: isoAtDayHour(1, 10, 0),
            title: "Bosque de bambú",
            location: "Arashiyama",
            description:
              "Caminata en silencio. El bambú enseña flexibilidad sin perder el centro.",
          },
          {
            id: "it_6",
            time: isoAtDayHour(1, 16, 0),
            title: "Ceremonia del té",
            location: "Casa de té tradicional, Kioto",
            description:
              "Chado: atención plena en cada gesto. Vestimenta cómoda y calcetines limpios.",
          },
        ],
      },
      {
        id: "day_3",
        date: isoAtDayHour(2, 0),
        label: "Día 3 — Nara, tierra del Buda",
        teaching: {
          title: "La mansedumbre",
          body: "Los ciervos de Nara no se conquistan. Se espera. Hoy la enseñanza es no forzar el encuentro: lo sagrado se acerca cuando hay calma.",
          author: "Mistikterra · Camino del kami",
        },
        items: [
          {
            id: "it_7",
            time: isoAtDayHour(2, 8, 0),
            title: "Gran Buda de Todai-ji",
            location: "Todai-ji, Nara",
            description:
              "Visita contemplativa al Daibutsu. Tiempo para sentarse y observar, no solo fotografiar.",
          },
          {
            id: "it_8",
            time: isoAtDayHour(2, 11, 30),
            title: "Bosque sagrado de Kasuga",
            location: "Santuario Kasuga Taisha",
            description:
              "Caminata entre linternas de piedra y cedros. Ritmo lento, sin auriculares.",
          },
          {
            id: "it_9",
            time: isoAtDayHour(2, 16, 0),
            title: "Círculo de gratitud",
            location: "Parque de Nara",
            description:
              "Cierre del día en el prado. Compartimos una palabra de lo que se suavizó.",
          },
        ],
      },
      {
        id: "day_4",
        date: isoAtDayHour(3, 0),
        label: "Día 4 — Monte Koya",
        teaching: {
          title: "La montaña interior",
          body: "Koya no es un destino: es un descenso hacia el silencio. Okunoin nos recuerda que los que fueron siguen acompañando el camino.",
          author: "Mistikterra · Camino del kami",
        },
        items: [
          {
            id: "it_10",
            time: isoAtDayHour(3, 7, 0),
            title: "Viaje a Monte Koya",
            location: "Tren y funicular hacia Koyasan",
            description:
              "Traslados coordinados por la anfitriona. Equipaje ligero; la noche es en templo.",
          },
          {
            id: "it_11",
            time: isoAtDayHour(3, 14, 0),
            title: "Caminata por Okunoin",
            location: "Cementerio sagrado de Koyasan",
            description:
              "Recorrido entre cedros milenarios hasta el mausoleo de Kobo Daishi.",
          },
          {
            id: "it_12",
            time: isoAtDayHour(3, 19, 0),
            title: "Cena shojin y retiro",
            location: "Shukubo (alojamiento en templo)",
            description:
              "Cena de templo, baño y silencio nocturno. Apagamos pantallas a las 21:00.",
          },
        ],
      },
      {
        id: "day_5",
        date: isoAtDayHour(4, 0),
        label: "Día 5 — Sutras y cierre",
        teaching: {
          title: "Integrar, no acumular",
          body: "El viaje no se guarda en fotos. Se guarda en el cuerpo. Hoy dejamos que lo vivido se asiente antes de volver al ruido.",
          author: "Mistikterra · Camino del kami",
        },
        items: [
          {
            id: "it_13",
            time: isoAtDayHour(4, 5, 30),
            title: "Sutras del amanecer",
            location: "Sala principal del templo",
            description:
              "Canto matutino con los monjes. Participación en silencio o con la voz, según indique el guía del templo.",
          },
          {
            id: "it_14",
            time: isoAtDayHour(4, 11, 0),
            title: "Círculo de cierre",
            location: "Monte Koya",
            description:
              "Integración de la experiencia, agradecimiento y despedida del grupo.",
          },
        ],
      },
    ],
    alerts: [],
    announcements: [
      {
        id: "ann_1",
        title: "Bienvenida a Japón",
        body: "Tu experiencia en Kioto comienza pronto. Mantén la app a la mano para el punto de encuentro y cambios de itinerario.",
        createdAt: isoInHours(-2),
      },
    ],
    recommendations: [
      {
        id: "rec_1",
        name: "Camino de los Filósofos",
        category: "barrio",
        zone: "Kioto",
        area: "Higashiyama · canal de Ginkaku-ji",
        summary:
          "Paseo junto al agua entre templos. Ideal en un tiempo libre de la tarde, sin prisa.",
        mapUrl: "https://maps.google.com/?q=Philosopher+Path+Kyoto",
        nearDayId: "day_2",
      },
      {
        id: "rec_2",
        name: "Mercado Nishiki",
        category: "gastronomia",
        zone: "Kioto",
        area: "Centro de Kioto",
        summary:
          "Calle techada de sabores locales. Prueba té, pickles y dulces; evita las horas pico.",
        mapUrl: "https://maps.google.com/?q=Nishiki+Market+Kyoto",
        nearDayId: "day_1",
      },
      {
        id: "rec_3",
        name: "Gion",
        category: "barrio",
        zone: "Kioto",
        area: "Gion Shirakawa",
        summary:
          "Calles de madera al anochecer. Camina en silencio y respeta la privacidad de las geiko.",
        mapUrl: "https://maps.google.com/?q=Gion+Shirakawa+Kyoto",
        nearDayId: "day_1",
      },
      {
        id: "rec_4",
        name: "Kinkaku-ji · Pabellón Dorado",
        category: "sagrado",
        zone: "Kioto",
        area: "Kita",
        summary:
          "Templo cubierto de oro sobre el estanque. Ve temprano si tienes una mañana libre.",
        mapUrl: "https://maps.google.com/?q=Kinkaku-ji+Kyoto",
        nearDayId: "day_2",
      },
      {
        id: "rec_5",
        name: "Kungyokudo",
        category: "tienda",
        zone: "Kioto",
        area: "Junto a Nishi Hongan-ji",
        summary:
          "Incienso de casa fundada en 1587. Un souvenir sobrio, alineado con la práctica.",
        mapUrl: "https://maps.google.com/?q=Kungyokudo+Kyoto",
        nearDayId: "day_1",
      },
      {
        id: "rec_6",
        name: "Mirador de Higashiyama",
        category: "mirador",
        zone: "Kioto",
        area: "Cerca de Kiyomizu-dera",
        summary:
          "Vista de tejados y montañas al atardecer. Complementa la meditación del Día 2.",
        mapUrl: "https://maps.google.com/?q=Higashiyama+viewpoint+Kyoto",
        nearDayId: "day_2",
      },
      {
        id: "rec_7",
        name: "Naramachi",
        category: "barrio",
        zone: "Nara",
        area: "Casco antiguo",
        summary:
          "Casas machiya, patios y tiendas tranquilas. Perfecto después de Todai-ji.",
        mapUrl: "https://maps.google.com/?q=Naramachi+Nara",
        nearDayId: "day_3",
      },
      {
        id: "rec_8",
        name: "Monte Wakakusa",
        category: "mirador",
        zone: "Nara",
        area: "Colina junto al parque",
        summary:
          "Ascenso suave y panorama de la ciudad. Lleva agua y baja antes del anochecer.",
        mapUrl: "https://maps.google.com/?q=Mount+Wakakusa+Nara",
        nearDayId: "day_3",
      },
      {
        id: "rec_9",
        name: "Nakatanidou",
        category: "gastronomia",
        zone: "Nara",
        area: "Sanjo-dori",
        summary:
          "Mochi de té verde preparado al momento. Una parada breve y memorable.",
        mapUrl: "https://maps.google.com/?q=Nakatanidou+Nara",
        nearDayId: "day_3",
      },
      {
        id: "rec_10",
        name: "Danjo Garan",
        category: "sagrado",
        zone: "Monte Koya",
        area: "Complejo central de Koyasan",
        summary:
          "Pagoda y recinto fundacional de Kobo Daishi. Visítalo en un hueco entre prácticas.",
        mapUrl: "https://maps.google.com/?q=Danjo+Garan+Koyasan",
        nearDayId: "day_4",
      },
      {
        id: "rec_11",
        name: "Kongobu-ji",
        category: "sagrado",
        zone: "Monte Koya",
        area: "Sede de la escuela Shingon",
        summary:
          "Jardín de piedra Banryutei y salas de tatami. Ritmo lento, fotos con respeto.",
        mapUrl: "https://maps.google.com/?q=Kongobu-ji+Koyasan",
        nearDayId: "day_4",
      },
      {
        id: "rec_12",
        name: "Cafés shojin del pueblo",
        category: "gastronomia",
        zone: "Monte Koya",
        area: "Calle principal de Koyasan",
        summary:
          "Té y cocina de templo para un tiempo libre breve, sin salir de la montaña.",
        mapUrl: "https://maps.google.com/?q=Koyasan+shojin+cafe",
        nearDayId: "day_5",
      },
    ],
    assistance: {
      contactName: "Mistikterra · Asistencia",
      phone: "+52 984 106 2003",
      whatsapp: "529841062003",
      email: "mistikterra01@gmail.com",
      whatsappMessage:
        "Hola Mistikterra, requiero asistencia con el punto de encuentro.",
    },
    confirmations: {},
  };
}
