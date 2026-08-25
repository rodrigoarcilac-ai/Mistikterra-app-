import { describe, expect, it } from "vitest";
import { buildFeed, buildStories } from "./stories";
import { createSeedTrip } from "./tripData";

describe("buildStories", () => {
  it("builds stories from days plus meeting, teacher and announcement milestones", () => {
    const trip = createSeedTrip();
    const stories = buildStories(trip);

    expect(stories[0]?.kind).toBe("meeting");
    expect(stories.filter((story) => story.kind === "day")).toHaveLength(
      trip.itinerary.length,
    );
    expect(
      stories.filter((story) => story.kind === "teacher").length,
    ).toBeGreaterThanOrEqual(1);
    expect(stories.some((story) => story.kind === "announcement")).toBe(true);
    expect(stories.every((story) => story.image.length > 0)).toBe(true);
  });
});

describe("buildFeed", () => {
  it("includes announcements and itinerary activities", () => {
    const trip = createSeedTrip();
    const feed = buildFeed(trip);
    const activityCount = trip.itinerary.reduce(
      (sum, day) => sum + day.items.length,
      0,
    );

    expect(feed.filter((item) => item.kind === "announcement")).toHaveLength(
      trip.announcements.length,
    );
    expect(feed.filter((item) => item.kind === "activity")).toHaveLength(
      activityCount,
    );
  });
});
