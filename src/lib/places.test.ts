import { describe, expect, it } from "vitest";
import { filterRecommendations, zonesFrom } from "./places";
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
});
