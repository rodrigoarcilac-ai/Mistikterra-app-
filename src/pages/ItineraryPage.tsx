import ItineraryList from "../components/ItineraryList";
import { useOnlineStatus } from "../lib/hooks";

export default function ItineraryPage() {
  const online = useOnlineStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-marfil">Itinerario</h1>
        <p className="text-marfil-tenue">
          {online
            ? "Tu agenda completa, siempre a la mano."
            : "Sin conexión · consultando la copia guardada en tu dispositivo."}
        </p>
      </div>
      <ItineraryList />
    </div>
  );
}
