"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, LayoutDashboard, Shield } from "lucide-react";

export function UserAvatar() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  if (!currentUser) return null;

  const userInitial = currentUser.email
    ? currentUser.email[0].toUpperCase()
    : "U";
  const userImage = null; // Django doesn't provide photo URLs by default

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <DropdownMenu>
      {" "}
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full hover:bg-accent p-1 transition-colors duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring focus:ring-offset-background">
          <Avatar className="h-8 w-8 cursor-pointer">
            {userImage ? (
              <AvatarImage src={userImage} alt="User avatar" />
            ) : (
              <AvatarFallback className="text-sm font-medium bg-primary/10 text-primary border-2 border-transparent hover:border-primary transition-all">
                {userInitial}
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="font-medium">My Account</span>
            <span className="text-xs text-muted-foreground truncate">
              {currentUser.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/profile")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/user-settings")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Shield className="h-4 w-4" />
            <span>Admin</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
