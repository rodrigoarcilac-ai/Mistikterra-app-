import { Link } from "react-router-dom";
import { CATEGORY_LABEL } from "../lib/places";
import type { Recommendation } from "../lib/types";

export default function NearbyPlaces({
  places,
  heading,
  action,
}: {
  places: Recommendation[];
  heading?: string;
  action?: { to: string; label: string };
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
        {places.map((place) => (
          <li key={place.id} className="py-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-oro">
              {CATEGORY_LABEL[place.category]} · {place.zone}
            </p>
            <h3 className="mt-1 font-display text-xl text-marfil">{place.name}</h3>
            <p className="text-base text-marfil-tenue">{place.area}</p>
            <p className="mt-1 text-base text-marfil">{place.summary}</p>
            <a
              href={place.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-12 items-center text-base font-semibold text-oro underline-offset-4 hover:underline"
            >
              Cómo llegar / Ver en mapa
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
