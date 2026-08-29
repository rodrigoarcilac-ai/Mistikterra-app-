import { useEffect, useRef } from "react";
import L from "leaflet";
import "@maplibre/maplibre-gl-leaflet";
import { hasCoords, type LatLng } from "../lib/places";
import { fetchSpanishDarkStyle } from "../lib/mapStyle";
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

function toLatLng(point: LatLng): L.LatLngExpression {
  return [point.lat, point.lng];
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
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
    });
    map.attributionControl.setPrefix(false);
    map.attributionControl.addAttribution(
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · OpenFreeMap',
    );
    L.control
      .zoom({
        position: "topleft",
        zoomInTitle: "Acercar",
        zoomOutTitle: "Alejar",
      })
      .addTo(map);

    const controller = new AbortController();
    void fetchSpanishDarkStyle(controller.signal)
      .then((style) => {
        if (controller.signal.aborted || !mapRef.current) return;
        L.maplibreGL({
          style,
          attributionControl: false,
        }).addTo(map);
        map.invalidateSize();
      })
      .catch(() => {
        if (controller.signal.aborted || !mapRef.current) return;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
          className: "mt-map-tiles",
          maxZoom: 19,
        }).addTo(map);
      });

    mapRef.current = map;
    layersRef.current = L.layerGroup().addTo(map);

    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);
    window.setTimeout(onResize, 80);

    return () => {
      controller.abort();
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
      layersRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;
    if (!map || !layers || !hasCoords(origin)) return;

    layers.clearLayers();

    const mappable = places.filter(hasCoords);
    const path = (route ?? []).filter(hasCoords);

    const originMarker = L.marker(toLatLng(origin), {
      icon: pinIcon("origin"),
      title: origin.label,
      keyboard: true,
    });
    originMarker.bindTooltip(origin.label, { direction: "top" });
    originMarker.addTo(layers);

    for (const place of mappable) {
      const selected = place.id === selectedId;
      const marker = L.marker(toLatLng(place), {
        icon: pinIcon(selected ? "selected" : "place"),
        title: place.name,
        keyboard: true,
        riseOnHover: true,
      });
      marker.bindTooltip(place.name, { direction: "top" });
      marker.on("click", () => onSelect(place.id));
      marker.addTo(layers);
    }

    if (path.length > 1) {
      L.polyline(path.map(toLatLng), {
        color: "#d4af37",
        weight: 4,
        opacity: 0.95,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(layers);
    }

    const selectedPlace = mappable.find((place) => place.id === selectedId);
    const bounds = L.latLngBounds([toLatLng(origin)]);
    if (path.length > 1) {
      for (const point of path) bounds.extend(toLatLng(point));
      if (selectedPlace) bounds.extend(toLatLng(selectedPlace));
    } else {
      for (const place of mappable) bounds.extend(toLatLng(place));
    }
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.22));
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
          lang="es"
          role="application"
          aria-label="Mapa de lugares cercanos en español"
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
