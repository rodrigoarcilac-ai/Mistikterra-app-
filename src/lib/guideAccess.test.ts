import { describe, expect, it } from "vitest";
import {
  displayNameForContact,
  isGuideContact,
  roleForContact,
} from "./guideAccess";

describe("guideAccess", () => {
  it("treats Gabriela's email and WhatsApp as the host", () => {
    expect(isGuideContact("mistikterra01@gmail.com")).toBe(true);
    expect(isGuideContact("Mistikterra01@gmail.com")).toBe(true);
    expect(isGuideContact("+52 984 106 2003")).toBe(true);
    expect(isGuideContact("529841062003")).toBe(true);
    expect(roleForContact("mistikterra01@gmail.com")).toBe("guia");
    expect(displayNameForContact("mistikterra01@gmail.com", "email")).toBe(
      "Gabriela Calderón",
    );
  });

  it("treats any other contact as a traveler", () => {
    expect(isGuideContact("sofia@mistikterra.com")).toBe(false);
    expect(roleForContact("ana@correo.com")).toBe("viajero");
    expect(displayNameForContact("ana.lopez@correo.com", "email")).toBe(
      "Ana Lopez",
    );
    expect(displayNameForContact("+525555550123", "telefono")).toBe("Viajero");
  });
});
