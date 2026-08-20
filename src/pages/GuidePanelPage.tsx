import { useState } from "react";
import AlertsFeed from "../components/AlertsFeed";
import { useTrip } from "../lib/trip";
import type { AlertLevel } from "../lib/types";

const QUICK_ALERTS: { message: string; level: AlertLevel }[] = [
  { message: "Nos reunimos en 10 minutos en el punto de encuentro.", level: "importante" },
  { message: "Cambio de ubicación, revisen el mapa actualizado.", level: "urgente" },
  { message: "Tiempo libre hasta las 16:00. Disfruten.", level: "info" },
];

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-borde bg-carbon p-5">
      <h2 className="font-display text-xl text-marfil">{title}</h2>
      <p className="mt-1 text-sm text-marfil-tenue">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function GuidePanelPage() {
  const { trip, emitAlert, updateMeetingLocation, postAnnouncement } = useTrip();

  const [alertMessage, setAlertMessage] = useState("");
  const [alertLevel, setAlertLevel] = useState<AlertLevel>("importante");
  const [address, setAddress] = useState(trip.meetingPoint.address);
  const [mapUrl, setMapUrl] = useState(trip.meetingPoint.mapUrl);
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  const confirmedCount = Object.values(trip.confirmations).filter(Boolean).length;

  function notify(message: string) {
    setFlash(message);
    window.setTimeout(() => setFlash(null), 2500);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-marfil">Panel de la guía</h1>
        <p className="text-marfil-tenue">
          Coordina al grupo en tiempo real. {confirmedCount}{" "}
          {confirmedCount === 1 ? "persona ha" : "personas han"} confirmado
          asistencia.
        </p>
      </div>

      {flash ? (
        <p
          className="rounded-xl border border-oro/40 bg-oro/10 px-4 py-2 text-sm text-oro"
          role="status"
        >
          {flash}
        </p>
      ) : null}

      <Panel
        title="Emitir alerta prioritaria"
        description="Un toque para enviar avisos a todo el grupo."
      >
        <div className="flex flex-wrap gap-2">
          {QUICK_ALERTS.map((quick) => (
            <button
              key={quick.message}
              type="button"
              onClick={() => {
                emitAlert(quick);
                notify("Alerta enviada al grupo.");
              }}
              className="rounded-full border border-oro/40 px-4 py-2 text-sm text-oro transition hover:bg-oro/10"
            >
              {quick.message}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          <textarea
            value={alertMessage}
            onChange={(event) => setAlertMessage(event.target.value)}
            rows={2}
            placeholder="Mensaje personalizado…"
            className="w-full resize-none rounded-lg border border-borde bg-noche px-3.5 py-2.5 text-marfil outline-none transition focus:border-oro"
          />
          <div className="flex flex-wrap items-center gap-2">
            {(["info", "importante", "urgente"] as AlertLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setAlertLevel(level)}
                className={`rounded-full px-3 py-1.5 text-xs uppercase tracking-wide transition ${
                  alertLevel === level
                    ? "bg-oro text-noche"
                    : "border border-borde text-marfil-tenue hover:text-marfil"
                }`}
              >
                {level}
              </button>
            ))}
            <button
              type="button"
              disabled={alertMessage.trim().length === 0}
              onClick={() => {
                emitAlert({ message: alertMessage.trim(), level: alertLevel });
                setAlertMessage("");
                notify("Alerta enviada al grupo.");
              }}
              className="ml-auto rounded-full bg-oro px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-noche transition hover:bg-oro-suave disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </div>
      </Panel>

      <Panel
        title="Actualizar punto de encuentro"
        description="Cambia la ubicación y el mapa que ve el grupo."
      >
        <div className="space-y-3">
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Nueva dirección"
            className="w-full rounded-lg border border-borde bg-noche px-3.5 py-2.5 text-marfil outline-none transition focus:border-oro"
          />
          <input
            value={mapUrl}
            onChange={(event) => setMapUrl(event.target.value)}
            placeholder="Enlace de Google Maps"
            className="w-full rounded-lg border border-borde bg-noche px-3.5 py-2.5 text-marfil outline-none transition focus:border-oro"
          />
          <button
            type="button"
            onClick={() => {
              updateMeetingLocation({
                address: address.trim(),
                mapUrl: mapUrl.trim(),
              });
              notify("Punto de encuentro actualizado.");
            }}
            className="w-full rounded-full bg-oro px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-noche transition hover:bg-oro-suave"
          >
            Actualizar ubicación
          </button>
        </div>
      </Panel>

      <Panel
        title="Publicar comunicado"
        description="Avisos que quedan en el tablero del grupo."
      >
        <div className="space-y-3">
          <input
            value={annTitle}
            onChange={(event) => setAnnTitle(event.target.value)}
            placeholder="Título"
            className="w-full rounded-lg border border-borde bg-noche px-3.5 py-2.5 text-marfil outline-none transition focus:border-oro"
          />
          <textarea
            value={annBody}
            onChange={(event) => setAnnBody(event.target.value)}
            rows={2}
            placeholder="Detalle del comunicado…"
            className="w-full resize-none rounded-lg border border-borde bg-noche px-3.5 py-2.5 text-marfil outline-none transition focus:border-oro"
          />
          <button
            type="button"
            disabled={annTitle.trim().length === 0}
            onClick={() => {
              postAnnouncement({ title: annTitle.trim(), body: annBody.trim() });
              setAnnTitle("");
              setAnnBody("");
              notify("Comunicado publicado.");
            }}
            className="w-full rounded-full bg-oro px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-noche transition hover:bg-oro-suave disabled:cursor-not-allowed disabled:opacity-50"
          >
            Publicar
          </button>
        </div>
      </Panel>

      <AlertsFeed />
    </div>
  );
}
