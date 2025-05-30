"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { MainNav } from "@/components/dashboard/main-nav";
import { UserNav } from "@/components/dashboard/user-nav";
import { MobileNav } from "@/components/dashboard/mobile-nav";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { AccountInfoCard } from "@/components/dashboard/account-info-card";
import Link from "next/link";

export default function Dashboard() {
  const { currentUser } = useAuth();

  // Calculate days since user registration
  const daysSinceRegistration = currentUser?.metadata?.creationTime
    ? Math.floor(
        (Date.now() - new Date(currentUser.metadata.creationTime).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex gap-6 md:gap-10">
              <Link href="/" className="items-center space-x-2 flex">
                <span className="hidden font-bold sm:inline-block">
                  OmniCore
                </span>
              </Link>
              <div className="hidden md:flex">
                <MainNav />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserNav />
              <MobileNav>
                <Link href="/" className="mb-4 flex items-center">
                  <span className="font-bold">OmniCore</span>
                </Link>
                <div className="flex flex-col space-y-3">
                  <MainNav className="flex flex-col space-y-3" />
                </div>
              </MobileNav>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="container grid items-start gap-6 pb-8 pt-6 md:gap-8">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="Account Age"
                value={`${daysSinceRegistration} days`}
              />
              <DashboardCard
                title="Auth Provider"
                value={
                  currentUser?.providerData?.[0]?.providerId === "password"
                    ? "Email/Password"
                    : currentUser?.providerData?.[0]?.providerId ===
                      "google.com"
                    ? "Google"
                    : "Unknown"
                }
              />
              <DashboardCard
                title="Email Verified"
                value={currentUser?.emailVerified ? "Yes" : "No"}
              />
              <DashboardCard
                title="Last Sign In"
                value={
                  currentUser?.metadata?.lastSignInTime
                    ? new Date(
                        currentUser.metadata.lastSignInTime
                      ).toLocaleDateString()
                    : "Unknown"
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <AccountInfoCard user={currentUser} />
              <div className="col-span-4 md:col-span-3">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                  <Link href="/profile" className="w-full">
                    <DashboardCard
                      title="Profile"
                      value="View Profile"
                      className="h-full cursor-pointer hover:bg-muted/50"
                    />
                  </Link>
                  <Link href="/user-settings" className="w-full">
                    <DashboardCard
                      title="Settings"
                      value="Manage Account"
                      className="h-full cursor-pointer hover:bg-muted/50"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
