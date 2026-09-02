import { createContext, useContext } from "react";
import type { Alert, AlertLevel, Announcement, Trip } from "./types";

export type TripContextValue = {
  trip: Trip;
  isConfirmed: (userId: string) => boolean;
  toggleConfirmation: (userId: string) => void;
  updateMeetingLocation: (input: {
    address: string;
    mapUrl: string;
    lat?: number;
    lng?: number;
  }) => void;
  updateHeroImage: (url: string) => void;
  emitAlert: (input: { message: string; level: AlertLevel }) => Alert;
  postAnnouncement: (input: { title: string; body: string }) => Announcement;
  dismissAlert: (id: string) => void;
  reset: () => void;
};

export const TripContext = createContext<TripContextValue | null>(null);

export function useTrip(): TripContextValue {
  const value = useContext(TripContext);
  if (!value) {
    throw new Error("useTrip debe usarse dentro de <TripProvider>");
  }
  return value;
}
