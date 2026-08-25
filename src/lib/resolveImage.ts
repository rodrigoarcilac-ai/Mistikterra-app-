export type ImageSource = "curada" | "wikipedia";

export type ResolvedImage = {
  url: string;
  source: ImageSource;
  /** Título/atribución de la fuente (para créditos cuando aplique). */
  credit?: string;
};

/** Normaliza para comparar sin acentos ni mayúsculas. */
function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Biblioteca curada de destinos Mistikterra (máxima calidad y control de marca).
 * Se consulta primero; si no hay coincidencia, se recurre a Wikipedia.
 */
const CURATED: Record<string, string> = {
  teotihuacan: "/img/hero-teotihuacan.png",
  "piramide del sol": "/img/it-piramide-sol.png",
  "piramide de la luna": "/img/it-piramide-luna.png",
  "la gruta": "/img/it-gruta.png",
  "palacio de quetzalpapalotl": "/img/it-cierre.png",
  "altar de copal": "/img/it-ceremonia.png",
  kioto: "/img/hero-japon.jpg",
  kyoto: "/img/hero-japon.jpg",
  japon: "/img/hero-japon.jpg",
  "fushimi inari": "/img/hero-japon.jpg",
  koyasan: "/img/hero-japon.jpg",
  "monte koya": "/img/hero-japon.jpg",
};

function findCurated(name: string): string | undefined {
  const key = normalize(name);
  if (CURATED[key]) return CURATED[key];
  // Coincidencia parcial: "Ascenso a la Pirámide del Sol" -> "piramide del sol".
  const match = Object.keys(CURATED).find(
    (curatedKey) => key.includes(curatedKey) || curatedKey.includes(key),
  );
  return match ? CURATED[match] : undefined;
}

type WikiSummary = {
  originalimage?: { source?: string };
  thumbnail?: { source?: string };
  title?: string;
};

async function fetchWikipediaImage(
  name: string,
  lang: "es" | "en",
  signal: AbortSignal,
): Promise<ResolvedImage | null> {
  const endpoint = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    name,
  )}`;
  const response = await fetch(endpoint, { signal });
  if (!response.ok) return null;
  const data = (await response.json()) as WikiSummary;
  const url = data.originalimage?.source ?? data.thumbnail?.source;
  if (!url) return null;
  return { url, source: "wikipedia", credit: data.title };
}

/**
 * Resuelve automáticamente una imagen a partir del nombre de la ubicación.
 * Cascada: biblioteca curada -> Wikipedia (es -> en). Sin API key.
 * Devuelve `null` si no encuentra nada (la UI muestra un placeholder).
 */
export async function resolveDestinationImage(
  name: string,
  { timeoutMs = 7000 }: { timeoutMs?: number } = {},
): Promise<ResolvedImage | null> {
  const trimmed = name.trim();
  if (trimmed.length < 2) return null;

  const curated = findCurated(trimmed);
  if (curated) return { url: curated, source: "curada" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return (
      (await fetchWikipediaImage(trimmed, "es", controller.signal)) ??
      (await fetchWikipediaImage(trimmed, "en", controller.signal))
    );
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
