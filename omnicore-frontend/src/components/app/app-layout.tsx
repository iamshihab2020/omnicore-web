"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserNav } from "@/components/dashboard/user-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MenuIcon,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sidebar, SidebarItem } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/user-settings",
    icon: Settings,
  },
];

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser } = useAuth();

  // Required for iOS Safari to prevent the sheet from being shown when the page loads
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Get the current route path
  const getCurrentPath = () => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "";
  };

  if (!isMounted) {
    // Render a placeholder with the same structure but hidden to avoid layout shift
    return <div className="invisible">{children}</div>;
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        {" "}
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
          <div
            className={cn(
              "flex h-16 items-center justify-between",
              showSidebar ? (isCollapsed ? "lg:pl-20" : "lg:pl-64") : "",
              "transition-all duration-300 px-4 md:px-6"
            )}
          >
            <div className="flex items-center gap-4 w-full">
              {showSidebar && (
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button variant="outline" size="icon">
                      <MenuIcon className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <div className="flex h-full flex-col">
                      <div className="border-b px-6 py-4">
                        <Link href="/" className="flex items-center gap-2">
                          <Image
                            src="/next.svg"
                            alt="OmniCore Logo"
                            width={100}
                            height={24}
                            className="dark:invert"
                          />
                          <span className="font-bold">OmniCore</span>
                        </Link>
                      </div>{" "}
                      <div className="flex-1 overflow-auto">
                        <Sidebar hideTitle={false}>
                          {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <SidebarItem
                                key={item.href}
                                href={item.href}
                                text={item.title}
                                icon={Icon}
                                isActive={getCurrentPath() === item.href}
                                onClick={() => setIsSidebarOpen(false)}
                              />
                            );
                          })}
                        </Sidebar>
                      </div>
                      <div className="border-t p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {currentUser?.displayName ||
                                currentUser?.email?.split("@")[0]}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {currentUser?.email}
                            </p>
                          </div>
                          <ThemeToggle />
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}

              <Link href="/" className="flex items-center gap-2 lg:hidden">
                <Image
                  src="/next.svg"
                  alt="OmniCore Logo"
                  width={100}
                  height={24}
                  className="dark:invert"
                />
                <span className="hidden font-bold sm:inline-block">
                  OmniCore
                </span>
              </Link>

              {/* Desktop Navigation - only show in medium screens where sidebar is not visible yet */}
              {showSidebar && (
                <nav className="hidden md:flex lg:hidden items-center space-x-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1",
                          getCurrentPath() === item.href
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      >
                        {Icon && <Icon className="h-4 w-4" />}
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
              )}

              {/* Page Title - show on large screens */}
              <div className="hidden lg:block text-lg font-semibold">
                {navItems.find((item) => getCurrentPath() === item.href)
                  ?.title || "Dashboard"}
              </div>

              <div className="flex-1"></div>

              {/* Right side items */}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
        <main className="flex-1">
          <div className="flex">
            {/* Desktop Sidebar */}
            {showSidebar && (
              <aside
                className={cn(
                  "hidden lg:flex flex-col border-r bg-background transition-all duration-300",
                  isCollapsed ? "w-20" : "w-64"
                )}
              >
                <div className="h-full flex flex-col">
                  <div className="flex items-center h-16 px-4 border-b justify-between">
                    {!isCollapsed && (
                      <Link href="/" className="flex items-center gap-2">
                        <Image
                          src="/next.svg"
                          alt="OmniCore Logo"
                          width={80}
                          height={24}
                          className="dark:invert"
                        />
                        <span className="font-bold">OmniCore</span>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleSidebar}
                      className={isCollapsed ? "mx-auto" : ""}
                    >
                      {isCollapsed ? (
                        <ChevronRight className="h-5 w-5" />
                      ) : (
                        <ChevronLeft className="h-5 w-5" />
                      )}
                    </Button>
                  </div>{" "}
                  <Sidebar
                    className={cn("py-4", isCollapsed ? "px-0 pt-2" : "")}
                    hideTitle={isCollapsed}
                  >
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <SidebarItem
                          key={item.href}
                          href={item.href}
                          text={isCollapsed ? "" : item.title}
                          icon={Icon}
                          isActive={getCurrentPath() === item.href}
                          className={isCollapsed ? "justify-center" : ""}
                        />
                      );
                    })}
                  </Sidebar>
                </div>
              </aside>
            )}{" "}
            {/* Content Area */}
            <div
              className={cn(
                "flex-1",
                "transition-all duration-300",
                isCollapsed ? "lg:ml-0" : ""
              )}
            >
              <div className="container py-6">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
