import type { ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./auth";

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe("AuthProvider", () => {
  it("issues a phone challenge and logs in with the correct code", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.requestAccess({
        method: "telefono",
        contact: "+525555550123",
        role: "viajero",
      });
    });

    const code = result.current.pending?.code;
    expect(code).toMatch(/^\d{6}$/);

    act(() => {
      const outcome = result.current.verify(code!);
      expect(outcome.ok).toBe(true);
    });

    expect(result.current.user?.role).toBe("viajero");
    expect(result.current.user?.contact).toBe("+525555550123");
    expect(localStorage.getItem("mt.session")).toContain("+525555550123");
  });

  it("rejects an incorrect code", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.requestAccess({
        method: "telefono",
        contact: "+525555550999",
        role: "guia",
      });
    });

    act(() => {
      const outcome = result.current.verify("000000");
      expect(outcome.ok).toBe(false);
    });

    expect(result.current.user).toBeNull();
  });

  it("logs in a guide via magic link and logs out", () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.requestAccess({
        method: "email",
        contact: "sofia@mistikterra.com",
        role: "guia",
      });
    });

    const token = result.current.pending?.magicToken;
    act(() => {
      result.current.verify(token!);
    });

    expect(result.current.user?.role).toBe("guia");
    expect(result.current.user?.name).toBe("Sofia");

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("mt.session")).toBeNull();
  });
});
