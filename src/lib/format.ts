export function createId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/** Hora local del programa (Turquía/Grecia, EEST / UTC+3 en estas fechas). */
export const TRIP_TIME_ZONE = "Europe/Istanbul";

const timeFormatter = new Intl.DateTimeFormat("es-MX", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TRIP_TIME_ZONE,
});

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TRIP_TIME_ZONE,
});

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export type Countdown = {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
};

export function getCountdown(targetIso: string, now: number = Date.now()): Countdown {
  const target = new Date(targetIso).getTime();
  const total = target - now;
  const clamped = Math.max(total, 0);
  const seconds = Math.floor((clamped / 1000) % 60);
  const minutes = Math.floor((clamped / 1000 / 60) % 60);
  const hours = Math.floor((clamped / 1000 / 60 / 60) % 24);
  const days = Math.floor(clamped / 1000 / 60 / 60 / 24);

  return { total, days, hours, minutes, seconds, past: total <= 0 };
}

function tripCalendarDay(isoOrMs: string | number): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TRIP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(isoOrMs));
}

export function countdownPhrase(
  targetIso: string,
  now: number = Date.now(),
): string {
  const countdown = getCountdown(targetIso, now);
  if (countdown.past) return "El encuentro ya comenzó";
  if (countdown.days > 0) {
    return countdown.days === 1
      ? "Falta 1 día para el cóctel"
      : `Faltan ${countdown.days} días para el cóctel`;
  }
  if (tripCalendarDay(now) === tripCalendarDay(targetIso)) {
    return `Hoy a las ${formatTime(targetIso)}`;
  }
  if (countdown.hours > 0) {
    return countdown.hours === 1
      ? "Falta 1 hora"
      : `Faltan ${countdown.hours} horas`;
  }
  if (countdown.minutes > 0) {
    return countdown.minutes === 1
      ? "Falta 1 minuto"
      : `Faltan ${countdown.minutes} minutos`;
  }
  return "El encuentro está por comenzar";
}
