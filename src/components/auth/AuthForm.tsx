
"use client";

import * as React from "react";
import { useActionState } from "react";
import { Shield, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { loginAsAdmin, loginAsUser } from "@/lib/actions";
import { SubmitButton } from "@/components/ui/submit-button";

type Role = "user" | "admin";

export default function AuthForm() {
  const [role, setRole] = React.useState<Role>("user");
  const { toast } = useToast();

  const [userFormState, userFormAction, isUserFormPending] = useActionState(loginAsUser, null);
  const [adminFormState, adminFormAction, isAdminFormPending] = useActionState(loginAsAdmin, null);

  React.useEffect(() => {
    if (userFormState?.error) {
      toast({ variant: "destructive", title: "Login Failed", description: userFormState.error });
    }
    if (adminFormState?.error) {
      toast({ variant: "destructive", title: "Login Failed", description: adminFormState.error });
    }
  }, [userFormState, adminFormState, toast]);

  return (
    <Card className="w-full">
      <CardHeader className="p-4 pb-0">
        <div className="flex w-full gap-1 rounded-lg bg-muted p-1">
          <Button
            onClick={() => setRole("user")}
            className={cn(
              "flex-1 justify-center text-muted-foreground shadow-none",
              role === "user" && "bg-background text-foreground shadow-sm"
            )}
            variant="ghost"
          >
            <User className="mr-2 h-4 w-4" /> User
          </Button>
          <Button
            onClick={() => setRole("admin")}
            className={cn(
              "flex-1 justify-center text-muted-foreground shadow-none",
              role === "admin" && "bg-background text-foreground shadow-sm"
            )}
            variant="ghost"
          >
            <Shield className="mr-2 h-4 w-4" /> Admin
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {role === "user" ? (
          <form action={userFormAction} className="space-y-4">
            <CardTitle className="pt-2 text-lg">User Sign-in / Sign-up</CardTitle>
            <CardDescription>
              Enter your details to log in or create an account.
            </CardDescription>
            <div className="space-y-2">
              <Label htmlFor="userName">Your Name</Label>
              <Input
                id="userName"
                name="name"
                placeholder="e.g., John Doe"
                required
                disabled={isUserFormPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userPhone">Your Phone</Label>
              <Input
                id="userPhone"
                name="phone"
                placeholder="e.g., 9876543210"
                required
                disabled={isUserFormPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminId">Admin ID / Code</Label>
              <Input
                id="adminId"
                name="adminId"
                placeholder="The ID of the admin to notify"
                required
                disabled={isUserFormPending}
              />
            </div>
            <SubmitButton className="w-full" disabled={isUserFormPending}>Continue as User</SubmitButton>
          </form>
        ) : (
          <form action={adminFormAction} className="space-y-4">
            <CardTitle className="pt-2 text-lg">Admin Access</CardTitle>
            <CardDescription>
              Enter your credentials to monitor alerts.
            </CardDescription>
            <div className="space-y-2">
              <Label htmlFor="adminId">Admin ID</Label>
              <Input
                id="adminId"
                name="adminId"
                placeholder="Admin"
                required
                disabled={isAdminFormPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Password</Label>
              <Input
                id="adminPassword"
                name="password"
                type="password"
                placeholder="Password"
                required
                disabled={isAdminFormPending}
              />
            </div>
            <SubmitButton className="w-full" disabled={isAdminFormPending}>Continue as Admin</SubmitButton>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
