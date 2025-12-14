"use client";

import { MapPin, WifiOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { useLocation } from "@/hooks/useLocation";

export default function LocationCard() {
  const { location, error } = useLocation();

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
