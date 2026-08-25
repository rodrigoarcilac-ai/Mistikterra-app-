import { formatDate, formatTime } from "./format";
import type { Trip } from "./types";

export type StoryKind = "day" | "meeting" | "teacher" | "announcement";

export type Story = {
  id: string;
  kind: StoryKind;
  label: string;
  image: string;
  title: string;
  subtitle?: string;
  body?: string;
};

export type FeedItem = {
  id: string;
  kind: "activity" | "announcement";
  image?: string;
  title: string;
  caption: string;
  time: string;
  location?: string;
};

function dayShortLabel(label: string): string {
  const beforeDash = label.split("—")[0]?.trim();
  return beforeDash || label;
}

function teacherShortLabel(author: string): string {
  const name = author.split("·")[0]?.trim() ?? author;
  const parts = name.split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).join(" ") || "Maestro";
}

function firstImage(images: (string | undefined)[], fallback: string): string {
  return images.find((image): image is string => Boolean(image)) ?? fallback;
}

/**
 * Stories de Home: días del itinerario + hitos (encuentro, maestros, comunicados).
 * Solo deriva UI; no muta el viaje.
 */
export function buildStories(trip: Trip): Story[] {
  const stories: Story[] = [];
  const fallback = trip.heroImage;

  stories.push({
    id: `story_meeting_${trip.id}`,
    kind: "meeting",
    label: "Encuentro",
    image: fallback,
    title: trip.meetingPoint.title,
    subtitle: `${formatDate(trip.meetingPoint.datetime)} · ${formatTime(trip.meetingPoint.datetime)}`,
    body: [trip.meetingPoint.address, trip.meetingPoint.note]
      .filter(Boolean)
      .join(" · "),
  });

  for (const day of trip.itinerary) {
    stories.push({
      id: `story_${day.id}`,
      kind: "day",
      label: dayShortLabel(day.label),
      image: firstImage(
        day.items.map((item) => item.image),
        fallback,
      ),
      title: day.label,
      subtitle: day.teaching?.title,
      body: day.teaching?.body ?? day.items.map((item) => item.title).join(" · "),
    });
  }

  for (const day of trip.itinerary) {
    if (!day.teaching?.author) continue;
    stories.push({
      id: `story_teacher_${day.id}`,
      kind: "teacher",
      label: teacherShortLabel(day.teaching.author),
      image: firstImage(
        day.items.map((item) => item.image),
        fallback,
      ),
      title: day.teaching.author,
      subtitle: day.teaching.title,
      body: day.teaching.body,
    });
  }

  for (const announcement of trip.announcements) {
    stories.push({
      id: `story_${announcement.id}`,
      kind: "announcement",
      label: "Aviso",
      image: fallback,
      title: announcement.title,
      subtitle: formatTime(announcement.createdAt),
      body: announcement.body,
    });
  }

  return stories;
}

/** Feed inmersivo: comunicados + actividades, con foto a sangre. */
export function buildFeed(trip: Trip): FeedItem[] {
  const items: FeedItem[] = [];

  for (const announcement of trip.announcements) {
    items.push({
      id: announcement.id,
      kind: "announcement",
      image: trip.heroImage,
      title: announcement.title,
      caption: announcement.body,
      time: announcement.createdAt,
      location: trip.location,
    });
  }

  for (const day of trip.itinerary) {
    for (const item of day.items) {
      items.push({
        id: item.id,
        kind: "activity",
        image: item.image,
        title: item.title,
        caption: item.description,
        time: item.time,
        location: item.location,
      });
    }
  }

  return items;
}
