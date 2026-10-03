import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import DocumentUpload from "../components/DocumentUpload";
import { useAuth } from "../lib/auth";
import {
  encodeTravelDoc,
  loadTravelDocs,
  persistTravelDoc,
  removeTravelDoc,
} from "../lib/travelDocs";
import type { TravelDocKind, TravelDocs } from "../lib/types";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [docs, setDocs] = useState<TravelDocs>(() =>
    user ? loadTravelDocs(user.id) : {},
  );
  const [busy, setBusy] = useState<TravelDocKind | null>(null);
  const [errors, setErrors] = useState<Partial<Record<TravelDocKind, string>>>(
    {},
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userId = user.id;

  async function handleSelect(kind: TravelDocKind, file: File) {
    setBusy(kind);
    setErrors((current) => ({ ...current, [kind]: undefined }));
    try {
      const record = await encodeTravelDoc(file);
      setDocs(persistTravelDoc(userId, kind, record));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo guardar el archivo.";
      setErrors((current) => ({ ...current, [kind]: message }));
    } finally {
      setBusy(null);
    }
  }

  function handleRemove(kind: TravelDocKind) {
    setDocs(removeTravelDoc(userId, kind));
    setErrors((current) => ({ ...current, [kind]: undefined }));
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const roleLabel = user.role === "guia" ? "Anfitriona" : "Viajero";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-marfil">Mi cuenta</h1>
        <p className="mt-2 text-sm leading-6 text-marfil-tenue">
          Tus datos de acceso y documentos de viaje en este teléfono.
        </p>
      </div>

      <section className="rounded-2xl border border-borde bg-carbon p-5">
        <p className="font-display text-2xl text-marfil">{user.name}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-oro">
          {roleLabel}
        </p>
        <p className="mt-3 text-base text-marfil-tenue">{user.contact}</p>
      </section>

      <div className="space-y-3">
        <h2 className="font-display text-2xl text-marfil">
          Documentos de viaje
        </h2>
        <p className="text-sm leading-6 text-marfil-tenue">
          Quedan en este teléfono. No se envían a Gabriela desde la app.
        </p>
        <DocumentUpload
          title="Pasaporte"
          description="Foto o PDF de la hoja de datos. Llévalo también en físico."
          file={docs.passport}
          busy={busy === "passport"}
          error={errors.passport}
          onSelect={(file) => handleSelect("passport", file)}
          onRemove={() => handleRemove("passport")}
        />
        <DocumentUpload
          title="Visa"
          description="Si tu nacionalidad lo pide (p. ej. e-visa de Turquía o Schengen para Grecia), súbela aquí."
          file={docs.visa}
          busy={busy === "visa"}
          error={errors.visa}
          onSelect={(file) => handleSelect("visa", file)}
          onRemove={() => handleRemove("visa")}
        />
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex min-h-12 w-full items-center justify-center text-base font-medium text-marfil-tenue underline underline-offset-4 transition hover:text-oro"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
