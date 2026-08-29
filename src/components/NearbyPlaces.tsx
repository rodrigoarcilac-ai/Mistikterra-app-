import { Link } from "react-router-dom";
import {
  CATEGORY_LABEL,
  distanceMeters,
  formatDistance,
  type LatLng,
} from "../lib/places";
import type { Recommendation } from "../lib/types";

export default function NearbyPlaces({
  places,
  heading,
  action,
  selectedId,
  onSelect,
  origin,
}: {
  places: Recommendation[];
  heading?: string;
  action?: { to: string; label: string };
  selectedId?: string;
  onSelect?: (id: string) => void;
  origin?: LatLng;
}) {
  if (places.length === 0) return null;

  return (
    <section aria-label={heading ?? "Lugares cercanos"} className="space-y-4">
      {heading ? (
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl text-marfil">{heading}</h2>
          {action ? (
            <Link
              to={action.to}
              className="flex min-h-12 items-center text-base font-semibold text-oro underline-offset-4 hover:underline"
            >
              {action.label}
            </Link>
          ) : null}
        </div>
      ) : null}

      <ul className="divide-y divide-borde border-y border-borde">
        {places.map((place) => {
          const selected = place.id === selectedId;
          const distance = origin
            ? formatDistance(distanceMeters(origin, place))
            : null;
          const body = (
            <>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-oro">
                {CATEGORY_LABEL[place.category]} · {place.zone}
                {distance ? ` · ${distance}` : null}
              </p>
              <h3 className="mt-1 font-display text-xl text-marfil">{place.name}</h3>
              <p className="text-base text-marfil-tenue">{place.area}</p>
              <p className="mt-1 text-base text-marfil">{place.summary}</p>
              <a
                href={place.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="mt-3 inline-flex min-h-12 items-center text-base font-semibold text-oro underline-offset-4 hover:underline"
              >
                Abrir en Google Maps
              </a>
            </>
          );

          return (
            <li key={place.id}>
              {onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(place.id)}
                  aria-pressed={selected}
                  className={`block w-full py-4 text-left ${
                    selected
                      ? "border-l-2 border-oro bg-oro/10 px-3"
                      : ""
                  }`}
                >
                  {body}
                </button>
              ) : (
                <div className="py-4">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
