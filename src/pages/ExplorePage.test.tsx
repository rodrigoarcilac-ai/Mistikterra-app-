import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
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

function listPlaceNames() {
  const list = screen.getByRole("list");
  return within(list)
    .getAllByRole("heading")
    .map((heading) => heading.textContent);
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

  it("hides the filter menu and hotel list until GPS is available", () => {
    mockGeolocation({ errorCode: 1 });
    wrap(<ExplorePage />);

    expect(
      screen.queryByRole("button", { name: /^usar mi ubicación$/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /estambul/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /todos/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/hotel sura design/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/hammam/i)).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      /activa la ubicación para ver lugares cerca de ti/i,
    );
  });

  it("ranks the nearest city automatically from a GPS pin", () => {
    mockGeolocation({ success: { lat: 41.0106, lng: 28.9681 } });
    wrap(<ExplorePage />);

    expect(listPlaceNames()[0]).toBe("Gran Bazar");
    expect(screen.getAllByText(/tu ubicación/i).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: /^usar mi ubicación$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /estambul/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/hotel sura design/i)).not.toBeInTheDocument();
  });

  it("switches the list to Capadocia when the pin is there", () => {
    mockGeolocation({ success: { lat: 38.6428, lng: 34.8305 } });
    wrap(<ExplorePage />);

    expect(listPlaceNames()[0]).toBe("Atardecer en Göreme");
    expect(screen.queryByText(/hammam/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/parece que estás en/i)).not.toBeInTheDocument();
  });

  it("shows a reading status before coordinates arrive", () => {
    mockGeolocation({
      success: { lat: 41.0106, lng: 28.9681 },
      delayMs: 50_000,
    });
    wrap(<ExplorePage />);

    expect(screen.getByRole("status")).toHaveTextContent(/leyendo tu ubicación/i);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });
});
