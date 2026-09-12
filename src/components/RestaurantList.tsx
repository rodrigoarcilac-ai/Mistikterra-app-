import {
  RESERVATION_LABEL,
  restaurantIsWalkable,
} from "../lib/restaurants";
import {
  distanceMeters,
  formatStraightLineDistance,
  type LatLng,
} from "../lib/places";
import type { Restaurant } from "../lib/types";

export default function RestaurantList({
  restaurants,
  selectedId,
  onSelect,
  origin,
  heading,
}: {
  restaurants: Restaurant[];
  selectedId?: string;
  onSelect: (id: string) => void;
  origin?: LatLng | null;
  heading?: string;
}) {
  if (restaurants.length === 0) return null;

  return (
    <section aria-label={heading ?? "Mesas"} className="space-y-3">
      {heading ? (
        <h2 className="font-display text-2xl text-marfil">{heading}</h2>
      ) : null}
      <ul className="divide-y divide-borde border-y border-borde">
        {restaurants.map((place) => {
          const selected = place.id === selectedId;
          const walkable = restaurantIsWalkable(place, origin);
          const distance = origin
            ? formatStraightLineDistance(distanceMeters(origin, place))
            : place.howFar;

          return (
            <li key={place.id}>
              <div
                className={
                  selected ? "border-l-2 border-oro bg-oro/10 px-3" : ""
                }
              >
                <button
                  type="button"
                  onClick={() => onSelect(place.id)}
                  aria-pressed={selected}
                  className="flex min-h-12 w-full items-baseline justify-between gap-3 py-3 text-left"
                >
                  <h3 className="font-display text-lg text-marfil">
                    {place.name}
                  </h3>
                  <span className="shrink-0 text-sm text-marfil-tenue">
                    {walkable && origin ? distance : place.howFar}
                  </span>
                </button>
                {selected ? (
                  <div className="pb-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-oro">
                      {RESERVATION_LABEL[place.reservation]}
                      {place.reservationNote ? ` · ${place.reservationNote}` : ""}
                    </p>
                    <p className="mt-1 text-base text-marfil">{place.style}</p>
                    <p className="mt-2 text-sm text-marfil-tenue">
                      {place.hours} · {place.howFar}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4">
                      {place.website ? (
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-12 items-center text-base font-semibold text-oro underline-offset-4 hover:underline"
                        >
                          Sitio web
                        </a>
                      ) : null}
                      <a
                        href={place.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center text-base font-semibold text-oro underline-offset-4 hover:underline"
                      >
                        Abrir en Google Maps
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
