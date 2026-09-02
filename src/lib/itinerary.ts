import type { ItineraryDay, ItineraryItem } from "./types";
import { TRIP_TIME_ZONE } from "./format";

export type NextProgramItem = {
  day: ItineraryDay;
  item: ItineraryItem;
};

/** YYYY-MM-DD in the trip's local calendar (Turquía/Grecia, UTC+3 in these dates). */
export function calendarDayKey(
  isoOrMs: string | number,
  timeZone = TRIP_TIME_ZONE,
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

/** First program item whose start time is still in the future (or happening now). */
export function pickNextItem(
  days: ItineraryDay[],
  now: number = Date.now(),
): NextProgramItem | null {
  const timed = days.flatMap((day) =>
    day.items.map((item) => ({ day, item })),
  );
  timed.sort(
    (a, b) =>
      new Date(a.item.time).getTime() - new Date(b.item.time).getTime(),
  );
  return (
    timed.find((entry) => new Date(entry.item.time).getTime() >= now) ?? null
  );
}

export function cocktailHasStarted(
  cocktailIso: string,
  now: number = Date.now(),
): boolean {
  return now >= new Date(cocktailIso).getTime();
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

export function zoneForDay(dayId: string): string {
  if (["day_1", "day_2", "day_3", "day_4", "day_5"].includes(dayId)) {
    return "Estambul";
  }
  if (["day_6", "day_7", "day_8"].includes(dayId)) return "Capadocia";
  if (["day_9", "day_10"].includes(dayId)) return "Atenas";
  if (["day_11", "day_12"].includes(dayId)) return "Meteora";
  return "Salónica";
}
