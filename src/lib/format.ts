export function createId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

const timeFormatter = new Intl.DateTimeFormat("es-MX", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
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
