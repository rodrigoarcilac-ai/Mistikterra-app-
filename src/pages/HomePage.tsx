import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { focusDayHeading, pickFocusDay } from "../lib/itinerary";
import { zonesFrom } from "../lib/places";
import { useTrip } from "../lib/trip";
import AlertsFeed from "../components/AlertsFeed";
import AnnouncementsFeed from "../components/AnnouncementsFeed";
import ItineraryList from "../components/ItineraryList";
import MeetingPointCard from "../components/MeetingPointCard";

export default function HomePage() {
  const { user } = useAuth();
  const { trip } = useTrip();
  const focusDay = pickFocusDay(trip.itinerary);
  const focusHeading = focusDay ? focusDayHeading(focusDay) : "";
  const firstZone = zonesFrom(trip.recommendations)[0] ?? "Estambul";

  return (
    <div>
      <section
        className="relative overflow-hidden bg-gradient-to-b from-noche via-carbon to-noche"
        aria-label={`Destino: ${trip.name}`}
      >
        {trip.heroImage ? (
          <>
            <img
              src={trip.heroImage}
              alt={`${trip.name}, ${trip.location}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-noche/80 via-noche/25 to-noche" />
          </>
        ) : (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(212,175,55,0.22),transparent_70%)]"
          />
        )}
        <div className="relative px-5 pb-8 pt-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oro">
            {trip.tagline}
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-marfil drop-shadow">
            {trip.name}
          </h1>
          <p className="mt-1 text-base text-marfil">
            {trip.location}
            {user ? ` · Hola, ${user.name.split(" ")[0]}` : null}
          </p>
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
            Tiempo libre en {firstZone}
          </Link>
        </p>
      </div>
    </div>
  );
}
