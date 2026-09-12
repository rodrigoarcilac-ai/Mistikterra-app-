import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../lib/AuthProvider";
import { DeviceOriginProvider } from "../lib/DeviceOriginProvider";
import { TripProvider } from "../lib/TripProvider";
import ExplorePage from "./ExplorePage";

function wrap(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TripProvider>
          <DeviceOriginProvider>{ui}</DeviceOriginProvider>
        </TripProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

function mockGeolocation(options: {
  success?: { lat: number; lng: number };
  errorCode?: number;
  delayMs?: number;
}) {
  const getCurrentPosition = vi.fn(
    (success: PositionCallback, error?: PositionErrorCallback) => {
      const run = () => {
        if (options.success) {
          success({
            coords: {
              latitude: options.success.lat,
              longitude: options.success.lng,
              accuracy: 10,
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

describe("ExplorePage GPS origin", () => {
  const originalGeolocation = navigator.geolocation;

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {})),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(navigator, "geolocation", {
      configurable: true,
      value: originalGeolocation,
    });
  });

  it("shows the trip map and city tables when GPS is denied", () => {
    mockGeolocation({ errorCode: 1 });
    wrap(<ExplorePage />);

    expect(
      screen.getByTitle(/recorrido mar de imperios/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Estambul" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Galeyan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Revithia" })).toBeInTheDocument();
    expect(screen.queryByText(/hammam/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /^usar mi ubicación$/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/sin tu ubicación, las mesas van por ciudad/i)).toBeInTheDocument();
  });

  it("lists Istanbul tables from a GPS pin and hides Cappadocia", () => {
    mockGeolocation({ success: { lat: 41.0106, lng: 28.9681 } });
    wrap(<ExplorePage />);

    expect(screen.getByRole("heading", { name: /mesas en estambul/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Galeyan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Deraliye Terrace" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Revithia" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Gran Bazar" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /estambul/i })).not.toBeInTheDocument();
  });

  it("switches restaurants to Capadocia when the pin is there", () => {
    mockGeolocation({ success: { lat: 38.6428, lng: 34.8305 } });
    wrap(<ExplorePage />);

    expect(screen.getByRole("heading", { name: /mesas en capadocia/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tasula" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Galeyan" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Atardecer en Göreme" })).toBeInTheDocument();
  });

  it("shows a reading status before coordinates arrive", () => {
    mockGeolocation({
      success: { lat: 41.0106, lng: 28.9681 },
      delayMs: 50_000,
    });
    wrap(<ExplorePage />);

    expect(screen.getByRole("status")).toHaveTextContent(/leyendo tu ubicación/i);
    expect(screen.getByTitle(/recorrido mar de imperios/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Galeyan" })).not.toBeInTheDocument();
  });

  it("does not pretend a taxi restaurant is a walking route", async () => {
    const user = userEvent.setup();
    mockGeolocation({ success: { lat: 41.0065, lng: 28.9784 } });
    wrap(<ExplorePage />);

    await user.click(screen.getByRole("button", { name: /tuğra/i }));
    expect(screen.getAllByText(/20 min en taxi/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/no es un trayecto a pie/i)).toBeInTheDocument();
  });
});
