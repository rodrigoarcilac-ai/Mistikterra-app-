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
};

export type ItineraryItem = {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
};

export type ItineraryDay = {
  id: string;
  date: string;
  label: string;
  items: ItineraryItem[];
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
};

export type Trip = {
  id: string;
  name: string;
  location: string;
  meetingPoint: MeetingPoint;
  itinerary: ItineraryDay[];
  alerts: Alert[];
  announcements: Announcement[];
  assistance: Assistance;
  /** userId -> confirmó asistencia al punto de encuentro. */
  confirmations: Record<string, boolean>;
};
