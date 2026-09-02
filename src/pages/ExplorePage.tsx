import { useMemo, useState } from "react";
import NearbyMap from "../components/NearbyMap";
import NearbyPlaces from "../components/NearbyPlaces";
import { useSharedDeviceOrigin } from "../lib/DeviceOriginProvider";
import {
  distanceMeters,
  filterRecommendations,
  formatDistance,
  hasCoords,
  isWalkableDistance,
  nearestZoneFromPosition,
  sortByNearest,
} from "../lib/places";
import { formatDuration } from "../lib/route";
import { useWalkingRoute } from "../lib/useWalkingRoute";
import { useTrip } from "../lib/trip";

export default function ExplorePage() {
  const { trip } = useTrip();
  const device = useSharedDeviceOrigin();
  const [pickedId, setPickedId] = useState<string | null>(null);

  const origin = device.origin;
  const activeZone = origin ? nearestZoneFromPosition(origin) : null;

  const ranked = useMemo(() => {
    if (!origin || !activeZone) return [];
    const places = filterRecommendations(trip.recommendations, {
      zone: activeZone,
    }).filter(hasCoords);
    return sortByNearest(places, origin);
  }, [activeZone, origin, trip.recommendations]);

  const selected =
    ranked.find((place) => place.id === pickedId) ?? ranked[0] ?? null;
  const selectedMeters =
    origin && selected ? distanceMeters(origin, selected) : 0;
  const walkable = selected ? isWalkableDistance(selectedMeters) : false;
  const route = useWalkingRoute(
    origin ?? { lat: 0, lng: 0 },
    origin && walkable ? selected : null,
  );

  const readingGps = device.status === "idle" || device.status === "loading";
  const gpsFailed = device.status === "denied" || device.status === "error";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl text-marfil">Cerca</h1>
        <p className="mt-2 text-sm leading-6 text-marfil-tenue">
          Lugares cerca de ti para tiempos libres.
        </p>
      </div>

      {readingGps ? (
        <p className="text-base text-marfil-tenue" role="status">
          Leyendo tu ubicación…
        </p>
      ) : null}

      {gpsFailed ? (
        <p className="text-base leading-6 text-marfil" role="status">
          Activa la ubicación para ver lugares cerca de ti.
        </p>
      ) : null}

      {origin && ranked.length === 0 ? (
        <p className="text-base text-marfil-tenue">
          Ningún lugar cerca en esta zona.
        </p>
      ) : null}

      {origin && selected ? (
        <>
          {walkable ? (
            <NearbyMap origin={origin} destination={selected} />
          ) : (
            <p className="rounded-2xl border border-borde bg-carbon/50 px-4 py-4 text-base leading-6 text-marfil">
              Este lugar no está a pie desde {origin.label} (
              {formatDistance(selectedMeters)}). Usa el traslado del grupo.
            </p>
          )}
          {walkable ? (
            <p className="text-sm leading-6 text-marfil-tenue">
              {route
                ? `A pie (estimación) a ${selected.name}: ${formatDuration(route.durationS)} · ${formatDistance(route.distanceM)} desde ${origin.label}.`
                : `Ruta a pie (estimación) a ${selected.name} desde ${origin.label}…`}
            </p>
          ) : null}
          <p className="text-xs text-marfil-tenue">
            Las distancias de la lista son en línea recta.
          </p>
          <NearbyPlaces
            places={ranked}
            selectedId={selected.id}
            onSelect={setPickedId}
            origin={origin}
          />
        </>
      ) : null}
    </div>
  );
}
