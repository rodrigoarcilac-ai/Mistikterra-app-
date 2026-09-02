import type { ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DeviceOriginProvider, useSharedDeviceOrigin } from "./DeviceOriginProvider";
import { DEVICE_ORIGIN_LABEL } from "./useDeviceOrigin";

const originalGeolocation = navigator.geolocation;

function mockGeolocation(options: {
  success?: { lat: number; lng: number };
  errorCode?: number;
}) {
  const getCurrentPosition = vi.fn(
    (success: PositionCallback, error?: PositionErrorCallback) => {
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
        code: options.errorCode ?? 1,
        message: "denied",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      } as GeolocationPositionError);
    },
  );

  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition, watchPosition: vi.fn(), clearWatch: vi.fn() },
  });
  return getCurrentPosition;
}

afterEach(() => {
  vi.unstubAllGlobals();
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: originalGeolocation,
  });
});

describe("DeviceOriginProvider", () => {
  it("requests GPS once on mount without a button", () => {
    const getCurrentPosition = mockGeolocation({
      success: { lat: 41.0106, lng: 28.9681 },
    });

    const { result } = renderHook(() => useSharedDeviceOrigin(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <DeviceOriginProvider>{children}</DeviceOriginProvider>
      ),
    });

    expect(getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(result.current.status).toBe("live");
    expect(result.current.origin?.label).toBe(DEVICE_ORIGIN_LABEL);
    expect(localStorage.getItem("mt.deviceOrigin")).toBeNull();
  });

  it("surfaces a denied permission without keeping coordinates", () => {
    mockGeolocation({ errorCode: 1 });

    const { result } = renderHook(() => useSharedDeviceOrigin(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <DeviceOriginProvider>{children}</DeviceOriginProvider>
      ),
    });

    expect(result.current.status).toBe("denied");
    expect(result.current.origin).toBeNull();
  });
});
