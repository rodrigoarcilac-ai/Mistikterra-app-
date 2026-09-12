import { describe, expect, it } from "vitest";
import {
  clearSessionHero,
  loadSessionHero,
  rotateSessionHero,
} from "./sessionHero";

describe("sessionHero", () => {
  it("starts with Turkey then alternates to Greece and back", () => {
    expect(loadSessionHero().id).toBe("turquia");

    const first = rotateSessionHero();
    expect(first.id).toBe("turquia");
    expect(loadSessionHero().src).toBe("/img/hero-turquia.jpg");
    expect(first.alt).toBe("Estambul, Turquía");

    expect(rotateSessionHero().id).toBe("grecia");
    expect(loadSessionHero().alt).toBe("Atenas, Grecia");
    expect(rotateSessionHero().id).toBe("turquia");
  });

  it("keeps the same photo on reload until the next login", () => {
    rotateSessionHero();
    expect(loadSessionHero().id).toBe("turquia");
    expect(loadSessionHero().id).toBe("turquia");
  });

  it("still alternates after the session photo is cleared", () => {
    expect(rotateSessionHero().id).toBe("turquia");
    clearSessionHero();
    expect(rotateSessionHero().id).toBe("grecia");
  });
});
