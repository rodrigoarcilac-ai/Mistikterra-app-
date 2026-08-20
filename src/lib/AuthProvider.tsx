import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createId } from "./format";
import type { User } from "./types";
import {
  AuthContext,
  type AuthContextValue,
  type LoginRequest,
  type PendingChallenge,
  type VerifyResult,
} from "./auth";

const SESSION_KEY = "mt.session";

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function deriveName(request: LoginRequest): string {
  if (request.name && request.name.trim().length > 1) {
    return request.name.trim();
  }
  if (request.method === "email") {
    const local = request.contact.split("@")[0] ?? "";
    const clean = local.replace(/[._-]+/g, " ").trim();
    if (clean) {
      return clean
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
  }
  return request.role === "guia" ? "Anfitriona" : "Viajer@";
}

function sixDigitCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Proveedor de autenticación sin contraseñas (enlace mágico / código SMS).
 * Implementación local para desarrollo; la interfaz está lista para
 * intercambiarse por Firebase Authentication sin tocar la UI.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadSession());
  const [pending, setPending] = useState<PendingChallenge | null>(null);

  const requestAccess = useCallback((request: LoginRequest) => {
    setPending({
      method: request.method,
      contact: request.contact.trim(),
      role: request.role,
      name: deriveName(request),
      code: sixDigitCode(),
      magicToken: createId("magic"),
    });
  }, []);

  const verify = useCallback(
    (input: string): VerifyResult => {
      if (!pending) {
        return { ok: false, error: "No hay una solicitud de acceso activa." };
      }
      const expected =
        pending.method === "telefono" ? pending.code : pending.magicToken;
      if (input.trim() !== expected) {
        return {
          ok: false,
          error:
            pending.method === "telefono"
              ? "El código no coincide. Intenta de nuevo."
              : "El enlace no es válido.",
        };
      }
      const authenticated: User = {
        id: createId("user"),
        role: pending.role,
        name: pending.name,
        contact: pending.contact,
        method: pending.method,
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(authenticated));
      setUser(authenticated);
      setPending(null);
      return { ok: true };
    },
    [pending],
  );

  const cancelPending = useCallback(() => setPending(null), []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setPending(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, pending, requestAccess, verify, cancelPending, logout }),
    [user, pending, requestAccess, verify, cancelPending, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
