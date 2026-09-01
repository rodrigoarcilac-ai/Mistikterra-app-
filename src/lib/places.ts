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
  Estambul: { lat: 41.0065, lng: 28.9784, label: "Hotel Sura Design" },
  Capadocia: { lat: 38.6428, lng: 34.8305, label: "Seraphim Cave Suites" },
  Atenas: { lat: 37.9758, lng: 23.7354, label: "Electra Palace Atenas" },
  Meteora: { lat: 39.7706, lng: 21.1828, label: "Grand Forest Metsovo" },
  Salónica: { lat: 40.6388, lng: 22.9478, label: "Hagios Demetrios" },
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

export function hasCoords(point: Partial<LatLng> | null | undefined): point is LatLng {
  return (
    !!point &&
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lng)
  );
}

export function originForZone(
  zone: string,
  meeting: MeetingPoint,
): LatLng & { label: string } {
  if (zone === "Estambul" && hasCoords(meeting)) {
    return { lat: meeting.lat, lng: meeting.lng, label: meeting.title };
  }
  const fallback = ZONE_ORIGINS[zone];
  if (fallback) return fallback;
  if (hasCoords(meeting)) {
    return { lat: meeting.lat, lng: meeting.lng, label: meeting.title };
  }
  return { ...ZONE_ORIGINS.Estambul, label: meeting.title };
}

export function sortByNearest(
  places: Recommendation[],
  origin: LatLng,
): Recommendation[] {
  return [...places].sort(
    (a, b) => distanceMeters(origin, a) - distanceMeters(origin, b),
  );
}

