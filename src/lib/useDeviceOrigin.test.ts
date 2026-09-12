import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DEVICE_ORIGIN_LABEL, useDeviceOrigin } from "./useDeviceOrigin";

type GeoSuccess = { lat: number; lng: number };

const originalGeolocation = navigator.geolocation;

function mockGeolocation(options: {
  success?: GeoSuccess;
  errorCode?: number;
  missing?: boolean;
  delayMs?: number;
}) {
  if (options.missing) {
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: undefined,
    });
    return;
  }

  const getCurrentPosition = vi.fn(
    (
      success: PositionCallback,
      error?: PositionErrorCallback,
    ) => {
      const run = () => {
        if (options.success) {
          success({
            coords: {
              latitude: options.success.lat,
              longitude: options.success.lng,
              accuracy: 12,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          } as GeolocationPosition);
          return;
        }
        error?.({
          code: options.errorCode ?? 2,
          message: "unavailable",
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError);
      };
      if (options.delayMs) {
        setTimeout(run, options.delayMs);
      } else {
        run();
      }
    },
  );

  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition, watchPosition: vi.fn(), clearWatch: vi.fn() },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: originalGeolocation,
  });
});

describe("useDeviceOrigin", () => {
  it("reports error when geolocation is missing", () => {
    mockGeolocation({ missing: true });
    const { result } = renderHook(() => useDeviceOrigin());

    act(() => {
      result.current.request();
    });

    expect(result.current.status).toBe("error");
    expect(result.current.origin).toBeNull();
  });

  it("reads live coordinates and labels them as the traveler position", () => {
    mockGeolocation({ success: { lat: 41.0106, lng: 28.9681 } });
    const { result } = renderHook(() => useDeviceOrigin());

    act(() => {
      result.current.request();
    });

    expect(result.current.status).toBe("live");
    expect(result.current.origin).toEqual({
      lat: 41.0106,
      lng: 28.9681,
      label: DEVICE_ORIGIN_LABEL,
    });
    expect(localStorage.getItem("mt.deviceOrigin")).toBeNull();
  });

  it("marks permission denial separately from other errors", () => {
    mockGeolocation({ errorCode: 1 });
    const { result } = renderHook(() => useDeviceOrigin());

    act(() => {
      result.current.request();
    });

    expect(result.current.status).toBe("denied");
    expect(result.current.origin).toBeNull();
  });

  it("clears a live origin back to idle without keeping coordinates", () => {
    mockGeolocation({ success: { lat: 41.0106, lng: 28.9681 } });
    const { result } = renderHook(() => useDeviceOrigin());

    act(() => {
      result.current.request();
    });
    expect(result.current.status).toBe("live");

    act(() => {
      result.current.clear();
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.origin).toBeNull();
  });

  it("ignores a late GPS reading after clear", () => {
    vi.useFakeTimers();
    mockGeolocation({
      success: { lat: 38.643, lng: 34.83 },
      delayMs: 50,
    });
    const { result } = renderHook(() => useDeviceOrigin());

    act(() => {
      result.current.request();
    });
    expect(result.current.status).toBe("loading");

    act(() => {
      result.current.clear();
    });
    act(() => {
      vi.advanceTimersByTime(80);
    });

    expect(result.current.status).toBe("idle");
    expect(result.current.origin).toBeNull();
  });
});
