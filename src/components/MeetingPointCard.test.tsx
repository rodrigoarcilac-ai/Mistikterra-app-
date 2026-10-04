import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "../lib/AuthProvider";
import { TripProvider } from "../lib/TripProvider";
import MeetingPointCard from "./MeetingPointCard";
import NextActivityCard from "./NextActivityCard";
import { createSeedTrip } from "../lib/tripData";

function wrap(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <TripProvider>{ui}</TripProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("MeetingPointCard", () => {
  it("links the hotel address instead of a Cómo llegar button", () => {
    wrap(<MeetingPointCard />);

    expect(
      screen.queryByRole("link", { name: /cómo llegar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /cómo llegar/i }),
    ).not.toBeInTheDocument();

    const address = screen.getByRole("link", {
      name: /hotel sura design/i,
    });
    expect(address).toHaveAttribute("href", expect.stringContaining("maps"));
    expect(
      screen.getByRole("button", { name: /confirmar asistencia/i }),
    ).toBeInTheDocument();
  });
});

describe("NextActivityCard", () => {
  it("names the next activity and keeps a quiet map link", () => {
    const trip = createSeedTrip();
    const item = trip.itinerary[1].items[3];
    wrap(
      <NextActivityCard
        next={{ day: trip.itinerary[1], item }}
        meetingPoint={trip.meetingPoint}
      />,
    );

    expect(screen.getByRole("heading", { name: /cisterna binbirdirek/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /cómo llegar/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /hotel sura design/i })).toHaveAttribute(
      "href",
      expect.stringContaining("maps"),
    );
  });
});
