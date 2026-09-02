import { formatTime } from "../lib/format";
import { useTrip } from "../lib/trip";
import type { ItineraryDay } from "../lib/types";
import TeachingCard from "./TeachingCard";

export default function ItineraryList({
  compact = false,
  days,
}: {
  compact?: boolean;
  days?: ItineraryDay[];
}) {
  const { trip } = useTrip();
  const list = days ?? trip.itinerary;

  return (
    <div className="space-y-10">
      {list.map((day) => (
        <section key={day.id} aria-label={day.label} className="space-y-4">
          <h3 className="font-display text-xl font-semibold text-oro">
            {day.label}
          </h3>

          {day.teaching ? (
            compact ? (
              <p className="text-base text-marfil-tenue">
                ✦ {day.teaching.title}
                {day.teaching.author ? ` · ${day.teaching.author}` : null}
              </p>
            ) : (
              <TeachingCard teaching={day.teaching} />
            )
          ) : null}

          <ol
            className={
              compact
                ? "divide-y divide-borde border-y border-borde"
                : "relative ml-2 space-y-6 border-l border-oro/40 pl-6"
            }
          >
            {day.items.map((item) => (
              <li key={item.id} className={compact ? "py-3" : "relative"}>
                {compact ? null : (
                  <span
                    aria-hidden
                    className="absolute -left-[1.54rem] top-1.5 h-2.5 w-2.5 rounded-full bg-oro"
                  />
                )}
                <p className="font-display text-base font-semibold tracking-wide text-oro-suave">
                  {formatTime(item.time)}
                </p>
                <p className="mt-0.5 text-xl text-marfil">{item.title}</p>
                <p className="text-base text-marfil-tenue">{item.location}</p>
                {compact ? null : (
                  <p className="mt-1 text-base text-marfil-tenue">
                    {item.description}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
