import { useMemo, useState } from "react";
import NearbyMap from "../components/NearbyMap";
import NearbyPlaces from "../components/NearbyPlaces";
import RestaurantList from "../components/RestaurantList";
import TripRouteMap from "../components/TripRouteMap";
import { useSharedDeviceOrigin } from "../lib/DeviceOriginProvider";
import {
  TRIP_ZONE_ORDER,
  ZONE_ORIGINS,
  distanceMeters,
  filterRecommendations,
  formatDistance,
  hasCoords,
  isWalkableDistance,
  nearestZoneFromPosition,
  sortByNearest,
} from "../lib/places";
import { restaurantIsWalkable, restaurantsInZone } from "../lib/restaurants";
import { formatDuration } from "../lib/route";
import { useWalkingRoute } from "../lib/useWalkingRoute";
import { useTrip } from "../lib/trip";
import type { Restaurant } from "../lib/types";

export default function ExplorePage() {
  const { trip } = useTrip();
  const device = useSharedDeviceOrigin();
  const [pickedMesaId, setPickedMesaId] = useState<string | null>(null);
  const [pickedPlaceId, setPickedPlaceId] = useState<string | null>(null);

  const origin = device.origin;
  const gpsZone = origin ? nearestZoneFromPosition(origin) : null;
  const readingGps = device.status === "idle" || device.status === "loading";
  const gpsFailed = device.status === "denied" || device.status === "error";
  const gpsLive = device.status === "live" && origin;

  const showMesas = !readingGps;

  const mesasByZone = useMemo(() => {
    if (!showMesas) return [];
    if (gpsZone) {
      const list = restaurantsInZone(trip.restaurants, gpsZone);
      return [
        {
          zone: gpsZone,
          restaurants: origin ? sortByNearest(list, origin) : list,
        },
      ];
    }
    return TRIP_ZONE_ORDER.map((zone) => ({
      zone,
      restaurants: restaurantsInZone(trip.restaurants, zone),
    })).filter((group) => group.restaurants.length > 0);
  }, [gpsZone, origin, showMesas, trip.restaurants]);

  const flatMesas = useMemo(
    () => mesasByZone.flatMap((group) => group.restaurants),
    [mesasByZone],
  );

  const selectedMesa: Restaurant | null =
    flatMesas.find((place) => place.id === pickedMesaId) ??
    flatMesas[0] ??
    null;

  const mesaOrigin = selectedMesa
    ? (origin ?? ZONE_ORIGINS[selectedMesa.zone])
    : origin ?? ZONE_ORIGINS.Estambul;
  const mesaWalkable = selectedMesa
    ? restaurantIsWalkable(selectedMesa, mesaOrigin)
    : false;
  const mesaMeters = selectedMesa
    ? distanceMeters(mesaOrigin, selectedMesa)
    : 0;
  const mesaRoute = useWalkingRoute(
    mesaOrigin,
    selectedMesa && mesaWalkable ? selectedMesa : null,
  );

  const rankedPlaces = useMemo(() => {
    if (!origin || !gpsZone) return [];
    const places = filterRecommendations(trip.recommendations, {
      zone: gpsZone,
    }).filter(hasCoords);
    return sortByNearest(places, origin);
  }, [gpsZone, origin, trip.recommendations]);

  const selectedPlace =
    rankedPlaces.find((place) => place.id === pickedPlaceId) ??
    rankedPlaces[0] ??
    null;
  const selectedPlaceMeters =
    origin && selectedPlace ? distanceMeters(origin, selectedPlace) : 0;
  const placeWalkable = selectedPlace
    ? isWalkableDistance(selectedPlaceMeters)
    : false;
  const placeRoute = useWalkingRoute(
    origin ?? { lat: 0, lng: 0 },
    origin && placeWalkable ? selectedPlace : null,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-marfil">Cerca</h1>
        <p className="mt-2 text-sm leading-6 text-marfil-tenue">
          Recorrido del viaje y mesas para tiempos libres.
        </p>
      </div>

      <TripRouteMap />

      {readingGps ? (
        <p className="text-base text-marfil-tenue" role="status">
          Leyendo tu ubicación…
        </p>
      ) : null}

      {gpsFailed ? (
        <p className="text-sm leading-6 text-marfil-tenue">
          Sin tu ubicación, las mesas van por ciudad del viaje.
        </p>
      ) : null}

      {selectedMesa ? (
        <div className="space-y-3">
          <h2 className="font-display text-2xl text-marfil">
            {gpsLive ? `Mesas en ${gpsZone}` : "Mesas"}
          </h2>
          {mesaWalkable ? (
            <>
              <NearbyMap origin={mesaOrigin} destination={selectedMesa} />
              <p className="text-sm leading-6 text-marfil-tenue">
                {mesaRoute
                  ? `A pie (estimación) a ${selectedMesa.name}: ${formatDuration(mesaRoute.durationS)} · ${formatDistance(mesaRoute.distanceM)} desde ${mesaOrigin.label}.`
                  : `Ruta a pie (estimación) a ${selectedMesa.name} desde ${mesaOrigin.label}…`}
              </p>
            </>
          ) : (
            <p className="rounded-2xl border border-borde bg-carbon/50 px-4 py-4 text-base leading-6 text-marfil">
              {selectedMesa.name}: {selectedMesa.howFar}. No es un trayecto a
              pie desde {mesaOrigin.label}
              {origin ? ` (${formatDistance(mesaMeters)})` : ""}.
            </p>
          )}
          {mesasByZone.map((group) => (
            <RestaurantList
              key={group.zone}
              heading={gpsLive ? undefined : group.zone}
              restaurants={group.restaurants}
              selectedId={selectedMesa.id}
              onSelect={setPickedMesaId}
              origin={gpsLive ? origin : ZONE_ORIGINS[group.zone]}
            />
          ))}
        </div>
      ) : null}

      {gpsLive && selectedPlace ? (
        <div className="space-y-3">
          <h2 className="font-display text-2xl text-marfil">También cerca</h2>
          {placeWalkable ? (
            <>
              <NearbyMap origin={origin} destination={selectedPlace} />
              <p className="text-sm leading-6 text-marfil-tenue">
                {placeRoute
                  ? `A pie (estimación) a ${selectedPlace.name}: ${formatDuration(placeRoute.durationS)} · ${formatDistance(placeRoute.distanceM)} desde ${origin.label}.`
                  : `Ruta a pie (estimación) a ${selectedPlace.name} desde ${origin.label}…`}
              </p>
            </>
          ) : (
            <p className="rounded-2xl border border-borde bg-carbon/50 px-4 py-4 text-base leading-6 text-marfil">
              Este lugar no está a pie desde {origin.label} (
              {formatDistance(selectedPlaceMeters)}). Usa el traslado del grupo.
            </p>
          )}
          <p className="text-xs text-marfil-tenue">
            Las distancias de la lista son en línea recta.
          </p>
          <NearbyPlaces
            places={rankedPlaces}
            selectedId={selectedPlace.id}
            onSelect={setPickedPlaceId}
            origin={origin}
          />
        </div>
      ) : null}
    </div>
  );
}
