import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TripProvider } from "./TripProvider";
import { useTrip } from "./trip";

function wrapper({ children }: { children: ReactNode }) {
  return <TripProvider>{children}</TripProvider>;
}

describe("TripProvider", () => {
  it("toggles a traveler's meeting-point confirmation", () => {
    const { result } = renderHook(() => useTrip(), { wrapper });

    expect(result.current.isConfirmed("user_1")).toBe(false);
    act(() => result.current.toggleConfirmation("user_1"));
    expect(result.current.isConfirmed("user_1")).toBe(true);
    act(() => result.current.toggleConfirmation("user_1"));
    expect(result.current.isConfirmed("user_1")).toBe(false);
  });

  it("emits an alert that appears at the top of the feed", () => {
    const { result } = renderHook(() => useTrip(), { wrapper });

    act(() => {
      result.current.emitAlert({ message: "Cambio de ubicación", level: "urgente" });
    });

    expect(result.current.trip.alerts[0].message).toBe("Cambio de ubicación");
    expect(result.current.trip.alerts[0].level).toBe("urgente");
  });

  it("updates the meeting point location", () => {
    const { result } = renderHook(() => useTrip(), { wrapper });

    act(() => {
      result.current.updateMeetingLocation({
        address: "Nueva dirección 123",
        mapUrl: "https://maps.google.com/?q=nueva",
      });
    });

    expect(result.current.trip.meetingPoint.address).toBe("Nueva dirección 123");
    expect(result.current.trip.meetingPoint.mapUrl).toContain("nueva");
  });

  it("persists trip state to localStorage", () => {
    const { result } = renderHook(() => useTrip(), { wrapper });
    act(() => {
      result.current.postAnnouncement({ title: "Aviso", body: "Cuerpo" });
    });
    expect(localStorage.getItem("mt.trip.v7")).toContain("Aviso");
  });
});
