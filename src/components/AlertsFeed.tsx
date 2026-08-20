import { formatTime } from "../lib/format";
import { useAuth } from "../lib/auth";
import { useTrip } from "../lib/trip";
import type { AlertLevel } from "../lib/types";

const LEVEL_STYLES: Record<AlertLevel, string> = {
  info: "border-borde bg-carbon text-marfil",
  importante: "border-oro/50 bg-oro/10 text-marfil",
  urgente: "border-red-500/60 bg-red-500/10 text-marfil",
};

const LEVEL_LABEL: Record<AlertLevel, string> = {
  info: "Info",
  importante: "Importante",
  urgente: "Urgente",
};

export default function AlertsFeed() {
  const { trip, dismissAlert } = useTrip();
  const { user } = useAuth();
  const isGuide = user?.role === "guia";

  if (trip.alerts.length === 0) {
    return null;
  }

  return (
    <section aria-label="Alertas prioritarias" className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-oro-suave">
        Alertas
      </h3>
      {trip.alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 ${LEVEL_STYLES[alert.level]}`}
          role="alert"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-oro-suave">
              {LEVEL_LABEL[alert.level]} · {formatTime(alert.createdAt)}
            </p>
            <p className="mt-1">{alert.message}</p>
          </div>
          {isGuide ? (
            <button
              type="button"
              onClick={() => dismissAlert(alert.id)}
              className="shrink-0 rounded-full px-2 text-marfil-tenue transition hover:text-marfil"
              aria-label="Descartar alerta"
            >
              ✕
            </button>
          ) : null}
        </div>
      ))}
    </section>
  );
}
