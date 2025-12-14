export const dynamic = "force-dynamic";

import LocationCard from "@/components/dashboard/LocationCard";
import SOSButton from "@/components/dashboard/SOSButton";
import EmergencyContacts from "@/components/dashboard/EmergencyContacts";
import AlertHistory from "@/components/dashboard/AlertHistory";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <SOSButton />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-1">
            <LocationCard />
        </div>
        <div className="lg:col-span-1">
            <EmergencyContacts />
        </div>
        <div className="lg:col-span-1">
            <AlertHistory />
        </div>
      </div>
    </div>
  );
}
