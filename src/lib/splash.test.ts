import { describe, expect, it } from "vitest";
import { markSplashSeen, splashAlreadySeen, SPLASH_KEY } from "./splash";

describe("splash", () => {
  it("is unseen until marked for this tab", () => {
    sessionStorage.removeItem(SPLASH_KEY);
    expect(splashAlreadySeen()).toBe(false);
    markSplashSeen();
    expect(splashAlreadySeen()).toBe(true);
  });
});
