import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../lib/auth";
import AssistanceButton from "./AssistanceButton";
import OfflineBanner from "./OfflineBanner";

type NavItem = { to: string; label: string; icon: string };

const BASE_NAV: NavItem[] = [
  { to: "/", label: "Inicio", icon: "◈" },
  { to: "/itinerario", label: "Itinerario", icon: "☰" },
];

const GUIDE_NAV: NavItem = { to: "/guia", label: "Panel guía", icon: "✦" };

export default function Layout() {
  const { user, logout } = useAuth();
  const navItems = user?.role === "guia" ? [...BASE_NAV, GUIDE_NAV] : BASE_NAV;

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <OfflineBanner />

      <header className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="font-display text-lg font-semibold tracking-[0.3em] text-oro">
            MISTIKTERRA
          </p>
          <p className="text-[10px] uppercase tracking-[0.35em] text-marfil-tenue">
            Awakening Experiences
          </p>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-marfil">{user.name}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-marfil-tenue">
                {user.role === "guia" ? "Anfitriona" : "Viajer@"}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-borde px-3 py-1.5 text-xs text-marfil-tenue transition hover:border-oro/50 hover:text-oro"
            >
              Salir
            </button>
          </div>
        ) : null}
      </header>

      <main className="flex-1 px-5 pb-28">
        <Outlet />
      </main>

      <AssistanceButton />

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-borde bg-carbon/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-stretch justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-1 py-3 text-xs transition ${
                  isActive ? "text-oro" : "text-marfil-tenue hover:text-marfil"
                }`
              }
            >
              <span aria-hidden className="text-lg">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
