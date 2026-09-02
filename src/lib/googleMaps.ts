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
