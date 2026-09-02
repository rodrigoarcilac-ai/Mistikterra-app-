import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../lib/AuthProvider";
import { TripProvider } from "../lib/TripProvider";
import ExplorePage from "./ExplorePage";

function wrap(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TripProvider>{ui}</TripProvider>
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
}) {
  const getCurrentPosition = vi.fn(
    (success: PositionCallback, error?: PositionErrorCallback) => {
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

  it("keeps the hotel as origin until the traveler opts in", () => {
    wrap(<ExplorePage />);

    expect(
      screen.getByRole("button", { name: /^usar mi ubicación$/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/hotel sura design/i).length).toBeGreaterThan(0);
    expect(listPlaceNames()[0]).toBe("Hammam Çemberlitaş");
  });

  it("re-ranks places from a GPS pin instead of Hotel Sura Design", async () => {
    const user = userEvent.setup();
    mockGeolocation({ success: { lat: 41.0106, lng: 28.9681 } });
    wrap(<ExplorePage />);

    expect(listPlaceNames()[0]).toBe("Hammam Çemberlitaş");

    await user.click(screen.getByRole("button", { name: /^usar mi ubicación$/i }));

    expect(listPlaceNames()[0]).toBe("Gran Bazar");
    expect(screen.getAllByText(/tu ubicación/i).length).toBeGreaterThan(0);
    expect(
      screen.queryByRole("button", { name: /^usar mi ubicación$/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /dejar de usar mi ubicación/i }),
    ).toBeInTheDocument();
  });

  it("stays on the hotel and shows a notice when GPS is denied", async () => {
    const user = userEvent.setup();
    mockGeolocation({ errorCode: 1 });
    wrap(<ExplorePage />);

    await user.click(screen.getByRole("button", { name: /^usar mi ubicación$/i }));

    expect(
      screen.getByRole("status"),
    ).toHaveTextContent(/no se pudo leer tu ubicación; seguimos desde el hotel/i);
    expect(screen.getAllByText(/hotel sura design/i).length).toBeGreaterThan(0);
    expect(listPlaceNames()[0]).toBe("Hammam Çemberlitaş");
  });

  it("suggests another city without switching the list automatically", async () => {
    const user = userEvent.setup();
    mockGeolocation({ success: { lat: 38.6428, lng: 34.8305 } });
    wrap(<ExplorePage />);

    await user.click(screen.getByRole("button", { name: /^usar mi ubicación$/i }));

    expect(screen.getByText(/parece que estás en capadocia/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /estambul/i, pressed: true }),
    ).toBeInTheDocument();
    expect(listPlaceNames()[0]).toBe("Hammam Çemberlitaş");

    await user.click(
      screen.getByRole("button", { name: /ver lugares de capadocia/i }),
    );

    expect(
      screen.getByRole("button", { name: /capadocia/i, pressed: true }),
    ).toBeInTheDocument();
    expect(listPlaceNames()[0]).toBe("Atardecer en Göreme");
  });
});
