import { getCountdown } from "../lib/format";
import { useNow } from "../lib/hooks";

const pad = (value: number) => String(value).padStart(2, "0");

type Unit = { value: string; label: string };

type CountdownTimerProps = {
  targetIso: string;
};

export default function CountdownTimer({ targetIso }: CountdownTimerProps) {
  const now = useNow();
  const countdown = getCountdown(targetIso, now);

  const units: Unit[] = countdown.past
    ? []
    : countdown.days > 0
      ? [
          { value: String(countdown.days), label: countdown.days === 1 ? "día" : "días" },
          { value: pad(countdown.hours), label: "horas" },
          { value: pad(countdown.minutes), label: "min" },
        ]
      : [
          { value: pad(countdown.hours), label: "horas" },
          { value: pad(countdown.minutes), label: "min" },
          { value: pad(countdown.seconds), label: "seg" },
        ];

  const spoken = countdown.past
    ? "El encuentro está en curso"
    : countdown.days > 0
      ? `Faltan ${countdown.days} días ${pad(countdown.hours)} horas y ${pad(countdown.minutes)} minutos para el punto de encuentro`
      : `Faltan ${pad(countdown.hours)} horas ${pad(countdown.minutes)} minutos y ${pad(countdown.seconds)} segundos para el punto de encuentro`;

  return (
    <div role="timer" aria-label={spoken} className="mt-5">
      {countdown.past ? (
        <p className="font-display text-4xl font-semibold text-oro sm:text-5xl">
          En curso
        </p>
      ) : (
        <div className="flex items-end gap-5 sm:gap-8">
          {units.map((unit, index) => (
            <div key={unit.label} className="flex items-end gap-5 sm:gap-8">
              {index > 0 ? (
                <span
                  aria-hidden
                  className="mb-7 text-3xl font-light text-oro/50 sm:mb-8 sm:text-4xl"
                >
                  :
                </span>
              ) : null}
              <div>
                <p className="text-5xl font-medium tabular-nums leading-none tracking-tight text-oro sm:text-6xl">
                  {unit.value}
                </p>
                <p className="mt-2 text-base uppercase tracking-[0.16em] text-marfil-tenue">
                  {unit.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-base text-marfil-tenue">
        {countdown.past ? "El encuentro ya comenzó" : "para el punto de encuentro"}
      </p>
    </div>
  );
}
