import { getCountdown } from "../lib/format";
import { useNow } from "../lib/hooks";

const pad = (value: number) => String(value).padStart(2, "0");

/** Radio y geometría del anillo (viewBox 120x120). */
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

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

  // El anillo se llena conforme se acerca el encuentro (proporción transcurrida).
  const remainingRatio = Math.min(Math.max(countdown.total / windowMs, 0), 1);
  const progress = countdown.past ? 1 : 1 - remainingRatio;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const primary = countdown.past
    ? "¡Ahora!"
    : countdown.days > 0
      ? `${countdown.days}d ${pad(countdown.hours)}h`
      : `${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`;

  const secondary = countdown.past
    ? "El encuentro está en curso"
    : countdown.days > 0
      ? `${pad(countdown.minutes)}m ${pad(countdown.seconds)}s`
      : "para el encuentro";

  return (
    <div
      className="relative mx-auto aspect-square w-52 max-w-full"
      role="timer"
      aria-label={
        countdown.past
          ? "El encuentro está en curso"
          : `Faltan ${primary} para el punto de encuentro`
      }
    >
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="oroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "var(--color-oro)" }} />
            <stop offset="100%" style={{ stopColor: "var(--color-oro-suave)" }} />
          </linearGradient>
        </defs>

        {/* Pista base */}
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          strokeWidth="8"
          style={{ stroke: "var(--color-borde)" }}
        />

        {/* Progreso (loop dorado) */}
        <circle
          cx="60"
          cy="60"
          r={RADIUS}
          fill="none"
          stroke="url(#oroGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.9s linear" }}
        />
      </svg>

      {/* Halo dorado sutil */}
      <div className="pointer-events-none absolute inset-4 rounded-full bg-oro/5 blur-xl" />

      {/* Contador al centro */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-marfil-tenue">
          {countdown.past ? "" : "Faltan"}
        </span>
        <span className="font-display text-3xl font-semibold tabular-nums text-oro sm:text-4xl">
          {primary}
        </span>
        <span className="mt-1 max-w-[7rem] text-xs leading-tight text-marfil-tenue">
          {secondary}
        </span>
      </div>
    </div>
  );
}
