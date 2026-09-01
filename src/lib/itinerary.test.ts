import { describe, expect, it } from "vitest";
import { focusDayHeading, pickFocusDay, zoneForDay } from "./itinerary";
import { createSeedTrip } from "./tripData";

describe("pickFocusDay", () => {
  const days = createSeedTrip().itinerary;

  it("returns the next upcoming day before the trip starts", () => {
    const now = Date.parse("2026-09-01T12:00:00+03:00");
    const focus = pickFocusDay(days, now);
    expect(focus?.id).toBe("day_1");
    expect(focusDayHeading(focus!, now)).toBe("Próxima jornada");
  });

  it("returns the calendar day in progress", () => {
    const now = Date.parse("2026-09-21T10:00:00+03:00");
    const focus = pickFocusDay(days, now);
    expect(focus?.id).toBe("day_2");
    expect(focusDayHeading(focus!, now)).toBe("Hoy");
  });

  it("returns the last day after the trip ends", () => {
    const now = Date.parse("2026-10-10T12:00:00+03:00");
    const focus = pickFocusDay(days, now);
    expect(focus?.id).toBe("day_14");
    expect(focusDayHeading(focus!, now)).toBe("Última jornada");
  });
});

describe("createSeedTrip", () => {
  it("seeds the Mar de Imperios program with 14 days and Gabriela", () => {
    const trip = createSeedTrip();
    expect(trip.name).toBe("Turquía y Grecia");
    expect(trip.tagline).toBe("Mar de Imperios");
    expect(trip.itinerary).toHaveLength(14);
    expect(trip.meetingPoint.datetime).toBe("2026-09-20T19:00:00+03:00");
    expect(trip.assistance.contactName).toBe("Gabriela Calderón");
    expect(trip.itinerary[1].items.some((item) => item.title.includes("Binbirdirek"))).toBe(true);
    expect(trip.itinerary[1].items.some((item) => item.title.includes("Basílica"))).toBe(true);
    expect(trip.itinerary[12].items.some((item) => item.title === "Noche en Salónica")).toBe(true);
    expect(trip.heroImage).toBe("");
  });

  it("maps focus days to Cerca cities", () => {
    expect(zoneForDay("day_1")).toBe("Estambul");
    expect(zoneForDay("day_7")).toBe("Capadocia");
    expect(zoneForDay("day_10")).toBe("Atenas");
    expect(zoneForDay("day_12")).toBe("Meteora");
    expect(zoneForDay("day_13")).toBe("Salónica");
  });
});
