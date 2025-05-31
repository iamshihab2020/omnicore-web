"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { AccountInfoCard } from "@/components/dashboard/account-info-card";
import { AppLayout } from "@/components/app/app-layout";
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
    <AppLayout>
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
    </AppLayout>
  );
}
