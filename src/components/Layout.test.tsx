import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../lib/AuthProvider";
import { TripProvider } from "../lib/TripProvider";
import Layout from "./Layout";

function seedTraveler() {
  localStorage.setItem(
    "mt.session",
    JSON.stringify({
      id: "user_ana",
      role: "viajero",
      name: "Ana",
      contact: "ana@correo.com",
      method: "email",
    }),
  );
}

function wrap(ui: ReactNode, initial = "/") {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <AuthProvider>
        <TripProvider>{ui}</TripProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Layout account header", () => {
  it("links Mi cuenta and does not show Salir", () => {
    seedTraveler();
    wrap(
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>inicio</p>} />
          <Route path="/cuenta" element={<p>cuenta</p>} />
        </Route>
      </Routes>,
    );

    expect(screen.queryByRole("button", { name: /^salir$/i })).not.toBeInTheDocument();
    const cuenta = screen.getByRole("link", { name: /mi cuenta/i });
    expect(cuenta).toHaveAttribute("href", "/cuenta");
    expect(cuenta).toHaveTextContent("Ana");
  });
});
