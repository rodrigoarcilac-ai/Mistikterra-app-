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

      <a
        href={meetingPoint.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex min-h-12 items-center text-lg text-marfil underline-offset-4 hover:text-oro hover:underline"
      >
        {meetingPoint.address}
      </a>
      {meetingPoint.note ? (
        <p className="mt-1 text-base text-marfil-tenue">{meetingPoint.note}</p>
      ) : null}

      <button
        type="button"
        onClick={() => user && toggleConfirmation(user.id)}
        aria-pressed={confirmed}
        className={
          confirmed
            ? "mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-oro/15 px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-oro ring-2 ring-inset ring-oro/70 transition"
            : "mt-5 flex min-h-12 w-full items-center justify-center rounded-full border-2 border-oro px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-oro transition hover:bg-oro/10"
        }
      >
        {confirmed ? "Asistencia confirmada ✓" : "Confirmar asistencia"}
      </button>
    </section>
  );
}
