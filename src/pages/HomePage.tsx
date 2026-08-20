import AlertsFeed from "../components/AlertsFeed";
import AnnouncementsFeed from "../components/AnnouncementsFeed";
import MeetingPointCard from "../components/MeetingPointCard";
import { useAuth } from "../lib/auth";
import { useTrip } from "../lib/trip";

export default function HomePage() {
  const { user } = useAuth();
  const { trip } = useTrip();

  return (
    <div className="space-y-8">
      <section
        className="relative -mx-5 -mt-2 overflow-hidden sm:mx-0 sm:rounded-2xl"
        aria-label={`Destino: ${trip.name}`}
      >
        <img
          src={trip.heroImage}
          alt={`${trip.name}, ${trip.location}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noche via-noche/80 to-noche/25" />
        <div className="relative flex min-h-[300px] flex-col justify-end px-6 pb-6 pt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-oro">
            {trip.tagline}
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-marfil drop-shadow">
            {trip.name}
          </h1>
          <p className="mt-1 text-marfil">{trip.location}</p>
          <p className="mt-3 text-sm text-marfil-tenue">
            Bienvenid@ de vuelta, {user?.name.split(" ")[0]}
          </p>
        </div>
      </section>

      <MeetingPointCard />
      <AlertsFeed />
      <AnnouncementsFeed />
    </div>
  );
}
