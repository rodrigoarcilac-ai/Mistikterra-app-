import { formatTime } from "../lib/format";
import { useTrip } from "../lib/trip";
import TeachingCard from "./TeachingCard";

export default function ItineraryList() {
  const { trip } = useTrip();

  return (
    <div className="space-y-10">
      {trip.itinerary.map((day) => (
        <section key={day.id} aria-label={day.label} className="space-y-4">
          <h3 className="font-display text-xl font-semibold text-oro">
            {day.label}
          </h3>

          {day.teaching ? <TeachingCard teaching={day.teaching} /> : null}

          <ol className="space-y-4">
            {day.items.map((item) => (
              <li
                key={item.id}
                className="overflow-hidden rounded-xl border border-borde bg-carbon"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={`${item.title} — ${item.location}`}
                    loading="lazy"
                    className="h-44 w-full rounded-xl border-2 border-oro/40 object-cover"
                  />
                ) : null}
                <div className="p-4">
                  <p className="font-display text-base font-semibold tracking-wide text-oro-suave">
                    {formatTime(item.time)}
                  </p>
                  <p className="mt-0.5 text-xl text-marfil">{item.title}</p>
                  <p className="text-base text-marfil-tenue">{item.location}</p>
                  <p className="mt-1 text-base text-marfil-tenue">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
