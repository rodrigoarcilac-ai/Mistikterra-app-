import { formatTime } from "../lib/format";
import { useTrip } from "../lib/trip";

export default function ItineraryList() {
  const { trip } = useTrip();

  return (
    <div className="space-y-8">
      {trip.itinerary.map((day) => (
        <section key={day.id} aria-label={day.label}>
          <h3 className="font-display text-xl font-semibold text-oro">
            {day.label}
          </h3>
          <ol className="mt-4 space-y-4 border-l border-borde pl-5">
            {day.items.map((item) => (
              <li key={item.id} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border border-oro bg-noche"
                />
                <p className="font-display text-sm font-semibold tracking-wide text-oro-suave">
                  {formatTime(item.time)}
                </p>
                <p className="mt-0.5 text-lg text-marfil">{item.title}</p>
                <p className="text-sm text-marfil-tenue">{item.location}</p>
                <p className="mt-1 text-sm text-marfil-tenue">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
