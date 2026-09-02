import { describe, expect, it } from "vitest";
import { googleMapEmbedSrc, googleWalkingLink } from "./googleMaps";

const fushimi = { lat: 34.96714, lng: 135.77267, label: "Fushimi Inari" };
const filosofos = { lat: 35.0264, lng: 135.7958, label: "Camino de los Filósofos" };

describe("googleMapEmbedSrc", () => {
  it("embeds a Spanish walking route between two places", () => {
    const src = googleMapEmbedSrc(fushimi, filosofos);
    expect(src.startsWith("https://www.google.com/maps?")).toBe(true);
    expect(src).toContain("hl=es");
    expect(src).toContain("dirflg=w");
    expect(src).toContain("output=embed");
    expect(src).toContain("34.96714");
    expect(src).toContain("35.0264");
  });

  it("embeds a single place when origin and destination are the same", () => {
    const src = googleMapEmbedSrc(fushimi, fushimi);
    expect(src).toContain("hl=es");
    expect(src).toContain("output=embed");
    expect(src).not.toContain("dirflg=w");
  });
});

describe("googleWalkingLink", () => {
  it("opens official Google walking directions in Spanish", () => {
    const href = googleWalkingLink(fushimi, filosofos);
    expect(href).toContain("https://www.google.com/maps/dir/?");
    expect(href).toContain("travelmode=walking");
    expect(href).toContain("hl=es");
  });
});
