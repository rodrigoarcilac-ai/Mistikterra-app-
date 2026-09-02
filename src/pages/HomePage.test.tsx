import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../lib/AuthProvider";
import { TripProvider } from "../lib/TripProvider";
import HomePage from "./HomePage";

function wrap(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TripProvider>{ui}</TripProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("HomePage hero", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps the cocktail card before the welcome drink", () => {
    vi.setSystemTime(new Date("2026-09-02T12:00:00+03:00"));
    wrap(<HomePage />);
    expect(
      screen.getByRole("heading", { name: /cóctel de bienvenida/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/^Siguiente$/)).not.toBeInTheDocument();
  });

  it("switches the hero to the next timed activity after the cocktail", () => {
    vi.setSystemTime(new Date("2026-09-21T15:30:00+03:00"));
    wrap(<HomePage />);
    expect(screen.getByText(/^Siguiente$/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /cisterna basílica/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /cóctel de bienvenida/i }),
    ).not.toBeInTheDocument();
  });
});
