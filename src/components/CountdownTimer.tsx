import { getCountdown } from "../lib/format";
import { useNow } from "../lib/hooks";

function Segment({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-3xl font-semibold text-oro tabular-nums sm:text-4xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-xs uppercase tracking-[0.2em] text-marfil-tenue">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer({ targetIso }: { targetIso: string }) {
  const now = useNow();
  const countdown = getCountdown(targetIso, now);

  if (countdown.past) {
    return (
      <div
        className="rounded-xl border border-oro/40 bg-oro/10 px-4 py-3 text-center text-oro"
        role="status"
      >
        <span className="font-display text-lg font-semibold tracking-wide">
          El encuentro está en curso
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center gap-4 sm:gap-6"
      role="timer"
      aria-label="Tiempo restante para el punto de encuentro"
    >
      {countdown.days > 0 ? <Segment value={countdown.days} label="Días" /> : null}
      <Segment value={countdown.hours} label="Horas" />
      <Segment value={countdown.minutes} label="Min" />
      <Segment value={countdown.seconds} label="Seg" />
    </div>
  );
}
