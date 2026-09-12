import { describe, expect, it } from "vitest";
import { buildItineraryPdf, itineraryPdfFileName } from "./itineraryPdf";
import { createSeedTrip } from "./tripData";

describe("itineraryPdf", () => {
  it("builds a PDF blob that includes the trip name and days", async () => {
    const trip = createSeedTrip();
    const doc = await buildItineraryPdf(trip);
    const bytes = new Uint8Array(doc.output("arraybuffer"));
    const header = String.fromCharCode(...bytes.slice(0, 4));
    const asText = new TextDecoder("latin1").decode(bytes);

    expect(header).toBe("%PDF");
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(1);
    expect(asText).toContain("MISTIKTERRA");
    expect(asText).toContain("Asistencia");
  });

  it("names the file from the trip title", () => {
    expect(itineraryPdfFileName(createSeedTrip())).toBe(
      "mistikterra-itinerario-turquia-y-grecia.pdf",
    );
  });
});
