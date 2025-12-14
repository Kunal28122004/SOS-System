import { History, BellRing } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";

// In a real app, this would be a server component fetching from Firebase.
// For now, it's a placeholder. The architecture is set up for it.
async function getAlertHistory() {
    // const session = await getSession();
    // if (!session?.user) return [];
    // const alertsRef = ref(realtimeDB, `alerts/${session.user.adminId}`);
    // This is where we would fetch user-specific alerts, but admin-based path makes it complex for user view.
    // For now, we'll return an empty array.
    return [];
}


export default async function AlertHistory() {
    const history: any[] = await getAlertHistory();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <span>Alert History</span>
        </CardTitle>
        <CardDescription>Your most recent SOS alerts.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <ul className="space-y-4">
            {history.map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <BellRing className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="font-medium">Emergency SOS</p>
                    <p className="text-sm text-muted-foreground">Date here</p>
                    <Badge variant="outline" className="mt-1">Resolved</Badge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center rounded-md border-2 border-dashed">
            <History className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No alerts sent yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
