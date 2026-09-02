import { useMemo, useState } from "react";
import NearbyMap from "../components/NearbyMap";
import NearbyPlaces from "../components/NearbyPlaces";
import {
  CATEGORY_LABEL,
  PLACE_CATEGORIES,
  distanceMeters,
  filterRecommendations,
  formatDistance,
  hasCoords,
  isWalkableDistance,
  originForZone,
  sortByNearest,
  suggestZoneFromPosition,
  zonesFrom,
} from "../lib/places";
import { formatDuration } from "../lib/route";
import { useDeviceOrigin } from "../lib/useDeviceOrigin";
import { useWalkingRoute } from "../lib/useWalkingRoute";
import type { PlaceCategory } from "../lib/types";
import { useTrip } from "../lib/trip";

type CategoryFilter = PlaceCategory | "todos";

function chipClass(active: boolean) {
  return `flex min-h-12 shrink-0 items-center rounded-full px-3.5 text-sm ${
    active
      ? "bg-oro text-noche"
      : "border border-borde text-marfil-tenue hover:text-marfil"
  }`;
}

export default function ExplorePage() {
  const { trip } = useTrip();
  const device = useDeviceOrigin();
  const zones = useMemo(
    () => zonesFrom(trip.recommendations),
    [trip.recommendations],
  );
  const [zone, setZone] = useState<string | null>(null);
  const [category, setCategory] = useState<CategoryFilter>("todos");
  const [pickedId, setPickedId] = useState<string | null>(null);

  const activeZone = zone ?? zones[0] ?? "";

  const hotelOrigin = useMemo(
    () => originForZone(activeZone, trip.meetingPoint),
    [trip.meetingPoint, activeZone],
  );
  const origin = device.origin ?? hotelOrigin;

  const ranked = useMemo(() => {
    const places = filterRecommendations(trip.recommendations, {
      zone: activeZone || undefined,
      category,
    }).filter(hasCoords);
    return sortByNearest(places, origin);
  }, [activeZone, category, origin, trip.recommendations]);

  const suggestedZone = useMemo(() => {
    if (!device.origin) return null;
    return suggestZoneFromPosition(
      device.origin,
      activeZone,
      trip.meetingPoint,
    );
  }, [activeZone, device.origin, trip.meetingPoint]);

  const selected =
    ranked.find((place) => place.id === pickedId) ?? ranked[0] ?? null;
  const selectedMeters = selected ? distanceMeters(origin, selected) : 0;
  const walkable = selected ? isWalkableDistance(selectedMeters) : false;
  const route = useWalkingRoute(origin, walkable ? selected : null);
  const gpsFailed = device.status === "denied" || device.status === "error";
  const readingGps = device.status === "loading";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl text-marfil">Cerca</h1>
        <p className="mt-2 text-sm leading-6 text-marfil-tenue">
          El mapa y las distancias salen del hotel de la ciudad, salvo que uses
          tu ubicación. Pensado para tiempos libres, no para el tour guiado.
        </p>
        <div className="mt-3 space-y-1.5 rounded-2xl border border-borde bg-carbon/50 p-2">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {zones.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setZone(option);
                  setPickedId(null);
                }}
                aria-pressed={activeZone === option}
                className={chipClass(activeZone === option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {(["todos", ...PLACE_CATEGORIES] as CategoryFilter[]).map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setCategory(option);
                    setPickedId(null);
                  }}
                  aria-pressed={category === option}
                  className={chipClass(category === option)}
                >
                  {option === "todos" ? "Todos" : CATEGORY_LABEL[option]}
                </button>
              ),
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {device.origin ? (
              <>
                <button
                  type="button"
                  onClick={device.request}
                  disabled={readingGps}
                  className={chipClass(true)}
                >
                  {readingGps ? "Leyendo ubicación…" : "Actualizar"}
                </button>
                <button
                  type="button"
                  onClick={device.clear}
                  className={chipClass(false)}
                >
                  Dejar de usar mi ubicación
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={device.request}
                disabled={readingGps}
                className={chipClass(false)}
              >
                {readingGps ? "Leyendo ubicación…" : "Usar mi ubicación"}
              </button>
            )}
          </div>
        </div>
        {gpsFailed ? (
          <p className="mt-2 text-sm leading-6 text-marfil" role="status">
            No se pudo leer tu ubicación; seguimos desde el hotel.
          </p>
        ) : null}
        {suggestedZone ? (
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-2xl border border-borde bg-carbon/50 px-3 py-2">
            <p className="text-sm leading-6 text-marfil">
              Parece que estás en {suggestedZone}
            </p>
            <button
              type="button"
              onClick={() => {
                setZone(suggestedZone);
                setPickedId(null);
              }}
              className="flex min-h-12 items-center text-sm font-semibold text-oro underline-offset-4 hover:underline"
            >
              Ver lugares de {suggestedZone}
            </button>
          </div>
        ) : null}
      </div>

      {ranked.length === 0 ? (
        <div className="space-y-3">
          <p className="text-base text-marfil-tenue">
            Ningún lugar con ese tipo.
          </p>
          <button
            type="button"
            onClick={() => setCategory("todos")}
            className="flex min-h-12 items-center text-base font-semibold text-oro underline-offset-4 hover:underline"
          >
            Mostrar todos
          </button>
        </div>
      ) : (
        <>
          {walkable ? (
            <NearbyMap origin={origin} destination={selected} />
          ) : (
            <p className="rounded-2xl border border-borde bg-carbon/50 px-4 py-4 text-base leading-6 text-marfil">
              Este lugar no está a pie desde {origin.label} (
              {formatDistance(selectedMeters)}). Usa el traslado del grupo.
            </p>
          )}
          {selected && walkable ? (
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
            selectedId={selected?.id}
            onSelect={setPickedId}
            origin={origin}
          />
        </>
      )}
    </div>
  );
}
