import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider } from "./lib/AuthProvider";
import { TripProvider } from "./lib/TripProvider";
import { useAuth } from "./lib/auth";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ItineraryPage from "./pages/ItineraryPage";
import ExplorePage from "./pages/ExplorePage";
import GuidePanelPage from "./pages/GuidePanelPage";

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
        <Route path="/cerca" element={<ExplorePage />} />
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
