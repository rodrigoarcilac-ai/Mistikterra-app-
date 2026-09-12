import { googleTripRouteEmbed, googleTripRouteLink } from "../lib/googleMaps";
import { TRIP_ZONE_ORDER, ZONE_ORIGINS } from "../lib/places";

export default function TripRouteMap() {
  const stops = TRIP_ZONE_ORDER.map((zone) => ZONE_ORIGINS[zone]);
  const src = googleTripRouteEmbed(stops);
  const openHref = googleTripRouteLink(stops);
  const summary = TRIP_ZONE_ORDER.join(" → ");

  return (
    <figure className="mt-map-frame">
      <span className="mt-map-corner mt-map-corner-tl" aria-hidden />
      <span className="mt-map-corner mt-map-corner-tr" aria-hidden />
      <span className="mt-map-corner mt-map-corner-bl" aria-hidden />
      <span className="mt-map-corner mt-map-corner-br" aria-hidden />
      <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-oro">
          Recorrido
        </p>
        <p className="truncate text-xs text-marfil-tenue">{summary}</p>
      </div>
      <div className="mt-map-frame-inner">
        <iframe
          title="Google Maps · recorrido Mar de Imperios"
          src={src}
          className="h-[22rem] w-full border-0 bg-carbon sm:h-[28rem]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="fullscreen"
        />
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-marfil-tenue">
        <span>Estambul a Salónica</span>
        <a
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center font-semibold text-oro underline-offset-4 hover:underline"
        >
          Abrir en Google Maps
        </a>
      </figcaption>
    </figure>
  );
}
