import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveDestinationImage } from "./resolveImage";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("resolveDestinationImage", () => {
  it("resolves a curated destination without any network call", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await resolveDestinationImage("Teotihuacán");

    expect(result).toEqual({
      url: "/img/hero-teotihuacan.png",
      source: "curada",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("matches a curated entry by partial name", async () => {
    const result = await resolveDestinationImage("Ascenso a la Pirámide del Sol");
    expect(result?.source).toBe("curada");
    expect(result?.url).toBe("/img/it-piramide-sol.png");
  });

  it("falls back to Wikipedia for an unknown place", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          title: "Hagia Sophia",
          originalimage: { source: "https://upload.wikimedia.org/hagia.jpg" },
        }),
      })),
    );

    const result = await resolveDestinationImage("Hagia Sophia");

    expect(result).toEqual({
      url: "https://upload.wikimedia.org/hagia.jpg",
      source: "wikipedia",
      credit: "Hagia Sophia",
    });
  });

  it("returns null when nothing is found", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, json: async () => ({}) })),
    );

    const result = await resolveDestinationImage("Lugar Inexistente XYZ");
    expect(result).toBeNull();
  });

  it("returns null for too-short input", async () => {
    const result = await resolveDestinationImage("a");
    expect(result).toBeNull();
  });
});
