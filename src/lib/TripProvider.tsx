import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { createId } from "./format";
import { createSeedTrip } from "./tripData";
import type { Alert, AlertLevel, Announcement, Trip } from "./types";
import { TripContext, type TripContextValue } from "./trip";

// La versión en la clave fuerza el reseed cuando cambia el esquema del viaje
// (p. ej. al añadir imágenes o enseñanzas). Súbela si cambias la forma de Trip.
const TRIP_KEY = "mt.trip.v5";

function loadTrip(): Trip {
  try {
    const raw = localStorage.getItem(TRIP_KEY);
    if (raw) {
      return JSON.parse(raw) as Trip;
    }
  } catch {
    // Ignoramos datos corruptos y reconstruimos la semilla.
  }
  return createSeedTrip();
}

/**
 * Estado del viaje compartido entre la vista del viajero y el panel de la guía.
 * Se persiste en localStorage para habilitar el modo offline. En producción,
 * este estado se sincronizaría en tiempo real con Cloud Firestore.
 */
export function TripProvider({ children }: { children: ReactNode }) {
  const [trip, setTrip] = useState<Trip>(() => loadTrip());

  useEffect(() => {
    localStorage.setItem(TRIP_KEY, JSON.stringify(trip));
  }, [trip]);

  const isConfirmed = useCallback(
    (userId: string) => Boolean(trip.confirmations[userId]),
    [trip.confirmations],
  );

  const toggleConfirmation = useCallback((userId: string) => {
    setTrip((prev) => ({
      ...prev,
      confirmations: {
        ...prev.confirmations,
        [userId]: !prev.confirmations[userId],
      },
    }));
  }, []);

  const updateMeetingLocation = useCallback(
    (input: { address: string; mapUrl: string }) => {
      setTrip((prev) => ({
        ...prev,
        meetingPoint: {
          ...prev.meetingPoint,
          address: input.address,
          mapUrl: input.mapUrl,
        },
      }));
    },
    [],
  );

  const updateHeroImage = useCallback((url: string) => {
    setTrip((prev) => ({ ...prev, heroImage: url }));
  }, []);

  const emitAlert = useCallback(
    (input: { message: string; level: AlertLevel }): Alert => {
      const alert: Alert = {
        id: createId("alert"),
        message: input.message,
        level: input.level,
        createdAt: new Date().toISOString(),
      };
      setTrip((prev) => ({ ...prev, alerts: [alert, ...prev.alerts] }));
      return alert;
    },
    [],
  );

  const postAnnouncement = useCallback(
    (input: { title: string; body: string }): Announcement => {
      const announcement: Announcement = {
        id: createId("ann"),
        title: input.title,
        body: input.body,
        createdAt: new Date().toISOString(),
      };
      setTrip((prev) => ({
        ...prev,
        announcements: [announcement, ...prev.announcements],
      }));
      return announcement;
    },
    [],
  );

  const dismissAlert = useCallback((id: string) => {
    setTrip((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((alert) => alert.id !== id),
    }));
  }, []);

  const reset = useCallback(() => setTrip(createSeedTrip()), []);

  const value = useMemo<TripContextValue>(
    () => ({
      trip,
      isConfirmed,
      toggleConfirmation,
      updateMeetingLocation,
      updateHeroImage,
      emitAlert,
      postAnnouncement,
      dismissAlert,
      reset,
    }),
    [
      trip,
      isConfirmed,
      toggleConfirmation,
      updateMeetingLocation,
      updateHeroImage,
      emitAlert,
      postAnnouncement,
      dismissAlert,
      reset,
    ],
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}
