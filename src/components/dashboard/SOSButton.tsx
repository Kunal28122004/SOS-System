"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { triggerSOS } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useLocation } from "@/hooks/useLocation";

export default function SOSButton() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { location } = useLocation();

  const handleSOS = async () => {
    setIsSubmitting(true);
    const result = await triggerSOS(message, location);
    setIsSubmitting(false);

    if (result?.error) {
      toast({
        variant: "destructive",
        title: "SOS Failed",
        description: result.error,
      });
    } else {
      toast({
        title: "SOS Alert Sent!",
        description: "Emergency contacts and admin have been notified.",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-8 bg-primary/5">
                <button
                    onClick={handleSOS}
                    disabled={isSubmitting}
                    className="relative flex h-40 w-40 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-70"
                >
                    {isSubmitting ? (
                    <Loader2 className="h-16 w-16 animate-spin" />
                    ) : (
                    <>
                        <span className="absolute h-full w-full animate-pulse-border rounded-full"></span>
                        <span className="text-4xl font-bold">SOS</span>
                    </>
                    )}
                </button>
                <p className="mt-4 text-center text-muted-foreground">Press in case of emergency</p>
            </div>
            <div className="p-8">
                 <CardHeader className="p-0 mb-4">
                    <CardTitle>Custom Message (Optional)</CardTitle>
                    <CardDescription>
                        This message will be sent with your location. If empty, a default alert will be sent.
                    </CardDescription>
                </CardHeader>
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g., I am in danger at..."
                    className="h-32 resize-none"
                    disabled={isSubmitting}
                />
            </div>
        </div>
    </Card>
  );
}
