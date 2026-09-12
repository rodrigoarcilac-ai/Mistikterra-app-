import { describe, expect, it } from "vitest";
import { seedRestaurants } from "./restaurantData";
import { restaurantIsWalkable, restaurantsInZone } from "./restaurants";
import { TRIP_ZONE_ORDER } from "./places";
import { createSeedTrip } from "./tripData";

describe("seedRestaurants", () => {
  it("seeds 30 tables across the five trip cities", () => {
    const mesas = seedRestaurants();
    expect(mesas).toHaveLength(30);
    expect(TRIP_ZONE_ORDER.every((zone) => restaurantsInZone(mesas, zone).length > 0)).toBe(
      true,
    );
    expect(restaurantsInZone(mesas, "Estambul")).toHaveLength(12);
    expect(restaurantsInZone(mesas, "Capadocia")).toHaveLength(5);
    expect(restaurantsInZone(mesas, "Atenas")).toHaveLength(6);
    expect(restaurantsInZone(mesas, "Meteora")).toHaveLength(3);
    expect(restaurantsInZone(mesas, "Salónica")).toHaveLength(4);
    expect(mesas.every((place) => place.mapUrl.includes("maps"))).toBe(true);
  });

  it("treats hotel and walking tables as walkable and taxis as not", () => {
    const mesas = seedRestaurants();
    const galeyan = mesas.find((place) => place.id === "mesa_galeyan")!;
    const tugra = mesas.find((place) => place.id === "mesa_tugra")!;
    expect(restaurantIsWalkable(galeyan)).toBe(true);
    expect(restaurantIsWalkable(tugra)).toBe(false);
  });

  it("attaches restaurants to the seed trip", () => {
    expect(createSeedTrip().restaurants).toHaveLength(30);
  });
});
