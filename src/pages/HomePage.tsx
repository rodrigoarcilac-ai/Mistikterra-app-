import { useAuth } from "../lib/auth";
import { useTrip } from "../lib/trip";
import { filterRecommendations } from "../lib/places";
import AlertsFeed from "../components/AlertsFeed";
import AnnouncementsFeed from "../components/AnnouncementsFeed";
import ItineraryList from "../components/ItineraryList";
import MeetingPointCard from "../components/MeetingPointCard";
import NearbyPlaces from "../components/NearbyPlaces";

export default function HomePage() {
  const { user } = useAuth();
  const { trip } = useTrip();
  const nearbyPreview = filterRecommendations(trip.recommendations, {
    zone: "Kioto",
    limit: 3,
  });

  return (
    <div>
      <section
        className="relative min-h-[100dvh] overflow-hidden"
        aria-label={`Destino: ${trip.name}`}
      >
        <img
          src={trip.heroImage}
          alt={`${trip.name}, ${trip.location}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noche/80 via-noche/25 to-noche" />
        <div className="relative flex min-h-[100dvh] flex-col">
          <div className="flex flex-1 flex-col justify-end px-5 pb-8 pt-24">
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
        </div>
      </section>

      <div className="space-y-8 px-5 py-6">
        <AlertsFeed />
        <AnnouncementsFeed />
        <NearbyPlaces
          places={nearbyPreview}
          heading="Cerca, en Kioto"
          action={{ to: "/cerca", label: "Ver todos" }}
        />
      </div>

      <section className="px-5 pb-10" aria-label="Itinerario del viaje">
        <h2 className="font-display text-2xl text-marfil">Itinerario</h2>
        <p className="mt-1 mb-8 text-base text-marfil-tenue">
          Sigue bajando para ver cada jornada del viaje.
        </p>
        <ItineraryList />
      </section>
    </div>
  );
}
