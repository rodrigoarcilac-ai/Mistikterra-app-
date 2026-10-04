import type { TravelDocFile, TravelDocKind, TravelDocs } from "./types";

export const TRAVEL_DOCS_PREFIX = "mt.docs.v1.";
export const MAX_DOC_BYTES = 1_500_000;
const MAX_IMAGE_EDGE = 1200;

export function travelDocsKey(userId: string): string {
  return `${TRAVEL_DOCS_PREFIX}${userId}`;
}

export function loadTravelDocs(userId: string): TravelDocs {
  try {
    const raw = localStorage.getItem(travelDocsKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as TravelDocs;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveTravelDocs(userId: string, docs: TravelDocs): void {
  localStorage.setItem(travelDocsKey(userId), JSON.stringify(docs));
}

export function upsertTravelDoc(
  userId: string,
  kind: TravelDocKind,
  file: TravelDocFile,
): TravelDocs {
  const next = { ...loadTravelDocs(userId), [kind]: file };
  saveTravelDocs(userId, next);
  return next;
}

export function removeTravelDoc(userId: string, kind: TravelDocKind): TravelDocs {
  const current = loadTravelDocs(userId);
  const next = { ...current };
  delete next[kind];
  saveTravelDocs(userId, next);
  return next;
}

export function isPdfDoc(file: Pick<TravelDocFile, "name" | "type">): boolean {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

function byteLengthOfDataUrl(dataUrl: string): number {
  const comma = dataUrl.indexOf(",");
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Math.floor((b64.length * 3) / 4);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }
      reject(new Error("No se pudo leer el archivo."));
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

function maybeResizeImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    if (typeof navigator !== "undefined" && /jsdom/i.test(navigator.userAgent)) {
      resolve(dataUrl);
      return;
    }
    const canvas = document.createElement("canvas");
    let ctx: CanvasRenderingContext2D | null = null;
    try {
      ctx = canvas.getContext("2d");
    } catch {
      ctx = null;
    }
    if (!ctx) {
      resolve(dataUrl);
      return;
    }
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(
        1,
        MAX_IMAGE_EDGE / Math.max(img.width || 1, img.height || 1),
      );
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      try {
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export async function encodeTravelDoc(file: File): Promise<TravelDocFile> {
  const pdf = isPdfDoc({ name: file.name, type: file.type });
  if (!pdf && file.type && !file.type.startsWith("image/")) {
    throw new Error("Usa una foto o un PDF.");
  }
  const dataUrl = await readAsDataUrl(file);
  const encoded =
    !pdf && (file.type.startsWith("image/") || file.type === "")
      ? await maybeResizeImage(dataUrl)
      : dataUrl;
  if (byteLengthOfDataUrl(encoded) > MAX_DOC_BYTES) {
    throw new Error("El archivo es demasiado grande. Usa uno de menos de 1,5 MB.");
  }
  return {
    name: file.name,
    type: pdf ? "application/pdf" : file.type || "image/jpeg",
    dataUrl: encoded,
    updatedAt: new Date().toISOString(),
  };
}

export function persistTravelDoc(
  userId: string,
  kind: TravelDocKind,
  record: TravelDocFile,
): TravelDocs {
  try {
    return upsertTravelDoc(userId, kind, record);
  } catch {
    throw new Error(
      "No hay espacio en este teléfono para guardar el documento.",
    );
  }
}
