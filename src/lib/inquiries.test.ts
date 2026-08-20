import { describe, expect, it } from "vitest";
import {
  createReference,
  listInquiries,
  saveInquiry,
  validateInquiry,
} from "./inquiries";

describe("validateInquiry", () => {
  const validInput = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    destination: "kyoto",
    travelers: 2,
    travelStyle: "Adventure",
    notes: "Anniversary trip",
  };

  it("accepts a well-formed inquiry and resolves the destination name", () => {
    const result = validateInquiry(validInput);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.destinationName).toBe("Kyoto");
      expect(result.value.travelers).toBe(2);
    }
  });

  it("rejects an invalid email", () => {
    const result = validateInquiry({ ...validInput, email: "not-an-email" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.email).toBeDefined();
    }
  });

  it("rejects an unknown destination", () => {
    const result = validateInquiry({ ...validInput, destination: "atlantis" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.destination).toBeDefined();
    }
  });

  it("rejects an out-of-range traveler count", () => {
    const result = validateInquiry({ ...validInput, travelers: 99 });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.travelers).toBeDefined();
    }
  });

  it("rejects an unsupported travel style", () => {
    const result = validateInquiry({ ...validInput, travelStyle: "Budget" });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.travelStyle).toBeDefined();
    }
  });
});

describe("createReference", () => {
  it("produces a Mistikterra-prefixed reference", () => {
    expect(createReference()).toMatch(/^MT-[A-Z0-9]{6}$/);
  });
});

describe("saveInquiry", () => {
  it("persists an inquiry and returns it with a reference", () => {
    const inquiry = saveInquiry({
      name: "Grace Hopper",
      email: "grace@example.com",
      destination: "santorini",
      destinationName: "Santorini",
      travelers: 3,
      travelStyle: "Romance",
      notes: "",
    });

    expect(inquiry.reference).toMatch(/^MT-/);
    expect(listInquiries()[0].reference).toBe(inquiry.reference);
  });
});
