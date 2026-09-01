import { formatDate, formatTime } from "../lib/format";
import { useAuth } from "../lib/auth";
import { useTrip } from "../lib/trip";
import CountdownTimer from "./CountdownTimer";

export default function MeetingPointCard() {
  const { user } = useAuth();
  const { trip, isConfirmed, toggleConfirmation } = useTrip();
  const { meetingPoint } = trip;
  const confirmed = user ? isConfirmed(user.id) : false;

  return (
    <section className="mt-8" aria-labelledby="meeting-title">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-oro">
        Punto de encuentro activo
      </p>
      <h2
        id="meeting-title"
        className="mt-1 font-display text-2xl font-semibold text-marfil"
      >
        {meetingPoint.title}
      </h2>
      <p className="mt-1 text-base text-marfil-tenue">
        {formatDate(meetingPoint.datetime)} · {formatTime(meetingPoint.datetime)}{" "}
        · hora local del viaje
      </p>

      <CountdownTimer targetIso={meetingPoint.datetime} />

      <p className="mt-5 text-lg text-marfil">{meetingPoint.address}</p>
      {meetingPoint.note ? (
        <p className="mt-1 text-base text-marfil-tenue">{meetingPoint.note}</p>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a
          href={meetingPoint.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-oro px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-noche shadow-lg shadow-black/30 transition hover:bg-oro-suave focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro"
        >
          Cómo llegar
        </a>
        <button
          type="button"
          onClick={() => user && toggleConfirmation(user.id)}
          aria-pressed={confirmed}
          className={
            confirmed
              ? "flex min-h-12 items-center justify-center gap-2 rounded-full bg-oro/15 px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-oro ring-2 ring-inset ring-oro/70 transition"
              : "flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-oro px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-oro transition hover:bg-oro/10"
          }
        >
          {confirmed ? "Asistencia confirmada ✓" : "Confirmar asistencia"}
        </button>
      </div>
    </section>
  );
}
