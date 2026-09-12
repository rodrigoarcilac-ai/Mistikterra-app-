import { distanceMeters, type LatLng } from "./places";

export type WalkingRoute = {
  coordinates: LatLng[];
  distanceM: number;
  durationS: number;
};

type OsrmResponse = {
  routes?: Array<{
    distance: number;
    duration: number;
    geometry?: { coordinates?: [number, number][] };
  }>;
};

/** Ritmo a pie ~4,5 km/h, usado si OSRM no responde. */
const WALK_METERS_PER_SECOND = 1.25;

export function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min a pie`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h a pie` : `${hours} h ${rest} min a pie`;
}

export function estimateWalkingRoute(from: LatLng, to: LatLng): WalkingRoute {
  const distanceM = distanceMeters(from, to);
  return {
    coordinates: [from, to],
    distanceM,
    durationS: Math.max(60, distanceM / WALK_METERS_PER_SECOND),
  };
}

export async function fetchWalkingRoute(
  from: LatLng,
  to: LatLng,
  signal?: AbortSignal,
): Promise<WalkingRoute | null> {
  const url = `https://router.project-osrm.org/route/v1/foot/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return null;
    const data = (await response.json()) as OsrmResponse;
    const route = data.routes?.[0];
    const coords = route?.geometry?.coordinates;
    if (!route || !coords || coords.length < 2) return null;
    return {
      distanceM: route.distance,
      durationS: route.duration,
      coordinates: coords.map(([lng, lat]) => ({ lat, lng })),
    };
  } catch {
    return null;
  }
}
