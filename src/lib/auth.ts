import { createContext, useContext } from "react";
import type { AuthMethod, Role, User } from "./types";

export type LoginRequest = {
  method: AuthMethod;
  contact: string;
  role: Role;
  name?: string;
};

export type VerifyResult = { ok: true } | { ok: false; error: string };

export type PendingChallenge = {
  method: AuthMethod;
  contact: string;
  role: Role;
  name: string;
  /** Código OTP para teléfono (demo). */
  code: string;
  /** Token de enlace mágico para correo (demo). */
  magicToken: string;
};

export type AuthContextValue = {
  user: User | null;
  pending: PendingChallenge | null;
  requestAccess: (request: LoginRequest) => void;
  verify: (input: string) => VerifyResult;
  cancelPending: () => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return value;
}
