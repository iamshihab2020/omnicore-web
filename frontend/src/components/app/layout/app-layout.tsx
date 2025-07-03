"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserNav } from "@/components/dashboard/user-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MenuIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Computer,
  ClipboardPlus,
  SearchIcon,
  UserRoundCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle";
import { Sidebar, SidebarItem } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

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
    title: "Create",
    href: "/create",
    icon: ClipboardPlus,
  },
  {
    title: "Management",
    href: "/management",
    icon: UserRoundCheck,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    setIsMounted(true);

    // Save sidebar collapsed state in local storage
    const savedCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsed) {
      setIsCollapsed(savedCollapsed === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    // Save to local storage
    localStorage.setItem("sidebarCollapsed", newCollapsedState.toString());
  };

  // Get current page title
  const currentPageTitle =
    navItems.find((item) => pathname === item.href)?.title || "Dashboard";

  if (!isMounted) {
    return <div className="invisible">{children}</div>;
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background">
        {/* Top Navigation Bar */}
        <header className="sticky z-40 top-0 w-full border-b bg-background/95 backdrop-blur-lg shadow-sm">
          <div
            className={cn(
              "flex h-16 items-center",
              showSidebar ? (isCollapsed ? "lg:pl-20" : "lg:pl-64") : "",
              "transition-all duration-300 px-4 md:px-6"
            )}
          >
            {/* Left side with logo and toggle */}
            {showSidebar && (
              <div className="hidden lg:flex items-center h-full pr-3 absolute left-0 top-0 bottom-0">
                <div
                  className={cn(
                    "flex items-center px-4 justify-between w-full h-full",
                    isCollapsed ? "w-20" : "w-64"
                  )}
                >
                  {!isCollapsed && (
                    <Link href="/" className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 flex-shrink-0">
                        <Image
                          src="/omnicore-icon.svg"
                          alt="OmniCore Logo"
                          width={45}
                          height={45}
                          className="object-contain w-full h-full"
                          priority
                        />
                      </div>
                      <span className="text-primary dark:text-white text-xl font-bold truncate hidden sm:inline-block">
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
                      className="ml-auto h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted"
                      aria-label={
                        isCollapsed ? "Expand sidebar" : "Collapse sidebar"
                      }
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <MenuIcon className="h-5 w-5" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    <div className="flex h-full flex-col">
                      <div className="border-b px-6 py-4 shrink-0">
                        <Link
                          href="/"
                          className="flex items-center gap-3 min-w-0"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <div className="w-10 h-10 flex-shrink-0">
                            <Image
                              src="/omnicore-icon.svg"
                              alt="OmniCore Logo"
                              width={54}
                              height={54}
                              className="object-contain w-full h-full"
                              priority
                            />
                          </div>
                          <span className="text-primary dark:text-white text-xl font-bold">
                            OmniCore
                          </span>
                        </Link>
                      </div>
                      <div className="flex-1 overflow-auto py-2">
                        <Sidebar hideTitle={false}>
                          {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                              <SidebarItem
                                key={item.href}
                                href={item.href}
                                text={item.title}
                                icon={Icon}
                                isActive={isActive}
                                collapsed={false} // Mobile sidebar is always expanded
                                onClick={() => setIsSidebarOpen(false)}
                                className={cn(
                                  "mb-1 transition-all",
                                  isActive && "font-medium shadow-sm"
                                )}
                              />
                            );
                          })}
                        </Sidebar>
                      </div>{" "}
                      <div className="border-t p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium">
                              {currentUser?.email?.split("@")[0]}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {currentUser?.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <FullscreenToggle />
                            <ThemeToggle />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
              {/* Mobile Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 lg:hidden min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
                  <Image
                    src="/omnicore-icon.svg"
                    alt="OmniCore Logo"
                    width={45}
                    height={45}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
                <span className="text-primary dark:text-white text-lg font-bold sm:inline-block">
                  OmniCore
                </span>
              </Link>
              {/* Tablet Navigation removed */}
              {/* Search Bar - show on larger screens */}
              <div className="hidden md:flex flex-1  ml-4">
                <div className="relative w-full">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="max-w-lg pl-9 h-9 rounded-full text-sm"
                  />
                </div>
              </div>
              {/* Page Title - show on large screens */}
              <div className="lg:flex hidden items-center gap-3 text-lg font-semibold ml-4">
                <span>{currentPageTitle}</span>
              </div>
              <div className="flex-1 md:flex-none"></div>
              {/* Right side items */}
              <div className="flex items-center gap-4">
                <UserNav />
                <div className="border-l h-6 mx-1 border-muted-foreground/20"></div>
                <FullscreenToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

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
                  {isCollapsed && (
                    <div className="flex justify-center pt-4 pb-2">
                      <Link
                        href="/"
                        className="flex items-center justify-center"
                      >
                        <div className="w-9 h-9">
                          <Image
                            src="/omnicore-icon.svg"
                            alt="OmniCore Logo"
                            width={45}
                            height={45}
                            className="object-contain w-full h-full"
                            priority
                          />
                        </div>
                      </Link>
                    </div>
                  )}{" "}
                  <div className="flex-1 overflow-y-auto py-4 pr-1">
                    <Sidebar
                      className={cn("px-3", isCollapsed ? "px-0 pt-2" : "")}
                      hideTitle={isCollapsed}
                    >
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <SidebarItem
                            key={item.href}
                            href={item.href}
                            text={item.title}
                            icon={Icon}
                            isActive={pathname === item.href}
                            collapsed={isCollapsed}
                            className={cn("mb-1 transition-all hover:bg-muted")}
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
                "flex-1 h-full flex flex-col",
                "transition-all duration-300 overflow-y-auto",
                isCollapsed ? "lg:ml-0" : ""
              )}
            >
              {/* Main content */}
              <div className="p-6 md:p-8  w-full flex-grow">
                <div className="md:hidden flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold">{currentPageTitle}</h1>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full md:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                  >
                    <SearchIcon className="h-4 w-4" />
                  </Button>
                </div>
                {children}
              </div>

              {/* Footer */}
              <footer className="border-t mt-auto">
                <div className="mx-auto p-2 md:p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/omnicore-icon.svg"
                      alt="OmniCore Logo"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <span>© {new Date().getFullYear()} OmniCore</span>
                  </div>
                  <div className="flex gap-6">
                    <Link
                      href="/terms"
                      className="hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </Link>
                    <Link
                      href="/privacy"
                      className="hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/contact"
                      className="hover:text-foreground transition-colors"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
