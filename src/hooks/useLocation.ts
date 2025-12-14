"use client";

import { useEffect, useState } from "react";
import { updateLocation } from "@/lib/actions";
import type { LiveLocation } from "@/lib/definitions";

export function useLocation() {
  const [location, setLocation] = useState<LiveLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      const newLocation = { latitude, longitude, accuracy, updatedAt: Date.now() };
      setLocation(newLocation);
      setError(null);
      updateLocation(newLocation);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(`Error: ${error.message}`);
    };

    const watcher = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return { location, error };
}
