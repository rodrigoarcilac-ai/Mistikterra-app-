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
    <section
      className="relative overflow-hidden rounded-2xl border border-oro/30 bg-carbon p-6 shadow-2xl shadow-black/40"
      aria-labelledby="meeting-title"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-oro/10 blur-3xl" />

      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-oro-suave">
          Punto de encuentro activo
        </p>
        <h2
          id="meeting-title"
          className="mt-2 font-display text-2xl font-semibold text-marfil"
        >
          {meetingPoint.title}
        </h2>

        <p className="mt-1 text-base text-marfil-tenue">
          {formatDate(meetingPoint.datetime)} · {formatTime(meetingPoint.datetime)}
        </p>

        <div className="my-6 rounded-xl border border-borde bg-noche/60 py-5">
          <CountdownTimer targetIso={meetingPoint.datetime} />
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-borde bg-noche/40 p-4">
          <span aria-hidden className="mt-0.5 text-oro">
            📍
          </span>
          <div>
            <p className="text-lg text-marfil">{meetingPoint.address}</p>
            {meetingPoint.note ? (
              <p className="mt-1 text-base text-marfil-tenue">{meetingPoint.note}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href={meetingPoint.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-oro px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-noche shadow-lg shadow-black/30 transition hover:bg-oro-suave focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro"
          >
            <span aria-hidden>🧭</span> Cómo llegar / Ver en mapa
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
      </div>
    </section>
  );
}
