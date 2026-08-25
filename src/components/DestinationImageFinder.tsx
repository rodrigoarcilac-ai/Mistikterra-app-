import { useState } from "react";
import { resolveDestinationImage, type ResolvedImage } from "../lib/resolveImage";
import { useTrip } from "../lib/trip";

type Status = "idle" | "loading" | "found" | "notfound";

export default function DestinationImageFinder({
  onApplied,
}: {
  onApplied?: (message: string) => void;
}) {
  const { trip, updateHeroImage } = useTrip();
  const [name, setName] = useState(trip.name);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ResolvedImage | null>(null);

  async function handleSearch() {
    if (name.trim().length < 2) return;
    setStatus("loading");
    setResult(null);
    const resolved = await resolveDestinationImage(name);
    if (resolved) {
      setResult(resolved);
      setStatus("found");
    } else {
      setStatus("notfound");
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleSearch();
          }}
          placeholder="Nombre del destino (ej. Kioto, Fushimi Inari, Teotihuacán…)"
          className="min-h-12 flex-1 rounded-lg border border-borde bg-noche px-3.5 py-2.5 text-marfil outline-none transition focus:border-oro"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={status === "loading" || name.trim().length < 2}
          className="min-h-12 rounded-full border border-oro/60 px-5 py-2.5 text-sm font-bold uppercase tracking-[0.1em] text-oro transition hover:bg-oro/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? "Buscando…" : "Buscar imagen"}
        </button>
      </div>

      {status === "notfound" ? (
        <p className="text-sm text-marfil-tenue">
          No encontramos una imagen para “{name}”. Prueba con el nombre del sitio
          o del lugar más conocido.
        </p>
      ) : null}

      {status === "found" && result ? (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border-2 border-oro/40">
            <img
              src={result.url}
              alt={`Vista previa de ${name}`}
              className="h-48 w-full object-cover"
            />
            <span className="absolute right-2 top-2 rounded-full bg-noche/80 px-3 py-1 text-xs text-oro">
              {result.source === "curada" ? "Imagen curada" : "Wikipedia"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              updateHeroImage(result.url);
              onApplied?.("Portada del destino actualizada.");
            }}
            className="min-h-12 w-full rounded-full bg-oro px-5 py-2.5 text-sm font-bold uppercase tracking-[0.1em] text-noche transition hover:bg-oro-suave"
          >
            Aplicar como portada
          </button>
        </div>
      ) : null}
    </div>
  );
}
