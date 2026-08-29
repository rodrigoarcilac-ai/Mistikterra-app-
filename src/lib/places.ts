import type { PlaceCategory, Recommendation } from "./types";

export const PLACE_CATEGORIES: PlaceCategory[] = [
  "sagrado",
  "mirador",
  "gastronomia",
  "tienda",
  "barrio",
];

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  sagrado: "Sitio sagrado",
  mirador: "Mirador",
  gastronomia: "Gastronomía",
  tienda: "Tienda",
  barrio: "Barrio",
};

export function zonesFrom(recommendations: Recommendation[]): string[] {
  const seen: string[] = [];
  for (const place of recommendations) {
    if (!seen.includes(place.zone)) seen.push(place.zone);
  }
  return seen;
}

export function filterRecommendations(
  recommendations: Recommendation[],
  {
    zone,
    category,
    limit,
  }: { zone?: string; category?: PlaceCategory | "todos"; limit?: number },
): Recommendation[] {
  let next = recommendations;
  if (zone) next = next.filter((place) => place.zone === zone);
  if (category && category !== "todos") {
    next = next.filter((place) => place.category === category);
  }
  if (typeof limit === "number") next = next.slice(0, limit);
  return next;
}
