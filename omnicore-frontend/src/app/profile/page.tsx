"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/app/app-layout";

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card shadow-sm rounded-lg overflow-hidden border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Profile</h2>
              </div>

              <div className="border-t pt-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm">
                      {currentUser?.email}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-muted-foreground">
                      User ID
                    </dt>
                    <dd className="mt-1 text-sm">
                      {currentUser?.uid}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Email verified
                    </dt>
                    <dd className="mt-1 text-sm">
                      {currentUser?.emailVerified ? (
                        <span className="text-green-600 dark:text-green-400">
                          Verified
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">
                          Not verified
                        </span>
                      )}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Account created
                    </dt>
                    <dd className="mt-1 text-sm">
                      {currentUser?.metadata?.creationTime
                        ? new Date(
                            currentUser.metadata.creationTime
                          ).toLocaleDateString()
                        : "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium">
                  Account Settings
                </h3>
                <div className="mt-4 space-y-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
