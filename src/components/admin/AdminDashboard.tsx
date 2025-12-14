
"use client";

import { useEffect, useState } from "react";
import { getRealtimeDB } from "@/lib/firebase";
import { ref, onValue, off } from "firebase/database";
import type { SOSAlert, LiveLocation } from "@/lib/definitions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Siren, MapPin, Phone, User as UserIcon, Clock, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface TrackedUser extends LiveLocation {
    id: string;
    name: string;
}

interface ActiveAlert extends SOSAlert {
    alertId: string;
}

export default function AdminDashboard({ adminId }: { adminId: string }) {
    const [alerts, setAlerts] = useState<ActiveAlert[]>([]);
    const [locations, setLocations] = useState<Record<string, LiveLocation>>({});

    useEffect(() => {
        const realtimeDB = getRealtimeDB();
        const alertsRef = ref(realtimeDB, `alerts/${adminId}`);
        const locationsRef = ref(realtimeDB, 'liveLocations');

        const onAlertsValue = onValue(alertsRef, (snapshot) => {
            const data = snapshot.val();
            const alertsArray: ActiveAlert[] = [];
            for (const key in data) {
                if(data[key].status === 'active') {
                    alertsArray.push({ ...data[key], alertId: key });
                }
            }
            setAlerts(alertsArray.sort((a,b) => b.timestamp - a.timestamp));
        });

        const onLocationsValue = onValue(locationsRef, (snapshot) => {
            setLocations(snapshot.val() || {});
        });

        return () => {
            off(alertsRef, 'value', onAlertsValue);
            off(locationsRef, 'value', onLocationsValue);
        }
    }, [adminId]);

    const activeAlertUserIds = new Set(alerts.map(a => a.userId));

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Siren className="text-destructive h-6 w-6"/>Active SOS Alerts</CardTitle>
                    <CardDescription>Users who have triggered an SOS alert.</CardDescription>
                </CardHeader>
                <CardContent>
                    {alerts.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {alerts.map(alert => (
                                <div key={alert.alertId} className="rounded-lg border-2 border-destructive bg-destructive/5 p-4 space-y-2 animate-pulse-slow">
                                    <div className="flex items-center gap-2 font-bold text-destructive">
                                        <ShieldAlert />
                                        <span>{alert.userName}</span>
                                    </div>
                                    <p className="text-sm text-destructive/80">{alert.message}</p>
                                    <div className="text-xs text-muted-foreground space-y-1 pt-2">
                                        <p className="flex items-center gap-2"><MapPin className="h-3 w-3" />{alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}</p>
                                        <p className="flex items-center gap-2"><Phone className="h-3 w-3" /> {alert.userPhone}</p>
                                        <p className="flex items-center gap-2"><Clock className="h-3 w-3" />{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-8">No active SOS alerts.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserIcon/>Tracked Users</CardTitle>
                    <CardDescription>Live location updates from connected users.</CardDescription>
                </CardHeader>
                <CardContent>
                     {Object.keys(locations).length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {Object.entries(locations).map(([userId, location]) => {
                                if (!location || !adminId) return null;
                                const userAdminId = userId.split('_')[0];
                                // A simple way to associate users to admin, in a real app this would be more robust
                                // This is a placeholder for filtering logic.
                                // For now we show all users to demonstrate tracking.
                                // A better approach would be to check if location.adminId === adminId
                                
                                return (
                                 <div key={userId} className={cn("rounded-lg border p-4 space-y-2", activeAlertUserIds.has(userId) && "border-destructive")}>
                                     <div className="flex items-center justify-between">
                                        <p className="font-semibold flex items-center gap-2">
                                            <UserIcon className="h-4 w-4"/>
                                            <span>{userId.replace('user_', '')}</span>
                                        </p>
                                        <div className={cn("h-2.5 w-2.5 rounded-full bg-green-500", activeAlertUserIds.has(userId) && "bg-destructive animate-pulse")}></div>
                                     </div>
                                      <div className="text-xs text-muted-foreground space-y-1 pt-2">
                                        <p className="flex items-center gap-2"><MapPin className="h-3 w-3" />{location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
                                        <p className="flex items-center gap-2"><Clock className="h-3 w-3" />{formatDistanceToNow(new Date(location.updatedAt), { addSuffix: true })}</p>
                                    </div>
                                 </div>
                                )
                            })}
                        </div>
                     ) : (
                        <p className="text-center text-sm text-muted-foreground py-8">No users are currently being tracked.</p>
                     )}
                </CardContent>
            </Card>
        </div>
    );
}
