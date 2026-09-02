import { Link } from "react-router-dom";
import { formatTime } from "../lib/format";
import type { NextProgramItem } from "../lib/itinerary";
import type { MeetingPoint } from "../lib/types";

export default function NextActivityCard({
  next,
  meetingPoint,
}: {
  next: NextProgramItem | null;
  meetingPoint: MeetingPoint;
}) {
  return (
    <section className="mt-8" aria-labelledby="next-title">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-oro">
        Siguiente
      </p>
      {next ? (
        <>
          <p className="mt-2 text-base text-marfil-tenue">
            {formatTime(next.item.time)} · hora local del viaje
          </p>
          <h2
            id="next-title"
            className="mt-1 font-display text-2xl font-semibold text-marfil"
          >
            {next.item.title}
          </h2>
          <p className="mt-1 text-base text-marfil-tenue">{next.item.location}</p>
        </>
      ) : (
        <h2
          id="next-title"
          className="mt-1 font-display text-2xl font-semibold text-marfil"
        >
          El programa ya concluyó
        </h2>
      )}

      <p className="mt-5 text-base text-marfil-tenue">
        Partida:{" "}
        <a
          href={meetingPoint.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 items-center text-marfil underline-offset-4 hover:text-oro hover:underline"
        >
          {meetingPoint.address}
        </a>
      </p>

      <Link
        to="/itinerario"
        className="mt-5 inline-flex min-h-12 items-center text-base font-semibold text-oro underline-offset-4 hover:underline"
      >
        Ver itinerario completo
      </Link>
    </section>
  );
}
