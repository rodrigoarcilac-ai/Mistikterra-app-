import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./lib/AuthProvider";
import { TripProvider } from "./lib/TripProvider";
import { useAuth } from "./lib/auth";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ItineraryPage from "./pages/ItineraryPage";
import GuidePanelPage from "./pages/GuidePanelPage";

const ExplorePage = lazy(() => import("./pages/ExplorePage"));

function CercaFallback() {
  return (
    <p className="text-base text-marfil-tenue" role="status">
      Cargando el mapa…
    </p>
  );
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function RequireGuide({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user?.role !== "guia") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/itinerario" element={<ItineraryPage />} />
        <Route
          path="/cerca"
          element={
            <Suspense fallback={<CercaFallback />}>
              <ExplorePage />
            </Suspense>
          }
        />
        <Route
          path="/guia"
          element={
            <RequireGuide>
              <GuidePanelPage />
            </RequireGuide>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TripProvider>
    </AuthProvider>
  );
}
