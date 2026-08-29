import { useEffect, useState } from "react";
import { distanceMeters, type LatLng } from "./places";
import {
  estimateWalkingRoute,
  fetchWalkingRoute,
  type WalkingRoute,
} from "./route";

function routeKey(from: LatLng, to: LatLng): string {
  return `${from.lat},${from.lng}|${to.lat},${to.lng}`;
}

export function useWalkingRoute(
  from: LatLng,
  to: LatLng | null,
): WalkingRoute | null {
  const key = to ? routeKey(from, to) : null;
  const [cache, setCache] = useState<Record<string, WalkingRoute>>({});

  useEffect(() => {
    if (!key) return;

    const [fromPart, toPart] = key.split("|");
    const [fromLat, fromLng] = fromPart.split(",").map(Number);
    const [toLat, toLng] = toPart.split(",").map(Number);
    const origin = { lat: fromLat, lng: fromLng };
    const dest = { lat: toLat, lng: toLng };
    if (distanceMeters(origin, dest) < 30) return;

    const controller = new AbortController();
    void fetchWalkingRoute(origin, dest, controller.signal).then((next) => {
      if (controller.signal.aborted) return;
      setCache((prev) => ({
        ...prev,
        [key]: next ?? estimateWalkingRoute(origin, dest),
      }));
    });
    return () => controller.abort();
  }, [key]);

  return key ? (cache[key] ?? null) : null;
}
