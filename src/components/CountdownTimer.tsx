import { countdownPhrase } from "../lib/format";
import { useNow } from "../lib/hooks";

export default function CountdownTimer({ targetIso }: { targetIso: string }) {
  const now = useNow(60_000);
  const phrase = countdownPhrase(targetIso, now);

  return (
    <p
      role="timer"
      aria-label={phrase}
      className="mt-5 font-display text-3xl font-semibold leading-snug text-oro sm:text-4xl"
    >
      {phrase}
    </p>
  );
}
