"use client";

import { useEffect, useState } from "react";
import { MapPin, RefreshCw, WifiOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateLocation } from "@/lib/actions";
import { Skeleton } from "../ui/skeleton";

type LocationState = {
  latitude: number;
  longitude: number;
  accuracy: number;
} | null;

export default function LocationCard() {
  const [location, setLocation] = useState<LocationState>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      const newLocation = { latitude, longitude, accuracy };
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Live Location</span>
        </CardTitle>
        <CardDescription>Your current GPS coordinates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
            <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <WifiOff className="h-5 w-5" />
                <span>{error}</span>
            </div>
        )}
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Latitude</p>
            {location ? <p className="font-mono text-lg">{location.latitude.toFixed(6)}</p> : <Skeleton className="h-7 w-40" />}
        </div>
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Longitude</p>
            {location ? <p className="font-mono text-lg">{location.longitude.toFixed(6)}</p> : <Skeleton className="h-7 w-40" />}
        </div>
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
            {location ? <p className="text-lg">{Math.round(location.accuracy)} meters</p> : <Skeleton className="h-7 w-24" />}
        </div>
      </CardContent>
    </Card>
  );
}
