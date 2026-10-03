import { describe, expect, it } from "vitest";
import {
  encodeTravelDoc,
  isPdfDoc,
  loadTravelDocs,
  persistTravelDoc,
  removeTravelDoc,
  travelDocsKey,
} from "./travelDocs";

describe("travelDocs", () => {
  it("stores a file per user and can remove it", async () => {
    const file = new File([" visado "], "visa.pdf", { type: "application/pdf" });
    const record = await encodeTravelDoc(file);
    expect(isPdfDoc(record)).toBe(true);
    expect(record.name).toBe("visa.pdf");
    expect(record.dataUrl.startsWith("data:")).toBe(true);

    persistTravelDoc("user_ana", "visa", record);
    expect(localStorage.getItem(travelDocsKey("user_ana"))).toContain("visa.pdf");
    expect(loadTravelDocs("user_ana").visa?.name).toBe("visa.pdf");
    expect(loadTravelDocs("user_ana").passport).toBeUndefined();

    removeTravelDoc("user_ana", "visa");
    expect(loadTravelDocs("user_ana").visa).toBeUndefined();
  });

  it("rejects non image/pdf types", async () => {
    const file = new File(["x"], "notes.txt", { type: "text/plain" });
    await expect(encodeTravelDoc(file)).rejects.toThrow(/foto o un PDF/i);
  });
});
