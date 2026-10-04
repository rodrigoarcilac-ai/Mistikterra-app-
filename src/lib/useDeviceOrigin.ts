import { useCallback, useRef, useState } from "react";
import type { MapOrigin } from "./places";

export type DeviceOriginStatus = "idle" | "loading" | "live" | "denied" | "error";

const GPS_TIMEOUT_MS = 8000;

export const DEVICE_ORIGIN_LABEL = "Tu ubicación";

function mapGeoError(err: { code?: number } | undefined): DeviceOriginStatus {
  if (err?.code === 1) return "denied";
  return "error";
}

export function useDeviceOrigin() {
  const [status, setStatus] = useState<DeviceOriginStatus>("idle");
  const [origin, setOrigin] = useState<MapOrigin | null>(null);
  const requestId = useRef(0);

  const request = useCallback(() => {
    const id = ++requestId.current;

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setOrigin(null);
      return;
    }

    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (id !== requestId.current) return;
        setOrigin({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: DEVICE_ORIGIN_LABEL,
        });
        setStatus("live");
      },
      (err) => {
        if (id !== requestId.current) return;
        setOrigin(null);
        setStatus(mapGeoError(err));
      },
      { enableHighAccuracy: true, timeout: GPS_TIMEOUT_MS, maximumAge: 0 },
    );
  }, []);

  const clear = useCallback(() => {
    requestId.current += 1;
    setOrigin(null);
    setStatus("idle");
  }, []);

  return { status, origin, request, clear };
}
