"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserNav } from "@/components/dashboard/user-nav";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MenuIcon,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Computer,
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
    title: "Point of Sale",
    href: "/pos",
    icon: Computer,
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getCurrentPath = () => {
    if (typeof window !== "undefined") {
      return window.location.pathname;
    }
    return "";
  };

  if (!isMounted) {
    return <div className="invisible">{children}</div>;
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky z-40 w-full  border-b bg-background backdrop-blur-sm">
          <div
            className={cn(
              "flex h-20 items-center",
              showSidebar ? (isCollapsed ? "lg:pl-20" : "lg:pl-64") : "",
              "transition-all duration-300 px-4 md:px-6"
            )}
          >
            {/* Left side with logo and toggle */}
            {showSidebar && (
              <div className="hidden lg:flex items-center h-full pr-3 absolute left-0 top-0 bottom-0">
                <div
                  className={cn(
                    "flex items-center px-4 justify-between w-full",
                    isCollapsed ? "w-20" : "w-64"
                  )}
                >
                  {!isCollapsed && (
                    <Link href="/" className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 flex-shrink-0">
                        <Image
                          src="/omnicore-icon.svg"
                          alt="OmniCore Logo"
                          width={45}
                          height={45}
                          className="object-contain w-full h-full"
                          priority
                        />
                      </div>
                      <span className="text-primary dark:text-white text-2xl font-bold truncate hidden sm:inline-block">
                        OmniCore
                      </span>
                    </Link>
                  )}
                  {/* Collapse button: ensure it's centered and sized */}
                  <div className="flex items-center h-full">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleSidebar}
                      className="ml-auto h-10 w-10 flex items-center justify-center"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="h-5 w-5" />
                      ) : (
                        <ChevronLeft className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

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
                    <SheetHeader>
                      <SheetTitle className="sr-only">
                        Navigation Menu
                      </SheetTitle>
                      <SheetDescription className="sr-only">
                        Main navigation drawer for OmniCore dashboard and pages.
                      </SheetDescription>
                    </SheetHeader>
                    {/* <SheetHeader className="sr-only"></SheetHeader> */}
                    <div className="flex h-full flex-col">
                      <div className="border-b px-6 py-4 shrink-0">
                        <Link
                          href="/"
                          className="flex items-center gap-2 min-w-0"
                        >
                          <div className="w-10 h-10 flex-shrink-0">
                            <Image
                              src="/omnicore-icon.svg"
                              alt="OmniCore Logo"
                              width={48}
                              height={48}
                              className="object-contain w-full h-full"
                              priority
                            />
                          </div>
                        </Link>
                      </div>
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
              <Link
                href="/"
                className="flex items-center gap-2 lg:hidden min-w-0"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0">
                  <Image
                    src="/omnicore-icon.svg"
                    alt="OmniCore Logo"
                    width={48}
                    height={48}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
              </Link>
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
              <div className="hidden lg:flex items-center gap-3 text-lg font-semibold">
                {/* removed mt-2 */}
                <span>
                  {navItems.find((item) => getCurrentPath() === item.href)
                    ?.title || "Dashboard"}
                </span>
              </div>
              <div className="flex-1"></div>
              {/* Right side items */}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <UserNav />
              </div>
            </div>
          </div>
        </header>{" "}
        {/* Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {showSidebar && (
              <aside
                className={cn(
                  "hidden lg:flex flex-col border-r bg-background transition-all duration-300 h-full",
                  isCollapsed ? "w-20" : "w-64"
                )}
              >
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto">
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
                </div>
              </aside>
            )}
            {/* Content Area */}
            <div
              className={cn(
                "flex-1 h-full",
                "transition-all duration-300 overflow-y-auto",
                isCollapsed ? "lg:ml-0" : ""
              )}
            >
              <div className="p-6">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
