import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import type { AuthMethod, Role } from "../lib/types";

export default function LoginPage() {
  const { pending, requestAccess, verify, cancelPending } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState<AuthMethod>("email");
  const [role, setRole] = useState<Role>("viajero");
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleRequest(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const trimmed = contact.trim();
    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Ingresa un correo válido.");
      return;
    }
    if (method === "telefono" && trimmed.replace(/\D/g, "").length < 8) {
      setError("Ingresa un número de teléfono válido.");
      return;
    }
    requestAccess({ method, contact: trimmed, role });
  }

  function handleVerify(input: string) {
    setError(null);
    const result = verify(input);
    if (result.ok) {
      navigate("/", { replace: true });
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <div className="text-center">
        <p className="font-display text-2xl font-semibold tracking-[0.35em] text-oro">
          MISTIKTERRA
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.4em] text-marfil-tenue">
          Awakening Experiences
        </p>
        <h1 className="mt-8 font-display text-3xl text-marfil">
          Tu viaje interior comienza aquí
        </h1>
        <p className="mt-3 text-marfil-tenue">
          Accede sin contraseñas. Te enviaremos un enlace mágico o un código.
        </p>
      </div>

      {!pending ? (
        <form
          onSubmit={handleRequest}
          className="mt-10 rounded-2xl border border-borde bg-carbon p-6"
        >
          <div className="grid grid-cols-2 gap-2 rounded-full border border-borde p-1">
            {(["email", "telefono"] as AuthMethod[]).map((option) => (
              <button
                type="button"
                key={option}
                onClick={() => setMethod(option)}
                className={`rounded-full py-2 text-sm font-medium transition ${
                  method === option
                    ? "bg-oro text-noche"
                    : "text-marfil-tenue hover:text-marfil"
                }`}
              >
                {option === "email" ? "Correo" : "Teléfono"}
              </button>
            ))}
          </div>

          <label className="mt-5 block">
            <span className="mb-1.5 block text-sm text-marfil-tenue">
              {method === "email" ? "Correo electrónico" : "Número de teléfono"}
            </span>
            <input
              type={method === "email" ? "email" : "tel"}
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder={method === "email" ? "tu@correo.com" : "+52 55 1234 5678"}
              className="w-full rounded-lg border border-borde bg-noche px-3.5 py-2.5 text-marfil outline-none transition focus:border-oro"
            />
          </label>

          <fieldset className="mt-5">
            <legend className="mb-1.5 text-sm text-marfil-tenue">
              Ingresas como <span className="text-marfil-tenue">(demo)</span>
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {(["viajero", "guia"] as Role[]).map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setRole(option)}
                  className={`rounded-lg border py-2 text-sm transition ${
                    role === option
                      ? "border-oro bg-oro/10 text-oro"
                      : "border-borde text-marfil-tenue hover:text-marfil"
                  }`}
                >
                  {option === "viajero" ? "Viajer@" : "Anfitriona / Guía"}
                </button>
              ))}
            </div>
          </fieldset>

          {error ? (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          ) : null}

          <button
            type="submit"
            className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-oro px-5 py-3 text-base font-bold uppercase tracking-[0.14em] text-noche transition hover:bg-oro-suave"
          >
            {method === "email" ? "Enviar enlace mágico" : "Enviar código"}
          </button>
        </form>
      ) : (
        <div className="mt-10 rounded-2xl border border-borde bg-carbon p-6">
          {pending.method === "email" ? (
            <>
              <h2 className="font-display text-xl text-marfil">
                Revisa tu correo
              </h2>
              <p className="mt-2 text-sm text-marfil-tenue">
                Enviamos un enlace mágico a{" "}
                <span className="text-marfil">{pending.contact}</span>. Ábrelo para
                entrar.
              </p>
              <p className="mt-4 rounded-lg border border-dashed border-oro/40 bg-noche p-3 text-sm text-marfil-tenue">
                Modo demo: el correo real requiere Firebase. Usa el botón para
                simular la apertura del enlace.
              </p>
              {error ? (
                <p className="mt-4 text-sm text-red-400">{error}</p>
              ) : null}
              <button
                type="button"
                onClick={() => handleVerify(pending.magicToken)}
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-oro px-5 py-3 text-base font-bold uppercase tracking-[0.14em] text-noche transition hover:bg-oro-suave"
              >
                Abrir enlace mágico
              </button>
            </>
          ) : (
            <>
              <h2 className="font-display text-xl text-marfil">
                Ingresa tu código
              </h2>
              <p className="mt-2 text-sm text-marfil-tenue">
                Enviamos un código de 6 dígitos a{" "}
                <span className="text-marfil">{pending.contact}</span>.
              </p>
              <p className="mt-4 rounded-lg border border-dashed border-oro/40 bg-noche p-3 text-sm text-marfil-tenue">
                Modo demo · tu código es{" "}
                <span className="text-lg font-bold tracking-[0.3em] text-oro">
                  {pending.code}
                </span>
              </p>
              <label className="mt-4 block">
                <span className="mb-1.5 block text-sm text-marfil-tenue">
                  Código
                </span>
                <input
                  inputMode="numeric"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-lg border border-borde bg-noche px-3.5 py-2.5 text-center text-xl tracking-[0.4em] text-marfil outline-none transition focus:border-oro"
                />
              </label>
              {error ? (
                <p className="mt-3 text-sm text-red-400">{error}</p>
              ) : null}
              <button
                type="button"
                onClick={() => handleVerify(code)}
                className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full bg-oro px-5 py-3 text-base font-bold uppercase tracking-[0.14em] text-noche transition hover:bg-oro-suave"
              >
                Verificar y entrar
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              cancelPending();
              setCode("");
              setError(null);
            }}
            className="mt-4 flex min-h-12 w-full items-center justify-center text-center text-base font-medium text-marfil underline underline-offset-4 transition hover:text-oro"
          >
            Usar otro método
          </button>
        </div>
      )}
    </div>
  );
}
