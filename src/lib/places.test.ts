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
  it("seeds nearby places across Japan trip zones and categories", () => {
    const { recommendations } = createSeedTrip();
    const zones = zonesFrom(recommendations);

    expect(recommendations.length).toBeGreaterThanOrEqual(8);
    expect(zones).toEqual(["Kioto", "Nara", "Monte Koya"]);
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
    const kiotoFood = filterRecommendations(recommendations, {
      zone: "Kioto",
      category: "gastronomia",
    });
    expect(kiotoFood.length).toBeGreaterThan(0);
    expect(kiotoFood.every((place) => place.zone === "Kioto")).toBe(true);
  });

  it("measures zero distance for the same point", () => {
    const point = { lat: 34.96714, lng: 135.77267 };
    expect(distanceMeters(point, point)).toBe(0);
  });

  it("uses the meeting point as Kioto origin and sorts by nearest", () => {
    const trip = createSeedTrip();
    const origin = originForZone("Kioto", trip.meetingPoint);
    expect(origin.lat).toBe(trip.meetingPoint.lat);
    expect(origin.lng).toBe(trip.meetingPoint.lng);

    const kioto = trip.recommendations.filter((place) => place.zone === "Kioto");
    const ranked = sortByNearest(kioto, origin);
    const nearest = distanceMeters(origin, ranked[0]);
    const farthest = distanceMeters(origin, ranked[ranked.length - 1]);
    expect(nearest).toBeLessThanOrEqual(farthest);
  });

  it("falls back to Fushimi when the meeting point has no coordinates", () => {
    const origin = originForZone("todos", {
      title: "Punto",
      address: "x",
      mapUrl: "https://maps.google.com/?q=x",
      datetime: new Date().toISOString(),
    });
    expect(origin.lat).toBe(34.96714);
    expect(origin.lng).toBe(135.77267);
  });
});
