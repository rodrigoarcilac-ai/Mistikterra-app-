import { useState } from "react";
import { useTrip } from "../lib/trip";

export default function AssistanceButton() {
  const { trip } = useTrip();
  const [open, setOpen] = useState(false);
  const { assistance } = trip;

  const telHref = `tel:${assistance.phone.replace(/[^\d+]/g, "")}`;
  const whatsappHref = `https://wa.me/${assistance.whatsapp}?text=${encodeURIComponent(
    assistance.whatsappMessage,
  )}`;
  const emailHref = `mailto:${assistance.email}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-30 flex h-14 min-h-12 w-14 items-center justify-center rounded-full border border-oro/60 bg-carbon text-2xl text-oro shadow-xl shadow-black/50 transition hover:bg-oro/10"
        aria-label="Asistencia y SOS por WhatsApp"
      >
        <span aria-hidden>🆘</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Asistencia directa"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-oro/30 bg-carbon p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="font-display text-xl text-marfil">Asistencia directa</h3>
            <p className="mt-1 text-sm text-marfil-tenue">
              {assistance.contactName} está disponible para cualquier imprevisto
              con el punto de encuentro.
            </p>
            <div className="mt-5 space-y-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-oro px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-noche transition hover:bg-oro-suave"
              >
                <span aria-hidden>💬</span> WhatsApp / SOS
              </a>
              <a
                href={telHref}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-oro/50 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-oro transition hover:bg-oro/10"
              >
                Llamar {assistance.phone}
              </a>
              <a
                href={emailHref}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-borde px-5 py-3 text-sm font-semibold text-marfil-tenue transition hover:border-oro/50 hover:text-oro"
              >
                {assistance.email}
              </a>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 flex min-h-12 w-full items-center justify-center text-center text-sm text-marfil-tenue transition hover:text-marfil"
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
