import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SplashScreen from "./SplashScreen";
import { SPLASH_HOLD_MS, SPLASH_KEY } from "../lib/splash";

describe("SplashScreen", () => {
  beforeEach(() => {
    sessionStorage.removeItem(SPLASH_KEY);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.removeItem(SPLASH_KEY);
  });

  it("shows the logo splash then hides it for the rest of the tab", () => {
    render(
      <SplashScreen>
        <p>app</p>
      </SplashScreen>,
    );

    expect(screen.getByRole("status", { name: /mistikterra/i })).toBeInTheDocument();
    expect(screen.getByAltText(/mistikterra/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(SPLASH_HOLD_MS);
    });

    expect(sessionStorage.getItem(SPLASH_KEY)).toBe("1");
  });

  it("does not show again when the tab already saw it", () => {
    sessionStorage.setItem(SPLASH_KEY, "1");
    render(
      <SplashScreen>
        <p>app</p>
      </SplashScreen>,
    );

    expect(screen.queryByRole("status", { name: /mistikterra/i })).not.toBeInTheDocument();
    expect(screen.getByText("app")).toBeInTheDocument();
  });
});
