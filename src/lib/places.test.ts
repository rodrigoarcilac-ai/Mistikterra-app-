import { describe, expect, it } from "vitest";
import {
  filterRecommendations,
  distanceMeters,
  originForZone,
  sortByNearest,
  zonesFrom,
} from "./places";
import { createSeedTrip } from "./tripData";

describe("recommendations", () => {
  it("seeds nearby places across Turkey and Greece trip zones", () => {
    const { recommendations } = createSeedTrip();
    const zones = zonesFrom(recommendations);

    expect(recommendations.length).toBeGreaterThanOrEqual(8);
    expect(zones).toEqual([
      "Estambul",
      "Capadocia",
      "Atenas",
      "Meteora",
      "Salónica",
    ]);
    expect(recommendations.some((place) => place.category === "sagrado")).toBe(
      true,
    );
    expect(recommendations.some((place) => place.category === "gastronomia")).toBe(
      true,
    );
    expect(recommendations.every((place) => place.mapUrl.includes("maps"))).toBe(
      true,
    );
    expect(
      recommendations.every(
        (place) => Number.isFinite(place.lat) && Number.isFinite(place.lng),
      ),
    ).toBe(true);
  });

  it("filters by zone and category", () => {
    const { recommendations } = createSeedTrip();
    const athensShops = filterRecommendations(recommendations, {
      zone: "Atenas",
      category: "tienda",
    });
    expect(athensShops.length).toBeGreaterThan(0);
    expect(athensShops.every((place) => place.zone === "Atenas")).toBe(true);
  });

  it("measures zero distance for the same point", () => {
    const point = { lat: 41.0065, lng: 28.9784 };
    expect(distanceMeters(point, point)).toBe(0);
  });

  it("uses the meeting point as Estambul origin and sorts by nearest", () => {
    const trip = createSeedTrip();
    const origin = originForZone("Estambul", trip.meetingPoint);
    expect(origin.lat).toBe(trip.meetingPoint.lat);
    expect(origin.lng).toBe(trip.meetingPoint.lng);

    const istanbul = trip.recommendations.filter(
      (place) => place.zone === "Estambul",
    );
    const ranked = sortByNearest(istanbul, origin);
    const nearest = distanceMeters(origin, ranked[0]);
    const farthest = distanceMeters(origin, ranked[ranked.length - 1]);
    expect(nearest).toBeLessThanOrEqual(farthest);
  });

  it("falls back to Hotel Sura Design when the meeting point has no coordinates", () => {
    const origin = originForZone("Estambul", {
      title: "Punto",
      address: "x",
      mapUrl: "https://maps.google.com/?q=x",
      datetime: new Date().toISOString(),
    });
    expect(origin.lat).toBe(41.0065);
    expect(origin.lng).toBe(28.9784);
  });

  it("uses Seraphim Cave as the Capadocia origin", () => {
    const trip = createSeedTrip();
    const origin = originForZone("Capadocia", trip.meetingPoint);
    expect(origin.label).toBe("Seraphim Cave Suites");
    expect(origin.lat).toBeCloseTo(38.6428, 3);
  });
});
