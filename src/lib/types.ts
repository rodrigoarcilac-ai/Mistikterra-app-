export type Role = "viajero" | "guia";

export type AuthMethod = "email" | "telefono";

export type User = {
  id: string;
  role: Role;
  name: string;
  contact: string;
  method: AuthMethod;
};

export type MeetingPoint = {
  title: string;
  address: string;
  mapUrl: string;
  /** ISO datetime del próximo encuentro. */
  datetime: string;
  note?: string;
  lat?: number;
  lng?: number;
};

export type ItineraryItem = {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  /** Miniatura fotográfica opcional del sitio a visitar. */
  image?: string;
};

export type Teaching = {
  title: string;
  body: string;
  /** Maestro/asesor de Mistikterra al que se atribuye la enseñanza. */
  author?: string;
};

export type ItineraryDay = {
  id: string;
  date: string;
  label: string;
  items: ItineraryItem[];
  /** Enseñanza o clave simbólica del día (turismo espiritual). */
  teaching?: Teaching;
};

export type AlertLevel = "info" | "importante" | "urgente";

export type Alert = {
  id: string;
  message: string;
  level: AlertLevel;
  createdAt: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export type Assistance = {
  contactName: string;
  phone: string;
  whatsapp: string;
  email: string;
  whatsappMessage: string;
};

/** Lugares para tiempos libres cerca de cada jornada. */
export type PlaceCategory =
  | "sagrado"
  | "mirador"
  | "gastronomia"
  | "tienda"
  | "barrio";

export type Recommendation = {
  id: string;
  name: string;
  category: PlaceCategory;
  /** Ciudad o etapa del viaje (Estambul, Capadocia, Atenas…). */
  zone: string;
  area: string;
  summary: string;
  mapUrl: string;
  lat: number;
  lng: number;
  nearDayId?: string;
};

export type Trip = {
  id: string;
  name: string;
  location: string;
  /** Lema/temática del destino (alineado con mistikterra.com). */
  tagline: string;
  /** Imagen hero del destino actual. */
  heroImage: string;
  meetingPoint: MeetingPoint;
  itinerary: ItineraryDay[];
  recommendations: Recommendation[];
  alerts: Alert[];
  announcements: Announcement[];
  assistance: Assistance;
  /** userId -> confirmó asistencia al punto de encuentro. */
  confirmations: Record<string, boolean>;
};
