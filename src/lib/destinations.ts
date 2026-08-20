export type Destination = {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  experiences: string[];
  fromPriceUsd: number;
  accent: string;
};

export const destinations: Destination[] = [
  {
    slug: "amalfi-coast",
    name: "Amalfi Coast",
    country: "Italy",
    tagline: "Cliffside villas & private yacht days",
    description:
      "Wake to the Tyrrhenian Sea from a private terrace, then cruise hidden coves aboard a classic gozzo with a personal chef.",
    experiences: ["Private yacht charter", "Michelin dinners", "Ravello villa stay"],
    fromPriceUsd: 8900,
    accent: "#0f766e",
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    country: "Japan",
    tagline: "Temples, tea houses & ryokan serenity",
    description:
      "A curated immersion into old Japan: after-hours temple access, a private tea ceremony, and a riverside kaiseki ryokan.",
    experiences: ["After-hours temple tour", "Private tea ceremony", "Kaiseki ryokan"],
    fromPriceUsd: 11200,
    accent: "#9d174d",
  },
  {
    slug: "serengeti",
    name: "Serengeti",
    country: "Tanzania",
    tagline: "Luxury tented safari under endless skies",
    description:
      "Track the Great Migration by day and dine beneath the stars, with a dedicated guide and a mobile camp that follows the herds.",
    experiences: ["Great Migration game drives", "Hot-air balloon safari", "Bush dinner"],
    fromPriceUsd: 13400,
    accent: "#b45309",
  },
  {
    slug: "santorini",
    name: "Santorini",
    country: "Greece",
    tagline: "Caldera suites & sunset sailings",
    description:
      "Whitewashed cave suites carved into the caldera, a private catamaran at golden hour, and volcanic-vineyard wine tastings.",
    experiences: ["Caldera cave suite", "Private catamaran", "Vineyard tasting"],
    fromPriceUsd: 7600,
    accent: "#1d4ed8",
  },
  {
    slug: "patagonia",
    name: "Patagonia",
    country: "Chile",
    tagline: "Glaciers, guanacos & design lodges",
    description:
      "Hike toward the Torres del Paine with a private guide, then return to a design-forward lodge and a wood-fired asado.",
    experiences: ["Guided Torres del Paine trek", "Glacier catamaran", "Patagonian asado"],
    fromPriceUsd: 9800,
    accent: "#047857",
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    tagline: "Riads, souks & Atlas escapes",
    description:
      "A restored riad in the medina, a private tour of the souks with an artisan guide, and a starlit dinner in the Agafay desert.",
    experiences: ["Private riad", "Artisan souk tour", "Agafay desert dinner"],
    fromPriceUsd: 6900,
    accent: "#c2410c",
  },
];

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((destination) => destination.slug === slug);
}
