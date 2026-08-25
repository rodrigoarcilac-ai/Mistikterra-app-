import { useCallback, useMemo, useState } from "react";
import AlertsFeed from "../components/AlertsFeed";
import FeedPost from "../components/FeedPost";
import MeetingPointCard from "../components/MeetingPointCard";
import StoryTray from "../components/StoryTray";
import StoryViewer from "../components/StoryViewer";
import { useAuth } from "../lib/auth";
import { buildFeed, buildStories } from "../lib/stories";
import { useTrip } from "../lib/trip";

export default function HomePage() {
  const { user } = useAuth();
  const { trip } = useTrip();
  const stories = useMemo(() => buildStories(trip), [trip]);
  const feed = useMemo(() => buildFeed(trip), [trip]);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(() => new Set());
  const [inspiredIds, setInspiredIds] = useState<Set<string>>(() => new Set());

  const markSeen = useCallback((id: string) => {
    setSeenIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const inspire = useCallback((id: string) => {
    setInspiredIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

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
          <div className="pt-24">
            <StoryTray
              stories={stories}
              seenIds={seenIds}
              onOpen={(index) => {
                const opened = stories[index];
                if (opened) markSeen(opened.id);
                setStoryIndex(index);
              }}
            />
          </div>
          <div className="flex flex-1 flex-col justify-end px-5 pb-8 pt-4">
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

      <div className="px-5 py-6">
        <AlertsFeed />
      </div>

      <section aria-label="Actividades y avisos">
        <h2 className="px-5 pb-3 font-display text-2xl text-marfil">
          Hoy en el viaje
        </h2>
        {feed.map((item) => (
          <FeedPost
            key={item.id}
            item={item}
            inspired={inspiredIds.has(item.id)}
            onInspire={() => inspire(item.id)}
          />
        ))}
      </section>

      {storyIndex !== null ? (
        <StoryViewer
          stories={stories}
          startIndex={storyIndex}
          onClose={() => setStoryIndex(null)}
          onSeen={markSeen}
          inspiredIds={inspiredIds}
          onInspire={inspire}
        />
      ) : null}
    </div>
  );
}
