import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { useAuth } from "../lib/auth";
import { useScrolled } from "../lib/hooks";
import AssistanceButton from "./AssistanceButton";
import BrandLogo from "./BrandLogo";
import OfflineBanner from "./OfflineBanner";

type NavItem = { to: string; label: string; icon: string };

const BASE_NAV: NavItem[] = [
  { to: "/", label: "Inicio", icon: "◈" },
  { to: "/itinerario", label: "Itinerario", icon: "☰" },
  { to: "/cerca", label: "Cerca", icon: "◎" },
];

const GUIDE_NAV: NavItem = { to: "/guia", label: "Panel", icon: "✦" };

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const reduce = useReducedMotion();
  const isHome = location.pathname === "/";
  const scrolled = useScrolled(20, isHome);
  const solidHeader = !isHome || scrolled;
  const navItems = user?.role === "guia" ? [...BASE_NAV, GUIDE_NAV] : BASE_NAV;

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      <div className="fixed inset-x-0 top-0 z-30">
        <div className="mx-auto max-w-2xl">
          <OfflineBanner />
          <header
            className={`flex items-center justify-between px-5 py-3 ${
              reduce ? "" : "transition-colors duration-300"
            } ${
              solidHeader
                ? "border-b border-borde/80 bg-carbon/95 backdrop-blur-md"
                : "border-b border-transparent bg-gradient-to-b from-noche/85 to-transparent"
            }`}
          >
            <BrandLogo to="/" />
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="text-right">
                    <p className="text-base text-marfil">{user.name}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-marfil-tenue">
                      {user.role === "guia" ? "Anfitriona" : "Viajero"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex min-h-12 items-center rounded-full border border-borde px-3 text-sm text-marfil-tenue transition hover:border-oro/50 hover:text-oro"
                  >
                    Salir
                  </button>
                </>
              ) : null}
            </div>
          </header>
        </div>
      </div>

      <main className={isHome ? "flex-1 pb-28" : "flex-1 px-5 pb-28 pt-24"}>
        <Outlet />
      </main>

      <AssistanceButton />

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-borde bg-carbon/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-stretch justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 py-2 text-sm transition ${
                  isActive ? "text-oro" : "text-marfil-tenue hover:text-marfil"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <motion.span
                      layoutId={reduce ? undefined : "tab-indicator"}
                      className="absolute top-0 h-0.5 w-10 rounded-full bg-oro"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 30 }
                      }
                    />
                  ) : null}
                  <motion.span
                    aria-hidden
                    className="text-lg"
                    animate={reduce ? undefined : { scale: isActive ? 1.12 : 1 }}
                    transition={{ duration: reduce ? 0 : 0.2 }}
                  >
                    {item.icon}
                  </motion.span>
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
