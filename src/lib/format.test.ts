import { describe, expect, it } from "vitest";
import { createId, countdownPhrase, formatDate, formatTime, getCountdown } from "./format";

describe("getCountdown", () => {
  it("breaks down a future target into days/hours/minutes/seconds", () => {
    const now = new Date("2030-01-01T00:00:00.000Z").getTime();
    const target = new Date("2030-01-02T03:04:05.000Z").toISOString();
    const result = getCountdown(target, now);

    expect(result.past).toBe(false);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(3);
    expect(result.minutes).toBe(4);
    expect(result.seconds).toBe(5);
  });

  it("flags a target in the past", () => {
    const now = new Date("2030-01-02T00:00:00.000Z").getTime();
    const target = new Date("2030-01-01T00:00:00.000Z").toISOString();
    const result = getCountdown(target, now);

    expect(result.past).toBe(true);
    expect(result.total).toBeLessThanOrEqual(0);
  });
});

describe("formatDate", () => {
  it("includes the year so September and October labels stay unambiguous", () => {
    const label = formatDate("2026-09-20T19:00:00+03:00");
    expect(label).toMatch(/2026/);
    expect(label.toLowerCase()).toContain("septiembre");
  });
});

describe("formatTime", () => {
  it("shows the program local time, not the device timezone", () => {
    const label = formatTime("2026-09-20T19:00:00+03:00");
    expect(label).toMatch(/7:00|19:00/);
  });
});

describe("countdownPhrase", () => {
  const cocktail = "2026-09-20T19:00:00+03:00";

  it("speaks remaining days in a friendly sentence", () => {
    const now = Date.parse("2026-09-01T12:00:00+03:00");
    expect(countdownPhrase(cocktail, now)).toBe(
      "Faltan 19 días para el cóctel",
    );
  });

  it("uses tonight's local time on the calendar day of the meeting", () => {
    const now = Date.parse("2026-09-20T10:00:00+03:00");
    const phrase = countdownPhrase(cocktail, now);
    expect(phrase.startsWith("Hoy a las ")).toBe(true);
    expect(phrase).toMatch(/7:00|19:00/);
  });

  it("counts hours when the meeting is tomorrow", () => {
    const now = Date.parse("2026-09-19T22:00:00+03:00");
    expect(countdownPhrase(cocktail, now)).toBe("Faltan 21 horas");
  });

  it("announces when the meeting has started", () => {
    const now = Date.parse("2026-09-20T20:00:00+03:00");
    expect(countdownPhrase(cocktail, now)).toBe("El encuentro ya comenzó");
  });
});

describe("createId", () => {
  it("uses the provided prefix and is unique", () => {
    const a = createId("alert");
    const b = createId("alert");
    expect(a.startsWith("alert_")).toBe(true);
    expect(a).not.toBe(b);
  });
});
