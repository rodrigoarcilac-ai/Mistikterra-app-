import { distanceMeters, type LatLng } from "./places";

export type MapPoint = LatLng & { label?: string };

function pointQuery(point: MapPoint): string {
  return `${point.lat},${point.lng}`;
}

/** Embed de Google Maps en español: lugar o ruta a pie. No requiere API key. */
export function googleMapEmbedSrc(
  origin: MapPoint,
  destination: MapPoint | null,
): string {
  if (!destination || distanceMeters(origin, destination) < 30) {
    const point = destination ?? origin;
    const params = new URLSearchParams({
      q: pointQuery(point),
      hl: "es",
      z: "16",
      output: "embed",
    });
    return `https://www.google.com/maps?${params.toString()}`;
  }

  const params = new URLSearchParams({
    saddr: pointQuery(origin),
    daddr: pointQuery(destination),
    hl: "es",
    dirflg: "w",
    t: "m",
    output: "embed",
  });
  return `https://www.google.com/maps?${params.toString()}`;
}

/** Recorrido del viaje entre paradas (hoteles), sin API key. */
export function googleTripRouteEmbed(stops: MapPoint[]): string {
  if (stops.length === 0) {
    return "https://www.google.com/maps?hl=es&output=embed";
  }
  const origin = pointQuery(stops[0]);
  const rest = stops.slice(1).map((stop) => encodeURIComponent(pointQuery(stop)));
  const params = new URLSearchParams({
    hl: "es",
    t: "m",
    output: "embed",
  });
  return `https://www.google.com/maps?saddr=${encodeURIComponent(origin)}&daddr=${rest.join("+to:")}&${params.toString()}`;
}

export function googleTripRouteLink(stops: MapPoint[]): string {
  if (stops.length === 0) return "https://www.google.com/maps?hl=es";
  const origin = pointQuery(stops[0]);
  const destination = pointQuery(stops[stops.length - 1]);
  const waypoints = stops.slice(1, -1).map(pointQuery).join("|");
  const params = new URLSearchParams({
    api: "1",
    origin,
    destination,
    hl: "es",
  });
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/** Enlace oficial para abrir la ruta a pie en Google Maps. */
export function googleWalkingLink(origin: MapPoint, destination: MapPoint): string {
  const params = new URLSearchParams({
    api: "1",
    origin: pointQuery(origin),
    destination: pointQuery(destination),
    travelmode: "walking",
    hl: "es",
  });
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
