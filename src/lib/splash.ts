export const SPLASH_KEY = "mt.splash.seen";
/** Visible time before fade-out starts. Total ~3s with the exit fade. */
export const SPLASH_HOLD_MS = 2400;
export const SPLASH_FADE_MS = 600;

export function splashAlreadySeen(): boolean {
  try {
    return sessionStorage.getItem(SPLASH_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSplashSeen(): void {
  try {
    sessionStorage.setItem(SPLASH_KEY, "1");
  } catch {
    // sessionStorage puede fallar en modo privado.
  }
}
