import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLng } from "../lib/places";
import type { Recommendation } from "../lib/types";

type NearbyMapProps = {
  places: Recommendation[];
  selectedId: string | null;
  origin: LatLng & { label: string };
  route: LatLng[] | null;
  onSelect: (id: string) => void;
};

function pinIcon(kind: "place" | "selected" | "origin") {
  return L.divIcon({
    className: `mt-map-pin mt-map-pin-${kind}`,
    iconSize: kind === "selected" ? [22, 22] : [16, 16],
    iconAnchor: kind === "selected" ? [11, 11] : [8, 8],
  });
}

export default function NearbyMap({
  places,
  selectedId,
  origin,
  route,
  onSelect,
}: NearbyMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || mapRef.current) return;

    const map = L.map(node, {
      zoomControl: true,
      attributionControl: true,
      scrollWheelZoom: false,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap &copy; CARTO",
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;
    layersRef.current = L.layerGroup().addTo(map);

    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    window.setTimeout(onResize, 80);

    return () => {
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
      layersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    const originMarker = L.marker([origin.lat, origin.lng], {
      icon: pinIcon("origin"),
      title: origin.label,
      keyboard: true,
    });
    originMarker.bindTooltip(origin.label, { direction: "top" });
    originMarker.addTo(layers);

    for (const place of places) {
      const selected = place.id === selectedId;
      const marker = L.marker([place.lat, place.lng], {
        icon: pinIcon(selected ? "selected" : "place"),
        title: place.name,
        keyboard: true,
        riseOnHover: true,
      });
      marker.bindTooltip(place.name, { direction: "top" });
      marker.on("click", () => onSelect(place.id));
      marker.addTo(layers);
    }

    if (route && route.length > 1) {
      L.polyline(
        route.map((point) => [point.lat, point.lng] as L.LatLngExpression),
        {
          color: "#d4af37",
          weight: 4,
          opacity: 0.95,
          lineJoin: "round",
          lineCap: "round",
        },
      ).addTo(layers);
    }

    const selectedPlace = places.find((place) => place.id === selectedId);
    if (route && route.length > 1) {
      const bounds = L.latLngBounds(
        route.map((point) => [point.lat, point.lng] as [number, number]),
      );
      bounds.extend([origin.lat, origin.lng]);
      if (selectedPlace) bounds.extend([selectedPlace.lat, selectedPlace.lng]);
      map.fitBounds(bounds.pad(0.22));
    } else {
      const bounds = L.latLngBounds([
        [origin.lat, origin.lng],
        ...places.map((place) => [place.lat, place.lng] as [number, number]),
      ]);
      if (bounds.isValid()) {
        map.fitBounds(bounds.pad(0.18));
      }
    }
    window.setTimeout(() => map.invalidateSize(), 50);
  }, [onSelect, origin, places, route, selectedId]);

  return (
    <figure className="mt-map-frame">
      <span className="mt-map-corner mt-map-corner-tl" aria-hidden />
      <span className="mt-map-corner mt-map-corner-tr" aria-hidden />
      <span className="mt-map-corner mt-map-corner-bl" aria-hidden />
      <span className="mt-map-corner mt-map-corner-br" aria-hidden />
      <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-oro">
          Mapa · Cerca
        </p>
        <p className="truncate text-xs text-marfil-tenue">{origin.label}</p>
      </div>
      <div className="mt-map-frame-inner">
        <div
          ref={containerRef}
          className="h-72 w-full sm:h-80"
          role="application"
          aria-label="Mapa de lugares cercanos"
        />
      </div>
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 px-4 py-2 text-xs text-marfil-tenue">
        <span className="inline-flex items-center gap-1.5">
          <i className="mt-map-legend mt-map-legend-origin" aria-hidden />
          Origen
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="mt-map-legend mt-map-legend-place" aria-hidden />
          Lugar
        </span>
        <span className="inline-flex items-center gap-1.5 text-oro">
          <i className="mt-map-legend mt-map-legend-selected" aria-hidden />
          Selección
        </span>
      </figcaption>
    </figure>
  );
}
