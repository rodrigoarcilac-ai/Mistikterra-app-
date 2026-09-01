import { useState } from "react";
import ItineraryList from "../components/ItineraryList";
import { useOnlineStatus } from "../lib/hooks";
import { downloadItineraryPdf } from "../lib/itineraryPdf";
import { useTrip } from "../lib/trip";

export default function ItineraryPage() {
  const online = useOnlineStatus();
  const { trip } = useTrip();
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadItineraryPdf(trip);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-marfil">Itinerario</h1>
        <p className="text-base text-marfil-tenue">
          {online
            ? "Resumen de tu viaje, listo para llevar."
            : "Sin conexión · consultando la copia guardada en tu dispositivo."}
        </p>
      </div>

      <button
        type="button"
        onClick={() => void handleDownload()}
        disabled={downloading}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-oro px-5 py-3 text-base font-bold uppercase tracking-[0.1em] text-noche transition hover:bg-oro-suave focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oro disabled:opacity-70"
      >
        <span aria-hidden>↓</span>
        {downloading ? "Preparando PDF…" : "Descargar PDF"}
      </button>

      <ItineraryList />
    </div>
  );
}
