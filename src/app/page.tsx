import AuthForm from "@/components/auth/AuthForm";
import { TriangleAlert } from "lucide-react";

export default function AuthenticationPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-primary/20 via-background to-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
            <TriangleAlert className="h-10 w-10" />
          </div>
          <h1 className="font-headline text-3xl font-bold text-foreground">
            GuardianAngel SOS
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your personal emergency alert system.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
