import { afterEach, describe, expect, it, vi } from "vitest";
import { estimateWalkingRoute, fetchWalkingRoute, formatDuration } from "./route";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchWalkingRoute", () => {
  it("maps an OSRM response into lat/lng points", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          routes: [
            {
              distance: 1200,
              duration: 900,
              geometry: {
                coordinates: [
                  [135.77, 34.96],
                  [135.78, 34.97],
                ],
              },
            },
          ],
        }),
      })),
    );

    const route = await fetchWalkingRoute(
      { lat: 34.96, lng: 135.77 },
      { lat: 34.97, lng: 135.78 },
    );

    expect(route?.distanceM).toBe(1200);
    expect(route?.coordinates).toEqual([
      { lat: 34.96, lng: 135.77 },
      { lat: 34.97, lng: 135.78 },
    ]);
    expect(formatDuration(900)).toBe("15 min a pie");
  });

  it("estimates a straight walking route when routing is unavailable", () => {
    const route = estimateWalkingRoute(
      { lat: 34.96714, lng: 135.77267 },
      { lat: 34.96714, lng: 135.77267 },
    );
    expect(route.distanceM).toBe(0);
    expect(route.durationS).toBeGreaterThanOrEqual(60);
    expect(route.coordinates).toHaveLength(2);
  });
});
