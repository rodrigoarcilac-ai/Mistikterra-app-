export type SessionHeroId = "turquia" | "grecia";

export type SessionHero = {
  id: SessionHeroId;
  src: string;
  alt: string;
};

/** Wikimedia Commons (CC): Santa Sofía / Sultanahmet, y el Partenón. */
export const SESSION_HEROES: SessionHero[] = [
  {
    id: "turquia",
    src: "/img/hero-turquia.jpg",
    alt: "Estambul, Turquía",
  },
  {
    id: "grecia",
    src: "/img/hero-grecia.jpg",
    alt: "Atenas, Grecia",
  },
];

const LAST_KEY = "mt.hero.last";
const SESSION_KEY = "mt.hero.session";

function heroById(id: string | null): SessionHero | undefined {
  return SESSION_HEROES.find((hero) => hero.id === id);
}

export function loadSessionHero(): SessionHero {
  try {
    const current = heroById(localStorage.getItem(SESSION_KEY));
    if (current) return current;
  } catch {
    // Sin localStorage (SSR o modo privado), caemos al de Turquía.
  }
  return SESSION_HEROES[0];
}

/** Elige la foto que no se usó en el login anterior y la deja fija en esta sesión. */
export function rotateSessionHero(): SessionHero {
  let last: SessionHeroId = "grecia";
  try {
    const stored = localStorage.getItem(LAST_KEY);
    if (stored === "turquia" || stored === "grecia") last = stored;
  } catch {
    // keep default
  }
  const next = last === "turquia" ? SESSION_HEROES[1] : SESSION_HEROES[0];
  try {
    localStorage.setItem(LAST_KEY, next.id);
    localStorage.setItem(SESSION_KEY, next.id);
  } catch {
    // ignore quota
  }
  return next;
}

export function clearSessionHero(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}
