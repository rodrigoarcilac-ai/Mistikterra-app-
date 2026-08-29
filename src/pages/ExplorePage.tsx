import { useMemo, useState } from "react";
import NearbyPlaces from "../components/NearbyPlaces";
import {
  CATEGORY_LABEL,
  PLACE_CATEGORIES,
  filterRecommendations,
  zonesFrom,
} from "../lib/places";
import type { PlaceCategory } from "../lib/types";
import { useTrip } from "../lib/trip";

type CategoryFilter = PlaceCategory | "todos";

export default function ExplorePage() {
  const { trip } = useTrip();
  const zones = useMemo(
    () => zonesFrom(trip.recommendations),
    [trip.recommendations],
  );
  const [zone, setZone] = useState<string>("todos");
  const [category, setCategory] = useState<CategoryFilter>("todos");

  const places = filterRecommendations(trip.recommendations, {
    zone: zone === "todos" ? undefined : zone,
    category,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-marfil">Cerca</h1>
        <p className="mt-1 text-base text-marfil-tenue">
          Lugares recomendados para tus tiempos libres, junto a cada jornada del
          viaje.
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-oro">
          Zona
        </legend>
        <div className="flex flex-wrap gap-2">
          {["todos", ...zones].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setZone(option)}
              className={`flex min-h-12 items-center rounded-full px-4 text-base ${
                zone === option
                  ? "bg-oro text-noche"
                  : "border border-borde text-marfil-tenue hover:text-marfil"
              }`}
            >
              {option === "todos" ? "Todas" : option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-oro">
          Tipo
        </legend>
        <div className="flex flex-wrap gap-2">
          {(["todos", ...PLACE_CATEGORIES] as CategoryFilter[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setCategory(option)}
              className={`flex min-h-12 items-center rounded-full px-4 text-base ${
                category === option
                  ? "bg-oro text-noche"
                  : "border border-borde text-marfil-tenue hover:text-marfil"
              }`}
            >
              {option === "todos" ? "Todos" : CATEGORY_LABEL[option]}
            </button>
          ))}
        </div>
      </fieldset>

      {places.length === 0 ? (
        <p className="text-base text-marfil-tenue">
          No hay recomendaciones con ese filtro.
        </p>
      ) : (
        <NearbyPlaces places={places} />
      )}
    </div>
  );
}
