import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useDeviceOrigin } from "./useDeviceOrigin";

type DeviceOriginValue = ReturnType<typeof useDeviceOrigin>;

const DeviceOriginContext = createContext<DeviceOriginValue | null>(null);

export function DeviceOriginProvider({ children }: { children: ReactNode }) {
  const device = useDeviceOrigin();
  const request = device.request;

  useEffect(() => {
    request();
  }, [request]);

  return (
    <DeviceOriginContext.Provider value={device}>
      {children}
    </DeviceOriginContext.Provider>
  );
}

export function useSharedDeviceOrigin(): DeviceOriginValue {
  const value = useContext(DeviceOriginContext);
  if (!value) {
    throw new Error(
      "useSharedDeviceOrigin debe usarse dentro de <DeviceOriginProvider>",
    );
  }
  return value;
}
