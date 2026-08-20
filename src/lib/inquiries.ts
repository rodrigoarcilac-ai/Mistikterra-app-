import { getDestination } from "./destinations";

export type InquiryInput = {
  name?: unknown;
  email?: unknown;
  destination?: unknown;
  travelers?: unknown;
  travelStyle?: unknown;
  notes?: unknown;
};

export type Inquiry = {
  reference: string;
  name: string;
  email: string;
  destination: string;
  destinationName: string;
  travelers: number;
  travelStyle: string;
  notes: string;
  createdAt: string;
};

export type ValidationResult =
  | { ok: true; value: Omit<Inquiry, "reference" | "createdAt"> }
  | { ok: false; errors: Record<string, string> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TRAVEL_STYLES = [
  "Relaxed luxury",
  "Adventure",
  "Culture & cuisine",
  "Romance",
  "Family",
] as const;

export function validateInquiry(input: InquiryInput): ValidationResult {
  const errors: Record<string, string> = {};

  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (name.length < 2) {
    errors.name = "Please tell us your name.";
  }

  const email = typeof input.email === "string" ? input.email.trim() : "";
  if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const destination = typeof input.destination === "string" ? input.destination : "";
  const matchedDestination = getDestination(destination);
  if (!matchedDestination) {
    errors.destination = "Please choose one of our curated destinations.";
  }

  const travelersRaw = Number(input.travelers);
  const travelers = Number.isFinite(travelersRaw) ? Math.floor(travelersRaw) : NaN;
  if (!Number.isFinite(travelers) || travelers < 1 || travelers > 20) {
    errors.travelers = "Travelers must be between 1 and 20.";
  }

  const travelStyle = typeof input.travelStyle === "string" ? input.travelStyle : "";
  if (!TRAVEL_STYLES.includes(travelStyle as (typeof TRAVEL_STYLES)[number])) {
    errors.travelStyle = "Please select a travel style.";
  }

  const notes = typeof input.notes === "string" ? input.notes.trim() : "";

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      destination,
      destinationName: matchedDestination!.name,
      travelers,
      travelStyle,
      notes,
    },
  };
}

export function createReference(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `MT-${random}`;
}

const inquiries: Inquiry[] = [];

export function saveInquiry(value: Omit<Inquiry, "reference" | "createdAt">): Inquiry {
  const inquiry: Inquiry = {
    ...value,
    reference: createReference(),
    createdAt: new Date().toISOString(),
  };
  inquiries.push(inquiry);
  return inquiry;
}

export function listInquiries(): Inquiry[] {
  return [...inquiries].reverse();
}
