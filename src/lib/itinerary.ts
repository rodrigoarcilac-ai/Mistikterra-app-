import type { ItineraryDay } from "./types";

const TRIP_TZ = "Europe/Istanbul";

/** YYYY-MM-DD in the trip's local calendar (Turquía/Grecia, UTC+3 in these dates). */
export function calendarDayKey(
  isoOrMs: string | number,
  timeZone = TRIP_TZ,
): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(isoOrMs));
}

/**
 * Day that is happening now, otherwise the next upcoming day,
 * otherwise the last day of the trip.
 */
export function pickFocusDay(
  days: ItineraryDay[],
  now: number = Date.now(),
): ItineraryDay | undefined {
  if (days.length === 0) return undefined;
  const sorted = [...days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const today = calendarDayKey(now);
  const sameDay = sorted.find((day) => calendarDayKey(day.date) === today);
  if (sameDay) return sameDay;
  const upcoming = sorted.find((day) => calendarDayKey(day.date) > today);
  return upcoming ?? sorted[sorted.length - 1];
}

export function focusDayHeading(
  day: ItineraryDay,
  now: number = Date.now(),
): string {
  const today = calendarDayKey(now);
  const key = calendarDayKey(day.date);
  if (key === today) return "Hoy";
  if (key > today) return "Próxima jornada";
  return "Última jornada";
}
