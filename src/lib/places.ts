import type { MeetingPoint, PlaceCategory, Recommendation } from "./types";

export type LatLng = { lat: number; lng: number };

export const PLACE_CATEGORIES: PlaceCategory[] = [
  "sagrado",
  "mirador",
  "gastronomia",
  "tienda",
  "barrio",
];

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  sagrado: "Sitio sagrado",
  mirador: "Mirador",
  gastronomia: "Gastronomía",
  tienda: "Tienda",
  barrio: "Barrio",
};

const ZONE_ORIGINS: Record<string, LatLng & { label: string }> = {
  Kioto: { lat: 34.96714, lng: 135.77267, label: "Punto de encuentro" },
  Nara: { lat: 34.6889, lng: 135.8398, label: "Todai-ji" },
  "Monte Koya": { lat: 34.2135, lng: 135.5836, label: "Danjo Garan" },
};

export function zonesFrom(recommendations: Recommendation[]): string[] {
  const seen: string[] = [];
  for (const place of recommendations) {
    if (!seen.includes(place.zone)) seen.push(place.zone);
  }
  return seen;
}

export function filterRecommendations(
  recommendations: Recommendation[],
  {
    zone,
    category,
    limit,
  }: { zone?: string; category?: PlaceCategory | "todos"; limit?: number },
): Recommendation[] {
  let next = recommendations;
  if (zone) next = next.filter((place) => place.zone === zone);
  if (category && category !== "todos") {
    next = next.filter((place) => place.category === category);
  }
  if (typeof limit === "number") next = next.slice(0, limit);
  return next;
}

export function distanceMeters(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earth = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return 2 * earth * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
}

export function originForZone(
  zone: string,
  meeting: MeetingPoint,
): LatLng & { label: string } {
  if (
    (zone === "todos" || zone === "Kioto") &&
    typeof meeting.lat === "number" &&
    typeof meeting.lng === "number"
  ) {
    return { lat: meeting.lat, lng: meeting.lng, label: meeting.title };
  }
  return (
    ZONE_ORIGINS[zone] ?? {
      lat: meeting.lat ?? 34.96714,
      lng: meeting.lng ?? 135.77267,
      label: meeting.title,
    }
  );
}

export function originForPlace(
  place: Recommendation,
  meeting: MeetingPoint,
): LatLng & { label: string } {
  if (
    place.zone === "Kioto" &&
    typeof meeting.lat === "number" &&
    typeof meeting.lng === "number"
  ) {
    return { lat: meeting.lat, lng: meeting.lng, label: meeting.title };
  }
  return ZONE_ORIGINS[place.zone] ?? { lat: place.lat, lng: place.lng, label: place.zone };
}

export function sortByNearest(
  places: Recommendation[],
  origin: LatLng,
): Recommendation[] {
  return [...places].sort(
    (a, b) => distanceMeters(origin, a) - distanceMeters(origin, b),
  );
}

