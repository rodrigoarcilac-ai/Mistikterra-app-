import type { Role } from "./types";

export const GUIDE_NAME = "Gabriela Calderón";
export const GUIDE_EMAIL = "mistikterra01@gmail.com";
export const GUIDE_PHONE_DIGITS = "9841062003";

export function isGuideContact(contact: string): boolean {
  const trimmed = contact.trim().toLowerCase();
  if (trimmed === GUIDE_EMAIL) return true;
  const digits = contact.replace(/\D/g, "");
  return digits === GUIDE_PHONE_DIGITS || digits.endsWith(GUIDE_PHONE_DIGITS);
}

export function roleForContact(contact: string): Role {
  return isGuideContact(contact) ? "guia" : "viajero";
}

export function displayNameForContact(
  contact: string,
  method: "email" | "telefono",
): string {
  if (isGuideContact(contact)) return GUIDE_NAME;
  if (method === "email") {
    const local = contact.split("@")[0] ?? "";
    const clean = local.replace(/[._-]+/g, " ").trim();
    if (clean) {
      return clean
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }
  }
  return "Viajero";
}
