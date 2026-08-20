import { formatTime } from "../lib/format";
import { useTrip } from "../lib/trip";

export default function AnnouncementsFeed() {
  const { trip } = useTrip();

  if (trip.announcements.length === 0) {
    return null;
  }

  return (
    <section aria-label="Comunicados oficiales" className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-oro-suave">
        Comunicados
      </h3>
      {trip.announcements.map((announcement) => (
        <article
          key={announcement.id}
          className="rounded-xl border border-borde bg-carbon px-4 py-3"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="font-display text-lg text-marfil">
              {announcement.title}
            </h4>
            <span className="shrink-0 text-xs text-marfil-tenue">
              {formatTime(announcement.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm text-marfil-tenue">{announcement.body}</p>
        </article>
      ))}
    </section>
  );
}
