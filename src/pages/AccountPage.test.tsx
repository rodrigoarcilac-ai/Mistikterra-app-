import type { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../lib/AuthProvider";
import { TripProvider } from "../lib/TripProvider";
import { loadTravelDocs, travelDocsKey } from "../lib/travelDocs";
import AccountPage from "./AccountPage";

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

function wrap(ui: ReactNode) {
  return render(
    <MemoryRouter initialEntries={["/cuenta"]}>
      <AuthProvider>
        <TripProvider>
          <Routes>
            <Route path="/cuenta" element={ui} />
            <Route path="/login" element={<p>login</p>} />
          </Routes>
        </TripProvider>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("AccountPage", () => {
  it("shows passport and optional visa, and keeps visa empty", () => {
    seedTraveler();
    wrap(<AccountPage />);

    expect(screen.getByRole("heading", { name: "Mi cuenta" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pasaporte" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Visa" })).toBeInTheDocument();
    expect(screen.getByText(/e-visa de Turquía/i)).toBeInTheDocument();
    expect(screen.getAllByText(/sin archivo aún/i)).toHaveLength(2);
    expect(screen.getByRole("button", { name: /cerrar sesión/i })).toBeInTheDocument();
  });

  it("persists a passport photo and can remove it", async () => {
    const user = userEvent.setup();
    seedTraveler();
    wrap(<AccountPage />);

    const passport = screen.getByRole("heading", { name: "Pasaporte" }).closest("section");
    expect(passport).toBeTruthy();
    const file = new File(["fake-image"], "pasaporte.jpg", { type: "image/jpeg" });
    const input = within(passport as HTMLElement).getByLabelText(/subir/i);
    await user.upload(input, file);

    await waitFor(() => {
      expect(loadTravelDocs("user_ana").passport?.name).toBe("pasaporte.jpg");
    });
    expect(localStorage.getItem(travelDocsKey("user_ana"))).toContain("pasaporte.jpg");
    expect(loadTravelDocs("user_ana").visa).toBeUndefined();

    await user.click(within(passport as HTMLElement).getByRole("button", { name: /quitar/i }));
    expect(loadTravelDocs("user_ana").passport).toBeUndefined();
  });

  it("logs out from Mi cuenta", async () => {
    const user = userEvent.setup();
    seedTraveler();
    wrap(<AccountPage />);

    await user.click(screen.getByRole("button", { name: /cerrar sesión/i }));
    expect(localStorage.getItem("mt.session")).toBeNull();
    expect(screen.getByText("login")).toBeInTheDocument();
  });
});
