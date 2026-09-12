import type { ReservationNeed, Restaurant } from "./types";
import { isWalkableDistance, distanceMeters, type LatLng } from "./places";

export const RESERVATION_LABEL: Record<ReservationNeed, string> = {
  indispensable: "Reserva indispensable",
  recomendado: "Reserva recomendada",
  no_necesario: "Sin reserva",
};

/** Hotel, misma finca o minutos a pie: no fingir caminata si el PDF dice taxi. */
export function restaurantIsWalkable(
  place: Restaurant,
  origin?: LatLng | null,
): boolean {
  const far = place.howFar.toLowerCase();
  if (far.includes("taxi")) return false;
  if (
    /hotel|planta|piso|enfrente|frente|terraza/.test(far) ||
    far.includes("caminando")
  ) {
    return true;
  }
  if (origin) return isWalkableDistance(distanceMeters(origin, place));
  return false;
}

export function restaurantsInZone(
  restaurants: Restaurant[],
  zone: string,
): Restaurant[] {
  return restaurants.filter((place) => place.zone === zone);
}
