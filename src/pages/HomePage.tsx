import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { focusDayHeading, pickFocusDay, zoneForDay } from "../lib/itinerary";
import { loadSessionHero } from "../lib/sessionHero";
import { useTrip } from "../lib/trip";
import AlertsFeed from "../components/AlertsFeed";
import AnnouncementsFeed from "../components/AnnouncementsFeed";
import ItineraryList from "../components/ItineraryList";
import MeetingPointCard from "../components/MeetingPointCard";

export default function HomePage() {
  const { user } = useAuth();
  const { trip } = useTrip();
  const hero = loadSessionHero();
  const focusDay = pickFocusDay(trip.itinerary);
  const focusHeading = focusDay ? focusDayHeading(focusDay) : "";
  const freeTimeZone = focusDay ? zoneForDay(focusDay.id) : "Estambul";

  return (
    <div>
      <section
        className="relative min-h-[100dvh] overflow-hidden bg-noche"
        aria-label={`Destino: ${trip.name}`}
      >
        <img
          src={hero.src}
          alt={hero.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noche/80 via-noche/40 to-noche" />
        <div className="relative flex min-h-[100dvh] flex-col justify-end px-5 pb-8 pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oro">
            {trip.tagline}
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-marfil drop-shadow">
            {trip.name}
          </h1>
          <p className="mt-1 text-base text-marfil">{trip.location}</p>
          {user ? (
            <p className="mt-1 text-base text-marfil-tenue">
              Hola, {user.name.split(" ")[0]}
            </p>
          ) : null}
          <MeetingPointCard />
        </div>
      </section>

      <div className="space-y-8 px-5 py-6">
        <AlertsFeed />
        <AnnouncementsFeed />

        {focusDay ? (
          <section aria-label={focusHeading} className="space-y-4">
            <h2 className="font-display text-2xl text-marfil">{focusHeading}</h2>
            <ItineraryList compact days={[focusDay]} />
            <Link
              to="/itinerario"
              className="inline-flex min-h-12 items-center text-base font-semibold text-oro underline-offset-4 hover:underline"
            >
              Ver itinerario completo
            </Link>
          </section>
        ) : null}

        <p>
          <Link
            to="/cerca"
            className="inline-flex min-h-12 items-center text-base font-semibold text-oro underline-offset-4 hover:underline"
          >
            Tiempo libre en {freeTimeZone}
          </Link>
        </p>
      </div>
    </div>
  );
}
