import { useId, useState } from "react";
import { isPdfDoc } from "../lib/travelDocs";
import type { TravelDocFile } from "../lib/types";

export default function DocumentUpload({
  title,
  description,
  file,
  busy,
  error,
  onSelect,
  onRemove,
}: {
  title: string;
  description: string;
  file?: TravelDocFile;
  busy?: boolean;
  error?: string | null;
  onSelect: (next: File) => void;
  onRemove: () => void;
}) {
  const inputId = useId();
  const [inputKey, setInputKey] = useState(0);
  const pdf = file ? isPdfDoc(file) : false;

  return (
    <section className="rounded-2xl border border-borde bg-carbon p-5">
      <h3 className="font-display text-xl text-marfil">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-marfil-tenue">{description}</p>

      {file ? (
        <div className="mt-4 space-y-3">
          {pdf ? (
            <p className="text-base text-marfil">{file.name}</p>
          ) : (
            <img
              src={file.dataUrl}
              alt={`Vista previa de ${title.toLowerCase()}`}
              className="max-h-48 w-full rounded-xl object-contain bg-noche"
            />
          )}
          <p className="text-xs text-marfil-tenue">
            {file.name}
            {file.updatedAt
              ? ` · ${new Date(file.updatedAt).toLocaleString("es-MX", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}`
              : ""}
          </p>
        </div>
      ) : (
        <p className="mt-4 text-base text-marfil-tenue">Sin archivo aún.</p>
      )}

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <label
          htmlFor={inputId}
          className="inline-flex min-h-12 cursor-pointer items-center rounded-full bg-oro px-5 text-base font-bold uppercase tracking-[0.14em] text-noche"
        >
          {busy ? "Guardando…" : file ? "Reemplazar" : "Subir"}
          <input
            id={inputId}
            key={inputKey}
            type="file"
            accept="image/*,.pdf,application/pdf"
            className="sr-only"
            disabled={busy}
            onChange={(event) => {
              const next = event.target.files?.[0];
              if (next) onSelect(next);
              setInputKey((value) => value + 1);
            }}
          />
        </label>
        {file ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex min-h-12 items-center rounded-full border border-borde px-5 text-base font-medium text-marfil-tenue hover:text-oro"
          >
            Quitar
          </button>
        ) : null}
      </div>
    </section>
  );
}
