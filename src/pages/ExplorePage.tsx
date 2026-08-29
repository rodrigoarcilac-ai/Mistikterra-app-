import { useMemo, useState } from "react";
import NearbyMap from "../components/NearbyMap";
import NearbyPlaces from "../components/NearbyPlaces";
import {
  CATEGORY_LABEL,
  PLACE_CATEGORIES,
  filterRecommendations,
  formatDistance,
  hasCoords,
  originForZone,
  sortByNearest,
  zonesFrom,
} from "../lib/places";
import { formatDuration } from "../lib/route";
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
  const zones = useMemo(
    () => zonesFrom(trip.recommendations),
    [trip.recommendations],
  );
  const [zone, setZone] = useState<string>("todos");
  const [category, setCategory] = useState<CategoryFilter>("todos");
  const [pickedId, setPickedId] = useState<string | null>(null);

  const origin = useMemo(
    () => originForZone(zone, trip.meetingPoint),
    [trip.meetingPoint, zone],
  );

  const ranked = useMemo(() => {
    const places = filterRecommendations(trip.recommendations, {
      zone: zone === "todos" ? undefined : zone,
      category,
    }).filter(hasCoords);
    return sortByNearest(places, origin);
  }, [category, origin, trip.recommendations, zone]);

  const selected =
    ranked.find((place) => place.id === pickedId) ?? ranked[0] ?? null;
  const route = useWalkingRoute(origin, selected);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl text-marfil">Cerca</h1>
        <div className="mt-3 space-y-1.5 rounded-2xl border border-borde bg-carbon/50 p-2">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {["todos", ...zones].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setZone(option)}
                aria-pressed={zone === option}
                className={chipClass(zone === option)}
              >
                {option === "todos" ? "Todas" : option}
              </button>
            ))}
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {(["todos", ...PLACE_CATEGORIES] as CategoryFilter[]).map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  aria-pressed={category === option}
                  className={chipClass(category === option)}
                >
                  {option === "todos" ? "Todos" : CATEGORY_LABEL[option]}
                </button>
              ),
            )}
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-marfil-tenue">
          Elige un lugar. El mapa lo resalta y traza la ruta a pie más cercana
          desde el punto de referencia de la zona.
        </p>
      </div>

      {ranked.length === 0 ? (
        <p className="text-base text-marfil-tenue">
          No hay recomendaciones con ese filtro.
        </p>
      ) : (
        <>
          <NearbyMap
            places={ranked}
            selectedId={selected?.id ?? null}
            origin={origin}
            route={route?.coordinates ?? null}
            onSelect={setPickedId}
          />
          {selected ? (
            <p className="text-sm leading-6 text-marfil-tenue">
              {route
                ? `Ruta a ${selected.name}: ${formatDuration(route.durationS)} · ${formatDistance(route.distanceM)} desde ${origin.label}.`
                : `Ruta más cercana a ${selected.name} desde ${origin.label}…`}
            </p>
          ) : null}
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
