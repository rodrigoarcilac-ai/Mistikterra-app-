import { googleMapEmbedSrc, googleWalkingLink } from "../lib/googleMaps";
import type { LatLng } from "../lib/places";

type MapPlace = LatLng & { name?: string; label?: string };

export default function NearbyMap({
  origin,
  destination,
}: {
  origin: LatLng & { label: string };
  destination: MapPlace | null;
}) {
  const destPoint = destination
    ? { lat: destination.lat, lng: destination.lng, label: destination.name }
    : null;
  const src = googleMapEmbedSrc(origin, destPoint);
  const openHref = destPoint ? googleWalkingLink(origin, destPoint) : null;
  const title = destPoint?.label
    ? `Google Maps · ruta a pie a ${destPoint.label}`
    : "Google Maps · lugares cercanos";

  return (
    <figure className="mt-map-frame">
      <span className="mt-map-corner mt-map-corner-tl" aria-hidden />
      <span className="mt-map-corner mt-map-corner-tr" aria-hidden />
      <span className="mt-map-corner mt-map-corner-bl" aria-hidden />
      <span className="mt-map-corner mt-map-corner-br" aria-hidden />
      <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-oro">
          Mapa a pie
        </p>
        <p className="truncate text-xs text-marfil-tenue">{origin.label}</p>
      </div>
      <div className="mt-map-frame-inner">
        <iframe
          title={title}
          src={src}
          className="h-[22rem] w-full border-0 bg-carbon sm:h-[28rem]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="fullscreen; geolocation"
        />
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-marfil-tenue">
        <span>Ruta a pie</span>
        {openHref ? (
          <a
            href={openHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center font-semibold text-oro underline-offset-4 hover:underline"
          >
            Abrir en Google Maps
          </a>
        ) : null}
      </figcaption>
    </figure>
  );
}
