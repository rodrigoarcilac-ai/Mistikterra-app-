import { useId } from "react";
import { getCountdown } from "../lib/format";
import { useNow } from "../lib/hooks";

const pad = (value: number) => String(value).padStart(2, "0");

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const STROKE = 2.5;

type CountdownTimerProps = {
  targetIso: string;
  /**
   * Ventana (ms) sobre la que se "llena" el anillo a medida que se acerca el
   * encuentro. Por defecto 24h: el anillo se completa al llegar la hora.
   */
  windowMs?: number;
};

export default function CountdownTimer({
  targetIso,
  windowMs = 24 * 60 * 60 * 1000,
}: CountdownTimerProps) {
  const now = useNow();
  const countdown = getCountdown(targetIso, now);
  const gradientId = useId().replace(/:/g, "");

  const remainingRatio = Math.min(Math.max(countdown.total / windowMs, 0), 1);
  const progress = countdown.past ? 1 : 1 - remainingRatio;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const primary = countdown.past
    ? "Ahora"
    : countdown.days > 0
      ? `${countdown.days}d ${pad(countdown.hours)}h`
      : `${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;

  const secondary = countdown.past
    ? "El encuentro está en curso"
    : "para el encuentro";

  return (
    <div
      className="relative mx-auto aspect-square w-36 max-w-full sm:w-40"
      role="timer"
      aria-label={
        countdown.past
          ? "El encuentro está en curso"
          : `Faltan ${primary} para el punto de encuentro`
      }
    >
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          style={{ stroke: "rgba(245, 245, 240, 0.22)" }}
        />
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.9s linear" }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "var(--color-oro-suave)" }} />
            <stop offset="100%" style={{ stopColor: "var(--color-oro)" }} />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-medium tabular-nums tracking-tight text-oro sm:text-[2rem]">
          {primary}
        </span>
        <span className="mt-1 max-w-[7.5rem] text-base leading-tight text-marfil-tenue">
          {secondary}
        </span>
      </div>
    </div>
  );
}
