"use client";

import { LogOut, TriangleAlert } from "lucide-react";
import { logout } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import type { User, Admin } from "@/lib/definitions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppHeader({ user }: { user: User | Admin }) {
    const userInitial = user.name.charAt(0).toUpperCase();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <TriangleAlert className="h-6 w-6 text-primary" />
          <h1 className="hidden font-headline text-xl font-bold text-foreground sm:block">
            GuardianAngel
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.role === 'user' ? user.phone : user.id}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <form action={logout}>
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
