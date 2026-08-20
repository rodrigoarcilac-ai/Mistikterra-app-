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
      <div>
        <p className="text-sm text-marfil-tenue">
          Bienvenid@ de vuelta, {user?.name.split(" ")[0]}
        </p>
        <h1 className="mt-1 font-display text-3xl text-marfil">{trip.name}</h1>
        <p className="text-marfil-tenue">{trip.location}</p>
      </div>

      <MeetingPointCard />
      <AlertsFeed />
      <AnnouncementsFeed />
    </div>
  );
}
