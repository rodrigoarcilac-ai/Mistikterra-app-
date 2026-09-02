import { useOnlineStatus } from "../lib/hooks";

export default function OfflineBanner() {
  const online = useOnlineStatus();

  if (online) {
    return null;
  }

  return (
    <div
      className="bg-oro/15 px-4 py-2 text-center text-sm text-oro"
      role="status"
      aria-live="polite"
    >
      Modo offline · mostrando tu itinerario guardado en este dispositivo
    </div>
  );
}
