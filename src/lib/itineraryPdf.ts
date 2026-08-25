import { formatDate, formatTime } from "./format";
import type { Trip } from "./types";

const MARGIN = 18;
const PAGE_W = 210;
const PAGE_H = 297;
const MAX_Y = PAGE_H - 18;

export function itineraryPdfFileName(trip: Trip): string {
  const slug = trip.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `mistikterra-itinerario-${slug || "viaje"}.pdf`;
}

export async function buildItineraryPdf(trip: Trip) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: false });
  let y = 22;

  const ensure = (need: number) => {
    if (y + need > MAX_Y) {
      doc.addPage();
      y = 22;
    }
  };

  const width = PAGE_W - MARGIN * 2;

  doc.setTextColor(30, 28, 26);
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text("MISTIKTERRA", MARGIN, y);
  y += 6;
  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.text("Awakening Experiences", MARGIN, y);
  y += 12;

  doc.setFont("times", "bold");
  doc.setFontSize(18);
  const nameLines = doc.splitTextToSize(trip.name, width);
  doc.text(nameLines, MARGIN, y);
  y += nameLines.length * 8;
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.text(trip.location, MARGIN, y);
  y += 6;
  doc.setFontSize(10);
  doc.text(trip.tagline, MARGIN, y);
  y += 12;

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("Punto de encuentro", MARGIN, y);
  y += 6;
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  const meeting = [
    trip.meetingPoint.title,
    `${formatDate(trip.meetingPoint.datetime)} · ${formatTime(trip.meetingPoint.datetime)}`,
    trip.meetingPoint.address,
    trip.meetingPoint.note ?? "",
  ]
    .filter(Boolean)
    .join("\n");
  const meetingLines = doc.splitTextToSize(meeting, width);
  ensure(meetingLines.length * 5 + 4);
  doc.text(meetingLines, MARGIN, y);
  y += meetingLines.length * 5 + 8;

  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.text("Itinerario resumido", MARGIN, y);
  y += 8;

  for (const day of trip.itinerary) {
    ensure(16);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text(day.label, MARGIN, y);
    y += 6;

    if (day.teaching) {
      doc.setFont("times", "italic");
      doc.setFontSize(9);
      const teaching = `Enseñanza: ${day.teaching.title}${
        day.teaching.author ? ` — ${day.teaching.author}` : ""
      }`;
      const teachingLines = doc.splitTextToSize(teaching, width);
      ensure(teachingLines.length * 4.5 + 2);
      doc.text(teachingLines, MARGIN, y);
      y += teachingLines.length * 4.5 + 2;
    }

    doc.setFont("times", "normal");
    doc.setFontSize(10);
    for (const item of day.items) {
      const line = `${formatTime(item.time)}   ${item.title}  ·  ${item.location}`;
      const wrapped = doc.splitTextToSize(line, width);
      ensure(wrapped.length * 5 + 1);
      doc.text(wrapped, MARGIN, y);
      y += wrapped.length * 5 + 1;
    }
    y += 5;
  }

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.text("Mistikterra — itinerario resumido de viaje", MARGIN, PAGE_H - 10);
    doc.text(`${i} / ${pages}`, PAGE_W - MARGIN, PAGE_H - 10, { align: "right" });
  }

  return doc;
}

export async function downloadItineraryPdf(trip: Trip): Promise<void> {
  const doc = await buildItineraryPdf(trip);
  doc.save(itineraryPdfFileName(trip));
}
