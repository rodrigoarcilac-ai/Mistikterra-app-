import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createId } from "./format";
import {
  displayNameForContact,
  roleForContact,
} from "./guideAccess";
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
  return displayNameForContact(request.contact, request.method);
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
    const contact = request.contact.trim();
    setPending({
      method: request.method,
      contact,
      role: roleForContact(contact),
      name: deriveName({ ...request, contact }),
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
