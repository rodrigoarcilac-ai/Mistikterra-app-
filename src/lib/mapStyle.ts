import type { ExpressionSpecification, StyleSpecification } from "maplibre-gl";

export const OPENFREEMAP_DARK_STYLE =
  "https://tiles.openfreemap.org/styles/dark";

/** Prefer Spanish OSM names, then Latin script, then English, then local. */
export const SPANISH_NAME_FIELD: ExpressionSpecification = [
  "coalesce",
  ["get", "name:es"],
  ["get", "name_es"],
  ["get", "name:latin"],
  ["get", "name_en"],
  ["get", "name"],
];

function usesPlaceName(value: unknown): boolean {
  if (typeof value === "string") {
    return /\bname(_en|:latin|:nonlatin)?\b/.test(value);
  }
  if (Array.isArray(value)) return value.some(usesPlaceName);
  return false;
}

export function localizeStyleToSpanish(
  style: StyleSpecification,
): StyleSpecification {
  const next = structuredClone(style);
  for (const layer of next.layers) {
    if (layer.type !== "symbol" || !layer.layout) continue;
    const textField = layer.layout["text-field"];
    if (textField == null || !usesPlaceName(textField)) continue;
    layer.layout["text-field"] = SPANISH_NAME_FIELD;
  }
  return next;
}

export async function fetchSpanishDarkStyle(
  signal?: AbortSignal,
): Promise<StyleSpecification> {
  const response = await fetch(OPENFREEMAP_DARK_STYLE, { signal });
  if (!response.ok) {
    throw new Error(`No se pudo cargar el estilo del mapa (${response.status})`);
  }
  const style = (await response.json()) as StyleSpecification;
  return localizeStyleToSpanish(style);
}
